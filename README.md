# DragNDrop - Editor HTML Visual

Un editor HTML visual completo con funcionalidad de arrastrar y soltar para crear páginas web de forma intuitiva.

![DragNDrop Editor](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-Expanding-yellow)

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

- **[Documentación Principal](./docs/README.md)** - Guía completa del proyecto
- **[Guía de Desarrollo](./docs/guides/DEVELOPMENT.md)** - Setup y desarrollo
- **[API Reference](./docs/api/README.md)** - Documentación de componentes
- **[Deployment Guide](./docs/deployment/README.md)** - Guías de despliegue
- **[Testing Guide](./docs/guides/TESTING.md)** - Estrategia de testing

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

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build**: Vite
- **Testing**: Jest, Playwright
- **Deployment**: Vercel, Netlify, GitHub Actions
- **Development**: ESLint, Prettier

## 📈 Estado del Proyecto

- ✅ **Core Features**: Completamente implementado
- ✅ **Documentation**: Documentación completa
- 🔄 **Testing**: Expandiendo cobertura
- 🔄 **CI/CD**: Configurando pipeline
- ✅ **Deployment**: Múltiples plataformas

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