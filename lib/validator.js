/**
 * Project Validator
 * Validates project structure and configuration
 */

const fs = require('fs').promises;
const path = require('path');
const { detectFramework } = require('./framework-detector');
const { glob } = require('glob');

/**
 * Validate project
 */
async function validateProject(cwd, config) {
  const errors = [];
  const warnings = [];
  let filesCount = 0;
  let componentsCount = 0;
  let framework = 'unknown';
  
  try {
    // Check if directory exists
    try {
      await fs.access(cwd);
    } catch (error) {
      errors.push(`Project directory does not exist: ${cwd}`);
      return { valid: false, errors, warnings };
    }
    
    // Detect framework
    framework = await detectFramework(cwd);
    
    // Validate source directories
    for (const sourceDir of config.source || ['src']) {
      const sourcePath = path.join(cwd, sourceDir);
      try {
        await fs.access(sourcePath);
      } catch (error) {
        warnings.push(`Source directory not found: ${sourceDir}`);
      }
    }
    
    // Count files
    const patterns = config.include || ['**/*.html', '**/*.jsx', '**/*.vue'];
    const ignore = config.exclude || ['node_modules/**', 'dist/**'];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd,
        ignore,
        absolute: false
      });
      
      filesCount += files.length;
      
      // Count components (files that look like components)
      componentsCount += files.filter(f => {
        const basename = path.basename(f, path.extname(f));
        return /^[A-Z]/.test(basename) || f.includes('component');
      }).length;
    }
    
    if (filesCount === 0) {
      warnings.push('No files found matching the include patterns');
    }
    
    // Check for package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    try {
      await fs.access(packageJsonPath);
    } catch (error) {
      warnings.push('No package.json found in project root');
    }
    
    // Check for node_modules
    const nodeModulesPath = path.join(cwd, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
    } catch (error) {
      warnings.push('No node_modules found. Run npm install first.');
    }
    
    // Framework-specific validation
    if (framework === 'react' || framework === 'next') {
      await validateReactProject(cwd, errors, warnings);
    } else if (framework === 'vue' || framework === 'nuxt') {
      await validateVueProject(cwd, errors, warnings);
    } else if (framework === 'angular') {
      await validateAngularProject(cwd, errors, warnings);
    }
    
  } catch (error) {
    errors.push(`Validation failed: ${error.message}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    framework,
    filesCount,
    componentsCount
  };
}

/**
 * Validate React project
 */
async function validateReactProject(cwd, errors, warnings) {
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(cwd, 'package.json'), 'utf-8')
    );
    
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    if (!deps.react) {
      warnings.push('React not found in dependencies');
    }
    
    if (!deps['react-dom']) {
      warnings.push('react-dom not found in dependencies');
    }
    
  } catch (error) {
    // Ignore if package.json doesn't exist
  }
}

/**
 * Validate Vue project
 */
async function validateVueProject(cwd, errors, warnings) {
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(cwd, 'package.json'), 'utf-8')
    );
    
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    if (!deps.vue) {
      warnings.push('Vue not found in dependencies');
    }
    
  } catch (error) {
    // Ignore if package.json doesn't exist
  }
}

/**
 * Validate Angular project
 */
async function validateAngularProject(cwd, errors, warnings) {
  try {
    // Check for angular.json
    await fs.access(path.join(cwd, 'angular.json'));
  } catch (error) {
    warnings.push('angular.json not found');
  }
  
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(cwd, 'package.json'), 'utf-8')
    );
    
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    if (!deps['@angular/core']) {
      warnings.push('@angular/core not found in dependencies');
    }
    
  } catch (error) {
    // Ignore if package.json doesn't exist
  }
}

/**
 * Validate file structure
 */
async function validateFileStructure(cwd, config) {
  const issues = [];
  
  // Check for common anti-patterns
  const patterns = config.include || ['**/*.html', '**/*.jsx', '**/*.vue'];
  const ignore = config.exclude || ['node_modules/**', 'dist/**'];
  
  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd,
      ignore,
      absolute: true
    });
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        // Check file size
        if (content.length > 1000000) { // 1MB
          issues.push({
            file: path.relative(cwd, file),
            type: 'warning',
            message: 'File is very large (>1MB)'
          });
        }
        
        // Check for syntax errors (basic)
        if (file.endsWith('.json')) {
          try {
            JSON.parse(content);
          } catch (error) {
            issues.push({
              file: path.relative(cwd, file),
              type: 'error',
              message: `Invalid JSON: ${error.message}`
            });
          }
        }
        
      } catch (error) {
        issues.push({
          file: path.relative(cwd, file),
          type: 'error',
          message: `Cannot read file: ${error.message}`
        });
      }
    }
  }
  
  return issues;
}

/**
 * Check dependencies
 */
async function checkDependencies(cwd) {
  const missing = [];
  const outdated = [];
  
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(cwd, 'package.json'), 'utf-8')
    );
    
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(cwd, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
      
      // Check each dependency
      for (const dep of Object.keys(allDeps)) {
        const depPath = path.join(nodeModulesPath, dep);
        try {
          await fs.access(depPath);
        } catch (error) {
          missing.push(dep);
        }
      }
      
    } catch (error) {
      // node_modules doesn't exist
      missing.push(...Object.keys(allDeps));
    }
    
  } catch (error) {
    // package.json doesn't exist
  }
  
  return { missing, outdated };
}

module.exports = {
  validateProject,
  validateFileStructure,
  checkDependencies
};
