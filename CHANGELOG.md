# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

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
