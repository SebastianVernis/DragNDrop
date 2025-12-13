# Versión 9: Frontend React + TypeScript + Vite

## Descripción
Frontend moderno del editor construido con React 18, TypeScript y Vite. Versión en desarrollo activo para reemplazar el frontend vanilla con una arquitectura más escalable y mantenible.

## Tecnologías
- **React 18**: Biblioteca UI con Concurrent Features
- **TypeScript**: Tipado estático para mayor seguridad
- **Vite**: Build tool ultra-rápido con HMR
- **TailwindCSS**: Utility-first CSS (planeado)
- **Zustand**: State management ligero (planeado)
- **React Router**: Routing (planeado)
- **React DnD**: Drag and drop (planeado)

## Características (Planeadas)
- 🚧 Componentes React modernos y reutilizables
- 🚧 TypeScript para type safety
- 🚧 Build optimizado con Vite
- 🚧 Hot Module Replacement (HMR) instantáneo
- 🚧 State management con Zustand
- 🚧 Routing con React Router
- 🚧 Drag & Drop con React DnD
- 🚧 Testing con Vitest
- 🚧 Storybook para componentes
- 🚧 ESLint + Prettier configurados
- 🚧 Husky para pre-commit hooks

## Cómo ejecutar

### Instalación
```bash
cd /home/admin/DragNDrop/versions/v9-frontend-react-vite
npm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir: http://localhost:5173
```

### Build
```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

### Linting y formato
```bash
# Ejecutar ESLint
npm run lint

# Fix automático
npm run lint:fix

# Formatear con Prettier
npm run format
```

## Estructura de archivos
```
v9-frontend-react-vite/
├── src/
│   ├── components/         # Componentes React
│   │   ├── Editor/        # Componentes del editor
│   │   ├── Canvas/        # Canvas de diseño
│   │   ├── Sidebar/       # Paneles laterales
│   │   ├── Properties/    # Panel de propiedades
│   │   └── UI/            # Componentes UI reutilizables
│   ├── hooks/             # Custom hooks
│   │   ├── useEditor.ts   # Hook del editor
│   │   ├── useDragDrop.ts # Hook drag & drop
│   │   └── useProject.ts  # Hook de proyectos
│   ├── stores/            # Zustand stores
│   │   ├── editorStore.ts # Estado del editor
│   │   ├── projectStore.ts # Estado de proyectos
│   │   └── userStore.ts   # Estado del usuario
│   ├── types/             # TypeScript types
│   │   ├── editor.ts      # Tipos del editor
│   │   ├── component.ts   # Tipos de componentes
│   │   └── project.ts     # Tipos de proyectos
│   ├── utils/             # Utilidades
│   │   ├── export.ts      # Exportar HTML/CSS
│   │   ├── parser.ts      # Parser de componentes
│   │   └── validators.ts  # Validadores
│   ├── services/          # Servicios API
│   │   ├── api.ts         # Cliente API
│   │   ├── auth.ts        # Autenticación
│   │   └── projects.ts    # Proyectos API
│   ├── styles/            # Estilos globales
│   │   └── globals.css    # CSS global
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Tipos de Vite
├── public/                # Assets estáticos
├── package.json
├── tsconfig.json          # Config TypeScript
├── tsconfig.node.json     # Config TypeScript (Node)
├── vite.config.ts         # Config Vite
├── tailwind.config.js     # Config Tailwind (planeado)
├── .eslintrc.json         # Config ESLint
├── .prettierrc            # Config Prettier
└── README.md
```

## Puertos
- **Dev**: 5173 (Vite default)
- **Preview**: 4173

## Estado
🚧 **EN DESARROLLO** - No listo para producción

## Roadmap de desarrollo

### Fase 1: Setup y estructura base ✅
- [x] Configurar Vite + React + TypeScript
- [x] Configurar ESLint + Prettier
- [x] Estructura de carpetas
- [x] Configuración de tipos

### Fase 2: Componentes core 🚧
- [ ] Componente Editor principal
- [ ] Canvas de diseño
- [ ] Sidebar de componentes
- [ ] Panel de propiedades
- [ ] Toolbar superior
- [ ] Sistema de templates

### Fase 3: Drag & Drop 📋
- [ ] Integrar React DnD
- [ ] Drag de componentes desde sidebar
- [ ] Drop en canvas
- [ ] Reordenar elementos
- [ ] Nested drag & drop

### Fase 4: State Management 📋
- [ ] Configurar Zustand
- [ ] Store del editor
- [ ] Store de proyectos
- [ ] Store de usuario
- [ ] Persistencia local

### Fase 5: Funcionalidades avanzadas 📋
- [ ] Export HTML/CSS/JS
- [ ] Import de proyectos
- [ ] Undo/Redo
- [ ] Responsive preview
- [ ] Componentes interactivos

### Fase 6: Integración con backend 📋
- [ ] Cliente API
- [ ] Autenticación
- [ ] CRUD de proyectos
- [ ] Colaboración en tiempo real
- [ ] Deploy integration

### Fase 7: Testing 📋
- [ ] Unit tests con Vitest
- [ ] Integration tests
- [ ] E2E tests con Playwright
- [ ] Coverage > 80%

### Fase 8: Optimización 📋
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Bundle optimization
- [ ] Performance profiling
- [ ] Lighthouse score > 90

## Scripts disponibles

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

## Dependencias principales

### Producción
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.4.0",
  "react-router-dom": "^6.20.0",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1"
}
```

### Desarrollo
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "typescript": "^5.2.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "vitest": "^1.0.0",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0"
}
```

## Casos de uso (Futuros)
- Editor moderno con mejor performance
- Mejor experiencia de desarrollo
- Type safety con TypeScript
- Componentes reutilizables
- Testing más robusto
- Arquitectura escalable

## Ventajas sobre v1 (Vanilla)
- ✅ Type safety con TypeScript
- ✅ Componentes reutilizables
- ✅ State management centralizado
- ✅ Hot Module Replacement
- ✅ Mejor tooling (ESLint, Prettier)
- ✅ Testing más fácil
- ✅ Mejor performance con React 18
- ✅ Código más mantenible

## Migración desde v1

### Componentes a migrar
1. Editor principal → `<Editor />`
2. Canvas → `<Canvas />`
3. Component Panel → `<ComponentPanel />`
4. Properties Panel → `<PropertiesPanel />`
5. Toolbar → `<Toolbar />`
6. Templates → `<TemplateGallery />`

### Estado a migrar
1. Selected element → `editorStore`
2. Canvas elements → `editorStore`
3. Project data → `projectStore`
4. User data → `userStore`

## Contribuir

### Setup
```bash
# Fork y clone
git clone https://github.com/tu-usuario/DragNDrop.git
cd DragNDrop/versions/v9-frontend-react-vite

# Instalar
npm install

# Crear branch
git checkout -b feature/nueva-funcionalidad

# Desarrollar y commit
git commit -m "feat: nueva funcionalidad"

# Push
git push origin feature/nueva-funcionalidad
```

### Convenciones
- Commits: Conventional Commits
- Branches: `feature/`, `fix/`, `docs/`
- Code style: ESLint + Prettier
- Tests: Requeridos para nuevas features

## Próximos pasos inmediatos
1. Completar componentes core del editor
2. Implementar drag & drop básico
3. Integrar Zustand para state management
4. Agregar tests unitarios
5. Migrar funcionalidades de v1
6. Documentar componentes con Storybook
