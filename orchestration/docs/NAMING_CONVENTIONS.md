# 📝 Convenciones de Nomenclatura

**Versión**: 1.0  
**Última Actualización**: 2025-12-10  
**Estado**: 🟢 ACTIVO

---

## 📖 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Identificadores de Tareas](#-identificadores-de-tareas)
3. [Nombres de Archivos](#-nombres-de-archivos)
4. [Estructura de Directorios](#-estructura-de-directorios)
5. [Mensajes y Comunicación](#-mensajes-y-comunicación)
6. [Código y Variables](#-código-y-variables)
7. [Git y Versionado](#-git-y-versionado)
8. [Ejemplos Completos](#-ejemplos-completos)

---

## 🎯 Visión General

Las convenciones de nomenclatura garantizan **consistencia**, **claridad** y **facilidad de búsqueda** en todo el sistema de orquestación y el proyecto DragNDrop.

### Principios Fundamentales

1. **Descriptivo**: El nombre debe indicar el contenido/propósito
2. **Consistente**: Seguir el mismo patrón en todo el proyecto
3. **Buscable**: Fácil de encontrar con grep/search
4. **Sin ambigüedad**: Un nombre = un significado

---

## 🏷️ Identificadores de Tareas

### Formato General

```
{PREFIJO}-{NÚMERO}
```

### Prefijos por Tipo

| Prefijo | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `TASK` | General | Tareas generales | `TASK-001` |
| `FEAT` | Feature | Nueva funcionalidad | `FEAT-015` |
| `BUG` | Bug | Corrección de error | `BUG-042` |
| `DOCS` | Documentación | Tareas de documentación | `DOCS-007` |
| `TEST` | Testing | Tareas de testing | `TEST-023` |
| `DEVOPS` | DevOps | Infraestructura/CI/CD | `DEVOPS-004` |
| `QA` | Quality | Auditorías de calidad | `QA-011` |
| `REFACTOR` | Refactoring | Mejoras de código | `REFACTOR-008` |
| `PERF` | Performance | Optimización | `PERF-003` |
| `SEC` | Security | Seguridad | `SEC-001` |

### Numeración

- **Secuencial**: Incrementar desde 001
- **Padding**: Siempre 3 dígitos mínimo (001, 002, ..., 999)
- **Sin reutilizar**: Números cancelados no se reutilizan
- **Por prefijo**: Cada prefijo tiene su propia secuencia

### Ejemplos

```
TASK-001    # Primera tarea general
FEAT-015    # Feature número 15
BUG-042     # Bug número 42
DEVOPS-004  # Cuarta tarea de DevOps
```

---

## 📄 Nombres de Archivos

### Archivos de Tareas

```
{ID}.md
```

**Ejemplos**:
```
TASK-001.md
FEAT-015.md
BUG-042.md
```

### Archivos de Reportes

```
{TIPO}_{FECHA}_{AGENTE}.md
```

**Ejemplos**:
```
PROGRESS_2025-12-10_dev.md
DAILY_2025-12-10.md
WEEKLY_2025-W50.md
AUDIT_2025-12-10_qa.md
```

### Archivos de Comunicación

```
MSG_{FROM}_{TO}_{TIMESTAMP}.md
```

**Ejemplos**:
```
MSG_dev_test_20251210T140000.md
MSG_qa_dev_20251210T153000.md
```

### Archivos de Bloqueo

```
LOCK_{TIMESTAMP}.md
REQUEST_{TIMESTAMP}.md
```

**Ejemplos**:
```
LOCK_20251210T100000.md
REQUEST_20251210T103000.md
```

### Archivos de Código

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Módulos JS | camelCase | `themeManager.js` |
| Componentes | camelCase | `fileLoader.js` |
| Tests unitarios | `{module}.test.js` | `themeManager.test.js` |
| Tests E2E | `{feature}.spec.js` | `mobile.spec.js` |
| Estilos CSS | kebab-case | `mobile-styles.css` |
| Configuración | kebab-case | `playwright.config.js` |

---

## 📁 Estructura de Directorios

### Orquestación

```
orchestration/
├── agents/
│   ├── dev/
│   │   ├── CONFIG.md
│   │   ├── CURRENT.md
│   │   ├── STATUS.md
│   │   ├── HISTORY.md
│   │   └── inbox/
│   ├── test/
│   ├── qa/
│   ├── docs/
│   └── devops/
│
├── tasks/
│   ├── queue/          # Tareas en cola
│   ├── active/         # Tareas activas
│   ├── completed/      # Tareas completadas
│   └── blocked/        # Tareas bloqueadas
│
├── reports/
│   ├── daily/          # Reportes diarios
│   ├── weekly/         # Reportes semanales
│   └── agents/         # Reportes por agente
│       ├── dev/
│       ├── test/
│       └── ...
│
├── status/
│   ├── DASHBOARD.md
│   └── METRICS.md
│
├── logs/
│   ├── activity/       # Logs de actividad
│   └── agent_logs/     # Logs por agente
│
└── docs/               # Documentación del sistema
    ├── TASK_WORKFLOW.md
    ├── AGENT_ROLES.md
    ├── NAMING_CONVENTIONS.md
    └── BEST_PRACTICES.md
```

### Código Fuente

```
src/
├── core/               # Módulos principales
│   ├── themeManager.js
│   ├── undoRedo.js
│   └── ...
│
├── components/         # Componentes UI
│   ├── fileLoader.js
│   ├── htmlParser.js
│   └── ...
│
├── utils/              # Utilidades
│   ├── deviceDetector.js
│   ├── performanceOptimizer.js
│   └── ...
│
├── storage/            # Persistencia
│   └── projectManager.js
│
└── styles/             # Estilos CSS
    ├── main.css
    ├── mobile.css
    └── themes/
```

### Tests

```
tests/
├── unit/
│   ├── core/
│   │   ├── themeManager.test.js
│   │   └── undoRedo.test.js
│   ├── components/
│   └── utils/
│
├── e2e/
│   ├── editor.spec.js
│   ├── mobile.spec.js
│   └── ...
│
├── fixtures/           # Datos de prueba
│   ├── sample-html.html
│   └── test-project.json
│
└── mocks/              # Mocks y stubs
    └── localStorage.js
```

---

## 💬 Mensajes y Comunicación

### Formato de Asunto

```
[{TIPO}] {DESCRIPCIÓN_BREVE}
```

**Tipos**:
- `REQUEST` - Solicitud
- `INFO` - Información
- `ALERT` - Alerta
- `RESPONSE` - Respuesta
- `HANDOFF` - Transferencia

**Ejemplos**:
```
[REQUEST] Tests necesarios para themeManager
[INFO] Feature completada - Layer System
[ALERT] Bloqueo detectado en TASK-006
[RESPONSE] Tests completados para TASK-003
[HANDOFF] Código listo para QA review
```

### Formato de Timestamps

**ISO 8601 completo**:
```
2025-12-10T14:30:00Z
```

**Para nombres de archivo** (sin caracteres especiales):
```
20251210T143000
```

**Para fechas simples**:
```
2025-12-10
```

**Para semanas**:
```
2025-W50
```

---

## 💻 Código y Variables

### JavaScript

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Variables | camelCase | `currentTheme` |
| Constantes | UPPER_SNAKE_CASE | `MAX_UNDO_STATES` |
| Funciones | camelCase | `applyTheme()` |
| Clases | PascalCase | `ThemeManager` |
| Métodos privados | _camelCase | `_updateUI()` |
| Eventos | kebab-case | `theme-changed` |
| Data attributes | kebab-case | `data-theme-id` |

### CSS

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Clases | kebab-case | `.theme-selector` |
| IDs | kebab-case | `#main-canvas` |
| Variables CSS | --kebab-case | `--primary-color` |
| Keyframes | kebab-case | `@keyframes fade-in` |
| Media queries | Descriptivo | `@media (min-width: 768px)` |

### HTML

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| IDs | kebab-case | `id="canvas-container"` |
| Clases | kebab-case | `class="btn-primary"` |
| Data attributes | kebab-case | `data-component-id` |
| Custom elements | kebab-case | `<drag-handle>` |

---

## 🔀 Git y Versionado

### Branches

```
{tipo}/{descripcion-breve}
```

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feature/` | Nueva funcionalidad | `feature/layer-system` |
| `bugfix/` | Corrección de bug | `bugfix/theme-persistence` |
| `hotfix/` | Fix urgente en prod | `hotfix/critical-crash` |
| `docs/` | Documentación | `docs/api-reference` |
| `refactor/` | Refactoring | `refactor/event-system` |
| `test/` | Tests | `test/coverage-expansion` |

### Commits

```
{tipo}({scope}): {descripción}
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta código)
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Mantenimiento

**Ejemplos**:
```
feat(theme): add dark mode support
fix(undo): resolve state corruption on rapid clicks
docs(api): update themeManager documentation
test(core): add unit tests for undoRedo
refactor(events): simplify event delegation
chore(deps): update jest to v29
```

### Tags de Versión

```
v{MAJOR}.{MINOR}.{PATCH}
```

**Ejemplos**:
```
v3.3.0
v3.3.1
v4.0.0
```

### Releases

```
v{VERSION} - {NOMBRE_CÓDIGO} (opcional)
```

**Ejemplos**:
```
v4.0.0 - Mobile First
v4.1.0 - Layer System
```

---

## 📋 Ejemplos Completos

### Ciclo de Vida de una Tarea

```
1. Creación:
   orchestration/tasks/queue/FEAT-015.md

2. Asignación:
   orchestration/tasks/active/FEAT-015.md
   orchestration/agents/dev/CURRENT.md → FEAT-015

3. Progreso:
   orchestration/reports/agents/dev/PROGRESS_2025-12-10_dev.md

4. Comunicación:
   orchestration/agents/test/inbox/MSG_dev_test_20251210T140000.md

5. Completado:
   orchestration/tasks/completed/FEAT-015.md
   orchestration/reports/agents/dev/COMPLETE_FEAT-015_2025-12-10.md
```

### Estructura de Feature Completa

```
# Código
src/core/layerSystem.js
src/components/LayerPanel.js
src/styles/layers.css

# Tests
tests/unit/core/layerSystem.test.js
tests/e2e/layers.spec.js

# Documentación
docs/features/LAYER_SYSTEM.md
CHANGELOG.md (actualizado)

# Git
Branch: feature/layer-system
Commits:
  - feat(layers): implement layer data structure
  - feat(layers): add LayerPanel component
  - feat(layers): add drag-to-reorder functionality
  - test(layers): add unit tests
  - docs(layers): add feature documentation
Tag: v4.1.0
```

### Reporte Diario

```
orchestration/reports/daily/DAILY_2025-12-10.md

Contenido:
# Reporte Diario - 2025-12-10

## Resumen
- Tareas completadas: 3
- Tareas en progreso: 2
- Tareas bloqueadas: 1

## Por Agente
### @dev
- FEAT-015: 100% ✅
- FEAT-016: 45% 🔄

### @test
- TEST-023: 80% 🔄
- Bloqueado por FEAT-016

...
```

---

## ⚠️ Anti-Patrones a Evitar

### ❌ No Hacer

```
# IDs inconsistentes
task-1, TASK_002, Task003

# Nombres vagos
fix.md, update.js, new-feature.md

# Timestamps inconsistentes
2025-12-10, 12/10/2025, Dec 10 2025

# Mezcla de convenciones
myFunction, my_function, MyFunction (en mismo contexto)

# Nombres muy largos
TASK-001-implement-the-new-layer-system-with-drag-and-drop-support.md
```

### ✅ Hacer

```
# IDs consistentes
TASK-001, TASK-002, TASK-003

# Nombres descriptivos pero concisos
FEAT-015.md, layer-system.js, DAILY_2025-12-10.md

# Timestamps ISO 8601
2025-12-10T14:30:00Z

# Convención única por contexto
camelCase para JS, kebab-case para CSS

# Nombres balanceados
FEAT-015.md (detalles en el contenido)
```

---

## 🔍 Búsqueda y Filtrado

### Comandos Útiles

```bash
# Buscar todas las tareas de un tipo
ls orchestration/tasks/*/FEAT-*.md

# Buscar tareas de un agente
grep -r "@dev" orchestration/tasks/

# Buscar por fecha
ls orchestration/reports/daily/DAILY_2025-12-*.md

# Buscar en código
grep -r "themeManager" src/

# Buscar commits de un tipo
git log --oneline --grep="feat(theme)"
```

---

## 🔗 Referencias

- [TASK_WORKFLOW.md](./TASK_WORKFLOW.md) - Flujo de trabajo de tareas
- [AGENT_ROLES.md](./AGENT_ROLES.md) - Roles y responsabilidades
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Mejores prácticas
- [Conventional Commits](https://www.conventionalcommits.org/) - Estándar de commits

---

**Sistema de Orquestación v1.0** - Nomenclatura consistente para máxima claridad
