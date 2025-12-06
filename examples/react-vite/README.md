# React + Vite + DragNDrop Example

This example demonstrates how to integrate DragNDrop Editor into a React + Vite project.

## Setup

```bash
# Create React app with Vite
npm create vite@latest my-react-app -- --template react
cd my-react-app

# Install dependencies
npm install

# Install DragNDrop Editor
npm install --save-dev dragndrop-editor

# Initialize DragNDrop
npx dragndrop init --framework react
```

## Configuration

The `dragndrop.config.js` file will be created automatically:

```javascript
module.exports = {
  source: ['src', 'components'],
  include: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
  exclude: ['node_modules/**', 'dist/**', 'build/**'],
  port: 3001,
  autoSave: true,
  autoSaveDelay: 1000,
  buildTool: 'vite',
  framework: 'react',
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
3. **See changes live**: Your Vite app at http://localhost:5173 will hot-reload automatically
4. **Files are updated**: Changes are saved directly to your source files

## Example Component

Create a component that can be edited visually:

```jsx
// src/components/Hero.jsx
export default function Hero() {
  return (
    <div className="hero">
      <h1>Welcome to My App</h1>
      <p>This component can be edited visually with DragNDrop</p>
      <button>Get Started</button>
    </div>
  );
}
```

## Tips

- Use semantic HTML for better visual editing
- Keep components modular and focused
- Use CSS classes for styling (easier to edit)
- Test changes in both the visual editor and your dev server

## Troubleshooting

### Port Conflicts

If port 3001 is in use:

```bash
npx dragndrop start --port 3002
```

### Hot Reload Not Working

Make sure both servers are running and check Vite's HMR configuration.

### Changes Not Saving

Check file permissions and ensure auto-save is enabled in `dragndrop.config.js`.
