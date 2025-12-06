# Estructura del Proyecto DragNDrop v2.0

**Fecha:** 2024-12-04
**Versión:** 2.0.0

## 📁 Estructura Completa

```
/vercel/sandbox/
│
├── 📋 Archivos Principales
│   ├── index.html                 # Punto de entrada de la aplicación
│   ├── script.js                  # Script principal del editor (1877+ líneas)
│   ├── style.css                  # Estilos principales (654+ líneas)
│   ├── package.json              # Configuración del proyecto
│   ├── package-lock.json         # Lock de dependencias
│   ├── README.md                 # Documentación principal
│   ├── CHANGELOG.md              # Historial de cambios (raíz)
│   └── .gitignore                # Archivos ignorados por Git
│
├── ⚙️ config/                     # Configuración centralizada
│   ├── babel.config.js           # Configuración de Babel
│   ├── jest.config.js            # Configuración de Jest
│   ├── playwright.config.js      # Configuración de Playwright
│   ├── vite.config.js            # Configuración de Vite
│   └── wrangler.toml             # Configuración de Cloudflare Workers
│
├── 📚 docs/                       # Documentación
│   │
│   ├── archive/                  # Documentación histórica
│   │   └── v1.0/                # Versión 1.0
│   │       ├── ARCHIVE_INFO.md
│   │       ├── RESUMEN_*.md
│   │       ├── PLAN_*.md
│   │       ├── IMPLEMENTACION_*.md
│   │       ├── WORKFLOW_*.md
│   │       └── ...
│   │
│   ├── current/                  # Documentación actual (v2.0)
│   │   ├── INDEX.md             # Índice completo de documentación
│   │   ├── PATH_MAPPING.md      # Mapeo de rutas
│   │   ├── CHANGELOG.md         # Historial de cambios
│   │   ├── STATUS.md            # Estado del proyecto
│   │   │
│   │   ├── api/                 # Documentación de API
│   │   │   ├── TECHNICAL_SPECS.md
│   │   │   ├── AI_FEATURES_README.md
│   │   │   ├── AI_FEATURES_QUICK_START.md
│   │   │   └── AGENTS.md
│   │   │
│   │   ├── deployment/          # Guías de deployment
│   │   │   ├── DEPLOYMENT.md
│   │   │   └── README.md
│   │   │
│   │   ├── guides/              # Guías de usuario
│   │   │   ├── QUICK_START.md
│   │   │   ├── GUIA_RAPIDA.md
│   │   │   ├── DEVELOPMENT.md
│   │   │   └── TESTING.md
│   │   │
│   │   ├── testing/             # Documentación de testing
│   │   │   ├── TEST_REPORT.md
│   │   │   ├── TESTING_CHECKLIST.md
│   │   │   └── VERIFICACION_CALIDAD.md
│   │   │
│   │   └── workflows/           # Workflows (futuro)
│   │
│   ├── deployment/              # Docs de deployment (legacy)
│   └── guides/                  # Guías (legacy)
│
├── 🔧 scripts/                    # Scripts de utilidad
│   ├── deployment/              # Scripts de deployment
│   │   ├── deploy-prod.sh
│   │   ├── deploy-vercel.sh
│   │   ├── deploy-netlify.sh
│   │   ├── deploy-github-pages.sh
│   │   ├── deploy-secrets.sh
│   │   ├── list-secrets.sh
│   │   └── delete-secret.sh
│   │
│   ├── testing/                 # Scripts de testing (futuro)
│   │
│   ├── init-workflow.sh         # Script de inicialización
│   └── verify-workflow4.cjs     # Script de verificación
│
├── 💻 src/                        # Código fuente
│   │
│   ├── ai/                      # Características de IA
│   │   ├── accessibilityChecker.js
│   │   ├── accessibilityFixes.js
│   │   ├── componentGenerator.js
│   │   ├── index.js
│   │   ├── promptBuilder.js
│   │   ├── responseParser.js
│   │   ├── seoOptimizer.js
│   │   ├── seoRules.js
│   │   ├── tokenTracker.js
│   │   └── wcagRules.js
│   │
│   ├── components/              # Componentes UI
│   │   ├── A11yPanel.js
│   │   ├── AdvancedPropertiesPanel.js
│   │   ├── DeployModal.js
│   │   ├── SEOPanel.js
│   │   ├── fileLoader.js
│   │   ├── htmlParser.js
│   │   ├── aiGenerator/
│   │   │   └── GeneratorModal.js
│   │   └── layers/
│   │       └── LayersPanel.js
│   │
│   ├── core/                    # Funcionalidades core
│   │   ├── aiCodeGenerator.js
│   │   ├── alignmentEngine.js
│   │   ├── batchOperations.js
│   │   ├── enhancedDragDrop.js
│   │   ├── freePositionDragDrop.js
│   │   ├── geminiValidator.js
│   │   ├── groupManager.js
│   │   ├── keyboardShortcuts.js
│   │   ├── layersManager.js
│   │   ├── livePreview.js
│   │   ├── marqueeSelector.js
│   │   ├── multiSelect.js
│   │   ├── projectAnalyzer.js
│   │   ├── resizeManager.js
│   │   ├── responsiveTester.js
│   │   ├── smartGuides.js
│   │   ├── themeManager.js
│   │   └── undoRedo.js
│   │
│   ├── deploy/                  # Sistema de deployment
│   │   ├── deploymentHistory.js
│   │   ├── deploymentMonitor.js
│   │   ├── fileUploader.js
│   │   ├── index.js
│   │   └── vercelDeployer.js
│   │
│   ├── integrations/            # Integraciones externas
│   │   ├── gitIntegration.js
│   │   ├── index.js
│   │   └── repoManager.js
│   │
│   ├── security/                # Seguridad
│   │   ├── cspGenerator.js
│   │   └── securityChecker.js
│   │
│   ├── services/                # Servicios
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── cloudSync.js
│   │   └── sessionManager.js
│   │
│   ├── storage/                 # Almacenamiento
│   │   └── projectManager.js
│   │
│   ├── tutorial/                # Tutorial interactivo
│   │   ├── index.js
│   │   ├── spotlight.js
│   │   ├── steps.js
│   │   └── tutorialEngine.js
│   │
│   └── utils/                   # Utilidades
│       └── componentExtractor.js
│
├── 🧪 tests/                      # Tests
│   │
│   ├── ai/                      # Tests de IA
│   │   ├── accessibilityChecker.test.js
│   │   ├── componentGenerator.test.js
│   │   └── seoOptimizer.test.js
│   │
│   ├── deploy/                  # Tests de deployment
│   │   ├── fileUploader.test.js
│   │   └── vercelDeployer.test.js
│   │
│   ├── e2e/                     # Tests End-to-End
│   │   ├── editor.spec.js
│   │   └── theme.spec.js
│   │
│   ├── integration/             # Tests de integración
│   │   ├── deployment-flow.test.js
│   │   └── drag-drop.test.js
│   │
│   ├── unit/                    # Tests unitarios
│   │   ├── alignmentEngine.test.js
│   │   ├── batchOperations.test.js
│   │   ├── layersManager.test.js
│   │   ├── multiSelect.test.js
│   │   ├── components/
│   │   │   └── fileLoader.test.js
│   │   └── core/
│   │       ├── editor.test.js
│   │       ├── keyboardShortcuts.test.js
│   │       ├── themeManager.test.js
│   │       └── undoRedo.test.js
│   │
│   ├── jest.config.js           # Config de Jest (tests)
│   ├── playwright.config.js     # Config de Playwright (tests)
│   └── setup.js                 # Setup de tests
│
├── 🚀 deploy/                     # Configuración de deployment
│   ├── github-pages/
│   ├── netlify/
│   └── vercel/
│       └── vercel.json
│
├── 📊 reports/                    # Reportes
│   └── checkpoints/
│       ├── dark-mode-checkpoint-1-planning.md
│       ├── dark-mode-checkpoint-2-code-review.md
│       ├── dark-mode-checkpoint-3-testing.md
│       └── dark-mode-checkpoint-4-documentation.md
│
├── 📝 tasks/                      # Sistema de tareas
│   ├── active/
│   │   ├── 01-landing-page.task.md
│   │   ├── 02-expand-testing.task.md
│   │   └── 03-theme-oscuro.task.md
│   └── templates/
│       ├── bug.task.md
│       └── feature.task.md
│
├── 🎬 videos/                     # Videos de demostración
│
├── 📋 workflow-docs/              # Documentación de workflows
│   ├── DOCUMENTATION_INDEX.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── INSTRUCCIONES.md
│   ├── MULTI_AGENT_OPTION.md
│   ├── README.md
│   ├── ROADMAP_V1.md
│   ├── SETUP_GUIDE.md
│   ├── TECHNICAL_SPECS.md
│   └── WORKFLOW_GUIDE.md
│
├── 🔄 workflows/                  # Workflows
│   └── WORKFLOWS_README.md
│
├── 🖥️ backend/                    # Backend Python (legacy)
│   └── app/
│       ├── core/
│       ├── models/
│       ├── routers/
│       └── schemas/
│
├── 🖥️ backend-node/               # Backend Node.js
│   ├── api/
│   │   ├── components.js
│   │   ├── deployments.js
│   │   └── projects.js
│   ├── auth/
│   │   ├── config.js
│   │   └── middleware.js
│   ├── db/
│   │   ├── client.js
│   │   └── schema.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   ├── setup.js
│   │   └── integration/
│   │       └── cloud-sync.test.js
│   ├── utils/
│   │   └── validation.js
│   ├── drizzle.config.js
│   ├── jest.config.js
│   ├── package.json
│   ├── README.md
│   ├── server.js
│   ├── SETUP_GUIDE.md
│   └── VERIFICATION.md
│
├── 🎨 frontend/                   # Frontend TypeScript (futuro)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.node.json
│
├── 🔒 .env.example                # Ejemplo de variables de entorno
├── 🔒 .env.vault                  # Vault de variables encriptadas
│
├── 🔧 .blackbox/                  # Configuración de Blackbox
│   ├── agents.config.json
│   ├── README.md
│   ├── SUPERVISOR_COMMANDS.md
│   ├── templates/
│   └── tmp/
│
├── 🔧 .blackboxcli/               # Configuración de Blackbox CLI
│   ├── mcp.json
│   ├── PROJECT_SUMMARY.md
│   └── settings.json
│
├── 🔧 .github/                    # GitHub Actions
│   └── workflows/
│
└── 📄 Documentos de Reorganización
    ├── REORGANIZATION_SUMMARY.md
    ├── VERIFICATION_CHECKLIST.md
    └── PROJECT_STRUCTURE.md (este archivo)
```

