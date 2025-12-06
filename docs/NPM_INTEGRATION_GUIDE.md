# DragNDrop NPM Package Integration Guide

Complete guide for integrating DragNDrop Editor as an npm dependency in your projects.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Framework-Specific Guides](#framework-specific-guides)
5. [Configuration](#configuration)
6. [CLI Reference](#cli-reference)
7. [Programmatic API](#programmatic-api)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

DragNDrop Editor can be integrated into existing projects as an npm dependency, allowing you to:

- Edit components visually without leaving your development workflow
- Maintain your existing build tools and processes
- Sync changes in real-time between the editor and your source files
- Support multiple frameworks (React, Vue, Angular, Svelte)

## Installation

### As Development Dependency (Recommended)

```bash
npm install --save-dev dragndrop-editor
```

### Global Installation

```bash
npm install -g dragndrop-editor
```

### Verify Installation

```bash
npx dragndrop --version
```

## Quick Start

### 1. Initialize Configuration

```bash
cd your-project
npx dragndrop init
```

This command:
- Detects your framework automatically
- Creates `dragndrop.config.js` with optimal settings
- Scans your project structure

### 2. Start the Editor

```bash
npx dragndrop start
```

The editor will:
- Start a dev server on port 3001 (configurable)
- Open your browser automatically
- Watch for file changes
- Enable real-time sync via WebSocket

### 3. Edit Your Components

1. Browse your project files in the editor
2. Select a component to edit
3. Use drag-and-drop to modify the UI
4. Changes are saved automatically to your source files
5. Your dev server hot-reloads the changes

## Framework-Specific Guides

### React

#### Setup

```bash
# In your React project
npm install --save-dev dragndrop-editor
npx dragndrop init --framework react
```

#### Configuration

```javascript
// dragndrop.config.js
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.jsx', '**/*.tsx'],
  framework: 'react',
  buildTool: 'vite' // or 'webpack', 'parcel'
};
```

#### Usage

```bash
# Terminal 1: Your dev server
npm run dev

# Terminal 2: DragNDrop editor
npx dragndrop start
```

#### Component Example

```jsx
// src/components/Card.jsx
export default function Card({ title, description }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <button>Learn More</button>
    </div>
  );
}
```

### Vue

#### Setup

```bash
# In your Vue project
npm install --save-dev dragndrop-editor
npx dragndrop init --framework vue
```

#### Configuration

```javascript
// dragndrop.config.js
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.vue'],
  framework: 'vue',
  buildTool: 'vite'
};
```

#### Component Example

```vue
<!-- src/components/Card.vue -->
<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button @click="handleClick">Learn More</button>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    description: String
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>
```

### Next.js

#### Setup

```bash
# In your Next.js project
npm install --save-dev dragndrop-editor
npx dragndrop init --framework next
```

#### Configuration

```javascript
// dragndrop.config.js
module.exports = {
  source: ['app', 'components', 'pages'],
  include: ['**/*.jsx', '**/*.tsx'],
  exclude: ['node_modules/**', '.next/**'],
  framework: 'next',
  buildTool: 'next'
};
```

#### App Router Example

```jsx
// app/components/Hero.jsx
export default function Hero() {
  return (
    <section className="hero">
      <h1>Welcome to Next.js</h1>
      <p>Edit this component visually with DragNDrop</p>
    </section>
  );
}
```

### Angular

#### Setup

```bash
# In your Angular project
npm install --save-dev dragndrop-editor
npx dragndrop init --framework angular
```

#### Configuration

```javascript
// dragndrop.config.js
module.exports = {
  source: ['src/app'],
  include: ['**/*.component.ts', '**/*.component.html'],
  framework: 'angular',
  buildTool: 'angular-cli'
};
```

#### Component Example

```typescript
// src/app/card/card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}
```

```html
<!-- src/app/card/card.component.html -->
<div class="card">
  <h2>{{ title }}</h2>
  <p>{{ description }}</p>
  <button>Learn More</button>
</div>
```

### Svelte

#### Setup

```bash
# In your Svelte project
npm install --save-dev dragndrop-editor
npx dragndrop init --framework svelte
```

#### Configuration

```javascript
// dragndrop.config.js
module.exports = {
  source: ['src'],
  include: ['**/*.svelte'],
  framework: 'svelte',
  buildTool: 'vite'
};
```

#### Component Example

```svelte
<!-- src/components/Card.svelte -->
<script>
  export let title = '';
  export let description = '';
  
  function handleClick() {
    console.log('Button clicked');
  }
</script>

<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>
  <button on:click={handleClick}>Learn More</button>
</div>

<style>
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
</style>
```

## Configuration

### Complete Configuration Reference

```javascript
// dragndrop.config.js
module.exports = {
  // Source directories to scan
  source: ['src', 'components', 'app'],
  
  // File patterns to include (glob patterns)
  include: [
    '**/*.html',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.vue',
    '**/*.svelte'
  ],
  
  // File patterns to exclude
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.next/**',
    '.git/**'
  ],
  
  // Dev server port
  port: 3001,
  
  // Auto-save configuration
  autoSave: true,
  autoSaveDelay: 1000, // milliseconds
  
  // Build tool (auto-detected if not specified)
  buildTool: 'auto', // auto | vite | webpack | parcel | rollup | next | angular-cli
  
  // Framework (auto-detected if not specified)
  framework: 'auto', // auto | react | vue | angular | svelte | next | nuxt
  
  // Custom parsers (optional)
  parsers: {
    jsx: './custom-parsers/jsx-parser.js',
    vue: './custom-parsers/vue-parser.js'
  },
  
  // Git integration
  git: {
    autoCommit: false,
    commitMessage: 'Visual edit: ${filename}',
    branch: 'main'
  },
  
  // Prettier configuration (optional, uses project's .prettierrc if available)
  prettier: {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5'
  }
};
```

### Environment-Specific Configuration

```javascript
// dragndrop.config.js
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  source: ['src'],
  port: isDevelopment ? 3001 : 8080,
  autoSave: isDevelopment,
  verbose: isDevelopment
};
```

## CLI Reference

### Commands

#### `dragndrop init`

Initialize configuration file.

```bash
npx dragndrop init [options]

Options:
  -f, --framework <framework>  Framework (react|vue|angular|svelte|auto)
  -p, --port <port>           Server port (default: 3001)
  --no-git                    Disable git integration

Examples:
  npx dragndrop init
  npx dragndrop init --framework react --port 3002
  npx dragndrop init --no-git
```

#### `dragndrop start`

Start the visual editor server.

```bash
npx dragndrop start [options]

Options:
  -c, --config <path>  Config file path (default: dragndrop.config.js)
  -p, --port <port>    Override port from config
  -w, --watch          Enable file watching (default: true)
  --no-open            Don't open browser
  -v, --verbose        Verbose logging

Examples:
  npx dragndrop start
  npx dragndrop start --port 3002
  npx dragndrop start --no-open --verbose
  npx dragndrop start --config custom.config.js
```

#### `dragndrop build`

Build editor for production.

```bash
npx dragndrop build [options]

Options:
  -o, --output <dir>   Output directory (default: dist)
  -c, --config <path>  Config file path

Examples:
  npx dragndrop build
  npx dragndrop build --output public/editor
```

#### `dragndrop validate`

Validate project structure.

```bash
npx dragndrop validate [options]

Options:
  -c, --config <path>  Config file path

Examples:
  npx dragndrop validate
  npx dragndrop validate --config custom.config.js
```

#### `dragndrop info`

Display project information.

```bash
npx dragndrop info [options]

Options:
  -c, --config <path>  Config file path

Examples:
  npx dragndrop info
```

### Adding to package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "visual-edit": "dragndrop start",
    "visual-init": "dragndrop init",
    "visual-validate": "dragndrop validate",
    "visual-info": "dragndrop info"
  }
}
```

## Programmatic API

### Basic Usage

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

// Stop server
await editor.stop();
```

### With Event Listeners

```javascript
const editor = new DragNDrop({
  source: ['src'],
  port: 3001
});

// Listen for file changes
editor.on('fileChanged', (filePath, changes) => {
  console.log(`File changed: ${filePath}`);
  console.log('Changes:', changes);
});

// Listen for errors
editor.on('error', (error) => {
  console.error('Editor error:', error);
});

await editor.start();
```

### Integration with Build Tools

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import DragNDrop from 'dragndrop-editor';

export default defineConfig({
  plugins: [
    {
      name: 'dragndrop',
      configureServer(server) {
        const editor = new DragNDrop({
          source: ['src'],
          port: 3001
        });
        
        editor.start();
        
        server.httpServer.on('close', () => {
          editor.stop();
        });
      }
    }
  ]
});
```

## Best Practices

### 1. Project Structure

Organize your components for better visual editing:

```
src/
├── components/
│   ├── common/        # Reusable components
│   ├── layout/        # Layout components
│   └── features/      # Feature-specific components
├── pages/             # Page components
└── styles/            # Global styles
```

### 2. Component Design

Write components that are easy to edit visually:

```jsx
// ✅ Good: Semantic HTML, clear structure
export function Card({ title, description, image }) {
  return (
    <article className="card">
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
      <button>Read More</button>
    </article>
  );
}

// ❌ Avoid: Complex logic in JSX, unclear structure
export function Card(props) {
  return (
    <div>
      {props.data.map((item, i) => (
        <div key={i}>
          {item.show && <span>{item.text}</span>}
        </div>
      ))}
    </div>
  );
}
```

### 3. Styling

Use CSS classes for easier visual editing:

```jsx
// ✅ Good: CSS classes
<div className="hero hero--large hero--centered">
  <h1 className="hero__title">Welcome</h1>
</div>

// ❌ Avoid: Inline styles (harder to edit visually)
<div style={{ padding: '2rem', textAlign: 'center' }}>
  <h1 style={{ fontSize: '3rem' }}>Welcome</h1>
</div>
```

### 4. File Organization

Keep related files together:

```
components/
└── Card/
    ├── Card.jsx
    ├── Card.css
    ├── Card.test.js
    └── index.js
```

### 5. Version Control

Add to `.gitignore`:

```
# DragNDrop
*.backup
dragndrop-temp/
```

Commit the config file:

```
# Keep in version control
dragndrop.config.js
```

## Troubleshooting

### Port Already in Use

**Problem**: Port 3001 is already in use.

**Solution**:
```bash
npx dragndrop start --port 3002
```

Or update `dragndrop.config.js`:
```javascript
module.exports = {
  port: 3002
};
```

### Framework Not Detected

**Problem**: Framework auto-detection fails.

**Solution**:
```bash
npx dragndrop init --framework react
```

Or manually set in config:
```javascript
module.exports = {
  framework: 'react'
};
```

### Files Not Found

**Problem**: Editor doesn't show your files.

**Solution**: Check your configuration:

```javascript
module.exports = {
  source: ['src', 'components'], // Verify these directories exist
  include: ['**/*.jsx', '**/*.tsx'], // Verify patterns match your files
  exclude: ['node_modules/**'] // Ensure not excluding too much
};
```

### Changes Not Saving

**Problem**: Visual edits don't save to files.

**Solutions**:

1. Check file permissions:
```bash
ls -la src/components/
```

2. Enable verbose logging:
```bash
npx dragndrop start --verbose
```

3. Verify auto-save is enabled:
```javascript
module.exports = {
  autoSave: true,
  autoSaveDelay: 1000
};
```

### Hot Reload Not Working

**Problem**: Changes don't reflect in dev server.

**Solutions**:

1. Ensure both servers are running
2. Check HMR configuration in your build tool
3. Verify file watcher is enabled:
```bash
npx dragndrop start --watch
```

### Build Tool Conflicts

**Problem**: DragNDrop conflicts with your build tool.

**Solution**: Run on different ports:

```javascript
// dragndrop.config.js
module.exports = {
  port: 3001 // Different from your dev server
};
```

### Memory Issues

**Problem**: High memory usage with large projects.

**Solutions**:

1. Exclude unnecessary directories:
```javascript
module.exports = {
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.git/**'
  ]
};
```

2. Limit file patterns:
```javascript
module.exports = {
  include: ['src/**/*.jsx'] // Be specific
};
```

## Support

- **Documentation**: [GitHub Wiki](https://github.com/SebastianVernis/DragNDrop/wiki)
- **Issues**: [GitHub Issues](https://github.com/SebastianVernis/DragNDrop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SebastianVernis/DragNDrop/discussions)

## Next Steps

1. [Explore Examples](../examples/)
2. [Read API Documentation](./API.md)
3. [Check Advanced Features](./ADVANCED.md)
4. [Contribute](./CONTRIBUTING.md)
