# 📋 Guía de Organización de Documentación

## Estructura Actual (Diciembre 2025)

### 📁 Raíz del Proyecto
Solo archivos esenciales y de alto nivel:

```
/
├── DOCUMENTATION.md        # Índice principal → Apunta a docs/
├── README.md              # README principal del proyecto
├── AGENTS.md              # Comandos de desarrollo
├── CHANGELOG.md           # Registro de cambios
├── package.json           # Configuración npm
└── [archivos de código]
```

### 📚 Carpeta `docs/`
**Toda** la documentación organizada:

```
docs/
├── README.md                    # Punto de entrada principal
├── GETTING_STARTED.md          # Inicio rápido
├── DOCUMENTATION_INDEX.md      # Índice completo
├── INDICE.md                   # Índice general
├── ROADMAP_V1.md              # Roadmap
│
├── architecture/              # 🏗️ Arquitectura
│   ├── README.md
│   ├── TECHNICAL_SPECS.md
│   ├── PROJECT_STRUCTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── MULTI_AGENT_OPTION.md
│   └── PLAN_*.md
│
├── workflows/                 # 🔄 Workflows
│   ├── README.md
│   ├── WORKFLOW_1_*.md       # UI/UX
│   ├── WORKFLOW_2_*.md       # AI Features
│   ├── WORKFLOW_3_*.md       # Backend
│   ├── WORKFLOW_4_*.md       # Deploy
│   └── WORKFLOW_GUIDE.md
│
├── guides/                    # 📘 Guías
│   ├── README.md
│   ├── QUICK_START.md
│   ├── SETUP_GUIDE.md
│   ├── AI_FEATURES_*.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── TESTING.md
│   └── [features guides]
│
├── reports/                   # 📊 Reportes
│   ├── README.md
│   ├── STATUS.md
│   ├── TEST_REPORT.md
│   ├── TESTING_CHECKLIST.md
│   ├── VERIFICACION_CALIDAD.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── RESUMEN_*.md
│   └── checkpoints/
│
├── archive/                   # 📦 Histórico
│   └── [docs antiguos]
│
├── deployment/               # 🚀 Deploy
│   └── DEPLOYMENT_GUIDE.md
│
└── api/                      # 🔧 API
    └── [api docs]
```

## 🎯 Principios de Organización

### 1. **Separación Clara**
- **Raíz**: Solo archivos esenciales del proyecto
- **docs/**: TODA la documentación

### 2. **Navegación Jerárquica**
- Cada carpeta tiene su propio `README.md`
- READMEs funcionan como índices
- Links relativos entre documentos

### 3. **Categorización Lógica**
- **architecture/**: Diseño técnico, specs, planes
- **workflows/**: Procesos de implementación
- **guides/**: Tutoriales y guías de uso
- **reports/**: Status, testing, QA
- **archive/**: Documentos históricos

### 4. **Nomenclatura Consistente**
- `README.md`: Índice de la carpeta
- `NOMBRE_DESCRIPTIVO.md`: Contenido específico
- `WORKFLOW_N_*.md`: Workflows numerados
- `*_SUMMARY.md`: Resúmenes

## 📍 Dónde Colocar Nuevos Documentos

| Tipo de Documento | Ubicación |
|-------------------|-----------|
| Guía de usuario | `docs/guides/` |
| Especificación técnica | `docs/architecture/` |
| Workflow nuevo | `docs/workflows/` |
| Reporte de testing | `docs/reports/` |
| Guía de API | `docs/api/` |
| Guía de deploy | `docs/deployment/` o `docs/guides/` |
| Documento histórico | `docs/archive/` |

## 🔄 Proceso de Actualización

### Agregar Nuevo Documento:
1. Determinar categoría correcta
2. Crear archivo en carpeta apropiada
3. Actualizar README de esa carpeta
4. Si es importante, agregar a `docs/README.md`
5. Actualizar `DOCUMENTATION_INDEX.md` si necesario

### Reorganizar Documentos:
1. Mover archivo a nueva ubicación
2. Actualizar READMEs afectados
3. Verificar y actualizar links rotos
4. Actualizar índices principales

### Archivar Documentos:
1. Mover a `docs/archive/`
2. Agregar nota en README de origen
3. Mantener link si es referenciado frecuentemente

## 🔍 Búsqueda de Documentos

### Por Punto de Entrada:
- **Usuario nuevo**: `DOCUMENTATION.md` → `docs/README.md` → `docs/GETTING_STARTED.md`
- **Desarrollador**: `AGENTS.md` → `docs/architecture/` → `docs/workflows/`
- **Implementador**: `docs/workflows/` → workflow específico

### Por Categoría:
- **"¿Cómo empiezo?"** → `docs/guides/QUICK_START.md`
- **"¿Cómo funciona X?"** → `docs/architecture/TECHNICAL_SPECS.md`
- **"¿Cómo implemento Y?"** → `docs/workflows/WORKFLOW_N_*.md`
- **"¿Está todo bien?"** → `docs/reports/TEST_REPORT.md`

## ✅ Checklist de Calidad

Cuando agregues/modifiques documentación:

- [ ] Archivo en la carpeta correcta
- [ ] Nombre descriptivo y consistente
- [ ] README de la carpeta actualizado
- [ ] Links internos funcionan
- [ ] Formato Markdown correcto
- [ ] Secciones claras con headers
- [ ] Fecha de actualización al final
- [ ] Sin duplicados
- [ ] Sin documentos huérfanos

## 🛠️ Herramientas

### Verificar Links:
```bash
# Buscar links rotos
grep -r "\[.*\](.*\.md)" docs/ | grep -v node_modules
```

### Listar Todos los Documentos:
```bash
find docs/ -name "*.md" -type f | sort
```

### Verificar Estructura:
```bash
tree docs/ -L 2 -I 'node_modules'
```

## 📊 Métricas

**Estado actual**:
- Documentos en raíz: 4 (esenciales solamente)
- Documentos en docs/: ~70
- Subdirectorios: 7
- Niveles de profundidad: 2-3
- READMEs de navegación: 6

## 🎓 Convenciones

1. **Un tema = Un archivo**
2. **Índices claros** en cada nivel
3. **Links relativos** siempre que sea posible
4. **Metadata** al final de cada documento
5. **Sin duplicación** de contenido
6. **Versionado** en nombres cuando necesario

---

**Última actualización**: 5 de Diciembre, 2025  
**Mantenido por**: Equipo DragNDrop

**Nota**: Esta guía debe actualizarse cuando se hagan cambios significativos a la organización.
