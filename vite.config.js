import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Root directory
  root: '.',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    target: 'es2015',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html')
      },
      output: {
        manualChunks: {
          'core': ['./src/core/undoRedo.js', './src/core/keyboardShortcuts.js'],
          'drag-drop': ['./src/core/enhancedDragDrop.js', './src/core/freePositionDragDrop.js'],
          'ai': ['./src/core/geminiValidator.js', './src/core/aiCodeGenerator.js']
        }
      }
    }
  },

  // Development server
  server: {
    port: 8080,
    host: true,
    open: false,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  // Preview server (for built files)
  preview: {
    port: 8080,
    host: true,
    cors: true
  },

  // Asset handling
  assetsInclude: ['**/*.md'],

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },

  // CSS configuration
  css: {
    devSourcemap: true
  },

  // Environment variables
  envPrefix: 'VITE_',

  // Base public path
  base: './',

  // Public directory
  publicDir: false,

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
      '@components': resolve(process.cwd(), 'src/components'),
      '@utils': resolve(process.cwd(), 'src/utils'),
      '@storage': resolve(process.cwd(), 'src/storage')
    }
  }
});