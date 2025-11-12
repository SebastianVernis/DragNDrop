import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Root directory
  root: '.',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // Split vendor code
          vendor: ['src/utils/helpers.js'],
          // Split components
          components: [
            'src/components/fileLoader.js',
            'src/components/htmlParser.js',
            'src/components/componentExtractor.js'
          ]
        }
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: []
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
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },

  // Plugin configuration
  plugins: [
    // Custom plugin to handle legacy script.js
    {
      name: 'legacy-script-handler',
      configureServer(server) {
        server.middlewares.use('/script.js', (req, res, next) => {
          // Serve the main script file
          next();
        });
      }
    }
  ],

  // Environment variables
  envPrefix: 'VITE_',

  // Base public path
  base: './',

  // Public directory
  publicDir: 'public',

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@storage': resolve(__dirname, 'src/storage')
    }
  },

  // Worker configuration
  worker: {
    format: 'es'
  },

  // Experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `"${filename}"` };
      } else {
        return { relative: true };
      }
    }
  }
});