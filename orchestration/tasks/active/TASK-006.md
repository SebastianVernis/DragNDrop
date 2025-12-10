# TASK-006: Implement Layer System

**Tipo**: Feature  
**Prioridad**: 🟡 MEDIA  
**Estimación**: 4 días  
**Deadline**: 2025-12-23 (2 semanas)  
**Agente Recomendado**: @dev  

---

## 📋 Descripción

Implementar un sistema completo de layers/capas tipo Photoshop/Figma para mostrar y gestionar la jerarquía de elementos del canvas.

## 🎯 Objetivos

- [ ] Panel lateral de layers con vista de árbol
- [ ] Drag & drop para reordenar elementos
- [ ] Iconos por tipo de elemento
- [ ] Toggle de visibilidad (ojo 👁️)
- [ ] Lock/unlock elementos (candado 🔒)
- [ ] Renombrar capas con doble clic
- [ ] Búsqueda y filtrado
- [ ] Sincronización con selección en canvas
- [ ] Atajos de teclado

## 📁 Archivos a Crear/Modificar

```
src/
├── core/
│   └── layersPanel.js          # Lógica principal del panel
├── components/
│   ├── LayerTree.js            # Componente de árbol visual
│   └── LayerItem.js            # Item individual de layer
├── styles/
│   └── layers.css              # Estilos del panel
├── index.html                  # Agregar contenedor del panel
└── script.js                   # Integrar con sistema existente
```

## 🔧 Especificaciones Técnicas

### Estructura del Panel
```html
<div id="layers-panel" class="layers-panel">
  <div class="layers-header">
    <h3>Layers</h3>
    <input type="search" placeholder="Search layers...">
  </div>
  <div class="layers-tree">
    <!-- Árbol dinámico aquí -->
  </div>
  <div class="layers-footer">
    <button>Add Layer</button>
    <button>Group</button>
    <button>Delete</button>
  </div>
</div>
```

### Funcionalidades Clave
1. **Vista de Árbol**:
   - Elementos anidados con indentación
   - Colapsar/expandir grupos
   - Drag & drop nativo HTML5

2. **Controles por Layer**:
   - Checkbox de visibilidad
   - Icono de lock
   - Nombre editable
   - Menú contextual

3. **Sincronización**:
   - Actualizar al agregar/eliminar elementos
   - Highlight layer al seleccionar en canvas
   - Seleccionar en canvas al click en layer

4. **Performance**:
   - Virtual scrolling para 1000+ elementos
   - Debounce en búsqueda
   - Batch updates

## ✅ Definition of Done

- [ ] Panel funcional con todas las features
- [ ] Tests unitarios (>80% coverage)
- [ ] Responsive en móvil
- [ ] Atajos de teclado documentados
- [ ] Sin regresiones en funcionalidad existente
- [ ] Performance <100ms para 500 elementos
- [ ] Documentación de API

## 🚫 Restricciones

- No modificar estructura DOM existente del canvas
- Mantener compatibilidad con undo/redo
- No usar librerías externas (vanilla JS)
- Respetar arquitectura modular actual

## 📊 Métricas de Éxito

- Navegación 5x más rápida en proyectos grandes
- 0 bugs críticos en producción
- <100KB código adicional
- Adoptado por 80% usuarios en 1 mes

---

**Referencias**: 
- Figma Layers Panel
- Photoshop Layers
- `/docs/architecture/` para patrones actuales