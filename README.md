# DragNDrop - Editor HTML Visual v2.0

Un editor HTML visual completo con funcionalidad de arrastrar y soltar, sistema de temas, undo/redo, y características avanzadas de desarrollo web.

![DragNDrop Editor](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-High-green)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)

## 🌐 Live Demo

**Production:** https://dragndrop-editor.pages.dev

Deployed on Cloudflare Pages with automatic HTTPS and global CDN.

## ✨ Características Principales v2.0

### 🎨 Sistema de Temas
- **Modo Claro/Oscuro**: Cambio fluido entre temas
- **Detección Automática**: Detecta preferencia del sistema
- **Persistencia**: Guarda preferencia del usuario
- **17 CSS Variables**: Sistema de theming consistente
- **Atajo Rápido**: `Ctrl+Shift+D` para cambiar tema

### ↩️ Sistema Undo/Redo
- **Historial Completo**: Deshacer y rehacer cambios
- **Atajos Estándar**: `Ctrl+Z` y `Ctrl+Y`
- **Límite Configurable**: Gestión eficiente de memoria
- **Estados Persistentes**: Mantiene historial durante la sesión

### ⌨️ Atajos de Teclado
- **Sistema Extensible**: Fácil de personalizar
- **Paleta de Comandos**: `Ctrl+Shift+P`
- **Múltiples Shortcuts**: Productividad mejorada
- **Documentación Integrada**: Ayuda contextual

### 🎯 Drag & Drop Avanzado
- **Posicionamiento Libre**: Coloca elementos donde quieras
- **Guías Inteligentes**: Alineación automática
- **Snap to Grid**: Precisión en el posicionamiento
- **Preview Visual**: Ve el resultado antes de soltar

### 🔲 Selección Múltiple
- **Marquesina**: Selecciona múltiples elementos
- **Operaciones en Lote**: Aplica cambios a varios elementos
- **Alineación Grupal**: Alinea múltiples elementos
- **Distribución**: Distribuye elementos uniformemente

### 📐 Gestión de Capas
- **Panel Visual**: Visualiza jerarquía de elementos
- **Reordenamiento**: Arrastra para cambiar orden
- **Visibilidad**: Oculta/muestra elementos
- **Bloqueo**: Protege elementos de cambios

### 📱 Responsive Testing
- **Vista Previa**: Desktop, Tablet, Mobile
- **Breakpoints**: Múltiples tamaños de pantalla
- **Rotación**: Prueba orientación landscape/portrait
- **Live Preview**: Cambios en tiempo real

### 🤖 Características de IA
- **Generación de Componentes**: Crea componentes con IA
- **Optimización SEO**: Mejora automática de SEO
- **Verificación de Accesibilidad**: Cumplimiento WCAG
- **Sugerencias Inteligentes**: Mejoras automáticas

### 🚀 Deployment Integrado
- **Vercel**: Deploy directo a Vercel
- **GitHub Pages**: Publicación en GitHub
- **Netlify**: Deploy a Netlify
- **Monitoreo**: Seguimiento de deployments

### 🔐 Seguridad
- **Verificación de Código**: Detecta vulnerabilidades
- **CSP Generator**: Genera Content Security Policy
- **Sanitización**: Limpia código malicioso
- **Best Practices**: Aplica estándares de seguridad

## 📚 Documentación

### Inicio Rápido
- [Quick Start (English)](docs/current/guides/QUICK_START.md)
- [Guía Rápida (Español)](docs/current/guides/GUIA_RAPIDA.md)
- [Índice Completo](docs/current/INDEX.md)

### Guías de Desarrollo
- [Development Guide](docs/current/guides/DEVELOPMENT.md)
- [Testing Guide](docs/current/guides/TESTING.md)
- [API Documentation](docs/current/api/)

### Deployment
- [Deployment Guide](docs/current/deployment/DEPLOYMENT.md)
- [Scripts de Deployment](scripts/deployment/)

### Estado del Proyecto
- [CHANGELOG](docs/current/CHANGELOG.md)
- [STATUS](docs/current/STATUS.md)

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SebastianVernis/DragNDrop.git
cd DragNDrop

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Uso Básico

1. **Abrir el Editor**: Navega a `http://localhost:8080`
2. **Seleccionar Template**: Elige un template o empieza en blanco
3. **Arrastrar Componentes**: Arrastra componentes desde el panel izquierdo
4. **Editar Propiedades**: Selecciona elementos y edita en el panel derecho
5. **Exportar**: Usa el botón "Export HTML" para descargar tu página

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+S` | Guardar proyecto |
| `Ctrl+Shift+D` | Cambiar tema |
| `Ctrl+Shift+P` | Paleta de comandos |
| `Delete` | Eliminar elemento seleccionado |

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E
npm run test:e2e

# Tests E2E con UI
npm run test:e2e:ui

# Todos los tests
npm run test:all
```

## 🏗️ Build y Deploy

```bash
# Build para producción
npm run build:prod

# Preview del build
npm run preview

# Deploy a Vercel
npm run deploy

# Deploy con secrets
npm run deploy:secrets
```

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
│   └── current/              # Actual (v2.0)
│       ├── api/             # API docs
│       ├── deployment/      # Deployment
│       ├── guides/          # Guías
│       └── testing/         # Testing
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
├── index.html                 # Entrada principal
├── script.js                  # Script principal
├── style.css                  # Estilos principales
└── package.json              # Configuración npm
```

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build**: Vite
- **Testing**: Jest, Playwright
- **Deployment**: Vercel, Cloudflare Pages, Netlify, GitHub Pages
- **IA**: Google Gemini API
- **Integración**: GitHub API

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Sebastian Vernis**

- GitHub: [@SebastianVernis](https://github.com/SebastianVernis)
- Proyecto: [DragNDrop](https://github.com/SebastianVernis/DragNDrop)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto
- Usuarios y testers

## 📞 Soporte

- [GitHub Issues](https://github.com/SebastianVernis/DragNDrop/issues)
- [Documentación](docs/current/INDEX.md)
- [Guías](docs/current/guides/)

---

**Versión:** 2.0.0 | **Última actualización:** 2024-12-04

Para más información, consulta la [documentación completa](docs/current/INDEX.md).
