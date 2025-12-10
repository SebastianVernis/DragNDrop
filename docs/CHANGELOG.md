# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [3.1.0] - 2025-02-12

### ✨ Nuevo: Sistema de Posicionamiento Libre

#### Características Principales
- **Posicionamiento Absoluto**: Mueve elementos libremente con coordenadas precisas
- **Seguimiento de Cursor Mejorado**: El cursor mapea correctamente durante el drag con offset calculado
- **Canvas Dinámico**: Ajuste automático de altura según posición de elementos
- **Grid Visual**: Cuadrícula de fondo para referencia (20px x 20px)
- **Múltiples Modos de Layout**:
  - 📐 **Modo Libre**: Posicionamiento absoluto con movimiento libre
  - 📄 **Modo Flujo**: Posicionamiento HTML tradicional
  - ↕️ **Layout Vertical**: Reorganización automática en stack
  - ⊞ **Layout Grid**: Reorganización en grid de 3 columnas

#### Mejoras Técnicas
- Nuevo módulo `src/core/freePositionDragDrop.js` (600+ líneas)
- Ghost element mejorado que sigue el cursor con precisión
- Handles visuales en elementos seleccionados (⋮⋮)
- Drop zones con feedback visual animado
- Snap a grid opcional (configurable)
- Auto-scroll cuando se arrastra cerca de los bordes
- Exportación de funciones globales: `createComponent`, `selectElement`, `showToast`

#### Controles del Toolbar
- **📐 Libre/Flujo**: Alterna entre modo posicionamiento libre y flujo normal
- **↕️ Vertical**: Reorganiza todos los elementos verticalmente
- **⊞ Grid**: Reorganiza elementos en grid de 3 columnas

#### API Disponible
```javascript
// Cambiar modo de layout
window.freePositionDragDrop.autoLayout('vertical');
window.freePositionDragDrop.autoLayout('grid');

// Configurar snap a grid
window.freePositionDragDrop.setGridSnap(10); // 10px grid

// Convertir elementos a posicionamiento absoluto
window.freePositionDragDrop.convertToAbsolutePositioning();
```

#### Eventos Personalizados
- `freedragdrop:dragstart` - Drag iniciado
- `freedragdrop:elementMoved` - Elemento movido
- `freedragdrop:elementCreated` - Elemento creado

#### Documentación
- Nuevo archivo `docs/FREE_POSITION_SYSTEM.md` con guía completa
- Actualizado `AGENTS.md` con información del nuevo módulo

### 🐛 Correcciones
- ✅ Elementos se agregan ahora en la posición exacta del cursor
- ✅ Cursor mapea correctamente durante el drag con offset
- ✅ Canvas se adapta automáticamente al agregar elementos
- ✅ Layout se ajusta dinámicamente sin elementos superpuestos

### 🔧 Configuración
```javascript
const manager = new FreePositionDragDropManager();
manager.canvasMinHeight = 800;    // Altura mínima del canvas
manager.canvasPadding = 40;       // Padding alrededor
manager.gridSize = 1;             // Tamaño grid snap
```

---

## [2.1.0] - 2025-11-29

### ✨ Added
- **Tema Oscuro (Dark Mode):** Sistema completo de temas con soporte para modo claro y oscuro
  - Toggle manual con botón en toolbar
  - Keyboard shortcut: `Ctrl+Shift+D` (o `Cmd+Shift+D` en Mac)
  - Detección automática de preferencia del sistema operativo
  - Persistencia en localStorage
  - 17 CSS variables para theming consistente
  - Transiciones suaves de 0.3s entre temas
  - Toast notifications al cambiar tema
  - Soporte para `prefers-color-scheme` media query
  - Observador de cambios en preferencia del sistema

### 🎨 Design
- Paleta de colores dark mode optimizada para reducir fatiga visual
- Contraste WCAG AA compliant en todos los componentes
- Estilos dark mode aplicados a:
  - Toolbar y controles
  - Panel de componentes
  - Panel de propiedades
  - Galería de plantillas
  - Modales y overlays
  - Tooltips y notificaciones
- Canvas mantiene fondo blanco para edición clara

### 🧪 Testing
- 5 E2E tests con Playwright (100% passed)
  - Toggle con botón
  - Persistencia al recargar
  - Keyboard shortcut
  - Toast notifications
  - Estilos dark mode
- 17 unit tests para ThemeManager
  - Inicialización y configuración
  - Detección del sistema
  - Toggle y persistencia
  - Aplicación de estilos
  - Actualización de UI
- Screenshots de verificación generados
- Coverage estimado: ~95%

### 📝 Documentation
- Guía de usuario para tema oscuro (`docs/USER_GUIDE_THEME.md`)
- Keyboard shortcut documentado en README
- Sección completa en README principal
- JSDoc completo en ThemeManager (155 líneas)
- Actualización de BLACKBOX.md con arquitectura

### 🔧 Technical
- Nuevo módulo: `src/core/themeManager.js` (155 líneas)
- CSS variables system con 17 propiedades
- Event listeners para keyboard shortcuts
- LocalStorage API para persistencia
- MatchMedia API para detección del sistema
- Singleton pattern para gestión centralizada

## [2.0.0] - 2025-11-29

### 🎉 Añadido
- **Sistema Undo/Redo completo** con historial de 50 estados
- **Gestión de atajos de teclado** con 20+ shortcuts predefinidos
- **Paleta de comandos** (Ctrl+Shift+P) para acceso rápido
- **Responsive Tester** con 8 dispositivos predefinidos
- **Live Preview** en ventana separada con actualización en tiempo real
- **4 módulos core nuevos**: undoRedo, keyboardShortcuts, responsiveTester, livePreview
- **Tests unitarios** para módulos críticos (27+ tests)
- **Documentación completa** de nuevas funcionalidades

### 🔧 Mejorado
- **Toolbar reorganizada** con agrupación lógica
- **FileLoader** con soporte mejorado para múltiples tipos de archivo
- **HTMLParser** con detección inteligente de componentes
- **ProjectManager** con auto-guardado cada 30 segundos
- **ComponentExtractor** con 8 patrones de detección
- **Estilos CSS** con +400 líneas nuevas para UI mejorada
- **Performance** con debouncing y optimizaciones

### 📖 Documentación
- Agregado `NUEVAS_FUNCIONALIDADES.md` - Guía completa de v2.0
- Agregado `IMPLEMENTACION_COMPLETA.md` - Resumen técnico
- Agregado `CHANGELOG.md` - Historial de cambios
- Actualizado `README.md` con nuevas funcionalidades
- Actualizado `AGENTS.md` con comandos de testing

### 🧪 Testing
- 15+ tests para sistema undo/redo
- 12+ tests para keyboard shortcuts
- Configuración Jest actualizada
- Coverage reports mejorados

### 🎨 UI/UX
- Botones de Undo/Redo en toolbar
- Botón de Responsive Tester
- Botón de Live Preview  
- Estados disabled para botones no aplicables
- Animaciones y transiciones suaves
- Tooltips mejorados con descripciones y atajos

## [1.0.0] - 2025-11-XX

### Añadido
- Editor HTML visual con drag & drop
- Panel de componentes con categorías
- Panel de propiedades dinámico
- Sistema de plantillas predefinidas
- Exportación de HTML y archivos
- Gestión básica de proyectos
- Tests E2E con Playwright
- Documentación inicial

---

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).
