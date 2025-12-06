/**
 * Configuration System
 * Handles dragndrop.config.js creation and validation
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Default configuration
 */
const defaultConfig = {
  source: ['src', 'components'],
  include: ['**/*.html', '**/*.jsx', '**/*.vue', '**/*.tsx'],
  exclude: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
  port: 3001,
  autoSave: true,
  autoSaveDelay: 1000,
  buildTool: 'auto',
  framework: 'auto',
  parsers: {},
  git: {
    autoCommit: false,
    commitMessage: 'Visual edit: ${filename}'
  }
};

/**
 * Initialize configuration file
 */
async function initConfig(cwd, customConfig = {}) {
  const config = {
    ...defaultConfig,
    ...customConfig
  };
  
  const configPath = path.join(cwd, 'dragndrop.config.js');
  
  // Check if config already exists
  try {
    await fs.access(configPath);
    throw new Error('Configuration file already exists');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  
  // Generate config file content
  const configContent = `/**
 * DragNDrop Editor Configuration
 * Generated on ${new Date().toISOString()}
 */

module.exports = ${JSON.stringify(config, null, 2)};
`;
  
  await fs.writeFile(configPath, configContent, 'utf-8');
  
  return configPath;
}

/**
 * Load configuration from file
 */
async function loadConfig(cwd, configFile = 'dragndrop.config.js') {
  const configPath = path.join(cwd, configFile);
  
  try {
    // Clear require cache
    delete require.cache[require.resolve(configPath)];
    
    const config = require(configPath);
    return {
      ...defaultConfig,
      ...config
    };
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return defaultConfig;
    }
    throw new Error(`Failed to load config: ${error.message}`);
  }
}

/**
 * Validate configuration
 */
function validateConfig(config) {
  const errors = [];
  const warnings = [];
  
  // Validate source directories
  if (!config.source || !Array.isArray(config.source)) {
    errors.push('source must be an array of directory paths');
  } else if (config.source.length === 0) {
    warnings.push('source array is empty');
  }
  
  // Validate include patterns
  if (!config.include || !Array.isArray(config.include)) {
    errors.push('include must be an array of glob patterns');
  }
  
  // Validate exclude patterns
  if (config.exclude && !Array.isArray(config.exclude)) {
    errors.push('exclude must be an array of glob patterns');
  }
  
  // Validate port
  if (config.port) {
    const port = parseInt(config.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('port must be a number between 1 and 65535');
    }
  }
  
  // Validate autoSaveDelay
  if (config.autoSaveDelay) {
    const delay = parseInt(config.autoSaveDelay);
    if (isNaN(delay) || delay < 0) {
      errors.push('autoSaveDelay must be a positive number');
    }
  }
  
  // Validate framework
  const validFrameworks = [
    'auto', 'react', 'vue', 'angular', 'svelte',
    'next', 'nuxt', 'gatsby', 'sveltekit', 'html'
  ];
  if (config.framework && !validFrameworks.includes(config.framework)) {
    warnings.push(`Unknown framework: ${config.framework}. Will use auto-detection.`);
  }
  
  // Validate buildTool
  const validBuildTools = ['auto', 'vite', 'webpack', 'parcel', 'rollup', 'none'];
  if (config.buildTool && !validBuildTools.includes(config.buildTool)) {
    warnings.push(`Unknown build tool: ${config.buildTool}. Will use auto-detection.`);
  }
  
  // Validate git config
  if (config.git) {
    if (typeof config.git !== 'object') {
      errors.push('git must be an object');
    } else {
      if (config.git.autoCommit !== undefined && typeof config.git.autoCommit !== 'boolean') {
        errors.push('git.autoCommit must be a boolean');
      }
      if (config.git.commitMessage !== undefined && typeof config.git.commitMessage !== 'string') {
        errors.push('git.commitMessage must be a string');
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Update configuration file
 */
async function updateConfig(cwd, updates) {
  const configPath = path.join(cwd, 'dragndrop.config.js');
  
  // Load existing config
  const existingConfig = await loadConfig(cwd);
  
  // Merge updates
  const newConfig = {
    ...existingConfig,
    ...updates
  };
  
  // Validate
  const validation = validateConfig(newConfig);
  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }
  
  // Write updated config
  const configContent = `/**
 * DragNDrop Editor Configuration
 * Updated on ${new Date().toISOString()}
 */

module.exports = ${JSON.stringify(newConfig, null, 2)};
`;
  
  await fs.writeFile(configPath, configContent, 'utf-8');
  
  return newConfig;
}

/**
 * Get config template for specific framework
 */
function getFrameworkTemplate(framework) {
  const templates = {
    react: {
      source: ['src', 'components'],
      include: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      framework: 'react',
      buildTool: 'vite'
    },
    vue: {
      source: ['src', 'components'],
      include: ['**/*.vue', '**/*.js', '**/*.ts'],
      exclude: ['node_modules/**', 'dist/**'],
      framework: 'vue',
      buildTool: 'vite'
    },
    angular: {
      source: ['src/app'],
      include: ['**/*.component.ts', '**/*.component.html'],
      exclude: ['node_modules/**', 'dist/**'],
      framework: 'angular',
      buildTool: 'angular-cli'
    },
    svelte: {
      source: ['src'],
      include: ['**/*.svelte', '**/*.js', '**/*.ts'],
      exclude: ['node_modules/**', 'build/**'],
      framework: 'svelte',
      buildTool: 'vite'
    },
    html: {
      source: ['.'],
      include: ['**/*.html'],
      exclude: ['node_modules/**', 'dist/**'],
      framework: 'html',
      buildTool: 'none'
    }
  };
  
  return {
    ...defaultConfig,
    ...(templates[framework] || templates.html)
  };
}

module.exports = {
  defaultConfig,
  initConfig,
  loadConfig,
  validateConfig,
  updateConfig,
  getFrameworkTemplate
};
