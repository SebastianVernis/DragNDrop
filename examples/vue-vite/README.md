# Vue + Vite + DragNDrop Example

This example demonstrates how to integrate DragNDrop Editor into a Vue + Vite project.

## Setup

```bash
# Create Vue app with Vite
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app

# Install dependencies
npm install

# Install DragNDrop Editor
npm install --save-dev dragndrop-editor

# Initialize DragNDrop
npx dragndrop init --framework vue
```

## Configuration

The `dragndrop.config.js` file will be created automatically:

```javascript
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.vue', '**/*.js', '**/*.ts'],
  exclude: ['node_modules/**', 'dist/**'],
  port: 3001,
  autoSave: true,
  autoSaveDelay: 1000,
  buildTool: 'vite',
  framework: 'vue',
  git: {
    autoCommit: false,
    commitMessage: 'Visual edit: ${filename}'
  }
};
```

## Usage

### Start Development Server

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start DragNDrop editor
npx dragndrop start
```

### Add to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "visual-edit": "dragndrop start",
    "visual-validate": "dragndrop validate"
  }
}
```

Then simply run:

```bash
npm run visual-edit
```

## Workflow

1. **Start both servers**: Vite dev server (port 5173) and DragNDrop editor (port 3001)
2. **Edit visually**: Open http://localhost:3001 to use the visual editor
3. **See changes live**: Your Vue app at http://localhost:5173 will hot-reload automatically
4. **Files are updated**: Changes are saved directly to your .vue files

## Example Component

Create a Single File Component that can be edited visually:

```vue
<!-- src/components/Hero.vue -->
<template>
  <div class="hero">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button @click="handleClick">Get Started</button>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  data() {
    return {
      title: 'Welcome to My App',
      description: 'This component can be edited visually with DragNDrop'
    };
  },
  methods: {
    handleClick() {
      console.log('Button clicked!');
    }
  }
};
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem;
}

h1 {
  color: #42b983;
}
</style>
```

## Tips

- Use semantic HTML in your templates
- Keep components modular and reusable
- Use scoped styles for component-specific CSS
- Leverage Vue's reactivity for dynamic content

## Troubleshooting

### Port Conflicts

If port 3001 is in use:

```bash
npx dragndrop start --port 3002
```

### Hot Reload Not Working

Make sure both servers are running and check Vite's HMR configuration.

### SFC Parsing Issues

Ensure your .vue files follow the standard Single File Component structure with `<template>`, `<script>`, and `<style>` sections.
