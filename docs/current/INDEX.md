# Índice de Documentación - DragNDrop HTML Editor v2.0

**Última actualización:** 2024-12-04
**Versión del proyecto:** 2.0.0

## 📚 Documentación Principal

### Inicio Rápido
- [README Principal](../../README.md) - Visión general del proyecto
- [Quick Start (English)](guides/QUICK_START.md) - Guía rápida en inglés
- [Guía Rápida (Español)](guides/GUIA_RAPIDA.md) - Guía rápida en español

### Estado del Proyecto
- [CHANGELOG](CHANGELOG.md) - Historial de cambios
- [STATUS](STATUS.md) - Estado actual del proyecto

## 🎯 Guías de Usuario

### Guías Básicas
- [Quick Start](guides/QUICK_START.md) - Primeros pasos
- [Guía Rápida](guides/GUIA_RAPIDA.md) - Primeros pasos (ES)

### Guías Avanzadas
- [Development Guide](guides/DEVELOPMENT.md) - Guía de desarrollo
- [Testing Guide](guides/TESTING.md) - Guía de testing

## 🚀 Deployment

### Guías de Despliegue
- [Deployment Guide](deployment/DEPLOYMENT.md) - Guía general de deployment
- [Deployment README](deployment/README.md) - Información de deployment

### Scripts de Deployment
Ubicados en `/scripts/deployment/`:
- `deploy-prod.sh` - Deployment a producción
- `deploy-vercel.sh` - Deployment a Vercel
- `deploy-netlify.sh` - Deployment a Netlify
- `deploy-github-pages.sh` - Deployment a GitHub Pages
- `deploy-secrets.sh` - Gestión de secrets
- `list-secrets.sh` - Listar secrets
- `delete-secret.sh` - Eliminar secrets

## 🧪 Testing

### Documentación de Testing
- [Test Report](testing/TEST_REPORT.md) - Reporte de tests
- [Testing Checklist](testing/TESTING_CHECKLIST.md) - Checklist de testing
- [Verificación de Calidad](testing/VERIFICACION_CALIDAD.md) - QA

### Configuración de Testing
Ubicados en `/config/`:
- `jest.config.js` - Configuración de Jest
- `playwright.config.js` - Configuración de Playwright

## 🔧 API y Características Técnicas

### Documentación de API
- [Technical Specs](api/TECHNICAL_SPECS.md) - Especificaciones técnicas
- [AI Features README](api/AI_FEATURES_README.md) - Características de IA
- [AI Features Quick Start](api/AI_FEATURES_QUICK_START.md) - Inicio rápido con IA
- [Agents](api/AGENTS.md) - Sistema de agentes

### Características Principales

#### Sistema de Temas
- **ThemeManager** (`src/core/themeManager.js`)
  - Modo claro/oscuro
  - Detección automática del sistema
  - Persistencia en localStorage
  - 17 CSS variables para theming
  - Atajo: `Ctrl+Shift+D`

#### Sistema Undo/Redo
- **UndoRedo** (`src/core/undoRedo.js`)
  - Historial de cambios
  - Atajos: `Ctrl+Z` (deshacer), `Ctrl+Y` (rehacer)
  - Límite configurable de historial

#### Atajos de Teclado
- **KeyboardShortcuts** (`src/core/keyboardShortcuts.js`)
  - Sistema extensible de shortcuts
  - Paleta de comandos: `Ctrl+Shift+P`
  - Múltiples atajos predefinidos

#### Drag & Drop Avanzado
- **EnhancedDragDrop** (`src/core/enhancedDragDrop.js`)
- **FreePositionDragDrop** (`src/core/freePositionDragDrop.js`)
  - Posicionamiento libre
  - Guías inteligentes
  - Snap to grid

#### Selección Múltiple
- **MultiSelect** (`src/core/multiSelect.js`)
- **MarqueeSelector** (`src/core/marqueeSelector.js`)
  - Selección por marquesina
  - Operaciones en lote

#### Gestión de Capas
- **LayersManager** (`src/core/layersManager.js`)
- **LayersPanel** (`src/components/layers/LayersPanel.js`)
  - Panel de capas visual
  - Reordenamiento
  - Visibilidad y bloqueo

#### Alineación y Distribución
- **AlignmentEngine** (`src/core/alignmentEngine.js`)
  - Alineación de elementos
  - Distribución espacial
  - Guías inteligentes

#### Operaciones en Lote
- **BatchOperations** (`src/core/batchOperations.js`)
  - Aplicar estilos a múltiples elementos
  - Operaciones agrupadas

#### Responsive Testing
- **ResponsiveTester** (`src/core/responsiveTester.js`)
  - Vista previa responsive
  - Múltiples breakpoints
  - Rotación de dispositivos

#### Live Preview
- **LivePreview** (`src/core/livePreview.js`)
  - Vista previa en tiempo real
  - Sincronización automática

