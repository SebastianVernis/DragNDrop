# DragNDrop - Editor HTML Visual

## Project Overview

**DragNDrop** is a complete visual HTML editor with drag-and-drop functionality for creating web pages intuitively. This is a standalone web application built with vanilla HTML, CSS, and JavaScript that allows users to create professional websites through a visual interface without writing code.

### Key Technologies
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with flexbox, grid, and animations
- **Vanilla JavaScript**: Complete functionality without external frameworks
- **Drag & Drop API**: Native browser drag-and-drop implementation
- **File API**: For project save/load functionality

### Architecture
The application follows a single-page architecture with three main panels:
- **Left Panel**: Component library organized by categories
- **Center Panel**: Visual canvas with responsive preview modes
- **Right Panel**: Dynamic properties editor for selected elements

#### Core Modules
- `script.js` - Main application logic (1877+ lines)
- `style.css` - Complete styling with theme support (654+ lines)
- `src/core/themeManager.js` - Theme system (155 lines)

## Building and Running

### Prerequisites
- Node.js (for development server and testing)
- Modern web browser with ES6+ support

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npx http-server -p 8080
# or
npx http-server -p 3000

# Access the application
# http://127.0.0.1:8080/index.html
# or
# http://127.0.0.1:3000/index.html
```

### Testing
```bash
# Run unit tests with Jest
npm test

# Run end-to-end tests with Playwright
npx playwright test

# Generate test report
npx playwright show-report
```

### Production Build
The application is production-ready as-is. Simply serve the static files:
- `index.html` - Main application entry point
- `script.js` - Core application logic (1877 lines)
- `style.css` - Complete styling (654 lines)

## Core Features

### 1. Template Gallery
- **5 Professional Templates**: SaaS Landing, Professional Portfolio, Minimalist Blog, Contact Page, Online Store
- **Category Filtering**: Business, Personal, Blog, Services, Store
- **Blank Project Option**: Start from scratch
- **Template Preview**: Visual previews with descriptions

### 2. Component Library (34 Components)
Organized in 6 categories:

#### Layout Components (6)
- Container, Section, Row, Column
- 2-Column Grid, 3-Column Grid

#### Text Components (7)
- H1, H2, H3 Headings
- Paragraph, Inline Text
- Ordered/Unordered Lists

#### Media Components (3)
- Image, Video, Iframe

#### Form Components (6)
- Text Input, Textarea, Button
- Checkbox, Radio, Select

#### UI Components (6)
- Primary/Secondary Buttons
- Card, Navbar, Footer, Hero Section

#### Advanced UI Components (6)
- Tabs, Accordion, Modal
- Carousel, Alert, Badge

### 3. Visual Canvas
- **Responsive Preview**: Desktop (default), Tablet, Mobile views
- **Element Selection**: Click to select, visual selection indicators
- **Text Editing**: Double-click to edit text content
- **Element Deletion**: Visual delete buttons on selected elements
- **Drag & Drop**: Full drag-and-drop support from component panel

### 4. Properties Panel
Dynamic property editor with sections:
- **General**: ID, CSS classes, HTML tag
- **Dimensions**: Width, height, max values
- **Spacing**: Padding and margin (all sides)
- **Positioning**: Display, position properties
- **Typography**: Size, weight, color, alignment
- **Background & Borders**: Colors, widths, styles, radius
- **Shadow & Effects**: Box-shadow, opacity, transitions
- **Flexbox**: Direction, justify, align, gap
- **Grid**: Template columns/rows, gap, alignment
- **Attributes**: Element-specific attributes

### 5. Toolbar Features
- **Templates**: Return to template gallery
- **New Project**: Create blank project
- **Responsive Views**: Desktop/Tablet/Mobile toggle
- **Export HTML**: Download complete HTML file
- **Export All**: Download HTML, CSS, JS as separate files
- **Save/Load**: Project persistence as JSON files
- **Help System**: Integrated documentation

### 6. Advanced Features
- **Component Search**: Real-time filtering of components
- **Keyboard Shortcuts**: Delete key, Ctrl+S for save
- **Toast Notifications**: User feedback for actions
- **Interactive Components**: Functional tabs, accordions, modals, carousels
- **Auto-generated IDs**: Unique element identification
- **CSS Inline Export**: Self-contained HTML export option

### 7. Theme System (Nuevo en v2.1.0)
- **ThemeManager Class**: Gestión centralizada de temas claro/oscuro
- **CSS Variables**: 17 variables para theming consistente
- **Detección del Sistema**: matchMedia API para detectar `prefers-color-scheme`
- **Persistencia**: localStorage para guardar preferencia del usuario
- **Keyboard Shortcut**: `Ctrl+Shift+D` para toggle rápido
- **Auto-detection**: Detecta preferencia del sistema al primer uso
- **System Watcher**: Observa cambios en preferencia del sistema
- **Smooth Transitions**: Animaciones de 0.3s entre temas
- **Toast Feedback**: Notificaciones al cambiar tema

## Development Conventions

### Code Structure
```
/
├── index.html          # Main application (HTML structure)
├── script.js           # Core JavaScript logic (1877 lines)
├── style.css           # Complete styling (654 lines)
├── script.test.js      # Unit tests
├── jest.config.js      # Jest configuration
├── playwright.config.js # Playwright E2E test config
├── package.json        # Dependencies and scripts
├── README.md           # Detailed project documentation
├── TEST_REPORT.md      # Comprehensive test results
├── TESTING_CHECKLIST.md # Feature verification checklist
└── tests/              # Test assets and screenshots
```

### JavaScript Architecture
- **Global Variables**: Centralized state management
- **Component Factory**: Dynamic HTML element creation
- **Event Handling**: Comprehensive drag-and-drop and UI events
- **Template System**: Pre-built professional templates
- **Export System**: HTML/CSS/JS generation
- **Property Management**: Dynamic CSS property editing

### CSS Methodology
- **Modern CSS**: Flexbox and Grid layouts
- **Component-based**: Modular styling approach
- **Responsive Design**: Mobile-first responsive patterns
- **Custom Properties**: CSS variables for theming
- **Animation**: Smooth transitions and hover effects

### CSS Variables for Theming
El proyecto usa CSS variables para un sistema de temas consistente:
- **Definición**: Variables definidas en `:root` para light mode
- **Override**: Sobrescritas en `[data-theme="dark"]` para dark mode
- **17 Variables**: Colores para backgrounds, text, borders, shadows
- **Best Practice**: Usar variables en lugar de colores hardcoded
- **Ejemplo**: `background: var(--bg-primary);` en lugar de `background: #fff;`

