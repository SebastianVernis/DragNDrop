/**
 * DragNDrop Editor Server
 * Main server class for running the visual editor
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs').promises;
const chokidar = require('chokidar');
const { FileParser } = require('./parser');
const { FileWriter } = require('./writer');
const { FileWatcher } = require('./watcher');

class DragNDrop {
  constructor(options = {}) {
    this.options = {
      source: ['src'],
      include: ['**/*.html', '**/*.jsx', '**/*.vue'],
      exclude: ['node_modules/**', 'dist/**'],
      port: 3001,
      autoSave: true,
      autoSaveDelay: 1000,
      framework: 'auto',
      watch: true,
      verbose: false,
      cwd: process.cwd(),
      ...options
    };
    
    this.app = express();
    this.server = null;
    this.wss = null;
    this.parser = new FileParser(this.options);
    this.writer = new FileWriter(this.options);
    this.watcher = null;
    this.clients = new Set();
  }
  
  /**
   * Start the editor server
   */
  async start() {
    try {
      // Setup Express middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Create HTTP server
      this.server = http.createServer(this.app);
      
      // Setup WebSocket server
      this.setupWebSocket();
      
      // Setup file watcher if enabled
      if (this.options.watch) {
        await this.setupFileWatcher();
      }
      
      // Start listening
      await new Promise((resolve, reject) => {
        this.server.listen(this.options.port, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      this.log(`Server started on port ${this.options.port}`);
      
    } catch (error) {
      throw new Error(`Failed to start server: ${error.message}`);
    }
  }
  
  /**
   * Stop the editor server
   */
  async stop() {
    try {
      // Close WebSocket connections
      if (this.wss) {
        this.clients.forEach(client => client.close());
        this.wss.close();
      }
      
      // Stop file watcher
      if (this.watcher) {
        await this.watcher.close();
      }
      
      // Close HTTP server
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
      }
      
      this.log('Server stopped');
    } catch (error) {
      throw new Error(`Failed to stop server: ${error.message}`);
    }
  }
  
  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
    
    // JSON body parser
    this.app.use(express.json({ limit: '50mb' }));
    
    // Static files - serve the editor UI
    const editorPath = path.join(__dirname, '../dist/editor');
    this.app.use('/editor', express.static(editorPath));
    
    // Serve project files
    this.app.use('/project', express.static(this.options.cwd));
    
    // Logging
    if (this.options.verbose) {
      this.app.use((req, res, next) => {
        this.log(`${req.method} ${req.path}`);
        next();
      });
    }
  }
  
  /**
   * Setup API routes
   */
  setupRoutes() {
    // Root - redirect to editor
    this.app.get('/', (req, res) => {
      res.redirect('/editor');
    });
    
    // Get project structure
    this.app.get('/api/project/structure', async (req, res) => {
      try {
        const structure = await this.parser.getProjectStructure(this.options.cwd);
        res.json({ success: true, data: structure });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // Get file content
    this.app.get('/api/file/:path(*)', async (req, res) => {
      try {
        const filePath = path.join(this.options.cwd, req.params.path);
        const content = await this.parser.parseFile(filePath);
        res.json({ success: true, data: content });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // Save file content
    this.app.post('/api/file/:path(*)', async (req, res) => {
      try {
        const filePath = path.join(this.options.cwd, req.params.path);
        const { content, changes } = req.body;
        
        await this.writer.writeFile(filePath, content, changes);
        
        // Broadcast change to all clients
        this.broadcast({
          type: 'fileChanged',
          path: req.params.path,
          changes
        });
        
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // Get configuration
    this.app.get('/api/config', (req, res) => {
      res.json({
        success: true,
        data: {
          framework: this.options.framework,
          source: this.options.source,
          autoSave: this.options.autoSave,
          autoSaveDelay: this.options.autoSaveDelay
        }
      });
    });
    
    // Search files
    this.app.post('/api/search', async (req, res) => {
      try {
        const { query, type } = req.body;
        const results = await this.parser.searchFiles(this.options.cwd, query, type);
        res.json({ success: true, data: results });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        data: {
          status: 'running',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: require('../package.json').version
        }
      });
    });
  }
  
  /**
   * Setup WebSocket server for real-time communication
   */
  setupWebSocket() {
    this.wss = new WebSocket.Server({ server: this.server });
    
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      this.log('Client connected');
      
      // Send initial configuration
      ws.send(JSON.stringify({
        type: 'config',
        data: {
          framework: this.options.framework,
          autoSave: this.options.autoSave
        }
      }));
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleWebSocketMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(ws);
        this.log('Client disconnected');
      });
      
      ws.on('error', (error) => {
        this.log(`WebSocket error: ${error.message}`);
      });
    });
  }
  
  /**
   * Handle WebSocket messages
   */
  async handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
        
      case 'fileChange':
        // Handle real-time file changes
        await this.writer.writeFile(
          path.join(this.options.cwd, data.path),
          data.content,
          data.changes
        );
        
        // Broadcast to other clients
        this.broadcast({
          type: 'fileChanged',
          path: data.path,
          changes: data.changes
        }, ws);
        break;
        
      case 'subscribe':
        // Subscribe to file changes
        ws.subscribedFiles = data.files || [];
        break;
        
      default:
        ws.send(JSON.stringify({
          type: 'error',
          error: `Unknown message type: ${data.type}`
        }));
    }
  }
  
  /**
   * Setup file watcher
   */
  async setupFileWatcher() {
    this.watcher = new FileWatcher({
      cwd: this.options.cwd,
      source: this.options.source,
      include: this.options.include,
      exclude: this.options.exclude,
      verbose: this.options.verbose
    });
    
    this.watcher.on('change', (filePath, stats) => {
      this.log(`File changed: ${filePath}`);
      this.broadcast({
        type: 'fileChanged',
        path: path.relative(this.options.cwd, filePath),
        stats
      });
    });
    
    this.watcher.on('add', (filePath, stats) => {
      this.log(`File added: ${filePath}`);
      this.broadcast({
        type: 'fileAdded',
        path: path.relative(this.options.cwd, filePath),
        stats
      });
    });
    
    this.watcher.on('unlink', (filePath) => {
      this.log(`File removed: ${filePath}`);
      this.broadcast({
        type: 'fileRemoved',
        path: path.relative(this.options.cwd, filePath)
      });
    });
    
    await this.watcher.start();
  }
  
  /**
   * Broadcast message to all connected clients
   */
  broadcast(message, exclude = null) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  
  /**
   * Build for production
   */
  async build(outputDir) {
    // This would copy the editor files and prepare them for production
    const editorSource = path.join(__dirname, '../dist/editor');
    const outputPath = path.join(this.options.cwd, outputDir);
    
    await fs.mkdir(outputPath, { recursive: true });
    await this.copyDir(editorSource, outputPath);
    
    this.log(`Build completed: ${outputPath}`);
  }
  
  /**
   * Copy directory recursively
   */
  async copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
  
  /**
   * Log message if verbose mode is enabled
   */
  log(message) {
    if (this.options.verbose) {
      console.log(`[DragNDrop] ${message}`);
    }
  }
  
  /**
   * Event emitter methods
   */
  on(event, callback) {
    if (!this.events) this.events = {};
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  
  emit(event, ...args) {
    if (this.events && this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }
}

module.exports = DragNDrop;
