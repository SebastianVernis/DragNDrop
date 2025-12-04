# Mapeo de Rutas - Reorganización del Proyecto

**Fecha:** 2024-12-04
**Versión:** 2.0.0

## Cambios en la Estructura de Archivos

### Archivos de Configuración

| Ubicación Anterior | Nueva Ubicación | Descripción |
|-------------------|-----------------|-------------|
| `/babel.config.js` | `/config/babel.config.js` | Configuración de Babel |
| `/jest.config.js` | `/config/jest.config.js` | Configuración de Jest |
| `/playwright.config.js` | `/config/playwright.config.js` | Configuración de Playwright |
| `/vite.config.js` | `/config/vite.config.js` | Configuración de Vite |
| `/wrangler.toml` | `/config/wrangler.toml` | Configuración de Cloudflare Workers |

### Scripts

| Ubicación Anterior | Nueva Ubicación | Descripción |
|-------------------|-----------------|-------------|
| `/init-workflow.sh` | `/scripts/init-workflow.sh` | Script de inicialización |
| `/verify-workflow4.cjs` | `/scripts/verify-workflow4.cjs` | Script de verificación |

### Documentación

#### Documentación Actual (v2.0)

| Archivo | Nueva Ubicación | Categoría |
|---------|-----------------|-----------|
| `CHANGELOG.md` | `/docs/current/CHANGELOG.md` | General |
| `STATUS.md` | `/docs/current/STATUS.md` | General |
| `QUICK_START.md` | `/docs/current/guides/QUICK_START.md` | Guías |
| `GUIA_RAPIDA.md` | `/docs/current/guides/GUIA_RAPIDA.md` | Guías |
| `DEPLOYMENT.md` | `/docs/current/deployment/DEPLOYMENT.md` | Deployment |
| `TEST_REPORT.md` | `/docs/current/testing/TEST_REPORT.md` | Testing |
| `TESTING_CHECKLIST.md` | `/docs/current/testing/TESTING_CHECKLIST.md` | Testing |
| `VERIFICACION_CALIDAD.md` | `/docs/current/testing/VERIFICACION_CALIDAD.md` | Testing |
| `TECHNICAL_SPECS.md` | `/docs/current/api/TECHNICAL_SPECS.md` | API |
| `AI_FEATURES_README.md` | `/docs/current/api/AI_FEATURES_README.md` | API |
| `AI_FEATURES_QUICK_START.md` | `/docs/current/api/AI_FEATURES_QUICK_START.md` | API |
| `AGENTS.md` | `/docs/current/api/AGENTS.md` | API |

#### Documentación Archivada (v1.0)

Toda la documentación histórica se encuentra en `/docs/archive/v1.0/`:
- `RESUMEN_*.md`
- `PLAN_*.md`
- `IMPLEMENTACION_*.md`
- `WORKFLOW_*.md`
- `ORGANIZATION_SUMMARY.md`
- `GITHUB_ISSUE_8_RESOLUTION.md`

## Actualización de Referencias

### En package.json

Los scripts que referencian archivos de configuración deben actualizarse:

```json
{
  "scripts": {
    "test": "jest --config config/jest.config.js",
    "test:e2e": "playwright test --config config/playwright.config.js",
    "build": "vite build --config config/vite.config.js"
  }
}
```

### En archivos de código

Si algún archivo importa configuraciones, actualizar las rutas:

```javascript
// Antes
import config from './jest.config.js';

// Después
import config from './config/jest.config.js';
```

## Estructura Final del Proyecto

```
/vercel/sandbox/
├── config/                    # Archivos de configuración
│   ├── babel.config.js
│   ├── jest.config.js
│   ├── playwright.config.js
│   ├── vite.config.js
│   └── wrangler.toml
├── docs/                      # Documentación
│   ├── archive/              # Documentación histórica
│   │   └── v1.0/            # Versión 1.0
│   └── current/              # Documentación actual
│       ├── api/             # Documentación de API
│       ├── deployment/      # Guías de deployment
│       ├── guides/          # Guías de usuario
│       ├── testing/         # Documentación de testing
│       └── workflows/       # Workflows
├── scripts/                   # Scripts de utilidad
│   ├── deployment/          # Scripts de deployment
│   └── testing/             # Scripts de testing
├── src/                       # Código fuente
├── tests/                     # Tests
├── index.html                 # Punto de entrada
├── script.js                  # Script principal
├── style.css                  # Estilos principales
├── package.json              # Configuración del proyecto
└── README.md                 # Documentación principal
```

## Notas Importantes

1. **No se eliminó ningún archivo**: Toda la documentación antigua se preservó en `/docs/archive/v1.0/`
2. **Versionado**: La documentación está versionada para evitar confusiones
3. **Referencias**: Actualizar todas las referencias en código y scripts
4. **Compatibilidad**: Los archivos principales (index.html, script.js, style.css) permanecen en la raíz

## Próximos Pasos

1. Actualizar referencias en package.json
2. Actualizar imports en archivos de código
3. Verificar que todos los scripts funcionen correctamente
4. Actualizar CI/CD pipelines si es necesario