**Variables disponibles:**
```css
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary, --text-muted
--border-color, --border-light
--shadow-sm, --shadow-md, --shadow-lg
--accent-color, --accent-hover
--success-color, --error-color, --warning-color
--overlay-bg
```

### Testing Strategy
- **Unit Tests**: Jest with jsdom environment
- **E2E Tests**: Playwright for browser automation
- **Manual Testing**: Comprehensive functional verification
- **Cross-browser**: Chrome/Chromium support

## Key Implementation Details

### Critical Bug Fix Applied
**Issue**: JavaScript execution was interrupted by an unescaped `</script>` tag within a template literal (line 2567).

**Solution**: Escaped the closing script tag as `<\/script>` to prevent browser interpretation.

### Component System
Each component is created through a factory function that:
1. Creates the appropriate HTML element
2. Applies default styling and classes
3. Adds selection and deletion capabilities
4. Registers event handlers
5. Returns the configured element

### Drag & Drop Implementation
- Uses native HTML5 Drag & Drop API
- Components are draggable from the panel
- Canvas accepts drops and creates elements
- Visual feedback during drag operations
- Proper event handling for all drag states

### Property Editor
- Dynamic form generation based on element type
- Real-time CSS property updates
- Input validation and type checking
- Organized into logical sections
- Supports all major CSS properties

### Export Functionality
Two export modes:
1. **Single HTML**: Complete page with inline styles
2. **Separate Files**: HTML structure + external CSS/JS files

### Project Persistence
- JSON-based project format
- Saves complete element tree and properties
- Includes canvas size and selected element state
- Browser File API for save/download

## Usage Instructions

### Getting Started
1. Open `index.html` in a web browser
2. Choose a template or start with a blank project
3. Drag components from the left panel to the canvas
4. Select elements to edit properties in the right panel
5. Use toolbar buttons for export, save, and view options

### Keyboard Shortcuts
- **Delete**: Remove selected element
- **Ctrl+S**: Save current project
- **Ctrl+Shift+D**: Toggle dark/light theme (Nuevo en v2.1.0)
- **Ctrl+Z**: Undo (v2.0)
- **Ctrl+Y**: Redo (v2.0)
- **Ctrl+Shift+P**: Command palette (v2.0)

### Best Practices
- Start with a template for faster development
- Use containers and sections for proper layout structure
- Test responsive views before exporting
- Save projects regularly during development
- Use the help system for feature documentation

## Project Status

✅ **FULLY FUNCTIONAL AND TESTED**

All core features are implemented and verified:
- Template gallery with 5 professional templates
- 34 draggable components across 6 categories
- Complete visual editor with property panel
- Responsive canvas with 3 view modes
- Export functionality (HTML and separate files)
- Save/load project system
- Interactive components with JavaScript
- Comprehensive help documentation
- Unit and E2E test coverage

## Dependencies

### Runtime Dependencies
- `@playwright/test@^1.56.1` - E2E testing framework

### Development Dependencies
- `http-server@^14.1.1` - Local development server
- `jest@^30.2.0` - Unit testing framework
- `jest-environment-jsdom@^30.2.0` - DOM testing environment

### Browser Requirements
- Modern browser with ES6+ support
- HTML5 Drag & Drop API support
- File API support for save/load functionality

## Notes

- **Standalone Application**: No external runtime dependencies
- **Cross-platform**: Works on any system with a modern browser
- **Production Ready**: Fully functional with comprehensive testing
- **Extensible**: Modular architecture allows easy feature additions
- **Well Documented**: Complete README and integrated help system

This project represents a complete visual web development tool that bridges the gap between code and design, making web development accessible to users of all skill levels.