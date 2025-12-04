# Guía de Desarrollo - DragNDrop

## 🛠️ Setup del Entorno de Desarrollo

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Git
- Navegador moderno (Chrome, Firefox, Safari)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/usuario/dragndrop.git
cd dragndrop

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
src/
├── core/                   # Funcionalidad principal del editor
│   ├── editor.js          # Lógica principal del editor
│   ├── canvas.js          # Manejo del canvas visual
│   ├── toolbar.js         # Barra de herramientas
│   └── properties.js      # Panel de propiedades
├── components/             # Componentes reutilizables
│   ├── fileLoader.js      # Carga de archivos
│   ├── htmlParser.js      # Parsing de HTML
│   └── componentExtractor.js # Extracción de componentes
├── storage/                # Persistencia de datos
│   └── projectManager.js  # Gestión de proyectos
├── utils/                  # Utilidades
│   ├── helpers.js         # Funciones auxiliares
│   └── constants.js       # Constantes del proyecto
└── templates/              # Plantillas predefinidas
    ├── saas.js            # Plantilla SaaS
    ├── portfolio.js       # Plantilla Portfolio
    └── blog.js            # Plantilla Blog
```

### Componentes Principales

#### 1. Editor Core (`src/core/editor.js`)
- Inicialización del editor
- Gestión del estado global
- Coordinación entre componentes

#### 2. Canvas (`src/core/canvas.js`)
- Renderizado visual
- Drag & Drop functionality
- Selección de elementos
- Responsive preview

#### 3. Component Library (`src/components/`)
- 34 componentes organizados en 6 categorías
- Factory pattern para creación
- Configuración dinámica

#### 4. Properties Panel (`src/core/properties.js`)
- Editor dinámico de propiedades CSS
- Validación de inputs
- Aplicación en tiempo real

## 🔧 Scripts de Desarrollo

### Scripts Principales

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload
npm run dev:debug        # Modo debug con source maps

# Build
npm run build            # Build para producción
npm run build:dev        # Build para desarrollo
npm run preview          # Preview del build

# Testing
npm run test             # Todos los tests
npm run test:unit        # Tests unitarios
npm run test:integration # Tests de integración
npm run test:e2e         # Tests end-to-end
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Reporte de cobertura

# Linting
npm run lint             # ESLint
npm run lint:fix         # Fix automático
npm run format           # Prettier

# Deployment
npm run deploy:preview   # Deploy preview
npm run deploy:prod      # Deploy producción
```

### Variables de Entorno

```bash
# .env.development
VITE_APP_NAME=DragNDrop Editor
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# .env.production
VITE_APP_NAME=DragNDrop Editor
VITE_API_URL=https://api.dragndrop.com
VITE_DEBUG=false
```

## 🧪 Testing Strategy

### Estructura de Tests

```
tests/
├── unit/                   # Tests unitarios
│   ├── core/              # Tests del core
│   ├── components/        # Tests de componentes
│   └── utils/             # Tests de utilidades
├── integration/            # Tests de integración
│   ├── drag-drop.test.js  # Funcionalidad drag & drop
│   ├── export.test.js     # Exportación de proyectos
│   └── templates.test.js  # Sistema de plantillas
├── e2e/                   # Tests end-to-end
│   ├── editor.spec.js     # Flujo completo del editor
│   ├── responsive.spec.js # Diseño responsive
│   └── performance.spec.js # Tests de rendimiento
└── fixtures/              # Datos de prueba
    ├── projects/          # Proyectos de ejemplo
    └── templates/         # Plantillas de prueba
```

### Convenciones de Testing

```javascript
// Naming convention
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Test implementation
    });
  });
});

// Test structure
// Arrange - Setup
// Act - Execute
// Assert - Verify
```

## 🎨 Convenciones de Código

### JavaScript Style Guide

```javascript
// Use camelCase for variables and functions
const componentFactory = createComponentFactory();

// Use PascalCase for classes and constructors
class ComponentManager {
  constructor() {}
}

// Use UPPER_SNAKE_CASE for constants
const DEFAULT_CANVAS_WIDTH = 1200;

// Use descriptive names
const isComponentSelected = checkComponentSelection();

// Prefer const over let, avoid var
const config = getConfiguration();
let currentElement = null;
```

### CSS Conventions

```css
/* Use BEM methodology */
.editor__canvas {}
.editor__canvas--responsive {}
.editor__canvas__element {}

/* Use CSS custom properties */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --border-radius: 8px;
}

/* Mobile-first responsive design */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### HTML Structure

```html
<!-- Use semantic HTML5 elements -->
<main class="editor">
  <aside class="editor__sidebar">
    <section class="component-library">
      <h2 class="component-library__title">Components</h2>
    </section>
  </aside>
  
  <section class="editor__canvas">
    <canvas class="canvas" role="application" aria-label="Visual Editor">
    </canvas>
  </section>
  
  <aside class="editor__properties">
    <section class="properties-panel">
      <h2 class="properties-panel__title">Properties</h2>
    </section>
  </aside>
</main>
```

## 🔄 Workflow de Desarrollo

### Git Workflow

```bash
# Feature development
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Bug fixes
git checkout -b fix/corregir-bug
git add .
git commit -m "fix: corregir bug en componente"
git push origin fix/corregir-bug

# Hotfixes
git checkout -b hotfix/correccion-critica
git add .
git commit -m "hotfix: corregir error crítico"
git push origin hotfix/correccion-critica
```

### Commit Messages

```bash
# Format: type(scope): description

feat(editor): agregar funcionalidad de undo/redo
fix(canvas): corregir problema de drag & drop
docs(readme): actualizar documentación de instalación
style(css): mejorar estilos del panel de propiedades
refactor(core): reorganizar lógica del editor
test(unit): agregar tests para component factory
chore(deps): actualizar dependencias
```

### Pull Request Process

1. **Crear branch** desde `develop`
2. **Implementar** funcionalidad con tests
3. **Ejecutar** todos los tests
4. **Crear PR** con descripción detallada
5. **Code review** por al menos 1 reviewer
6. **Merge** después de aprobación

## 🐛 Debugging

### Browser DevTools

```javascript
// Debug mode
window.DRAGNDROP_DEBUG = true;

// Logging utilities
console.group('Component Creation');
console.log('Component type:', componentType);
console.log('Properties:', properties);
console.groupEnd();

// Performance monitoring
console.time('Component Render');
renderComponent();
console.timeEnd('Component Render');
```

### Common Issues

#### 1. Drag & Drop no funciona
```javascript
// Check event listeners
element.addEventListener('dragstart', handleDragStart);
element.addEventListener('dragover', handleDragOver);
element.addEventListener('drop', handleDrop);

// Verify draggable attribute
element.draggable = true;
```

#### 2. Propiedades no se aplican
```javascript
// Check CSS property format
const property = 'background-color'; // kebab-case
const value = '#3b82f6';
element.style.setProperty(property, value);
```

#### 3. Export no funciona
```javascript
// Verify HTML structure
const html = canvas.innerHTML;
const isValid = validateHTML(html);
console.log('HTML valid:', isValid);
```

## 📚 Recursos Adicionales

### Documentación Técnica
- [API Reference](../api/README.md)
- [Component Library](../api/COMPONENTS.md)
- [Testing Guide](./TESTING.md)

### Herramientas Recomendadas
- **VS Code** con extensiones:
  - ESLint
  - Prettier
  - Vite
  - Jest
  - Playwright Test

### Enlaces Útiles
- [Vite Documentation](https://vitejs.dev/)
- [Jest Testing Framework](https://jestjs.io/)
- [Playwright E2E Testing](https://playwright.dev/)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)