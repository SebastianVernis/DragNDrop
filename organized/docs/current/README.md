# DragNDrop - Editor HTML Visual v3.0

Un editor HTML visual completo con funcionalidad de arrastrar y soltar, redimensionamiento visual, validación con IA, y análisis de proyectos completos.

![DragNDrop Editor](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-Expanding-yellow)
![Version](https://img.shields.io/badge/Version-3.0-blue)

## 🌐 Live Demo

**Production:** https://dragndrop-editor.pages.dev

Deployed on Cloudflare Pages with automatic HTTPS and global CDN.

## ✨ Novedades v3.0

- 🎯 **Drag & Drop Mejorado**: Preview visual, indicadores animados, drag handles
- 📐 **Redimensionamiento Visual**: 8 handles para cambiar tamaño con feedback en tiempo real
- 🤖 **Validación con IA**: Corrección automática de sintaxis usando Gemini API (gemini-2.0-flash-lite)
- 📁 **Análisis de Proyectos**: Carga directorios completos, detecta framework, analiza estructura

[📖 Ver documentación completa de nuevas funcionalidades](./NUEVAS_FUNCIONALIDADES.md) | [🚀 Guía rápida](./GUIA_RAPIDA.md)

---

## 🎯 Plan v1.0 "Best As Possible"

### 📦 **Workflow Documentation Package**

Documentación completa para implementar v1.0 con **4 workflows paralelos** y **13 features MUST-HAVE**.

**📍 Ubicación:** `workflow-docs/`

**🎨 Presentación interactiva:** [workflow-docs/index.html](./workflow-docs/index.html)

**📦 Paquete portable:** `workflow-docs/dragndrop-workflow-docs-20251202.zip` (103 KB)

### Quick Access
- [🎯 Plan de Implementación](./IMPLEMENTATION_PLAN.md) - Documento maestro
- [🔧 Especificaciones Técnicas](./TECHNICAL_SPECS.md) - Arquitectura completa
- [🔄 Guía de Workflows](./WORKFLOW_GUIDE.md) - Timeline día a día
- [🤖 Opción Multi-Agent](./MULTI_AGENT_OPTION.md) - Acelerar con IA
- [🔐 Setup Guide](./SETUP_GUIDE.md) - Configurar API keys

**Timeline:** 10-12 semanas | **Features:** 21 (vs 8 actuales) | **Workflows:** 4 paralelos

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm test

# Build para producción
npm run build

# Desplegar
npm run deploy
```

## 📁 Estructura del Proyecto

```
DragNDrop/
├── src/                    # Código fuente
├── tests/                  # Tests organizados
│   ├── unit/              # Tests unitarios
│   ├── integration/       # Tests de integración
│   ├── e2e/               # Tests end-to-end
│   └── fixtures/          # Datos de prueba
├── docs/                   # Documentación
│   ├── README.md          # Documentación principal
│   ├── api/               # Documentación de API
│   ├── guides/            # Guías de desarrollo
│   └── deployment/        # Guías de despliegue
├── deploy/                 # Configuraciones de deployment
├── scripts/                # Scripts de automatización
└── build/                  # Archivos de build
```

## 📚 Documentación

### 🎯 **[ÍNDICE COMPLETO →](./DOCUMENTATION_INDEX.md)** | Navegación rápida a toda la documentación

### Para Usuarios
- **[Guía Rápida](./GUIA_RAPIDA.md)** - Tutorial de 5 minutos
- **[Nuevas Funcionalidades v3.0](./NUEVAS_FUNCIONALIDADES.md)** - Features detalladas

### Para Desarrolladores
- **[Plan de Implementación v1.0](./IMPLEMENTATION_PLAN.md)** ⭐ **EMPEZAR AQUÍ**
- **[Guía de Workflows](./WORKFLOW_GUIDE.md)** - Trabajo en paralelo sin conflictos
- **[Especificaciones Técnicas](./TECHNICAL_SPECS.md)** - Arquitectura y specs completas
- **[AGENTS.md](./AGENTS.md)** - Guidelines y comandos

### Para Product/Planning
- **[Roadmap v1.0](./ROADMAP_V1.md)** - 60+ features organizadas y priorizadas

## 🧪 Testing

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests end-to-end
npm run test:e2e

# Coverage report
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🚀 Deployment

### Desarrollo Local
```bash
npm run dev
```

### Staging
```bash
npm run deploy:preview
```

### Producción
```bash
npm run deploy:prod
```

### Plataformas Soportadas
- **Vercel** - Deployment automático
- **Netlify** - Deployment con formularios
- **GitHub Pages** - Hosting gratuito
- **Servidor propio** - Build estático

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+ Modules)
- **Build**: Vite
- **Testing**: Jest (Unit), Playwright (E2E)
- **Deployment**: Vercel, Netlify, GitHub Actions
- **Architecture**: Modular design con 8 módulos core
- **Development**: JSDoc, ESLint, Prettier

## ✨ Nuevas Funcionalidades (v2.0)

- ✅ **Sistema Undo/Redo**: Historial de 50 estados con navegación completa
- ✅ **Atajos de Teclado**: 20+ shortcuts para workflow rápido
- ✅ **Responsive Tester**: Prueba en 8 dispositivos predefinidos
- ✅ **Live Preview**: Vista previa en tiempo real en ventana separada
- ✅ **Gestión Avanzada**: Proyectos, componentes y archivos mejorados

## ✨ Nuevas Funcionalidades (v2.1)

- ✨ **Tema Oscuro** - Modo claro/oscuro con detección automática y persistencia

Ver [NUEVAS_FUNCIONALIDADES.md](./docs/NUEVAS_FUNCIONALIDADES.md) para detalles completos.

### Tema Oscuro / Dark Mode

DragNDrop incluye soporte completo para tema oscuro con las siguientes características:

- **Toggle Manual:** Botón en la toolbar para cambiar entre modo claro y oscuro
- **Keyboard Shortcut:** Presiona `Ctrl+Shift+D` (o `Cmd+Shift+D` en Mac) para alternar
- **Detección Automática:** Detecta la preferencia de tu sistema operativo
- **Persistencia:** Tu preferencia se guarda automáticamente
- **Transiciones Suaves:** Cambios visuales con animación de 0.3s

#### Cómo Usar

1. **Cambiar tema manualmente:**
   - Click en el botón "🌙 Oscuro" o "☀️ Claro" en la toolbar
   - O presiona `Ctrl+Shift+D`

2. **Detección automática:**
   - Al abrir por primera vez, DragNDrop detecta tu preferencia del sistema
   - Si tu sistema está en dark mode, la app iniciará en dark mode

3. **Persistencia:**
   - Tu elección se guarda automáticamente
   - Se aplicará en futuras sesiones

Ver [Guía de Usuario: Tema Oscuro](./docs/USER_GUIDE_THEME.md) para más detalles.

## 📈 Estado del Proyecto

- ✅ **Core Features**: Completamente implementado
- ✅ **New Features v2.0**: Sistema undo/redo, shortcuts, responsive testing, live preview
- ✅ **New Features v2.1**: Tema oscuro con detección automática
- ✅ **Documentation**: Documentación completa y actualizada
- ✅ **Testing**: Tests unitarios y E2E para módulos críticos
- 🔄 **CI/CD**: Configurando pipeline
- ✅ **Deployment**: Múltiples plataformas

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+S` | Guardar proyecto |
| `Ctrl+Shift+P` | Abrir paleta de comandos |
| `Ctrl+Shift+D` | Alternar tema claro/oscuro |
| `Delete` | Eliminar elemento seleccionado |

Ver documentación completa de atajos en [NUEVAS_FUNCIONALIDADES.md](./docs/NUEVAS_FUNCIONALIDADES.md).

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces

- [Demo en Vivo](https://dragndrop-editor.vercel.app)
- [Documentación Completa](./docs/README.md)
- [Reportar Bug](https://github.com/usuario/dragndrop/issues)
- [Solicitar Feature](https://github.com/usuario/dragndrop/issues)