# 🔵 Workflow 1: UI/UX Core

**Branch:** `feature/ui-core`  
**Duración:** 30 días  
**Responsable:** Frontend Developer  

---

## 🎯 Objetivos

1. ✅ Sistema de Layers/Capas completamente funcional
2. ✅ Multi-selección con 8+ operaciones batch
3. ✅ Inspector de estilos avanzado
4. ✅ Smart guides y snap to grid

---

## 📅 Timeline

### Semana 1-2: Layers System (Días 1-14)
- [ ] Días 1-3: LayersManager core architecture
- [ ] Días 4-7: UI del panel con tree rendering
- [ ] Días 8-10: Features avanzadas (lock, hide, rename)
- [ ] Días 11-14: Sincronización bidireccional Canvas ↔ Layers

### Semana 3-4: Multi-Selection (Días 15-28)
- [ ] Días 15-18: Modos de selección (click, ctrl, shift, marquee)
- [ ] Días 19-24: Batch operations (align, distribute, group)
- [ ] Días 25-28: Smart guides y snap

### Semana 5+: Advanced Inspector (Días 29-35)
- [ ] Días 29-32: Computed vs inline styles
- [ ] Días 33-35: Color picker, box model, autocomplete

---

## 📁 Archivos a Crear

```
src/
  core/
    ✅ layersManager.js           # Core logic
    ✅ multiSelect.js              # Multi-selection
    ✅ batchOperations.js          # Batch operations
    ✅ alignmentEngine.js          # Alignment algorithms
    ✅ groupManager.js             # Group/ungroup
    ✅ smartGuides.js              # Smart guides
    ✅ marqueeSelector.js          # Marquee selection

  components/
    layers/
      ✅ LayersPanel.js            # Main panel component
      ✅ LayerNode.js              # Individual layer
      ✅ LayersToolbar.js          # Panel toolbar
    
    ✅ AdvancedPropertiesPanel.js  # Advanced inspector
    ✅ ColorPicker.js              # Color picker
    ✅ BoxModelVisualizer.js       # Box model visual
    ✅ CSSAutocomplete.js          # CSS autocomplete

  styles/
    ✅ layers.css                  # Layers panel styles
    ✅ multiSelect.css             # Multi-select styles
    ✅ inspector.css               # Inspector styles

tests/
  unit/
    ✅ layersManager.test.js
    ✅ multiSelect.test.js
    ✅ alignmentEngine.test.js
    ✅ batchOperations.test.js
```

---

## 🔗 API Contracts (Proveer para otros workflows)

```javascript
// Exponer globalmente
window.layersManager = {
  selectLayer(id),
  selectMultiple(ids),
  getSelectedLayers(),
  lockLayer(id),
  hideLayer(id),
  renameLayer(id, name),
  moveLayer(sourceId, targetId, position),
  deleteLayer(id),
  duplicateLayer(id),
  buildTree(rootElement)
};

window.multiSelectManager = {
  selectMultiple(ids),
  getSelected(),
  alignElements(alignment), // left, center, right, top, middle, bottom
  distributeElements(direction), // horizontal, vertical
  groupElements(name),
  ungroupElements(groupId),
  applyBatchStyle(property, value)
};

// Events a disparar
window.dispatchEvent(new CustomEvent('layers:selection', { detail: { ids } }));
window.dispatchEvent(new CustomEvent('layers:renamed', { detail: { id, name } }));
window.dispatchEvent(new CustomEvent('multiselect:aligned', { detail: { ids, alignment } }));
```

---

## 📚 Referencias

### Documentación
- Ver: `workflow-docs/IMPLEMENTATION_PLAN.md` → Workflow 1
- Ver: `workflow-docs/TECHNICAL_SPECS.md` → Layers System
- Ver: `workflow-docs/WORKFLOW_GUIDE.md` → Timeline detallado

### Código de Referencia
- `src/core/resizeManager.js` - Patrón de manager
- `src/core/enhancedDragDrop.js` - Event handling
- `src/core/undoRedo.js` - State management

---

## 🧪 Testing

```bash
# Correr tests de este workflow
npm run test -- --testPathPattern=layers
npm run test -- --testPathPattern=multiSelect

# Coverage mínimo: 75%
npm run test:coverage
```

---

## 🚀 Quick Start

```bash
# Asegurar que estás en la branch correcta
git checkout feature/ui-core

# Crear estructura
mkdir -p src/core src/components/layers src/styles
mkdir -p tests/unit

# Primer archivo
touch src/core/layersManager.js

# Implementar LayersManager siguiendo:
# workflow-docs/IMPLEMENTATION_PLAN.md → Workflow 1 → 1.1 Sistema de Layers

# Test
npm run dev
# Abrir http://localhost:8080

# Commit
git add .
git commit -m "feat(layers): implement LayersManager core"
git push
```

---

## 📝 Notas Importantes

- ⚠️ NO modificar `index.html` toolbar sin coordinar
- ⚠️ NO modificar `script.js` funciones globales sin coordinar
- ✅ SÍ crear archivos nuevos en `src/core/` y `src/components/`
- ✅ SÍ agregar estilos en `src/styles/layers.css`
- ✅ Mergear de `master` cada 2-3 días

---

**🎯 Siguiente:** Implementar `LayersManager` class
