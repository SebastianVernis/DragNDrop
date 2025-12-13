# V5 - NPM Package - Guía de Uso

## 📦 Paquete NPM para DragNDrop

### 🎯 Propósito
Biblioteca reutilizable que permite integrar funcionalidades drag & drop en cualquier proyecto JavaScript/TypeScript.

## 🚀 Instalación

```bash
npm install dragndrop-components
# o
yarn add dragndrop-components
```

## 💡 Uso Básico

### Importar en tu proyecto
```javascript
const DragNDrop = require('dragndrop-components');
// o ES6
import { DragNDrop, FrameworkDetector } from 'dragndrop-components';
```

### Inicialización Simple
```javascript
const dragger = new DragNDrop({
    container: '#my-container',
    allowDrop: true,
    enableSorting: true
});

dragger.init();
```

## 🛠️ API Reference

### DragNDrop Class
```javascript
// Constructor
new DragNDrop(options)

// Métodos principales
.init()                    // Inicializar
.destroy()                 // Limpiar
.addDropZone(selector)     // Agregar zona drop
.removeDropZone(selector)  // Remover zona drop
.serialize()               // Obtener estado actual
.load(data)               // Cargar estado
```

### FrameworkDetector
```javascript
import { FrameworkDetector } from 'dragndrop-components';

const framework = FrameworkDetector.detect(); // 'react', 'vue', 'angular', 'vanilla'
```

### Parser
```javascript
import { Parser } from 'dragndrop-components';

const parser = new Parser();
parser.parse(htmlString);        // Analizar HTML
parser.extractComponents();      // Extraer componentes
parser.generateCode(framework);  // Generar código
```

### Validator
```javascript
import { Validator } from 'dragndrop-components';

const validator = new Validator();
validator.validateHTML(html);    // Validar HTML
validator.validateCSS(css);      // Validar CSS
validator.validateJS(js);        // Validar JavaScript
```

## ⚙️ Configuración Avanzada

### Opciones Completas
```javascript
const options = {
    container: '#container',           // Selector del contenedor
    dragSelector: '.draggable',        // Elementos arrastrables
    dropSelector: '.drop-zone',        // Zonas de drop
    allowDrop: true,                   // Permitir drop
    enableSorting: true,               // Habilitar ordenamiento
    animation: 300,                    // Duración animación (ms)
    ghostClass: 'ghost',               // Clase para ghost element
    dragClass: 'dragging',             // Clase durante drag
    framework: 'auto',                 // Framework target ('auto', 'react', 'vue', etc.)
    
    // Callbacks
    onDragStart: (element, event) => {},
    onDragEnd: (element, event) => {},
    onDrop: (element, container) => {},
    onChange: (elements) => {},
    
    // Validación
    validateDrop: (element, container) => true,
    
    // Persistencia
    saveState: true,
    storageKey: 'dragndrop-state'
};
```

## 🎨 Integración con Frameworks

### React
```jsx
import { DragNDrop } from 'dragndrop-components';
import { useEffect, useRef } from 'react';

function DragDropComponent() {
    const containerRef = useRef();
    
    useEffect(() => {
        const dragger = new DragNDrop({
            container: containerRef.current,
            framework: 'react',
            onChange: (elements) => {
                // Handle changes
            }
        });
        
        dragger.init();
        
        return () => dragger.destroy();
    }, []);
    
    return (
        <div ref={containerRef} className="drag-container">
            {/* Your draggable elements */}
        </div>
    );
}
```

### Vue 3
```vue
<template>
    <div ref="container" class="drag-container">
        <!-- Your draggable elements -->
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { DragNDrop } from 'dragndrop-components';

const container = ref(null);
let dragger = null;

onMounted(() => {
    dragger = new DragNDrop({
        container: container.value,
        framework: 'vue',
        onChange: (elements) => {
            // Handle changes
        }
    });
    
    dragger.init();
});

onUnmounted(() => {
    dragger?.destroy();
});
</script>
```

### Vanilla JavaScript
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const dragger = new DragNDrop({
        container: '#my-container',
        framework: 'vanilla',
        onDrop: (element, container) => {
            console.log('Element dropped:', element);
        }
    });
    
    dragger.init();
});
```

## 🔧 Utilidades

### File Watcher
```javascript
import { Watcher } from 'dragndrop-components';

const watcher = new Watcher('./src/**/*.js');
watcher.on('change', (file) => {
    console.log('File changed:', file);
});
watcher.start();
```

### Development Server
```javascript
import { Server } from 'dragndrop-components';

const server = new Server({
    port: 3000,
    static: './public',
    hot: true
});

server.start();
```

## 🎯 Ejemplos Prácticos

### Lista Sorteable
```javascript
new DragNDrop({
    container: '#todo-list',
    dragSelector: '.todo-item',
    enableSorting: true,
    onChange: (items) => {
        // Actualizar orden en backend
        updateTodoOrder(items.map(item => item.dataset.id));
    }
});
```

### Kanban Board
```javascript
new DragNDrop({
    container: '.kanban-board',
    dragSelector: '.task-card',
    dropSelector: '.kanban-column',
    validateDrop: (task, column) => {
        return task.dataset.status !== column.dataset.status;
    },
    onDrop: (task, column) => {
        updateTaskStatus(task.id, column.dataset.status);
    }
});
```

## 📊 Performance Tips
- Usa `debounce` en callbacks frecuentes
- Limita el número de elementos monitoreados
- Usa `requestAnimationFrame` para animaciones
- Implementa virtualización para listas grandes

## 🐛 Debugging
```javascript
// Activar logs detallados
DragNDrop.setDebug(true);

// Inspeccionar estado interno
console.log(dragger.getState());
console.log(dragger.getConfig());
```