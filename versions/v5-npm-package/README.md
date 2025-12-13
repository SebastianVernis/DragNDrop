# Versión 5: NPM Package (CLI Tool)

## Descripción
Paquete npm que permite integrar el editor DragNDrop en cualquier proyecto como dependencia. Incluye CLI para iniciar servidor y API programática.

## Tecnologías
- **Node.js**: Runtime
- **Express**: Servidor web
- **WebSocket**: Comunicación en tiempo real
- **Chokidar**: File watcher
- **Commander**: CLI framework

## Características
- ✅ CLI tool (`dragndrop` command)
- ✅ Servidor integrable
- ✅ File parser (HTML, JSX, Vue)
- ✅ File watcher con hot reload
- ✅ WebSocket para sincronización
- ✅ API programática
- ✅ Soporte para React, Vue, Angular, Svelte
- ✅ Auto-detección de framework

## Instalación

### Como dependencia global
```bash
npm install -g dragndrop-editor
```

### Como dependencia de proyecto
```bash
npm install --save-dev dragndrop-editor
```

## Uso

### CLI
```bash
# Iniciar editor en proyecto actual
dragndrop

# Especificar directorio
dragndrop --source src

# Especificar puerto
dragndrop --port 3001

# Con opciones
dragndrop --source src --port 3001 --framework react --watch
```

### API Programática
```javascript
const DragNDrop = require('dragndrop-editor');

const editor = new DragNDrop({
  source: ['src'],
  include: ['**/*.html', '**/*.jsx', '**/*.vue'],
  exclude: ['node_modules/**', 'dist/**'],
  port: 3001,
  autoSave: true,
  framework: 'react',
  watch: true,
  verbose: true
});

// Iniciar servidor
await editor.start();

// Detener servidor
await editor.stop();

// Eventos
editor.on('fileChanged', (path) => {
  console.log('File changed:', path);
});
```

## Opciones de configuración

```javascript
{
  source: ['src'],              // Directorios a observar
  include: ['**/*.html'],       // Patrones de archivos
  exclude: ['node_modules/**'], // Patrones a excluir
  port: 3001,                   // Puerto del servidor
  autoSave: true,               // Guardar automáticamente
  autoSaveDelay: 1000,          // Delay en ms
  framework: 'auto',            // react|vue|angular|svelte|auto
  watch: true,                  // Observar cambios
  verbose: false,               // Logging detallado
  cwd: process.cwd()            // Directorio de trabajo
}
```

## Integración con frameworks

### React
```bash
# En proyecto React
dragndrop --source src --framework react --include "**/*.jsx"
```

### Vue
```bash
# En proyecto Vue
dragndrop --source src --framework vue --include "**/*.vue"
```

### Angular
```bash
# En proyecto Angular
dragndrop --source src --framework angular --include "**/*.html"
```

### Svelte
```bash
# En proyecto Svelte
dragndrop --source src --framework svelte --include "**/*.svelte"
```

## Estructura de archivos
```
v5-npm-package/
├── server.js          # Clase principal DragNDrop
├── parser.js          # File parser
├── writer.js          # File writer
├── watcher.js         # File watcher
└── bin/
    └── dragndrop.js   # CLI executable
```

## Puertos
- **Default**: 3001 (configurable)

## Estado
✅ **PRODUCCIÓN** - Listo para publicar en npm

## Casos de uso
- Integrar editor visual en proyecto existente
- Editar componentes React/Vue/Angular visualmente
- Prototipado rápido en proyectos
- Desarrollo visual de UI

## Publicación en npm
```bash
# Login
npm login

# Publicar
npm publish

# Actualizar versión
npm version patch|minor|major
npm publish
```

## Próximos pasos
- Publicar en npm registry
- Agregar más frameworks (Solid, Qwik)
- Mejorar parser para componentes complejos
- Agregar tests