#### Generación de Código con IA
- **AICodeGenerator** (`src/core/aiCodeGenerator.js`)
- **ComponentGenerator** (`src/ai/componentGenerator.js`)
  - Generación de componentes
  - Optimización de código

#### Accesibilidad
- **AccessibilityChecker** (`src/ai/accessibilityChecker.js`)
- **A11yPanel** (`src/components/A11yPanel.js`)
  - Verificación WCAG
  - Sugerencias de mejora

#### SEO
- **SEOOptimizer** (`src/ai/seoOptimizer.js`)
- **SEOPanel** (`src/components/SEOPanel.js`)
  - Análisis SEO
  - Optimizaciones automáticas

#### Deployment
- **VercelDeployer** (`src/deploy/vercelDeployer.js`)
- **DeploymentMonitor** (`src/deploy/deploymentMonitor.js`)
- **DeploymentHistory** (`src/deploy/deploymentHistory.js`)
- **DeployModal** (`src/components/DeployModal.js`)
  - Deployment directo a Vercel
  - Monitoreo de deployments
  - Historial de versiones

#### Integración con Git
- **GitIntegration** (`src/integrations/gitIntegration.js`)
- **RepoManager** (`src/integrations/repoManager.js`)
  - Integración con GitHub
  - Gestión de repositorios

#### Gestión de Proyectos
- **ProjectManager** (`src/storage/projectManager.js`)
- **CloudSync** (`src/services/cloudSync.js`)
  - Guardado local
  - Sincronización en la nube

#### Tutorial Interactivo
- **TutorialEngine** (`src/tutorial/tutorialEngine.js`)
- **Spotlight** (`src/tutorial/spotlight.js`)
  - Tutorial paso a paso
  - Onboarding interactivo

#### Seguridad
- **SecurityChecker** (`src/security/securityChecker.js`)
- **CSPGenerator** (`src/security/cspGenerator.js`)
  - Verificación de seguridad
  - Generación de CSP

## ⚙️ Configuración

### Archivos de Configuración
Ubicados en `/config/`:
- `babel.config.js` - Configuración de Babel
- `jest.config.js` - Configuración de Jest
- `playwright.config.js` - Configuración de Playwright
- `vite.config.js` - Configuración de Vite
- `wrangler.toml` - Configuración de Cloudflare Workers

### Variables de Entorno
- `.env.example` - Ejemplo de variables de entorno
- `.env.vault` - Vault de variables encriptadas

## 📦 Estructura del Proyecto

```
/vercel/sandbox/
├── config/                    # Configuración
│   ├── babel.config.js
│   ├── jest.config.js
│   ├── playwright.config.js
│   ├── vite.config.js
│   └── wrangler.toml
├── docs/                      # Documentación
│   ├── archive/              # Histórico
│   │   └── v1.0/            # Versión 1.0
│   └── current/              # Actual (v2.0)
│       ├── api/             # API docs
│       ├── deployment/      # Deployment
│       ├── guides/          # Guías
│       ├── testing/         # Testing
│       └── workflows/       # Workflows
├── scripts/                   # Scripts
│   ├── deployment/          # Deployment scripts
│   └── testing/             # Testing scripts
├── src/                       # Código fuente
│   ├── ai/                  # IA features
│   ├── components/          # Componentes UI
│   ├── core/                # Core features
│   ├── deploy/              # Deployment
│   ├── integrations/        # Integraciones
│   ├── security/            # Seguridad
│   ├── services/            # Servicios
│   ├── storage/             # Almacenamiento
│   ├── tutorial/            # Tutorial
│   └── utils/               # Utilidades
├── tests/                     # Tests
│   ├── ai/                  # Tests de IA
│   ├── deploy/              # Tests de deploy
│   ├── e2e/                 # Tests E2E
│   ├── integration/         # Tests de integración
│   └── unit/                # Tests unitarios
├── index.html                 # Entrada principal
├── script.js                  # Script principal
├── style.css                  # Estilos principales
├── package.json              # Configuración npm
└── README.md                 # README principal
```

## 📖 Documentación Archivada

La documentación de versiones anteriores se encuentra en:
- [Documentación v1.0](../archive/v1.0/) - Versión histórica

## 🔄 Mapeo de Rutas

Para información sobre cambios en la estructura de archivos:
- [PATH_MAPPING.md](PATH_MAPPING.md) - Mapeo completo de rutas

## 🆘 Soporte

### Reportar Issues
- [GitHub Issues](https://github.com/SebastianVernis/DragNDrop/issues)

### Contribuir
- Ver [README.md](../../README.md) para guías de contribución

## 📝 Licencia

MIT License - Ver archivo LICENSE en la raíz del proyecto

---

**Nota:** Esta documentación corresponde a la versión 2.0.0 del proyecto.
Para documentación de versiones anteriores, consulte la carpeta `archive/`.
