# DragNDrop NPM Package - Quick Summary

## 🎉 What's New

DragNDrop is now available as an **NPM package** that can be integrated into your existing projects!

## 📦 Installation

```bash
npm install --save-dev dragndrop-editor
```

## 🚀 Quick Start

```bash
# Initialize in your project
npx dragndrop init

# Start the visual editor
npx dragndrop start
```

## ✨ Key Features

- **Framework Support**: React, Vue, Angular, Svelte, Next.js, Nuxt, and more
- **Auto-Detection**: Automatically detects your framework and configures accordingly
- **Real-time Sync**: WebSocket-based live updates between editor and source files
- **File Watching**: Automatically detects and syncs file changes
- **CLI Tool**: Easy-to-use command-line interface with 5 commands
- **Code Preservation**: Maintains your code formatting with Prettier
- **No Conflicts**: Runs on separate port, doesn't interfere with your dev server

## 🎯 Use Cases

### 1. Visual Editing in React Projects

```bash
cd my-react-app
npm install --save-dev dragndrop-editor
npx dragndrop init --framework react
npx dragndrop start
```

### 2. Vue Component Editing

```bash
cd my-vue-app
npm install --save-dev dragndrop-editor
npx dragndrop init --framework vue
npx dragndrop start
```

### 3. Next.js App Development

```bash
cd my-nextjs-app
npm install --save-dev dragndrop-editor
npx dragndrop init --framework next
npx dragndrop start
```

## 📋 CLI Commands

| Command | Description |
|---------|-------------|
| `dragndrop init` | Initialize configuration file |
| `dragndrop start` | Start the visual editor server |
| `dragndrop build` | Build for production |
| `dragndrop validate` | Validate project structure |
| `dragndrop info` | Display project information |

## ⚙️ Configuration

Auto-generated `dragndrop.config.js`:

```javascript
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.jsx', '**/*.vue', '**/*.tsx'],
  exclude: ['node_modules/**', 'dist/**'],
  port: 3001,
  autoSave: true,
  framework: 'auto', // Auto-detected
  git: {
    autoCommit: false
  }
};
```

## 🔧 How It Works

1. **Install** the package in your project
2. **Initialize** with `npx dragndrop init`
3. **Start** your dev server (e.g., `npm run dev`)
4. **Launch** DragNDrop editor with `npx dragndrop start`
5. **Edit** components visually at http://localhost:3001
6. **Save** changes automatically to your source files
7. **See** changes hot-reload in your dev server

## 📚 Documentation

- **[NPM Package README](./NPM_PACKAGE_README.md)** - Complete package documentation
- **[Integration Guide](./docs/NPM_INTEGRATION_GUIDE.md)** - Step-by-step integration guide
- **[Examples](./examples/)** - React, Vue, and other framework examples
- **[Resolution Document](./GITHUB_ISSUE_18_RESOLUTION.md)** - Technical implementation details

## 🎨 Supported Frameworks

- ✅ React (including Next.js, Gatsby)
- ✅ Vue (including Nuxt)
- ✅ Angular
- ✅ Svelte (including SvelteKit)
- ✅ Solid
- ✅ Preact
- ✅ Plain HTML

## 🔌 Programmatic API

```javascript
const DragNDrop = require('dragndrop-editor');

const editor = new DragNDrop({
  source: ['src'],
  port: 3001,
  framework: 'react',
  verbose: true
});

await editor.start();

editor.on('fileChanged', (file, changes) => {
  console.log(`File updated: ${file}`);
});

await editor.stop();
```

## 🛠️ Technical Stack

- **CLI**: Commander.js
- **Server**: Express.js
- **WebSocket**: ws
- **File Watching**: Chokidar
- **Code Parsing**: Babel Parser
- **Code Generation**: Babel Generator
- **Formatting**: Prettier
- **File Matching**: Glob

## 📊 Package Info

- **Name**: `dragndrop-editor`
- **Version**: 4.0.0
- **License**: MIT
- **Node**: >=16.0.0
- **Type**: CommonJS

## 🎯 Benefits

### For Developers
- Visual editing without leaving your workflow
- No need to learn new tools
- Works with existing build tools
- Maintains code quality and formatting

### For Teams
- Consistent component structure
- Easier onboarding for designers
- Faster prototyping
- Better collaboration

### For Projects
- No vendor lock-in
- Keep your existing stack
- Incremental adoption
- Easy to remove if needed

## 🚦 Getting Started Checklist

- [ ] Install: `npm install --save-dev dragndrop-editor`
- [ ] Initialize: `npx dragndrop init`
- [ ] Review: Check `dragndrop.config.js`
- [ ] Start: `npx dragndrop start`
- [ ] Edit: Open http://localhost:3001
- [ ] Test: Make changes and verify in your app

## 📦 What's Included

```
dragndrop-editor/
├── bin/dragndrop.js          # CLI tool
├── lib/                      # Core modules
│   ├── server.js            # Express + WebSocket server
│   ├── parser.js            # File parser
│   ├── writer.js            # File writer
│   ├── watcher.js           # File watcher
│   ├── framework-detector.js # Framework detection
│   ├── config.js            # Configuration
│   └── validator.js         # Validator
├── dist/editor/             # Editor UI
└── examples/                # Example projects
```

## 🔄 Workflow Integration

### Add to package.json

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

### Run Commands

```bash
npm run dev          # Your dev server
npm run visual-edit  # DragNDrop editor
```

## 🎓 Learn More

- **GitHub**: [SebastianVernis/DragNDrop](https://github.com/SebastianVernis/DragNDrop)
- **NPM**: [dragndrop-editor](https://www.npmjs.com/package/dragndrop-editor)
- **Issues**: [Report bugs](https://github.com/SebastianVernis/DragNDrop/issues)
- **Discussions**: [Ask questions](https://github.com/SebastianVernis/DragNDrop/discussions)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Sebastian Vernis](https://github.com/SebastianVernis)

---

**Ready to try it?**

```bash
npm install --save-dev dragndrop-editor
npx dragndrop init
npx dragndrop start
```

**Happy visual editing! 🎨**