## 📊 Estadísticas del Proyecto

### Código Fuente
- **JavaScript**: 99+ archivos
- **Líneas de código**: 10,000+ líneas
- **Componentes**: 34 componentes drag & drop
- **Módulos**: 50+ módulos organizados

### Documentación
- **Archivos Markdown**: 87+ archivos
- **Documentación actual**: 20+ archivos
- **Documentación archivada**: 15+ archivos
- **Guías**: 10+ guías de usuario

### Tests
- **Tests unitarios**: 15+ archivos
- **Tests de integración**: 5+ archivos
- **Tests E2E**: 5+ archivos
- **Cobertura**: Alta

### Configuración
- **Archivos de config**: 5 archivos
- **Scripts**: 15+ scripts
- **Workflows**: 4 workflows

## 🎯 Características por Módulo

### Core Features (`src/core/`)
1. **themeManager.js** - Sistema de temas claro/oscuro
2. **undoRedo.js** - Sistema de deshacer/rehacer
3. **keyboardShortcuts.js** - Atajos de teclado
4. **enhancedDragDrop.js** - Drag & drop mejorado
5. **freePositionDragDrop.js** - Posicionamiento libre
6. **multiSelect.js** - Selección múltiple
7. **marqueeSelector.js** - Selección por marquesina
8. **layersManager.js** - Gestión de capas
9. **alignmentEngine.js** - Motor de alineación
10. **batchOperations.js** - Operaciones en lote
11. **responsiveTester.js** - Testing responsive
12. **livePreview.js** - Vista previa en vivo
13. **smartGuides.js** - Guías inteligentes
14. **resizeManager.js** - Redimensionamiento
15. **groupManager.js** - Gestión de grupos
16. **projectAnalyzer.js** - Análisis de proyectos
17. **geminiValidator.js** - Validación con IA
18. **aiCodeGenerator.js** - Generación de código con IA

