/**
 * Framework Detector
 * Detects the framework used in a project
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Detect framework from project
 */
async function detectFramework(cwd) {
  try {
    // Check package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      // Check for React
      if (dependencies.react || dependencies['react-dom']) {
        // Check if Next.js
        if (dependencies.next) {
          return 'next';
        }
        // Check if Gatsby
        if (dependencies.gatsby) {
          return 'gatsby';
        }
        return 'react';
      }
      
      // Check for Vue
      if (dependencies.vue) {
        // Check if Nuxt
        if (dependencies.nuxt) {
          return 'nuxt';
        }
        return 'vue';
      }
      
      // Check for Angular
      if (dependencies['@angular/core']) {
        return 'angular';
      }
      
      // Check for Svelte
      if (dependencies.svelte) {
        // Check if SvelteKit
        if (dependencies['@sveltejs/kit']) {
          return 'sveltekit';
        }
        return 'svelte';
      }
      
      // Check for Solid
      if (dependencies['solid-js']) {
        return 'solid';
      }
      
      // Check for Preact
      if (dependencies.preact) {
        return 'preact';
      }
      
    } catch (error) {
      // package.json not found or invalid
    }
    
    // Check for framework-specific files
    const files = await fs.readdir(cwd);
    
    // Angular
    if (files.includes('angular.json')) {
      return 'angular';
    }
    
    // Next.js
    if (files.includes('next.config.js') || files.includes('next.config.mjs')) {
      return 'next';
    }
    
    // Nuxt
    if (files.includes('nuxt.config.js') || files.includes('nuxt.config.ts')) {
      return 'nuxt';
    }
    
    // Gatsby
    if (files.includes('gatsby-config.js')) {
      return 'gatsby';
    }
    
    // SvelteKit
    if (files.includes('svelte.config.js')) {
      return 'sveltekit';
    }
    
    // Check for common file patterns
    const srcPath = path.join(cwd, 'src');
    try {
      const srcFiles = await fs.readdir(srcPath);
      
      // Vue files
      if (srcFiles.some(f => f.endsWith('.vue'))) {
        return 'vue';
      }
      
      // Svelte files
      if (srcFiles.some(f => f.endsWith('.svelte'))) {
        return 'svelte';
      }
      
      // JSX/TSX files (likely React)
      if (srcFiles.some(f => f.endsWith('.jsx') || f.endsWith('.tsx'))) {
        return 'react';
      }
      
    } catch (error) {
      // src directory not found
    }
    
    // Default to HTML if no framework detected
    return 'html';
    
  } catch (error) {
    console.warn(`Failed to detect framework: ${error.message}`);
    return 'unknown';
  }
}

/**
 * Get framework-specific configuration
 */
function getFrameworkConfig(framework) {
  const configs = {
    react: {
      extensions: ['.jsx', '.tsx', '.js', '.ts'],
      componentPattern: /^[A-Z]/,
      buildTool: 'vite',
      devCommand: 'npm run dev',
      buildCommand: 'npm run build'
    },
    vue: {
      extensions: ['.vue', '.js', '.ts'],
      componentPattern: /\.vue$/,
      buildTool: 'vite',
      devCommand: 'npm run dev',
      buildCommand: 'npm run build'
    },
    angular: {
      extensions: ['.ts', '.html', '.component.ts'],
      componentPattern: /\.component\.ts$/,
      buildTool: 'angular-cli',
      devCommand: 'ng serve',
      buildCommand: 'ng build'
    },
    svelte: {
      extensions: ['.svelte', '.js', '.ts'],
      componentPattern: /\.svelte$/,
      buildTool: 'vite',
      devCommand: 'npm run dev',
      buildCommand: 'npm run build'
    },
    next: {
      extensions: ['.jsx', '.tsx', '.js', '.ts'],
      componentPattern: /^[A-Z]/,
      buildTool: 'next',
      devCommand: 'npm run dev',
      buildCommand: 'npm run build'
    },
    nuxt: {
      extensions: ['.vue', '.js', '.ts'],
      componentPattern: /\.vue$/,
      buildTool: 'nuxt',
      devCommand: 'npm run dev',
      buildCommand: 'npm run build'
    },
    html: {
      extensions: ['.html', '.css', '.js'],
      componentPattern: /\.html$/,
      buildTool: 'none',
      devCommand: 'npx http-server',
      buildCommand: 'echo "No build needed"'
    }
  };
  
  return configs[framework] || configs.html;
}

/**
 * Validate framework compatibility
 */
function validateFramework(framework) {
  const supportedFrameworks = [
    'react', 'vue', 'angular', 'svelte',
    'next', 'nuxt', 'gatsby', 'sveltekit',
    'solid', 'preact', 'html'
  ];
  
  return supportedFrameworks.includes(framework);
}

module.exports = {
  detectFramework,
  getFrameworkConfig,
  validateFramework
};
