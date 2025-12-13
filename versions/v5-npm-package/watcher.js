/**
 * File Watcher
 * Watches for file changes in the project
 */

const chokidar = require('chokidar');
const path = require('path');
const EventEmitter = require('events');

class FileWatcher extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      cwd: process.cwd(),
      source: ['src'],
      include: ['**/*.html', '**/*.jsx', '**/*.vue'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      verbose: false,
      ...options
    };
    
    this.watcher = null;
    this.isWatching = false;
  }
  
  /**
   * Start watching files
   */
  async start() {
    if (this.isWatching) {
      throw new Error('Watcher is already running');
    }
    
    const watchPaths = this.options.source.map(src => 
      path.join(this.options.cwd, src)
    );
    
    this.watcher = chokidar.watch(watchPaths, {
      ignored: this.options.exclude,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });
    
    // Setup event handlers
    this.watcher
      .on('add', (filePath, stats) => {
        if (this.shouldWatch(filePath)) {
          this.log(`File added: ${filePath}`);
          this.emit('add', filePath, stats);
        }
      })
      .on('change', (filePath, stats) => {
        if (this.shouldWatch(filePath)) {
          this.log(`File changed: ${filePath}`);
          this.emit('change', filePath, stats);
        }
      })
      .on('unlink', (filePath) => {
        if (this.shouldWatch(filePath)) {
          this.log(`File removed: ${filePath}`);
          this.emit('unlink', filePath);
        }
      })
      .on('addDir', (dirPath) => {
        this.log(`Directory added: ${dirPath}`);
        this.emit('addDir', dirPath);
      })
      .on('unlinkDir', (dirPath) => {
        this.log(`Directory removed: ${dirPath}`);
        this.emit('unlinkDir', dirPath);
      })
      .on('error', (error) => {
        this.log(`Watcher error: ${error.message}`);
        this.emit('error', error);
      })
      .on('ready', () => {
        this.isWatching = true;
        this.log('File watcher is ready');
        this.emit('ready');
      });
    
    return new Promise((resolve) => {
      this.watcher.on('ready', resolve);
    });
  }
  
  /**
   * Stop watching files
   */
  async close() {
    if (this.watcher) {
      await this.watcher.close();
      this.isWatching = false;
      this.log('File watcher stopped');
    }
  }
  
  /**
   * Check if file should be watched
   */
  shouldWatch(filePath) {
    const ext = path.extname(filePath);
    const patterns = this.options.include;
    
    // Check if file matches include patterns
    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        // Glob pattern
        const regex = this.globToRegex(pattern);
        if (regex.test(filePath)) {
          return true;
        }
      } else if (filePath.endsWith(pattern)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Convert glob pattern to regex
   */
  globToRegex(pattern) {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    
    return new RegExp(regexPattern);
  }
  
  /**
   * Get watched files
   */
  getWatched() {
    if (this.watcher) {
      return this.watcher.getWatched();
    }
    return {};
  }
  
  /**
   * Add path to watch
   */
  add(paths) {
    if (this.watcher) {
      this.watcher.add(paths);
    }
  }
  
  /**
   * Remove path from watch
   */
  unwatch(paths) {
    if (this.watcher) {
      this.watcher.unwatch(paths);
    }
  }
  
  /**
   * Log message if verbose mode is enabled
   */
  log(message) {
    if (this.options.verbose) {
      console.log(`[FileWatcher] ${message}`);
    }
  }
}

module.exports = { FileWatcher };