### AI Features (`src/ai/`)
1. **componentGenerator.js** - Generación de componentes
2. **accessibilityChecker.js** - Verificación de accesibilidad
3. **accessibilityFixes.js** - Correcciones de accesibilidad
4. **seoOptimizer.js** - Optimización SEO
5. **seoRules.js** - Reglas SEO
6. **wcagRules.js** - Reglas WCAG
7. **promptBuilder.js** - Constructor de prompts
8. **responseParser.js** - Parser de respuestas
9. **tokenTracker.js** - Seguimiento de tokens

### Components (`src/components/`)
1. **A11yPanel.js** - Panel de accesibilidad
2. **SEOPanel.js** - Panel SEO
3. **DeployModal.js** - Modal de deployment
4. **AdvancedPropertiesPanel.js** - Panel de propiedades avanzadas
5. **LayersPanel.js** - Panel de capas
6. **GeneratorModal.js** - Modal de generador de IA
7. **fileLoader.js** - Cargador de archivos
8. **htmlParser.js** - Parser HTML

### Deployment (`src/deploy/`)
1. **vercelDeployer.js** - Deployer de Vercel
2. **deploymentMonitor.js** - Monitor de deployments
3. **deploymentHistory.js** - Historial de deployments
4. **fileUploader.js** - Subida de archivos

