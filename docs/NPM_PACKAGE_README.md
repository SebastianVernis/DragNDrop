# DragNDrop Editor - NPM Package

[![npm version](https://badge.fury.io/js/dragndrop-editor.svg)](https://www.npmjs.com/package/dragndrop-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Visual HTML editor with drag-and-drop functionality. Use as a standalone app or integrate as an npm dependency in your existing projects.

## 🚀 Features

- **Visual Editing**: Edit HTML, React, Vue, Angular, and Svelte components visually
- **Framework Support**: Auto-detects and supports major frameworks
- **Real-time Sync**: WebSocket-based live updates
- **File Watching**: Automatic detection of file changes
- **Code Preservation**: Maintains code formatting with Prettier
- **CLI Tool**: Easy-to-use command-line interface
- **Build Tool Integration**: Works with Vite, Webpack, Parcel, and more

## 📦 Installation

### As a Development Dependency

```bash
npm install --save-dev dragndrop-editor
# or
yarn add -D dragndrop-editor
# or
pnpm add -D dragndrop-editor
```

### Global Installation

```bash
npm install -g dragndrop-editor
```

## 🎯 Quick Start

### 1. Initialize Configuration

```bash
npx dragndrop init
```

This creates a `dragndrop.config.js` file in your project root with auto-detected settings.

### 2. Start the Editor

```bash
npx dragndrop start
```

The visual editor will open at `http://localhost:3001` (default port).

### 3. Edit Your Components

- Browse your project files in the editor
- Drag and drop components to build your UI
- Changes are automatically saved to your source files
- Continue using your existing build tools

## 📖 Usage

### CLI Commands

#### `dragndrop init`

Initialize DragNDrop configuration in your project.

```bash
npx dragndrop init [options]

Options:
  -f, --framework <framework>  Specify framework (react|vue|angular|svelte|auto)
  -p, --port <port>           Dev server port (default: 3001)
  --no-git                    Disable git integration
```

#### `dragndrop start`

Start the visual editor server.

```bash
npx dragndrop start [options]

Options:
  -c, --config <path>  Path to config file (default: dragndrop.config.js)
  -p, --port <port>    Override port from config
  -w, --watch          Enable file watching (default: true)
  --no-open            Don't open browser automatically
  -v, --verbose        Verbose logging
```

#### `dragndrop build`

Build the editor for production.

```bash
npx dragndrop build [options]

Options:
  -o, --output <dir>   Output directory (default: dist)
  -c, --config <path>  Path to config file
```

#### `dragndrop validate`

Validate project structure and configuration.

```bash
npx dragndrop validate [options]

Options:
  -c, --config <path>  Path to config file
```

#### `dragndrop info`

Display project and editor information.

```bash
npx dragndrop info [options]

Options:
  -c, --config <path>  Path to config file
```

## ⚙️ Configuration

### Configuration File (`dragndrop.config.js`)

```javascript
module.exports = {
  // Source directories to scan
  source: ['src', 'components'],
  
  // File patterns to include
  include: ['**/*.html', '**/*.jsx', '**/*.vue', '**/*.tsx'],
  
  // File patterns to exclude
  exclude: ['node_modules/**', 'dist/**', 'build/**'],
  
  // Port for dev server
  port: 3001,
  
  // Auto-save settings
  autoSave: true,
  autoSaveDelay: 1000, // milliseconds
  
  // Build tool integration
  buildTool: 'auto', // auto | vite | webpack | parcel | rollup
  
  // Framework detection
  framework: 'auto', // auto | react | vue | angular | svelte
  
  // Custom parsers (optional)
  parsers: {
    jsx: './custom-jsx-parser.js'
  },
  
  // Git integration
  git: {
    autoCommit: false,
    commitMessage: 'Visual edit: ${filename}'
  }
};
```

### Framework-Specific Templates

DragNDrop provides optimized configurations for different frameworks:

#### React Project

```javascript
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
  exclude: ['node_modules/**', 'dist/**', 'build/**'],
  framework: 'react',
  buildTool: 'vite'
};
```

#### Vue Project

```javascript
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.vue', '**/*.js', '**/*.ts'],
  exclude: ['node_modules/**', 'dist/**'],
  framework: 'vue',
  buildTool: 'vite'
};
```

#### Angular Project

```javascript
module.exports = {
  source: ['src/app'],
  include: ['**/*.component.ts', '**/*.component.html'],
  exclude: ['node_modules/**', 'dist/**'],
  framework: 'angular',
  buildTool: 'angular-cli'
};
```

## 🔌 Integration Examples

### React with Vite

```bash
# Create React app
npm create vite@latest my-app -- --template react

# Navigate to project
cd my-app

# Install dependencies
npm install

# Install DragNDrop
npm install --save-dev dragndrop-editor

# Initialize
npx dragndrop init --framework react

# Start editor
npx dragndrop start
```

### Vue with Vite

```bash
# Create Vue app
npm create vite@latest my-app -- --template vue

# Navigate to project
cd my-app

# Install dependencies
npm install

# Install DragNDrop
npm install --save-dev dragndrop-editor

# Initialize
npx dragndrop init --framework vue

# Start editor
npx dragndrop start
```

### Next.js

```bash
# Create Next.js app
npx create-next-app@latest my-app

# Navigate to project
cd my-app

# Install DragNDrop
npm install --save-dev dragndrop-editor

# Initialize
npx dragndrop init --framework next

# Start editor
npx dragndrop start
```

### Add to package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "visual-edit": "dragndrop start",
    "visual-validate": "dragndrop validate"
  }
}
```

Then run:

```bash
npm run visual-edit
```

## 🔧 Programmatic API

You can also use DragNDrop programmatically in your Node.js scripts:

```javascript
const DragNDrop = require('dragndrop-editor');

