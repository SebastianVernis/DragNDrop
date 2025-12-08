# Workflow Multi-Agente - Setup y Uso

## 📋 Tabla de Contenidos
- [Inicialización](#inicialización)
- [Configuración](#configuración)
- [Agentes Disponibles](#agentes-disponibles)
- [Workflows](#workflows)
- [Comandos](#comandos)
- [Troubleshooting](#troubleshooting)

## 🚀 Inicialización

### Primer Uso

1. **Ejecutar script de inicialización:**
   ```bash
   ./init-workflow.sh
   ```

2. **Verificar que todo esté configurado:**
   - ✅ Archivo `.env` con credenciales
   - ✅ Dependencias instaladas
   - ✅ Estructura de directorios
   - ✅ Configuración de agentes
   - ✅ Git configurado

### Credenciales Configuradas

El archivo `.env` ya está configurado con:

```bash
# Gemini API (validación y generación)
GEMINI_API_KEY=AIzaSyAHB1_YzZMGDlKa3TN7HvofB97fOOf586Y

# Blackbox AI (agentes)
BLACKBOX_API_KEY=sk-njEwFN7y0CpMnnCuz6e9ig
FALLBACK_BLACKBOX_API_KEY=sk-mgu31y6sPid25HyDyFFNMg
BLACKBOX_ACCESS_API_TOKEN=bb_bf3c2d5d10ddd9516781334bd61f0b6e3bfe619b56acc745e5fa5bf9fbbe8c78
```

## ⚙️ Configuración

### Estructura de Archivos

```
.
├── .env                           # Variables de entorno
├── .blackbox/
│   ├── agents.config.json         # Configuración de agentes
│   ├── README.md                  # Guía de agentes
│   ├── SUPERVISOR_COMMANDS.md     # Comandos del supervisor
│   └── tmp/                       # Archivos temporales
├── .blackboxcli/
│   ├── settings.json              # Settings de CLI
│   └── mcp.json                   # Configuración MCP
├── workflows/
│   ├── development/
│   │   ├── start-feature.sh
│   │   └── complete-feature.sh
│   └── testing/
│       └── run-full-suite.sh
└── tasks/
    ├── active/                    # Tareas en progreso
    └── templates/                 # Templates de tareas
```

### Configuración de MCP (Opcional)

Si quieres usar Blackbox CLI con MCP:

```bash
blackbox mcp add remote-code \
  https://cloud.blackbox.ai/api/mcp \
  -t http \
  -H "Authorization: Bearer bb_bf3c2d5d10ddd9516781334bd61f0b6e3bfe619b56acc745e5fa5bf9fbbe8c78"
```

## 👥 Agentes Disponibles

### 1. 👨‍💻 Developer Agent
**Rol:** Desarrollo
**Capacidades:**
- Implementar features
- Corregir bugs
- Refactorizar código
- Code review
- Optimizar performance

**Herramientas:** git, npm, eslint, prettier

### 2. 🧪 Tester Agent
**Rol:** Testing
**Capacidades:**
- Escribir tests unitarios
- Escribir tests E2E
- Ejecutar suites de tests
- Reports de coverage
- Testing de regresión

**Herramientas:** jest, playwright, testing-library

### 3. ✅ QA Agent
**Rol:** Quality Assurance
**Capacidades:**
- Testing manual
- Auditorías de accesibilidad
- Auditorías de performance
- Tests cross-browser
- Auditorías SEO

**Herramientas:** lighthouse, axe-core, browserstack

### 4. 🚀 DevOps Agent
**Rol:** Operations
**Capacidades:**
- Deploy a staging
- Deploy a producción
- Rollbacks
- Health checks
- Monitoring

**Herramientas:** vercel-cli, gh-cli, docker

### 5. 📚 Documentation Agent
**Rol:** Documentación
**Capacidades:**
- Escribir documentación
- Generar API docs
- Crear tutoriales
- Actualizar README
- Mantener CHANGELOG

**Herramientas:** markdown, jsdoc, mermaid

## 🔄 Workflows

### Feature Development

**Secuencia:** dev → test → qa → docs → devops

```bash
# Iniciar nueva feature
./workflows/development/start-feature.sh "free-position-system"

# Desarrollar (Developer Agent)
# - Implementar código
# - Commits incrementales

# Testing (Tester Agent)
npm test
npm run test:e2e

# QA (QA Agent)
npm run lighthouse
npm run accessibility

# Docs (Documentation Agent)
# - Actualizar README
# - Actualizar CHANGELOG

# Deploy (DevOps Agent)
./workflows/development/complete-feature.sh
```

### Bug Fix

**Secuencia:** dev → test → devops

```bash
# Más rápido, menos gates
# Para bugs urgentes
```

### Release

**Secuencia:** test → qa → docs → devops

```bash
# Workflow completo con todas las verificaciones
# Incluye approval manual
```

### Hotfix

**Secuencia:** dev → devops

```bash
# Emergencias - Fast track
# Mínimas verificaciones
```

## 🎯 Comandos

### Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Lint
npm run lint

# Format
npm run format
```

### Testing

```bash
# Tests unitarios
npm test
npm run test:watch
npm run test:coverage

# Tests E2E
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug

# Suite completa
./workflows/testing/run-full-suite.sh
```

### Git

```bash
# Ver estado
git status

# Crear feature branch
git checkout -b feature/nombre

# Commit
git add .
git commit -m "feat: descripción"

# Push
git push origin feature/nombre
```

### Workflows

```bash
# Iniciar feature
./workflows/development/start-feature.sh <nombre>

# Completar feature
./workflows/development/complete-feature.sh

# Suite de tests
./workflows/testing/run-full-suite.sh
```

## 🔍 Verificación del Sistema

### Check Rápido

```bash
# Ver estado de todo
./init-workflow.sh

# Debería mostrar:
# ✅ Node.js instalado
# ✅ Dependencias ok
# ✅ .env configurado
# ✅ 5 agentes configurados
# ✅ Git ok
```

### Verificar Credenciales

```bash
# Ver variables de entorno
cat .env | grep API_KEY

# Deberías ver:
# GEMINI_API_KEY=AIza...
# BLACKBOX_API_KEY=sk-...
```

### Verificar Agentes

```bash
# Ver configuración
cat .blackbox/agents.config.json | grep -A 3 '"role"'

# Deberías ver 5 agentes:
# - development
# - testing
# - quality-assurance
# - operations
# - documentation
```

## 🐛 Troubleshooting

### El script init-workflow.sh no ejecuta

```bash
# Dar permisos
chmod +x init-workflow.sh
./init-workflow.sh
```

### .env no encontrado

```bash
# El script ya lo creó, pero si necesitas recrearlo:
cp .env.example .env

# Luego editar con las credenciales del archivo:
# /home/sebastianvernis/.blackbox_tokens
```

### Dependencias no instaladas

```bash
npm install
```

### Tests fallan

```bash
# Verificar que el servidor no esté corriendo en 8080
lsof -ti:8080 | xargs kill -9

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ejecutar tests
npm test
```

### Git tiene cambios sin commitear

```bash
# Ver qué cambió
git status

# Agregar archivos
git add .

# Commit
git commit -m "mensaje"
```

## 📚 Documentación Adicional

- **Guía de Agentes:** `.blackbox/README.md`
- **Comandos Supervisor:** `.blackbox/SUPERVISOR_COMMANDS.md`
- **Documentación General:** `docs/`
- **Guía de Workflows:** `workflows/WORKFLOWS_README.md`

## 🎯 Próximos Pasos

1. ✅ Workflow inicializado
2. ⏭️ Ejecutar tests: `npm test`
3. ⏭️ Iniciar servidor: `npm run dev`
4. ⏭️ Abrir http://localhost:8080
5. ⏭️ Empezar a desarrollar

## 🤝 Colaboración

### Crear Nueva Feature

```bash
# 1. Crear rama
git checkout -b feature/nombre

# 2. Ejecutar workflow
./workflows/development/start-feature.sh nombre

# 3. Desarrollar
# ... código ...

# 4. Tests
npm test
npm run test:e2e

# 5. Completar
./workflows/development/complete-feature.sh

# 6. Push y PR
git push origin feature/nombre
```

### Reportar Bug

```bash
# 1. Crear issue en GitHub
# 2. Crear rama
git checkout -b fix/bug-descripcion

# 3. Fix
# ... código ...

# 4. Tests
npm test

# 5. Push
git push origin fix/bug-descripcion
```

## 📊 Métricas

El sistema recolecta métricas de:
- ✅ Usuarios
- ✅ Performance
- ✅ Errores
- ✅ GitHub activity
- ✅ Discord activity

Ver: `metrics/`

## 🔐 Seguridad

**⚠️ Importante:**
- ❌ NO commitear `.env`
- ❌ NO exponer API keys
- ✅ Usar `.env.example` como template
- ✅ Rotar keys periódicamente

## 📞 Soporte

- **Documentación:** `docs/`
- **Issues:** GitHub Issues
- **Slack/Discord:** (configurar en `.blackbox/agents.config.json`)

---

**✨ ¡Listo para desarrollar con el workflow multi-agente!**