### Integrations (`src/integrations/`)
1. **gitIntegration.js** - Integración con Git
2. **repoManager.js** - Gestión de repositorios

### Security (`src/security/`)
1. **securityChecker.js** - Verificador de seguridad
2. **cspGenerator.js** - Generador de CSP

### Services (`src/services/`)
1. **apiClient.js** - Cliente API
2. **authService.js** - Servicio de autenticación
3. **cloudSync.js** - Sincronización en la nube
4. **sessionManager.js** - Gestión de sesiones

### Storage (`src/storage/`)
1. **projectManager.js** - Gestión de proyectos

### Tutorial (`src/tutorial/`)
1. **tutorialEngine.js** - Motor de tutorial
2. **spotlight.js** - Sistema de spotlight
3. **steps.js** - Pasos del tutorial

## 🔗 Enlaces Rápidos

### Documentación Principal
- [README.md](README.md)
- [Índice de Documentación](docs/current/INDEX.md)
- [Mapeo de Rutas](docs/current/PATH_MAPPING.md)

### Guías
- [Quick Start](docs/current/guides/QUICK_START.md)
- [Guía Rápida](docs/current/guides/GUIA_RAPIDA.md)
- [Development Guide](docs/current/guides/DEVELOPMENT.md)
- [Testing Guide](docs/current/guides/TESTING.md)

### API
- [Technical Specs](docs/current/api/TECHNICAL_SPECS.md)
- [AI Features](docs/current/api/AI_FEATURES_README.md)

### Deployment
- [Deployment Guide](docs/current/deployment/DEPLOYMENT.md)

### Testing
- [Test Report](docs/current/testing/TEST_REPORT.md)
- [Testing Checklist](docs/current/testing/TESTING_CHECKLIST.md)

## 📝 Notas

- **Versión**: 2.0.0
- **Última actualización**: 2024-12-04
- **Estado**: Producción
- **Licencia**: MIT

---

**Generado automáticamente durante la reorganización del proyecto**
