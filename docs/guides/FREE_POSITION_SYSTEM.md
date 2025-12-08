# Sistema de Posicionamiento Libre

## Descripción

El nuevo sistema `FreePositionDragDropManager` permite posicionar elementos libremente en el canvas usando coordenadas absolutas, con seguimiento preciso del cursor y ajuste automático del tamaño del canvas.

## Características Principales

### 1. Posicionamiento Absoluto
- Los elementos se posicionan con coordenadas `left` y `top` absolutas
- El canvas actúa como contenedor de posicionamiento relativo
- Movimiento libre sin restricciones de flujo HTML

### 2. Seguimiento de Cursor Mejorado
- El ghost element sigue el cursor durante el drag
- Offset correcto cuando se mueve un elemento existente
- Preview visual en tiempo real de la posición

### 3. Ajuste Automático del Canvas
- El canvas crece automáticamente según la posición de los elementos
- Altura mínima configurable (800px por defecto)
- Padding automático para evitar elementos pegados al borde

### 4. Modos de Layout

#### Modo Libre (Free)
```javascript
// Activar modo libre
layoutMode = 'free';
window.freePositionDragDrop.convertToAbsolutePositioning();
```
- Posicionamiento absoluto
- Movimiento libre con el mouse
- Grid visual de fondo

#### Modo Flujo (Flow)
```javascript
// Activar modo flujo
layoutMode = 'flow';
// Remover position: absolute de todos los elementos
```
- Posicionamiento normal de HTML
- Flujo de documento tradicional
- Sin grid visual

### 5. Auto-Layout

#### Layout Vertical
```javascript
window.freePositionDragDrop.autoLayout('vertical');
```
- Apila elementos verticalmente
- Espaciado consistente de 20px
- Ancho completo (calc(100% - 40px))

#### Layout Grid
```javascript
window.freePositionDragDrop.autoLayout('grid');
```
- Grid de 3 columnas
- Ancho fijo de 300px por elemento
- Espaciado uniforme

### 6. Grid Snap (Opcional)
```javascript
// Habilitar snap a grid de 10px
window.freePositionDragDrop.setGridSnap(10);

// Deshabilitar snap
window.freePositionDragDrop.setGridSnap(1);
```

## Controles en el Toolbar

### 📐 Libre / 📄 Flujo
Alterna entre modo de posicionamiento libre y flujo normal

### ↕️ Vertical
Reorganiza todos los elementos en un stack vertical

### ⊞ Grid
Reorganiza todos los elementos en un grid de 3 columnas

## API

### Métodos Principales

#### `setupComponentDrag(componentElement, type)`
Configura drag para componentes del panel lateral
```javascript
window.freePositionDragDrop.setupComponentDrag(element, 'button');
```

#### `setupCanvasElementDrag(element)`
Configura drag para elementos ya en el canvas
```javascript
window.freePositionDragDrop.setupCanvasElementDrag(element);
```

#### `updateCanvasHeight()`
Recalcula y actualiza la altura del canvas
```javascript
window.freePositionDragDrop.updateCanvasHeight();
```

#### `convertToAbsolutePositioning()`
Convierte todos los elementos existentes a posicionamiento absoluto
```javascript
window.freePositionDragDrop.convertToAbsolutePositioning();
```

#### `autoLayout(type)`
Aplica layout automático
- `type`: 'vertical' | 'grid'
```javascript
window.freePositionDragDrop.autoLayout('vertical');
```

#### `setGridSnap(size)`
Configura el tamaño del snap a grid
- `size`: Tamaño en píxeles (1 = sin snap)
```javascript
window.freePositionDragDrop.setGridSnap(10);
```

### Eventos

El módulo dispara eventos personalizados:

#### `freedragdrop:dragstart`
```javascript
window.addEventListener('freedragdrop:dragstart', (e) => {
    console.log('Drag iniciado:', e.detail);
});
```

#### `freedragdrop:elementMoved`
```javascript
window.addEventListener('freedragdrop:elementMoved', (e) => {
    console.log('Elemento movido a:', e.detail.x, e.detail.y);
});
```

#### `freedragdrop:elementCreated`
```javascript
window.addEventListener('freedragdrop:elementCreated', (e) => {
    console.log('Elemento creado:', e.detail.element);
});
```

## Configuración

### Propiedades Configurables

```javascript
const manager = new FreePositionDragDropManager();

// Altura mínima del canvas (px)
manager.canvasMinHeight = 800;

// Padding alrededor del canvas (px)
manager.canvasPadding = 40;

// Tamaño del grid snap (px, 1 = sin snap)
manager.gridSize = 1;

// Velocidad de auto-scroll
manager.scrollSpeed = 5;

// Tamaño del área de auto-scroll (px)
manager.scrollEdgeSize = 50;
```

## Estilos CSS

El módulo inyecta estilos automáticamente:

- Grid de fondo visual (20px x 20px)
- Drag handles en elementos seleccionados
- Ghost element con sombra y rotación
- Outline animado en drop zones
- Opacity reducida en elementos siendo arrastrados

## Integración con Otros Módulos

### Resize Manager
El sistema es compatible con `ResizeManager` para redimensionar elementos

### Undo/Redo
Los cambios de posición pueden integrarse con el sistema de Undo/Redo

### Gemini Validator
Funciona junto con la validación de sintaxis de Gemini

## Ejemplos de Uso

### Crear y Posicionar un Nuevo Elemento
```javascript
// El sistema maneja esto automáticamente durante el drag & drop
// Los elementos se crean en la posición donde se sueltan
```

### Mover un Elemento Existente
```javascript
// 1. Seleccionar el elemento (click)
// 2. Usar el drag handle (⋮⋮)
// 3. Arrastrar a la nueva posición
// 4. Soltar
```

### Cambiar Modo de Layout Programáticamente
```javascript
// Cambiar a modo libre
document.getElementById('layoutModeBtn').click();

// O directamente
toggleLayoutMode();
```

### Reorganizar Elementos
```javascript
// Stack vertical
autoLayoutVertical();

// Grid 3 columnas
autoLayoutGrid();
```

## Notas Técnicas

1. **Posicionamiento**: Los elementos usan `position: absolute` con `left` y `top`
2. **Contenedor**: El canvas usa `position: relative`
3. **Altura Dinámica**: El canvas crece según el elemento más bajo + padding
4. **Z-Index**: Los handles tienen z-index 998, el ghost 9999
5. **Pointer Events**: El ghost tiene `pointer-events: none`

## Troubleshooting

### Los elementos no se mueven
- Verificar que el elemento esté seleccionado (tiene borde azul)
- Asegurar que `window.freePositionDragDrop` esté inicializado
- Verificar que el modo sea 'libre' y no 'flujo'

### El canvas no crece
- Llamar manualmente a `updateCanvasHeight()` después de cambios
- Verificar que los elementos tengan `position: absolute`

### El cursor no mapea correctamente
- El sistema calcula el offset durante `dragstart`
- Si el problema persiste, verificar que `dragOffset` se esté calculando

## Futuras Mejoras

- [ ] Multi-selección y movimiento grupal
- [ ] Guías de alineación (smart guides)
- [ ] Historial de posiciones
- [ ] Copiar posición entre elementos
- [ ] Distribución automática con espaciado uniforme
- [ ] Zoom y pan del canvas
- [ ] Capas (layers) con z-index