const editor = new DragNDrop({
  source: ['src'],
  port: 3001,
  framework: 'react',
  verbose: true
});

// Start server
await editor.start();

// Listen for file changes
editor.on('fileChanged', (file, changes) => {
  console.log(`File updated: ${file}`);
});

// Stop server
await editor.stop();
```

### API Methods

#### `new DragNDrop(options)`

Create a new editor instance.

**Options:**
- `source` (Array): Source directories
- `include` (Array): File patterns to include
- `exclude` (Array): File patterns to exclude
- `port` (Number): Server port
- `autoSave` (Boolean): Enable auto-save
- `framework` (String): Framework type
- `watch` (Boolean): Enable file watching
- `verbose` (Boolean): Verbose logging

#### `editor.start()`

Start the editor server. Returns a Promise.

#### `editor.stop()`

Stop the editor server. Returns a Promise.

#### `editor.build(outputDir)`

Build for production. Returns a Promise.

### Events

- `fileChanged`: Emitted when a file is modified
- `fileAdded`: Emitted when a file is added
- `fileRemoved`: Emitted when a file is removed
- `error`: Emitted on errors

## 🌐 WebSocket API

DragNDrop uses WebSocket for real-time communication between the editor and your project.

### Client-side Integration

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'fileChanged':
      console.log('File changed:', data.path);
      // Reload or update your component
      break;
    case 'config':
      console.log('Editor config:', data.data);
      break;
  }
};

// Send changes to editor
ws.send(JSON.stringify({
  type: 'fileChange',
  path: 'src/App.jsx',
  content: '...',
  changes: [...]
}));
```

## 🧪 Testing

DragNDrop includes comprehensive testing utilities:

```bash
# Validate project structure
npx dragndrop validate

# Check for issues
npx dragndrop validate --verbose
```

## 🔒 Security

- **File System Access**: DragNDrop only accesses files within your project directory
- **Backup System**: Automatic backups before file modifications
- **Validation**: Input validation and sanitization
- **No External Requests**: All processing happens locally

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use a different port
npx dragndrop start --port 3002
```

### Framework Not Detected

```bash
# Manually specify framework
npx dragndrop init --framework react
```

### Files Not Found

Check your `dragndrop.config.js`:
- Verify `source` directories exist
- Check `include` patterns match your files
- Ensure `exclude` patterns aren't too broad

### Changes Not Saving

- Check file permissions
- Verify auto-save is enabled in config
- Look for errors in verbose mode: `npx dragndrop start --verbose`

## 📚 Examples

See the `/examples` directory for complete integration examples:

- [React + Vite](./examples/react-vite)
- [Vue + Vite](./examples/vue-vite)
- [Next.js](./examples/nextjs)
- [Angular](./examples/angular)
- [Svelte](./examples/svelte)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © [Sebastian Vernis](https://github.com/SebastianVernis)

## 🔗 Links

- [GitHub Repository](https://github.com/SebastianVernis/DragNDrop)
- [Issue Tracker](https://github.com/SebastianVernis/DragNDrop/issues)
- [NPM Package](https://www.npmjs.com/package/dragndrop-editor)
- [Documentation](https://github.com/SebastianVernis/DragNDrop#readme)

## 🙏 Acknowledgments

- Built with [Express](https://expressjs.com/)
- Powered by [Babel](https://babeljs.io/)
- Formatted with [Prettier](https://prettier.io/)
- File watching by [Chokidar](https://github.com/paulmillr/chokidar)

---

**Made with ❤️ by the DragNDrop team**
