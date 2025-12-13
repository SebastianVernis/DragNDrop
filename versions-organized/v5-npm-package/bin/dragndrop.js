#!/usr/bin/env node

/**
 * DragNDrop Editor CLI
 * Command-line interface for the visual HTML editor
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs');
const DragNDrop = require('../lib/server');
const { initConfig, validateConfig } = require('../lib/config');
const { detectFramework } = require('../lib/framework-detector');
const { validateProject } = require('../lib/validator');

const program = new Command();
const packageJson = require('../package.json');

program
  .name('dragndrop')
  .description('Visual HTML editor with drag-and-drop functionality')
  .version(packageJson.version);

// Init command - Create configuration file
program
  .command('init')
  .description('Initialize DragNDrop configuration in current project')
  .option('-f, --framework <framework>', 'Specify framework (react|vue|angular|svelte|auto)', 'auto')
  .option('-p, --port <port>', 'Dev server port', '3001')
  .option('--no-git', 'Disable git integration')
  .action(async (options) => {
    const spinner = ora('Initializing DragNDrop configuration...').start();
    
    try {
      const framework = options.framework === 'auto' 
        ? await detectFramework(process.cwd())
        : options.framework;
      
      const config = {
        source: ['src', 'components'],
        include: ['**/*.html', '**/*.jsx', '**/*.vue', '**/*.tsx'],
        exclude: ['node_modules/**', 'dist/**', 'build/**'],
        port: parseInt(options.port),
        autoSave: true,
        autoSaveDelay: 1000,
        buildTool: 'auto',
        framework: framework,
        git: {
          autoCommit: false,
          commitMessage: 'Visual edit: ${filename}'
        }
      };
      
      await initConfig(process.cwd(), config);
      
      spinner.succeed(chalk.green('Configuration file created: dragndrop.config.js'));
      console.log(chalk.cyan('\nDetected framework:'), chalk.bold(framework));
      console.log(chalk.cyan('Dev server port:'), chalk.bold(options.port));
      console.log(chalk.yellow('\nNext steps:'));
      console.log(chalk.white('  1. Review dragndrop.config.js'));
      console.log(chalk.white('  2. Run'), chalk.bold('dragndrop start'), chalk.white('to launch the editor'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize configuration'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Start command - Launch the editor
program
  .command('start')
  .description('Start the visual editor server')
  .option('-c, --config <path>', 'Path to config file', 'dragndrop.config.js')
  .option('-p, --port <port>', 'Override port from config')
  .option('-w, --watch', 'Enable file watching', true)
  .option('--no-open', 'Don\'t open browser automatically')
  .option('-v, --verbose', 'Verbose logging')
  .action(async (options) => {
    const spinner = ora('Starting DragNDrop editor...').start();
    
    try {
      // Load configuration
      const configPath = path.resolve(process.cwd(), options.config);
      let config;
      
      if (fs.existsSync(configPath)) {
        config = require(configPath);
        spinner.text = 'Configuration loaded';
      } else {
        spinner.warn(chalk.yellow('No config file found, using defaults'));
        config = {
          source: ['src'],
          port: 3001,
          framework: 'auto'
        };
      }
      
      // Override port if specified
      if (options.port) {
        config.port = parseInt(options.port);
      }
      
      // Validate configuration
      const validation = validateConfig(config);
      if (!validation.valid) {
        spinner.fail(chalk.red('Invalid configuration'));
        validation.errors.forEach(err => console.error(chalk.red(`  - ${err}`)));
        process.exit(1);
      }
      
      spinner.text = 'Initializing editor...';
      
      // Create and start server
      const editor = new DragNDrop({
        ...config,
        watch: options.watch,
        verbose: options.verbose,
        cwd: process.cwd()
      });
      
      await editor.start();
      
      spinner.succeed(chalk.green('DragNDrop editor is running!'));
      
      console.log(chalk.cyan('\n┌─────────────────────────────────────────┐'));
      console.log(chalk.cyan('│') + chalk.bold.white('  DragNDrop Visual Editor Started  ') + chalk.cyan('│'));
      console.log(chalk.cyan('└─────────────────────────────────────────┘'));
      console.log(chalk.white('\n  Local:   '), chalk.cyan.bold(`http://localhost:${config.port}`));
      console.log(chalk.white('  Network: '), chalk.cyan.bold(`http://0.0.0.0:${config.port}`));
      console.log(chalk.white('\n  Framework: '), chalk.yellow(config.framework));
      console.log(chalk.white('  Watching:  '), chalk.yellow(options.watch ? 'enabled' : 'disabled'));
      console.log(chalk.gray('\n  Press Ctrl+C to stop\n'));
      
      // Open browser if requested
      if (options.open) {
        const open = require('open');
        await open(`http://localhost:${config.port}`);
      }
      
      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\nShutting down gracefully...'));
        await editor.stop();
        process.exit(0);
      });
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to start editor'));
      console.error(chalk.red(error.message));
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// Build command - Build for production
program
  .command('build')
  .description('Build the editor for production')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .option('-c, --config <path>', 'Path to config file', 'dragndrop.config.js')
  .action(async (options) => {
    const spinner = ora('Building for production...').start();
    
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      const config = fs.existsSync(configPath) ? require(configPath) : {};
      
      const editor = new DragNDrop({
        ...config,
        cwd: process.cwd()
      });
      
      await editor.build(options.output);
      
      spinner.succeed(chalk.green(`Build completed: ${options.output}`));
    } catch (error) {
      spinner.fail(chalk.red('Build failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Validate command - Validate project structure
program
  .command('validate')
  .description('Validate project structure and configuration')
  .option('-c, --config <path>', 'Path to config file', 'dragndrop.config.js')
  .action(async (options) => {
    const spinner = ora('Validating project...').start();
    
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      
      if (!fs.existsSync(configPath)) {
        spinner.warn(chalk.yellow('No config file found'));
        console.log(chalk.white('Run'), chalk.bold('dragndrop init'), chalk.white('to create one'));
        return;
      }
      
      const config = require(configPath);
      const validation = await validateProject(process.cwd(), config);
      
      if (validation.valid) {
        spinner.succeed(chalk.green('Project validation passed'));
        console.log(chalk.cyan('\nProject Info:'));
        console.log(chalk.white('  Framework:'), chalk.yellow(validation.framework));
        console.log(chalk.white('  Files found:'), chalk.yellow(validation.filesCount));
        console.log(chalk.white('  Components:'), chalk.yellow(validation.componentsCount));
      } else {
        spinner.fail(chalk.red('Project validation failed'));
        console.log(chalk.red('\nErrors:'));
        validation.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
        
        if (validation.warnings.length > 0) {
          console.log(chalk.yellow('\nWarnings:'));
          validation.warnings.forEach(warn => console.log(chalk.yellow(`  - ${warn}`)));
        }
      }
    } catch (error) {
      spinner.fail(chalk.red('Validation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Info command - Show project information
program
  .command('info')
  .description('Display project and editor information')
  .option('-c, --config <path>', 'Path to config file', 'dragndrop.config.js')
  .action(async (options) => {
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      const hasConfig = fs.existsSync(configPath);
      
      console.log(chalk.cyan('\n┌─────────────────────────────────────────┐'));
      console.log(chalk.cyan('│') + chalk.bold.white('     DragNDrop Editor Info         ') + chalk.cyan('│'));
      console.log(chalk.cyan('└─────────────────────────────────────────┘'));
      
      console.log(chalk.white('\nEditor Version:'), chalk.yellow(packageJson.version));
      console.log(chalk.white('Node Version:'), chalk.yellow(process.version));
      console.log(chalk.white('Platform:'), chalk.yellow(process.platform));
      console.log(chalk.white('Working Directory:'), chalk.yellow(process.cwd()));
      
      if (hasConfig) {
        const config = require(configPath);
        console.log(chalk.white('\nConfiguration:'), chalk.green('Found'));
        console.log(chalk.white('  Framework:'), chalk.yellow(config.framework || 'auto'));
        console.log(chalk.white('  Port:'), chalk.yellow(config.port || 3001));
        console.log(chalk.white('  Source dirs:'), chalk.yellow(config.source?.join(', ') || 'src'));
        console.log(chalk.white('  Auto-save:'), chalk.yellow(config.autoSave ? 'enabled' : 'disabled'));
      } else {
        console.log(chalk.white('\nConfiguration:'), chalk.red('Not found'));
        console.log(chalk.gray('  Run'), chalk.bold('dragndrop init'), chalk.gray('to create'));
      }
      
      // Detect framework
      const framework = await detectFramework(process.cwd());
      console.log(chalk.white('\nDetected Framework:'), chalk.yellow(framework));
      
      console.log(chalk.gray('\nFor more information, visit:'));
      console.log(chalk.cyan('  https://github.com/SebastianVernis/DragNDrop\n'));
      
    } catch (error) {
      console.error(chalk.red('Failed to get info'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
