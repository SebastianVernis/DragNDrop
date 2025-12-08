# 🏗️ Plan de Implementación v1.0 - "Best As Possible"

## 📋 Overview

Este documento detalla la implementación de 13 funcionalidades MUST-HAVE organizadas en **4 workflows paralelos** que pueden desarrollarse simultáneamente sin conflictos.

**Objetivo:** Versión 1.0 profesional en 2-3 meses

---

## 🚦 Estrategia de Workflows Paralelos

### Principios de No-Cannibalización
1. **Separación por directorios/archivos**
2. **Features independientes**
3. **API contracts definidos previamente**
4. **Merge local frecuente** (cada 2-3 días)
5. **Testing aislado por workflow**

---

## 🔵 WORKFLOW 1: UI/UX Core
**Branch:** `feature/ui-core`  
**Owner:** Dev Frontend  
**Duración:** 25-30 días  
**Archivos principales:** `src/core/layers.js`, `src/core/multiSelect.js`, `src/components/`, `style.css`

### 1.1 Sistema de Layers/Capas
**Días:** 1-8 | **Archivos:** `src/core/layersManager.js`, `src/components/LayersPanel.jsx`

#### Descripción Técnica
Panel lateral independiente que muestra jerarquía de elementos del DOM en tiempo real.

#### Arquitectura
```
src/
  core/
    layersManager.js          # Core logic
  components/
    LayersPanel.jsx           # UI Component (si usas React)
    LayersPanel.html          # O template vanilla
  styles/
    layers-panel.css          # Estilos específicos
```

#### Funcionalidades Detalladas

**A. Estructura de Datos**
```javascript
class LayersManager {
  constructor() {
    this.layers = new Map(); // elementId -> layerData
    this.tree = null; // Árbol jerárquico
    this.selected = new Set(); // Multi-selección
    this.locked = new Set(); // Elementos bloqueados
    this.hidden = new Set(); // Elementos ocultos
  }

  buildTree(rootElement) {
    // Convierte DOM a estructura de árbol
    // { id, type, name, children: [], parent, depth }
  }

  subscribe(callback) {
    // Observer pattern para updates
  }
}
```

**B. UI Components**
- **Tree Node**:
  - Icono por tipo (📄 p, 📦 div, 🖼️ img, etc.)
  - Nombre editable (doble clic)
  - Toggle collapse (►/▼)
  - Badges (🔒 locked, 👁️ hidden)
  - Drag handle para reordenar

- **Actions Bar**:
  - Búsqueda/filtro
  - Lock all/Unlock all
  - Collapse all/Expand all
  - Group selected

**C. Interacciones**
```javascript
// Click → Select
layerNode.addEventListener('click', () => {
  layersManager.selectLayer(elementId);
  syncCanvasSelection(elementId);
});

// Drag → Reorder
layerNode.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('layerId', elementId);
});

// Drop → Move in hierarchy
layerNode.addEventListener('drop', (e) => {
  const sourceId = e.dataTransfer.getData('layerId');
  layersManager.moveLayer(sourceId, targetId, position);
  updateDOM();
});

// Toggle visibility
toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  if (this.hidden.has(elementId)) {
    element.style.display = element.dataset.originalDisplay;
    this.hidden.delete(elementId);
  } else {
    element.dataset.originalDisplay = element.style.display;
    element.style.display = 'none';
    this.hidden.add(elementId);
  }
}

// Lock/Unlock
toggleLock(elementId) {
  const element = document.getElementById(elementId);
  if (this.locked.has(elementId)) {
    element.draggable = true;
    element.classList.remove('locked');
    this.locked.delete(elementId);
  } else {
    element.draggable = false;
    element.classList.add('locked');
    this.locked.add(elementId);
  }
}
```

**D. Sincronización Canvas ↔ Layers**
```javascript
// Canvas selection → Highlight layer
window.addEventListener('element:selected', (e) => {
  layersPanel.highlightLayer(e.detail.elementId);
  layersPanel.scrollIntoView(e.detail.elementId);
});

// Layer selection → Select canvas element
layersPanel.on('layer:selected', (elementId) => {
  const element = document.getElementById(elementId);
  window.selectElement(element);
});

// DOM changes → Update tree
const observer = new MutationObserver((mutations) => {
  layersManager.rebuildTree();
  layersPanel.render();
});

observer.observe(canvas, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['id', 'class']
});
```

#### API Pública
```javascript
// Global access
window.layersManager = new LayersManager();

// Methods
layersManager.selectLayer(id);
layersManager.selectMultiple([id1, id2, id3]);
layersManager.lockLayer(id);
layersManager.hideLayer(id);
layersManager.renameLayer(id, newName);
layersManager.moveLayer(sourceId, targetId, position);
layersManager.deleteLayer(id);
layersManager.duplicateLayer(id);

// Events
window.addEventListener('layers:selection', (e) => {});
window.addEventListener('layers:renamed', (e) => {});
window.addEventListener('layers:moved', (e) => {});
```

#### Estilos CSS
```css
/* src/styles/layers-panel.css */
.layers-panel {
  width: 250px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
}

.layers-header {
  padding: 12px;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layers-search {
  padding: 8px;
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  width: 100%;
  margin: 8px;
}

.layers-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.layer-node {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
  gap: 6px;
}

.layer-node:hover {
  background: var(--bg-tertiary);
}

.layer-node.selected {
  background: var(--accent-primary);
  color: white;
}

.layer-node.locked {
  opacity: 0.6;
  pointer-events: none;
}

.layer-node.hidden {
  opacity: 0.4;
  font-style: italic;
}

.layer-indent {
  width: calc(var(--depth) * 16px);
  flex-shrink: 0;
}

.layer-toggle {
  width: 16px;
  cursor: pointer;
}

.layer-icon {
  font-size: 14px;
}

.layer-name {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-actions {
  display: none;
  gap: 4px;
}

.layer-node:hover .layer-actions {
  display: flex;
}

.layer-action-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
}

.layer-action-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}
```

#### Testing
```javascript
// tests/unit/layersManager.test.js
describe('LayersManager', () => {
  it('should build tree from DOM', () => {});
  it('should handle layer selection', () => {});
  it('should lock/unlock layers', () => {});
  it('should hide/show layers', () => {});
  it('should rename layers', () => {});
  it('should move layers in hierarchy', () => {});
  it('should sync with canvas', () => {});
});
```

---

### 1.2 Multi-selección y Operaciones Batch
**Días:** 9-20 | **Archivos:** `src/core/multiSelect.js`, `src/core/batchOperations.js`

#### Descripción Técnica
Sistema de selección múltiple con operaciones aplicables a grupos de elementos.

#### Arquitectura
```javascript
class MultiSelectManager {
  constructor() {
    this.selectedElements = new Set();
    this.selectionBox = null; // Para marquee selection
    this.isSelecting = false;
    this.groups = new Map(); // Grupos guardados
  }

  // Métodos de selección
  addToSelection(element) {}
  removeFromSelection(element) {}
  toggleSelection(element) {}
  selectAll() {}
  selectNone() {}
  selectInvert() {}

  // Operaciones batch
  applyStyleToAll(property, value) {}
  alignElements(alignment) {} // left, center, right, top, middle, bottom
  distributeElements(direction) {} // horizontal, vertical
  groupElements(name) {}
  ungroupElements(groupId) {}

  // Marquee selection
  startMarqueeSelection(e) {}
  updateMarqueeSelection(e) {}
  endMarqueeSelection() {}
}
```

#### Funcionalidades Detalladas

**A. Modos de Selección**
1. **Click Simple**: Selecciona uno, deselecciona otros
2. **Ctrl/Cmd + Click**: Toggle elemento en selección
3. **Shift + Click**: Selección por rango (todos entre A y B)
4. **Marquee (Drag)**: Selección por área rectangular

**B. Visual Feedback**
```javascript
// Bounding box alrededor de selección múltiple
updateSelectionBoundingBox() {
  const elements = Array.from(this.selectedElements);
  const rects = elements.map(el => el.getBoundingClientRect());
  
  const minX = Math.min(...rects.map(r => r.left));
  const minY = Math.min(...rects.map(r => r.top));
  const maxX = Math.max(...rects.map(r => r.right));
  const maxY = Math.max(...rects.map(r => r.bottom));
  
  this.boundingBox.style.left = minX + 'px';
  this.boundingBox.style.top = minY + 'px';
  this.boundingBox.style.width = (maxX - minX) + 'px';
  this.boundingBox.style.height = (maxY - minY) + 'px';
}
```

**C. Alineación Inteligente**
```javascript
class AlignmentEngine {
  alignLeft(elements) {
    const minLeft = Math.min(...elements.map(el => 
      el.getBoundingClientRect().left
    ));
    
    elements.forEach(el => {
      el.style.position = 'absolute';
      el.style.left = minLeft + 'px';
    });
  }

  alignCenter(elements) {
    const centerX = this.calculateCenterX(elements);
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      el.style.position = 'absolute';
      el.style.left = (centerX - rect.width / 2) + 'px';
    });
  }

  distributeHorizontally(elements) {
    const sorted = elements.sort((a, b) => 
      a.getBoundingClientRect().left - b.getBoundingClientRect().left
    );
    
    const first = sorted[0].getBoundingClientRect();
    const last = sorted[sorted.length - 1].getBoundingClientRect();
    const totalSpace = last.right - first.left;
    const totalWidth = sorted.reduce((sum, el) => 
      sum + el.getBoundingClientRect().width, 0
    );
    const gap = (totalSpace - totalWidth) / (sorted.length - 1);
    
    let currentX = first.left;
    sorted.forEach((el, i) => {
      if (i > 0) {
        el.style.position = 'absolute';
        el.style.left = currentX + 'px';
      }
      currentX += el.getBoundingClientRect().width + gap;
    });
  }
}
```

**D. Grupos**
```javascript
class GroupManager {
  createGroup(elements, name = 'Group') {
    const groupId = 'group-' + Date.now();
    const wrapper = document.createElement('div');
    wrapper.id = groupId;
    wrapper.className = 'element-group';
    wrapper.dataset.groupName = name;
    
    // Mover elementos al grupo
    const parent = elements[0].parentNode;
    const refNode = elements[0];
    
    elements.forEach(el => wrapper.appendChild(el));
    parent.insertBefore(wrapper, refNode);
    
    this.groups.set(groupId, {
      id: groupId,
      name,
      elements: elements.map(el => el.id)
    });
    
    return groupId;
  }

  ungroup(groupId) {
    const group = document.getElementById(groupId);
    const parent = group.parentNode;
    
    // Mover hijos fuera del grupo
    Array.from(group.children).forEach(child => {
      parent.insertBefore(child, group);
    });
    
    group.remove();
    this.groups.delete(groupId);
  }
}
```

**E. UI de Operaciones Batch**
```html
<!-- Toolbar contextual cuando hay multi-selección -->
<div class="multi-select-toolbar" id="multiSelectToolbar" style="display: none;">
  <span class="selection-count">3 elementos seleccionados</span>
  
  <div class="toolbar-section">
    <label>Alinear:</label>
    <button onclick="alignSelected('left')" title="Alinear izquierda">⬅</button>
    <button onclick="alignSelected('center')" title="Alinear centro">-</button>
    <button onclick="alignSelected('right')" title="Alinear derecha">➡</button>
    <button onclick="alignSelected('top')" title="Alinear arriba">⬆</button>
    <button onclick="alignSelected('middle')" title="Alinear medio">-</button>
    <button onclick="alignSelected('bottom')" title="Alinear abajo">⬇</button>
  </div>

  <div class="toolbar-section">
    <label>Distribuir:</label>
    <button onclick="distributeSelected('horizontal')" title="Distribuir horizontalmente">⬌</button>
    <button onclick="distributeSelected('vertical')" title="Distribuir verticalmente">⬍</button>
  </div>

  <div class="toolbar-section">
    <button onclick="groupSelected()" title="Agrupar (Ctrl+G)">📦 Agrupar</button>
    <button onclick="duplicateSelected()" title="Duplicar (Ctrl+D)">📋 Duplicar</button>
    <button onclick="deleteSelected()" title="Eliminar (Del)">🗑️ Eliminar</button>
  </div>

  <div class="toolbar-section">
    <label>Aplicar estilo:</label>
    <input type="text" placeholder="propiedad" id="batchProperty">
    <input type="text" placeholder="valor" id="batchValue">
    <button onclick="applyBatchStyle()">Aplicar</button>
  </div>
</div>
```

**F. Marquee Selection**
```javascript
class MarqueeSelector {
  constructor(canvas) {
    this.canvas = canvas;
    this.selectionBox = this.createSelectionBox();
    this.isActive = false;
    this.startX = 0;
    this.startY = 0;
    
    this.setupEvents();
  }

  createSelectionBox() {
    const box = document.createElement('div');
    box.className = 'marquee-selection-box';
    box.style.cssText = `
      position: absolute;
      border: 2px dashed #2563eb;
      background: rgba(37, 99, 235, 0.1);
      pointer-events: none;
      z-index: 9999;
      display: none;
    `;
    document.body.appendChild(box);
    return box;
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      // Solo activar con Alt key o en área vacía
      if (e.altKey || e.target === this.canvas) {
        this.start(e);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isActive) {
        this.update(e);
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (this.isActive) {
        this.end(e);
      }
    });
  }

  start(e) {
    this.isActive = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    this.selectionBox.style.left = this.startX + 'px';
    this.selectionBox.style.top = this.startY + 'px';
    this.selectionBox.style.width = '0';
    this.selectionBox.style.height = '0';
    this.selectionBox.style.display = 'block';
  }

  update(e) {
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const left = Math.min(this.startX, currentX);
    const top = Math.min(this.startY, currentY);
    const width = Math.abs(currentX - this.startX);
    const height = Math.abs(currentY - this.startY);
    
    this.selectionBox.style.left = left + 'px';
    this.selectionBox.style.top = top + 'px';
    this.selectionBox.style.width = width + 'px';
    this.selectionBox.style.height = height + 'px';
  }

  end(e) {
    this.isActive = false;
    this.selectionBox.style.display = 'none';
    
    // Encontrar elementos dentro del área
    const boxRect = this.selectionBox.getBoundingClientRect();
    const elements = this.getElementsInRect(boxRect);
    
    // Seleccionar elementos
    window.multiSelectManager.selectMultiple(elements);
  }

  getElementsInRect(rect) {
    const canvasElements = document.querySelectorAll('.canvas-element');
    const selected = [];
    
    canvasElements.forEach(el => {
      const elRect = el.getBoundingClientRect();
      
      // Verificar intersección
      if (this.rectsIntersect(rect, elRect)) {
        selected.push(el);
      }
    });
    
    return selected;
  }

  rectsIntersect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  }
}
```

#### Integration Points
- **Con Undo/Redo**: Cada operación batch es un snapshot
- **Con Properties Panel**: Mostrar "Multiple (X)" cuando hay multi-selección
- **Con Enhanced Drag Drop**: Arrastrar múltiples elementos juntos

#### Testing
```javascript
describe('MultiSelectManager', () => {
  it('should select multiple with Ctrl+Click', () => {});
  it('should select range with Shift+Click', () => {});
  it('should marquee select', () => {});
  it('should align left correctly', () => {});
  it('should distribute evenly', () => {});
  it('should group elements', () => {});
  it('should apply batch styles', () => {});
});
```

---

### 1.3 Inspector de Estilos Avanzado
**Días:** 21-30 | **Archivos:** `src/components/AdvancedPropertiesPanel.js`

#### Descripción Técnica
Panel de propiedades mejorado con computed styles, box model visual, y autocomplete.

#### Features

**A. Computed vs Inline Styles**
```javascript
class StyleInspector {
  getComputedStyles(element) {
    const computed = window.getComputedStyle(element);
    const inline = element.style;
    
    return {
      computed: this.cssToObject(computed),
      inline: this.cssToObject(inline),
      inherited: this.getInheritedStyles(element)
    };
  }

  renderStylesPanel(element) {
    const styles = this.getComputedStyles(element);
    
    return `
      <div class="styles-panel">
        <div class="styles-section">
          <h4>Inline Styles</h4>
          ${this.renderStylesList(styles.inline, true)}
        </div>
        
        <div class="styles-section">
          <h4>Computed Styles</h4>
          ${this.renderStylesList(styles.computed, false)}
        </div>

        <div class="styles-section collapsed">
          <h4>Inherited Styles</h4>
          ${this.renderInheritedStyles(styles.inherited)}
        </div>
      </div>
    `;
  }
}
```

**B. Box Model Visual**
```html
<div class="box-model-visualizer">
  <div class="box-margin">
    <span class="dimension-label margin-top">20</span>
    
    <div class="box-border">
      <span class="dimension-label border-top">1</span>
      
      <div class="box-padding">
        <span class="dimension-label padding-top">10</span>
        
        <div class="box-content">
          <span class="content-dimensions">300 × 200</span>
        </div>
        
        <span class="dimension-label padding-bottom">10</span>
      </div>
      
      <span class="dimension-label border-bottom">1</span>
    </div>
    
    <span class="dimension-label margin-bottom">20</span>
  </div>
</div>
```

**C. Color Picker Avanzado**
```javascript
class AdvancedColorPicker {
  constructor() {
    this.recentColors = this.loadRecentColors();
    this.palettes = {
      tailwind: ['#3b82f6', '#10b981', '#f59e0b', ...],
      material: ['#2196F3', '#4CAF50', '#FF9800', ...],
      custom: []
    };
  }

  showPicker(property, currentValue, callback) {
    const picker = this.createPickerUI();
    
    // Tabs: Swatch, Gradient, Eyedropper, Recent
    picker.innerHTML = `
      <div class="color-picker-modal">
        <div class="picker-tabs">
          <button data-tab="swatch" class="active">Swatch</button>
          <button data-tab="gradient">Gradient</button>
          <button data-tab="eyedropper">Eyedropper</button>
          <button data-tab="recent">Recent</button>
        </div>

        <div class="picker-content">
          <!-- Swatch -->
          <div class="tab-pane active" id="tab-swatch">
            <input type="color" value="${currentValue}">
            <div class="palette-selector">
              ${this.renderPalettes()}
            </div>
          </div>

          <!-- Gradient -->
          <div class="tab-pane" id="tab-gradient">
            <div class="gradient-editor">
              <!-- Gradient builder UI -->
            </div>
          </div>

          <!-- Eyedropper -->
          <div class="tab-pane" id="tab-eyedropper">
            <button onclick="startEyedropper()">
              Pick Color from Screen
            </button>
          </div>

          <!-- Recent -->
          <div class="tab-pane" id="tab-recent">
            <div class="recent-colors">
              ${this.renderRecentColors()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async startEyedropper() {
    if (!window.EyeDropper) {
      alert('EyeDropper API no soportada en este navegador');
      return;
    }

    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    
    this.addToRecent(sRGBHex);
    return sRGBHex;
  }
}
```

**D. Autocomplete CSS**
```javascript
class CSSAutocomplete {
  constructor() {
    this.properties = this.loadCSSProperties();
    this.values = this.loadCSSValues();
  }

  loadCSSProperties() {
    return [
      'align-content', 'align-items', 'align-self',
      'animation', 'animation-delay', 'animation-direction',
      'background', 'background-color', 'background-image',
      'border', 'border-radius', 'border-color',
      // ... todas las propiedades CSS
    ];
  }

  loadCSSValues() {
    return {
      'display': ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
      'position': ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      'text-align': ['left', 'center', 'right', 'justify'],
      // ... valores por propiedad
    };
  }

  attachToInput(input) {
    const datalist = document.createElement('datalist');
    datalist.id = 'css-autocomplete-' + Date.now();
    
    input.setAttribute('list', datalist.id);
    input.parentNode.appendChild(datalist);
    
    input.addEventListener('input', () => {
      this.updateSuggestions(input, datalist);
    });
  }

  updateSuggestions(input, datalist) {
    const value = input.value.toLowerCase();
    const property = input.dataset.property;
    
    let suggestions = [];
    
    if (property) {
      // Sugerir valores para la propiedad
      suggestions = (this.values[property] || [])
        .filter(v => v.toLowerCase().includes(value));
    } else {
      // Sugerir propiedades
      suggestions = this.properties
        .filter(p => p.toLowerCase().includes(value))
        .slice(0, 10);
    }
    
    datalist.innerHTML = suggestions
      .map(s => `<option value="${s}">`)
      .join('');
  }
}
```

**E. Estados Pseudo**
```javascript
class PseudoStateEditor {
  enablePseudoStates(element) {
    // Agregar UI para toggle estados
    const toolbar = `
      <div class="pseudo-states-toolbar">
        <label>
          <input type="checkbox" onchange="togglePseudo('hover')">
          :hover
        </label>
        <label>
          <input type="checkbox" onchange="togglePseudo('active')">
          :active
        </label>
        <label>
          <input type="checkbox" onchange="togglePseudo('focus')">
          :focus
        </label>
        <label>
          <input type="checkbox" onchange="togglePseudo('disabled')">
          :disabled
        </label>
      </div>
    `;
    
    // Aplicar clases simulando estados
    element.classList.add('pseudo-hover'); // CSS: .pseudo-hover { /* hover styles */ }
  }
}
```

#### API Pública
```javascript
window.styleInspector = new StyleInspector();
window.multiSelectManager = new MultiSelectManager();
window.alignmentEngine = new AlignmentEngine();
window.groupManager = new GroupManager();
```

#### Testing
```javascript
describe('Advanced Inspector', () => {
  it('should show computed styles', () => {});
  it('should autocomplete CSS properties', () => {});
  it('should render box model', () => {});
  it('should toggle pseudo states', () => {});
});
```

---

## 🟢 WORKFLOW 2: AI & Smart Features
**Branch:** `feature/ai-smart`  
**Owner:** Dev AI/ML  
**Duración:** 20-25 días  
**Archivos principales:** `src/ai/`, `src/core/gemini*.js`

### 2.1 Generación de Componentes con IA
**Días:** 1-8 | **Archivos:** `src/ai/componentGenerator.js`

#### Descripción Técnica
Sistema completo de generación de componentes usando Gemini con múltiples estilos y refinamiento iterativo.

#### Arquitectura
```javascript
class AIComponentGenerator {
  constructor() {
    this.geminiAPI = 'https://generativelanguage.googleapis.com/v1beta/models/';
    this.model = 'gemini-2.0-flash-lite';
    this.apiKey = localStorage.getItem('gemini_api_key');
    this.generationHistory = [];
    this.stylePresets = {
      modern: 'Clean, minimal, with gradients and shadows',
      classic: 'Traditional, professional, serif fonts',
      playful: 'Colorful, rounded corners, fun animations',
      minimal: 'Black and white, maximum whitespace, no decorations',
      corporate: 'Professional, blues and grays, formal'
    };
  }

  async generateComponent(description, options = {}) {
    const {
      style = 'modern',
      includeJS = false,
      responsive = true,
      accessibility = true,
      framework = 'vanilla' // vanilla, react, vue
    } = options;

    const prompt = this.buildPrompt(description, options);
    const result = await this.callGemini(prompt);
    
    return {
      html: result.html,
      css: result.css,
      js: result.js,
      preview: this.createPreview(result),
      metadata: {
        description,
        style,
        timestamp: Date.now(),
        tokensUsed: result.tokensUsed
      }
    };
  }

  buildPrompt(description, options) {
    return `Generate a ${options.style} HTML component for: ${description}

Requirements:
- HTML5 semantic tags
- Inline CSS styles
${options.responsive ? '- Mobile-first responsive (use flexbox/grid)' : ''}
${options.accessibility ? '- ARIA labels and semantic structure' : ''}
${options.includeJS ? '- Include minimal vanilla JS for interactions' : '- No JavaScript'}
- Production-ready code
- Modern design aesthetics
- Max 300 lines total

Constraints:
- Return ONLY valid HTML code
- Use inline styles (no external CSS)
- No dependencies or libraries
- No explanations or comments in output

Example structure:
<section style="...">
  <h2>...</h2>
  <p>...</p>
</section>`;
  }

  async callGemini(prompt) {
    const response = await fetch(
      `${this.geminiAPI}${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7, // Creatividad moderada
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048, // Más tokens para componentes completos
          }
        })
      }
    );

    const data = await response.json();
    const generatedCode = this.extractCode(data);
    
    return {
      html: this.extractHTML(generatedCode),
      css: this.extractCSS(generatedCode),
      js: this.extractJS(generatedCode),
      tokensUsed: data.usageMetadata?.totalTokenCount || 0
    };
  }

  async refineComponent(componentHTML, feedback) {
    const prompt = `Refine this HTML component based on feedback.

Current component:
${componentHTML}

User feedback: ${feedback}

Return ONLY the improved HTML code, no explanations.`;

    return await this.callGemini(prompt);
  }
}
```

#### UI Modal
```html
<div class="ai-generator-modal">
  <div class="modal-header">
    <h3>🤖 Generar Componente con IA</h3>
    <button class="close-btn">×</button>
  </div>

  <div class="modal-body">
    <!-- Step 1: Descripción -->
    <div class="generation-step active" data-step="1">
      <label>Describe el componente que necesitas:</label>
      <textarea 
        id="componentDescription" 
        placeholder="Ej: Un hero section con título grande, subtítulo, dos botones y un formulario de email"
        rows="4"
      ></textarea>

      <div class="style-selector">
        <label>Estilo:</label>
        <div class="style-options">
          <button class="style-btn active" data-style="modern">
            <span class="emoji">✨</span>
            <span>Moderno</span>
          </button>
          <button class="style-btn" data-style="classic">
            <span class="emoji">📜</span>
            <span>Clásico</span>
          </button>
          <button class="style-btn" data-style="playful">
            <span class="emoji">🎨</span>
            <span>Juguetón</span>
          </button>
          <button class="style-btn" data-style="minimal">
            <span class="emoji">⬜</span>
            <span>Minimalista</span>
          </button>
          <button class="style-btn" data-style="corporate">
            <span class="emoji">💼</span>
            <span>Corporativo</span>
          </button>
        </div>
      </div>

      <div class="options-checkboxes">
        <label>
          <input type="checkbox" id="optResponsive" checked>
          Responsive (mobile-first)
        </label>
        <label>
          <input type="checkbox" id="optAccessibility" checked>
          Accesibilidad (ARIA)
        </label>
        <label>
          <input type="checkbox" id="optInteractive">
          Incluir interactividad (JS)
        </label>
      </div>

      <button class="btn btn-primary" onclick="generateComponent()">
        Generar Componente
      </button>
    </div>

    <!-- Step 2: Generando... -->
    <div class="generation-step" data-step="2">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p>Generando componente...</p>
        <small>Esto puede tomar 3-5 segundos</small>
      </div>
    </div>

    <!-- Step 3: Preview & Refine -->
    <div class="generation-step" data-step="3">
      <div class="preview-container">
        <h4>Preview:</h4>
        <iframe id="componentPreview"></iframe>
      </div>

      <div class="refine-section">
        <label>¿Necesitas ajustes?</label>
        <textarea 
          id="refinementFeedback" 
          placeholder="Ej: Cambiar el color azul por verde, hacer el título más grande"
          rows="2"
        ></textarea>
        <button class="btn btn-secondary" onclick="refineComponent()">
          Refinar
        </button>
      </div>

      <div class="generation-info">
        <small>Tokens usados: <span id="tokensUsed">0</span></small>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" onclick="regenerateComponent()">
          🔄 Regenerar
        </button>
        <button class="btn btn-primary" onclick="insertGeneratedComponent()">
          ✅ Insertar en Canvas
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Workflow de Generación
```javascript
async function generateComponent() {
  const description = document.getElementById('componentDescription').value;
  const style = document.querySelector('.style-btn.active').dataset.style;
  const responsive = document.getElementById('optResponsive').checked;
  const accessibility = document.getElementById('optAccessibility').checked;
  const interactive = document.getElementById('optInteractive').checked;

  showStep(2); // Loading

  try {
    const result = await aiComponentGenerator.generateComponent(description, {
      style,
      responsive,
      accessibility,
      includeJS: interactive
    });

    // Mostrar preview
    const iframe = document.getElementById('componentPreview');
    iframe.srcdoc = result.html;

    // Guardar en historial
    currentGeneration = result;

    // Mostrar tokens usados
    document.getElementById('tokensUsed').textContent = result.metadata.tokensUsed;

    showStep(3); // Preview
  } catch (error) {
    showToast('Error generando componente: ' + error.message, 'error');
    showStep(1);
  }
}

async function refineComponent() {
  const feedback = document.getElementById('refinementFeedback').value;
  
  if (!feedback) {
    alert('Por favor describe qué quieres ajustar');
    return;
  }

  showStep(2); // Loading

  const refined = await aiComponentGenerator.refineComponent(
    currentGeneration.html,
    feedback
  );

  // Actualizar preview
  const iframe = document.getElementById('componentPreview');
  iframe.srcdoc = refined.html;

  currentGeneration = refined;
  
  showStep(3);
  document.getElementById('refinementFeedback').value = '';
}

function insertGeneratedComponent() {
  const canvas = document.getElementById('canvas');
  
  // Crear wrapper temporal
  const temp = document.createElement('div');
  temp.innerHTML = currentGeneration.html;
  
  const element = temp.firstElementChild;
  element.id = 'element-' + (elementIdCounter++);
  element.classList.add('canvas-element');
  
  // Aplicar eventos estándar
  setupElementEvents(element);
  
  canvas.appendChild(element);
  
  showToast('✅ Componente insertado');
  closeGeneratorModal();
}
```

#### Optimización de Costos
```javascript
// Estimación de tokens antes de enviar
estimateTokens(prompt) {
  // ~1.3 tokens por palabra en promedio
  return Math.ceil(prompt.split(/\s+/).length * 1.3);
}

// Caché de generaciones similares
class GenerationCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50;
  }

  getCacheKey(description, options) {
    return JSON.stringify({ description, ...options });
  }

  get(description, options) {
    const key = this.getCacheKey(description, options);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hora
      return cached.result;
    }
    
    return null;
  }

  set(description, options, result) {
    const key = this.getCacheKey(description, options);
    
    if (this.cache.size >= this.maxSize) {
      // Eliminar el más antiguo
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }
}
```

---

### 2.2 Accesibilidad Automática (a11y)
**Días:** 9-18 | **Archivos:** `src/ai/accessibilityChecker.js`

#### Descripción Técnica
Validador y corrector automático de accesibilidad usando reglas WCAG 2.1 + IA.

#### Arquitectura
```javascript
class AccessibilityChecker {
  constructor() {
    this.rules = this.loadWCAGRules();
    this.issues = [];
    this.score = 100;
    this.geminiAPI = window.geminiValidator;
  }

  async scanDocument() {
    this.issues = [];
    
    // Ejecutar checks
    await Promise.all([
      this.checkImages(),
      this.checkHeadings(),
      this.checkContrast(),
      this.checkForms(),
      this.checkARIA(),
      this.checkKeyboardNav(),
      this.checkFocusIndicators(),
      this.checkLandmarks()
    ]);

    this.calculateScore();
    return {
      score: this.score,
      issues: this.issues,
      passed: this.issues.filter(i => i.severity === 'pass').length,
      warnings: this.issues.filter(i => i.severity === 'warning').length,
      errors: this.issues.filter(i => i.severity === 'error').length
    };
  }

  // Checks específicos
  async checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        this.issues.push({
          severity: 'error',
          rule: 'WCAG 1.1.1 Non-text Content',
          element: img,
          message: 'Imagen sin texto alternativo',
          fix: async () => await this.generateAltText(img),
          autoFixable: true
        });
      }
    });
  }

  async checkContrast() {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');
    
    for (const el of textElements) {
      const computed = window.getComputedStyle(el);
      const color = this.parseColor(computed.color);
      const bgColor = this.getBackgroundColor(el);
      
      const ratio = this.calculateContrastRatio(color, bgColor);
      const fontSize = parseFloat(computed.fontSize);
      const isBold = computed.fontWeight >= 700;
      
      // WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
      const minRatio = (fontSize >= 24 || (fontSize >= 19 && isBold)) ? 3 : 4.5;
      
      if (ratio < minRatio) {
        this.issues.push({
          severity: 'error',
          rule: 'WCAG 1.4.3 Contrast (Minimum)',
          element: el,
          message: `Contraste insuficiente: ${ratio.toFixed(2)}:1 (mínimo ${minRatio}:1)`,
          fix: () => this.fixContrast(el, color, bgColor, minRatio),
          autoFixable: true,
          details: {
            currentRatio: ratio,
            requiredRatio: minRatio,
            currentColor: color,
            currentBg: bgColor
          }
        });
      }
    }
  }

  async checkHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName[1]));
    
    // Verificar orden
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
        this.issues.push({
          severity: 'warning',
          rule: 'WCAG 1.3.1 Info and Relationships',
          element: headings[i],
          message: `Salto en jerarquía de headings: h${levels[i-1]} → h${levels[i]}`,
          fix: () => this.fixHeadingHierarchy(headings[i], levels[i-1]),
          autoFixable: true
        });
      }
    }

    // Verificar existencia de h1
    if (!document.querySelector('h1')) {
      this.issues.push({
        severity: 'error',
        rule: 'Best Practice',
        element: document.body,
        message: 'Falta heading h1 principal',
        fix: () => this.addH1(),
        autoFixable: false
      });
    }
  }

  async checkForms() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.issues.push({
          severity: 'error',
          rule: 'WCAG 3.3.2 Labels or Instructions',
          element: input,
          message: 'Campo de formulario sin etiqueta',
          fix: () => this.addLabel(input),
          autoFixable: true
        });
      }
    });
  }

  async checkARIA() {
    // Roles incorrectos
    const elementsWithRole = document.querySelectorAll('[role]');
    const validRoles = ['button', 'link', 'navigation', 'main', 'search', ...];
    
    elementsWithRole.forEach(el => {
      const role = el.getAttribute('role');
      if (!validRoles.includes(role)) {
        this.issues.push({
          severity: 'error',
          rule: 'ARIA 1.1',
          element: el,
          message: `Rol ARIA inválido: "${role}"`,
          fix: () => el.removeAttribute('role'),
          autoFixable: true
        });
      }
    });
  }

  // Fixes automáticos
  async generateAltText(img) {
    // Usar IA para generar alt text desde la URL o contexto
    const prompt = `Generate concise alt text for this image context:
    
Image src: ${img.src}
Parent element: ${img.parentElement.tagName}
Nearby text: ${this.getNearbyText(img)}

Return ONLY the alt text, max 125 characters, no quotes.`;

    const result = await this.geminiAPI.callGeminiAPI(img, { prompt });
    const altText = result.corrected.trim();
    
    img.alt = altText;
    return altText;
  }

  fixContrast(element, color, bgColor, minRatio) {
    // Ajustar automáticamente para cumplir ratio
    const newColor = this.findContrastingColor(bgColor, minRatio);
    element.style.color = newColor;
  }

  findContrastingColor(bgColor, minRatio) {
    // Algoritmo para encontrar color con contraste suficiente
    let [r, g, b] = bgColor;
    const luminance = this.calculateLuminance(bgColor);
    
    // Si el fondo es oscuro, usar texto claro
    if (luminance < 0.5) {
      return '#ffffff';
    } else {
      return '#000000';
    }
  }

  calculateContrastRatio(color1, color2) {
    const l1 = this.calculateLuminance(color1);
    const l2 = this.calculateLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  calculateLuminance([r, g, b]) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  addLabel(input) {
    const label = document.createElement('label');
    const inputId = input.id || ('input-' + Date.now());
    
    input.id = inputId;
    label.setAttribute('for', inputId);
    label.textContent = input.placeholder || 'Campo de formulario';
    
    input.parentNode.insertBefore(label, input);
  }
}
```

#### UI Panel de Accesibilidad
```html
<div class="accessibility-panel">
  <div class="panel-header">
    <h3>♿ Accesibilidad</h3>
    <button class="scan-btn" onclick="scanAccessibility()">
      Escanear
    </button>
  </div>

  <div class="score-display">
    <div class="score-circle" data-score="85">
      <svg viewBox="0 0 100 100">
        <circle class="score-bg" cx="50" cy="50" r="45" />
        <circle class="score-fill" cx="50" cy="50" r="45" 
          style="stroke-dasharray: 283; stroke-dashoffset: 42.45;" />
      </svg>
      <span class="score-value">85</span>
    </div>
    <div class="score-label">WCAG 2.1 AA</div>
  </div>

  <div class="issues-summary">
    <div class="issue-stat error">
      <span class="icon">❌</span>
      <span class="count">3</span>
      <span class="label">Errores</span>
    </div>
    <div class="issue-stat warning">
      <span class="icon">⚠️</span>
      <span class="count">5</span>
      <span class="label">Advertencias</span>
    </div>
    <div class="issue-stat passed">
      <span class="icon">✅</span>
      <span class="count">27</span>
      <span class="label">Pasadas</span>
    </div>
  </div>

  <div class="issues-list">
    <!-- Issue items -->
    <div class="issue-item error">
      <div class="issue-header" onclick="toggleIssue(this)">
        <span class="severity-icon">❌</span>
        <span class="issue-title">Imagen sin texto alternativo</span>
        <span class="rule-code">WCAG 1.1.1</span>
      </div>
      <div class="issue-details">
        <p class="issue-description">
          Las imágenes deben tener atributo alt descriptivo.
        </p>
        <div class="issue-element">
          <code>&lt;img src="..." /&gt;</code>
        </div>
        <div class="issue-actions">
          <button class="btn-fix" onclick="autoFixIssue(0)">
            🔧 Corregir automáticamente
          </button>
          <button class="btn-locate" onclick="locateElement(0)">
            📍 Localizar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="panel-actions">
    <button class="btn btn-primary" onclick="autoFixAll()">
      🔧 Corregir Todos
    </button>
    <button class="btn btn-secondary" onclick="exportA11yReport()">
      📄 Exportar Reporte
    </button>
  </div>
</div>
```

#### Testing
```javascript
describe('AccessibilityChecker', () => {
  it('should detect images without alt', () => {});
  it('should detect insufficient contrast', () => {});
  it('should detect heading hierarchy issues', () => {});
  it('should detect unlabeled form fields', () => {});
  it('should auto-fix images alt', () => {});
  it('should auto-fix contrast', () => {});
  it('should calculate WCAG score', () => {});
});
```

---

### 2.3 SEO Optimizer
**Días:** 19-25 | **Archivos:** `src/ai/seoOptimizer.js`

#### Descripción Técnica
Análisis y optimización SEO con generación automática de meta tags usando IA.

#### Funcionalidades

**A. Análisis SEO**
```javascript
class SEOOptimizer {
  async analyzeDocument() {
    const analysis = {
      score: 0,
      issues: [],
      suggestions: []
    };

    // Checks básicos
    this.checkTitle(analysis);
    this.checkMetaDescription(analysis);
    this.checkHeadings(analysis);
    this.checkImages(analysis);
    this.checkLinks(analysis);
    this.checkStructuredData(analysis);
    this.checkCanonical(analysis);
    this.checkOpenGraph(analysis);
    this.checkTwitterCards(analysis);

    // IA para sugerencias de contenido
    await this.analyzeContent(analysis);

    return analysis;
  }

  checkTitle(analysis) {
    const title = document.querySelector('title');
    
    if (!title) {
      analysis.issues.push({
        severity: 'error',
        message: 'Falta tag <title>',
        fix: () => this.generateTitle()
      });
      analysis.score -= 15;
    } else {
      const length = title.textContent.length;
      
      if (length < 30) {
        analysis.issues.push({
          severity: 'warning',
          message: 'Título muy corto (min 30 caracteres)',
          fix: () => this.improveTitle(title.textContent)
        });
        analysis.score -= 5;
      } else if (length > 60) {
        analysis.issues.push({
          severity: 'warning',
          message: 'Título muy largo (max 60 caracteres, se truncará en resultados)',
          fix: () => this.shortenTitle(title.textContent)
        });
        analysis.score -= 3;
      }
    }
  }

  checkMetaDescription(analysis) {
    const meta = document.querySelector('meta[name="description"]');
    
    if (!meta) {
      analysis.issues.push({
        severity: 'error',
        message: 'Falta meta description',
        fix: () => this.generateMetaDescription()
      });
      analysis.score -= 15;
    } else {
      const content = meta.getAttribute('content');
      const length = content.length;
      
      if (length < 120) {
        analysis.issues.push({
          severity: 'warning',
          message: 'Meta description muy corta (min 120 caracteres)',
          fix: () => this.improveMetaDescription(content)
        });
        analysis.score -= 5;
      } else if (length > 160) {
        analysis.issues.push({
          severity: 'warning',
          message: 'Meta description muy larga (max 160 caracteres)',
          fix: () => this.shortenMetaDescription(content)
        });
        analysis.score -= 3;
      }
    }
  }

  checkStructuredData(analysis) {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    
    if (!jsonLd) {
      analysis.suggestions.push({
        message: 'Agregar datos estructurados (Schema.org) para mejor presencia en resultados',
        fix: () => this.generateStructuredData()
      });
    }
  }

  async generateTitle() {
    const bodyText = document.body.textContent.substring(0, 500);
    
    const prompt = `Generate an SEO-optimized page title based on this content:

${bodyText}

Rules:
- 30-60 characters
- Include primary keyword
- Compelling and click-worthy
- No special characters except - or |
- Return ONLY the title text`;

    const result = await this.callGemini(prompt);
    
    let title = document.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      document.head.appendChild(title);
    }
    
    title.textContent = result.trim();
    return result;
  }

  async generateMetaDescription() {
    const bodyText = document.body.textContent.substring(0, 800);
    
    const prompt = `Generate an SEO-optimized meta description for this page:

${bodyText}

Rules:
- 120-160 characters
- Include primary keyword naturally
- Compelling call-to-action
- No special formatting
- Return ONLY the description text`;

    const result = await this.callGemini(prompt);
    
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', result.trim());
    return result;
  }

  generateStructuredData() {
    // Detectar tipo de página
    const type = this.detectPageType();
    
    let schema = {
      "@context": "https://schema.org",
      "@type": type
    };

    switch(type) {
      case 'Article':
        schema = {
          ...schema,
          "headline": document.querySelector('h1')?.textContent || '',
          "datePublished": new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": "Author Name"
          }
        };
        break;
        
      case 'Organization':
        schema = {
          ...schema,
          "name": document.querySelector('h1')?.textContent || '',
          "url": window.location.href,
          "logo": document.querySelector('img')?.src || ''
        };
        break;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  generateOpenGraphTags() {
    const tags = [
      { property: 'og:title', content: document.title },
      { property: 'og:description', content: document.querySelector('meta[name="description"]')?.content || '' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: document.querySelector('img')?.src || '' }
    ];

    tags.forEach(({ property, content }) => {
      if (content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      }
    });
  }
}
```

**B. UI Panel SEO**
```html
<div class="seo-panel">
  <div class="seo-score">
    <div class="score-circle" data-score="73">
      <span class="score-value">73</span>
      <span class="score-label">/100</span>
    </div>
    <p class="score-status">Needs Improvement</p>
  </div>

  <div class="seo-sections">
    <!-- Meta Tags -->
    <div class="seo-section">
      <h4>📄 Meta Tags</h4>
      
      <div class="meta-item">
        <label>Title (30-60 chars):</label>
        <input id="seo-title" value="">
        <span class="char-count">0/60</span>
        <button class="btn-generate" onclick="generateTitle()">
          🤖 Generar con IA
        </button>
      </div>

      <div class="meta-item">
        <label>Description (120-160 chars):</label>
        <textarea id="seo-description" rows="3"></textarea>
        <span class="char-count">0/160</span>
        <button class="btn-generate" onclick="generateDescription()">
          🤖 Generar con IA
        </button>
      </div>
    </div>

    <!-- Open Graph -->
    <div class="seo-section">
      <h4>📱 Open Graph (Social Share)</h4>
      <button class="btn-secondary" onclick="generateOGTags()">
        Auto-generar Tags OG
      </button>
    </div>

    <!-- Structured Data -->
    <div class="seo-section">
      <h4>📊 Datos Estructurados</h4>
      <select id="schema-type">
        <option value="Article">Article</option>
        <option value="Organization">Organization</option>
        <option value="Product">Product</option>
        <option value="LocalBusiness">Local Business</option>
      </select>
      <button class="btn-secondary" onclick="generateSchema()">
        Generar Schema
      </button>
    </div>
  </div>

  <button class="btn btn-primary" onclick="applySEOFixes()">
    ✅ Aplicar Todas las Optimizaciones
  </button>
</div>
```

---

## 🟣 WORKFLOW 3: Backend & Auth
**Branch:** `feature/backend-auth`  
**Owner:** Dev Backend  
**Duración:** 25-30 días  
**Archivos principales:** `backend/`, `src/services/auth/`

### 3.1 Better Auth Integration
**Días:** 1-12 | **Archivos:** `backend/auth/`, `src/services/authService.js`

#### Stack Tecnológico
```json
{
  "backend": "Node.js + Express",
  "auth": "better-auth",
  "database": "PostgreSQL (Supabase)",
  "orm": "Drizzle ORM (recomendado por Better Auth)",
  "session": "JWT + Cookie-based"
}
```

#### Estructura de Backend
```
backend/
  ├── server.js                 # Express server
  ├── auth/
  │   ├── config.js            # Better Auth config
  │   ├── routes.js            # Auth routes
  │   └── middleware.js        # Auth middleware
  ├── db/
  │   ├── schema.js            # Drizzle schema
  │   ├── migrations/          # DB migrations
  │   └── client.js            # DB client
  ├── api/
  │   ├── projects.js          # Projects CRUD
  │   ├── components.js        # Components library
  │   └── deployments.js       # Deployment handling
  └── utils/
      ├── jwt.js
      └── validation.js
```

#### Implementación Better Auth

**A. Backend Setup**
```javascript
// backend/auth/config.js
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // En producción: true
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
  },

  user: {
    additionalFields: {
      plan: {
        type: "string",
        defaultValue: "free",
        input: false // No editable por usuario
      },
      projectsQuota: {
        type: "number",
        defaultValue: 10
      },
      storageUsed: {
        type: "number",
        defaultValue: 0
      }
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        // Enviar email de confirmación
        await sendEmail({
          to: user.email,
          subject: 'Confirmar cambio de email',
          html: `<a href="${url}">Confirmar cambio a ${newEmail}</a>`
        });
      }
    }
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualizar cada día
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutos
    }
  },

  advanced: {
    cookiePrefix: "dragndrop_auth",
    generateId: () => crypto.randomUUID()
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Logging, analytics, etc.
          console.log('New user created:', user.email);
          return { data: user };
        },
        after: async (user) => {
          // Enviar email de bienvenida
          await sendWelcomeEmail(user);
        }
      }
    }
  }
});
```

**B. Database Schema (Drizzle)**
```javascript
// backend/db/schema.js
import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  
  // Custom fields
  plan: text("plan").notNull().default("free"),
  projectsQuota: integer("projectsQuota").notNull().default(10),
  storageUsed: integer("storageUsed").notNull().default(0),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Tablas custom de la app
export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // JSON stringified
  thumbnail: text("thumbnail"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const component = pgTable("component", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  html: text("html").notNull(),
  css: text("css"),
  js: text("js"),
  category: text("category"),
  tags: text("tags"), // JSON array
  isPublic: boolean("isPublic").default(false),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
```

**C. Server Setup**
```javascript
// backend/server.js
import express from 'express';
import cors from 'cors';
import { auth } from './auth/config.js';
import projectsRouter from './api/projects.js';
import componentsRouter from './api/components.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Better Auth routes
app.all('/api/auth/*', (req, res) => {
  return auth.handler(req, res);
});

// Protected routes
app.use('/api/projects', projectsRouter);
app.use('/api/components', componentsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

**D. Auth Middleware**
```javascript
// backend/auth/middleware.js
import { auth } from './config.js';

export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Please sign in to continue'
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message
    });
  }
}

export function checkQuota(resource) {
  return async (req, res, next) => {
    const user = req.user;
    
    if (resource === 'projects') {
      const projectCount = await db
        .select()
        .from(project)
        .where(eq(project.userId, user.id))
        .length;
      
      if (projectCount >= user.projectsQuota) {
        return res.status(403).json({
          error: 'Quota exceeded',
          message: `Maximum ${user.projectsQuota} projects allowed`
        });
      }
    }
    
    next();
  };
}
```

**E. Frontend Auth Client**
```javascript
// src/services/authService.js
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.API_URL || "http://localhost:3001",
  
  fetchOptions: {
    onError(ctx) {
      console.error('Auth error:', ctx.error);
      
      if (ctx.error.status === 401) {
        // Redirect to login
        window.location.href = '/login';
      }
    },
    
    onSuccess(ctx) {
      // Track analytics
      if (ctx.response.ok) {
        console.log('Auth success:', ctx.response.url);
      }
    }
  }
});

// Helper functions
export async function signUp(email, password, name) {
  return await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: '/dashboard'
  });
}

export async function signIn(email, password) {
  return await authClient.signIn.email({
    email,
    password,
    callbackURL: '/dashboard'
  });
}

export async function signInWithGoogle() {
  return await authClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard'
  });
}

export async function signInWithGitHub() {
  return await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/dashboard'
  });
}

export async function signOut() {
  return await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = '/';
      }
    }
  });
}

export async function getSession() {
  return await authClient.getSession();
}

export function useSession() {
  return authClient.useSession();
}
```

**F. UI Components de Auth**
```html
<!-- Login Page -->
<div class="auth-page">
  <div class="auth-card">
    <div class="auth-header">
      <h2>Iniciar Sesión</h2>
      <p>Accede a tus proyectos</p>
    </div>

    <div class="auth-body">
      <!-- Social login -->
      <div class="social-auth">
        <button class="social-btn google" onclick="signInWithGoogle()">
          <img src="/icons/google.svg" alt="Google">
          Continuar con Google
        </button>
        <button class="social-btn github" onclick="signInWithGitHub()">
          <img src="/icons/github.svg" alt="GitHub">
          Continuar con GitHub
        </button>
      </div>

      <div class="divider">
        <span>o</span>
      </div>

      <!-- Email/Password -->
      <form id="loginForm" onsubmit="handleLogin(event)">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" name="email" required>
        </div>

        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" required>
        </div>

        <button type="submit" class="btn btn-primary">
          Iniciar Sesión
        </button>
      </form>

      <div class="auth-footer">
        <a href="/signup">¿No tienes cuenta? Regístrate</a>
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</div>
```

**G. Session Management en Frontend**
```javascript
// src/services/sessionManager.js
class SessionManager {
  constructor() {
    this.session = null;
    this.listeners = new Set();
    this.checkInterval = null;
    
    this.init();
  }

  async init() {
    // Cargar sesión inicial
    await this.loadSession();
    
    // Check periódico (cada 5 minutos)
    this.checkInterval = setInterval(() => {
      this.refreshSession();
    }, 5 * 60 * 1000);

    // Listener de visibility para refrescar cuando vuelve a la pestaña
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshSession();
      }
    });
  }

  async loadSession() {
    try {
      const { data, error } = await authClient.getSession();
      
      if (error) throw error;
      
      this.session = data;
      this.notifyListeners();
      
      return data;
    } catch (error) {
      console.error('Error loading session:', error);
      this.session = null;
      return null;
    }
  }

  async refreshSession() {
    const oldSession = this.session;
    await this.loadSession();
    
    // Si cambió el estado de autenticación
    if (oldSession?.user && !this.session) {
      // Se cerró sesión
      this.handleSessionExpired();
    }
  }

  handleSessionExpired() {
    showToast('Tu sesión ha expirado', 'warning');
    
    // Guardar trabajo pendiente
    if (window.projectManager) {
      window.projectManager.saveToLocalStorage();
    }
    
    // Redirect a login
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.session));
  }

  isAuthenticated() {
    return !!this.session?.user;
  }

  getUser() {
    return this.session?.user || null;
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Global instance
window.sessionManager = new SessionManager();
```

**H. Protected Routes Frontend**
```javascript
// src/router/guards.js
function requireAuth(next) {
  if (!window.sessionManager.isAuthenticated()) {
    // Guardar URL deseada
    localStorage.setItem('redirect_after_login', window.location.pathname);
    
    // Redirect a login
    window.location.href = '/login';
    return false;
  }
  
  next();
  return true;
}

// Usage
window.addEventListener('load', () => {
  if (window.location.pathname === '/dashboard') {
    requireAuth(() => {
      initializeDashboard();
    });
  }
});
```

#### API REST del Backend
```javascript
// backend/api/projects.js
import { Router } from 'express';
import { requireAuth, checkQuota } from '../auth/middleware.js';
import { db } from '../db/client.js';
import { project } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// GET /api/projects - List user projects
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await db
      .select()
      .from(project)
      .where(eq(project.userId, req.user.id))
      .orderBy(project.updatedAt, 'desc');
    
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Create project
router.post('/', requireAuth, checkQuota('projects'), async (req, res) => {
  try {
    const { name, description, data, thumbnail } = req.body;
    
    const newProject = await db
      .insert(project)
      .values({
        id: crypto.randomUUID(),
        name,
        description,
        data: JSON.stringify(data),
        thumbnail,
        userId: req.user.id
      })
      .returning();
    
    res.json({ project: newProject[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, data, thumbnail } = req.body;
    
    // Verificar ownership
    const existing = await db
      .select()
      .from(project)
      .where(and(
        eq(project.id, id),
        eq(project.userId, req.user.id)
      ))
      .limit(1);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updated = await db
      .update(project)
      .set({
        name,
        description,
        data: JSON.stringify(data),
        thumbnail,
        updatedAt: new Date()
      })
      .where(eq(project.id, id))
      .returning();
    
    res.json({ project: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .delete(project)
      .where(and(
        eq(project.id, id),
        eq(project.userId, req.user.id)
      ));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**I. Frontend API Client**
```javascript
// src/services/apiClient.js
class APIClient {
  constructor() {
    this.baseURL = process.env.API_URL || 'http://localhost:3001';
  }

  async request(endpoint, options = {}) {
    const session = await authClient.getSession();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.session && {
          'Authorization': `Bearer ${session.session.token}`
        }),
        ...options.headers
      },
      credentials: 'include' // Important for cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return await response.json();
  }

  // Projects
  async getProjects() {
    return await this.request('/api/projects');
  }

  async createProject(projectData) {
    return await this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(id, projectData) {
    return await this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  async deleteProject(id) {
    return await this.request(`/api/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Components Library
  async getComponents() {
    return await this.request('/api/components');
  }

  async saveComponent(componentData) {
    return await this.request('/api/components', {
      method: 'POST',
      body: JSON.stringify(componentData)
    });
  }
}

window.apiClient = new APIClient();
```

#### Testing
```javascript
describe('Auth Integration', () => {
  it('should sign up new user', async () => {});
  it('should sign in with email/password', async () => {});
  it('should sign in with Google', async () => {});
  it('should sign in with GitHub', async () => {});
  it('should get session', async () => {});
  it('should sign out', async () => {});
  it('should refresh token', async () => {});
});

describe('Projects API', () => {
  it('should create project when authenticated', async () => {});
  it('should reject project creation without auth', async () => {});
  it('should enforce quota limits', async () => {});
  it('should list user projects', async () => {});
  it('should update project', async () => {});
  it('should delete project', async () => {});
});
```

---

### 3.2 Cloud Storage de Proyectos
**Días:** 13-20 | **Archivos:** `src/services/cloudSync.js`

#### Descripción Técnica
Sistema de sincronización automática de proyectos con el backend.

#### Features

**A. Auto-save con Debounce**
```javascript
class CloudSyncManager {
  constructor() {
    this.saveTimeout = null;
    this.saveDelay = 30000; // 30 segundos
    this.isSaving = false;
    this.lastSaved = null;
    this.pendingChanges = false;
    this.retryQueue = [];
  }

  markDirty() {
    this.pendingChanges = true;
    
    // Clear timeout anterior
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Schedule save
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, this.saveDelay);

    this.updateSaveIndicator();
  }

  async save() {
    if (this.isSaving || !this.pendingChanges) return;

    this.isSaving = true;
    this.updateSaveIndicator('saving');

    try {
      const projectData = this.serializeCurrentProject();
      
      if (projectData.id) {
        // Update existing
        await window.apiClient.updateProject(projectData.id, projectData);
      } else {
        // Create new
        const result = await window.apiClient.createProject(projectData);
        projectData.id = result.project.id;
        
        // Guardar ID localmente
        localStorage.setItem('current_project_id', projectData.id);
      }

      this.lastSaved = Date.now();
      this.pendingChanges = false;
      this.updateSaveIndicator('saved');
      
      console.log('✅ Proyecto guardado en la nube');
    } catch (error) {
      console.error('Error saving to cloud:', error);
      
      // Guardar localmente como fallback
      this.saveToLocalStorage(projectData);
      
      // Agregar a cola de retry
      this.retryQueue.push(projectData);
      
      this.updateSaveIndicator('error');
      
      showToast('Error guardando en la nube. Guardado localmente.', 'warning');
    } finally {
      this.isSaving = false;
    }
  }

  serializeCurrentProject() {
    const canvas = document.getElementById('canvas');
    
    return {
      id: localStorage.getItem('current_project_id'),
      name: this.getProjectName(),
      data: {
        html: canvas.innerHTML,
        elements: this.serializeElements(),
        metadata: {
          canvasSize: this.getCanvasSize(),
          theme: document.body.dataset.theme || 'light'
        }
      },
      thumbnail: this.generateThumbnail()
    };
  }

  updateSaveIndicator(status = 'idle') {
    const indicator = document.getElementById('saveIndicator');
    if (!indicator) return;

    const states = {
      idle: { text: 'Guardado', icon: '✓', class: 'saved' },
      saving: { text: 'Guardando...', icon: '↻', class: 'saving' },
      saved: { text: 'Guardado', icon: '✓', class: 'saved' },
      error: { text: 'Error', icon: '⚠', class: 'error' },
      pending: { text: 'Cambios sin guardar', icon: '●', class: 'pending' }
    };

    const state = states[status];
    indicator.innerHTML = `<span class="${state.class}">${state.icon} ${state.text}</span>`;
  }

  generateThumbnail() {
    // Usar html2canvas o similar para screenshot
    const canvas = document.getElementById('canvas');
    
    // Por ahora retornar data URL simple
    return 'data:image/svg+xml;base64,...'; // Placeholder
  }

  async retryFailedSaves() {
    while (this.retryQueue.length > 0) {
      const projectData = this.retryQueue[0];
      
      try {
        await window.apiClient.updateProject(projectData.id, projectData);
        this.retryQueue.shift(); // Remove from queue
        console.log('✅ Retry exitoso');
      } catch (error) {
        console.error('Retry failed:', error);
        break; // Stop retrying
      }
    }
  }
}
```

**B. Conflicts Resolution**
```javascript
class ConflictResolver {
  async detectConflict(localProject, remoteProject) {
    if (localProject.updatedAt > remoteProject.updatedAt) {
      // Local más reciente
      return {
        hasConflict: true,
        winner: 'local',
        localProject,
        remoteProject
      };
    } else if (remoteProject.updatedAt > localProject.updatedAt) {
      // Remote más reciente
      return {
        hasConflict: true,
        winner: 'remote',
        localProject,
        remoteProject
      };
    }
    
    return { hasConflict: false };
  }

  showConflictModal(conflict) {
    const modal = `
      <div class="conflict-modal">
        <h3>⚠️ Conflicto Detectado</h3>
        <p>El proyecto ha sido modificado en otro lugar.</p>

        <div class="conflict-comparison">
          <div class="version local">
            <h4>Tu Versión Local</h4>
            <p>Última modificación: ${new Date(conflict.localProject.updatedAt).toLocaleString()}</p>
            <iframe srcdoc="${conflict.localProject.data.html}"></iframe>
          </div>

          <div class="version remote">
            <h4>Versión en la Nube</h4>
            <p>Última modificación: ${new Date(conflict.remoteProject.updatedAt).toLocaleString()}</p>
            <iframe srcdoc="${conflict.remoteProject.data.html}"></iframe>
          </div>
        </div>

        <div class="conflict-actions">
          <button onclick="resolveConflict('local')">
            Usar Mi Versión
          </button>
          <button onclick="resolveConflict('remote')">
            Usar Versión en la Nube
          </button>
          <button onclick="resolveConflict('merge')">
            Intentar Fusionar (Experimental)
          </button>
        </div>
      </div>
    `;
  }
}
```

---

### 3.3 Security Checker
**Días:** 21-25 | **Archivos:** `src/security/securityChecker.js`

#### Descripción Técnica
Detección de vulnerabilidades comunes (XSS, CSRF, secrets exposure, etc.).

#### Implementation
```javascript
class SecurityChecker {
  async scan() {
    const issues = [];

    // XSS vulnerabilities
    this.checkXSS(issues);
    
    // Secrets exposed
    this.checkSecretsExposure(issues);
    
    // Insecure links
    this.checkInsecureLinks(issues);
    
    // CSP
    this.checkCSP(issues);
    
    // Mixed content
    this.checkMixedContent(issues);

    return {
      score: this.calculateSecurityScore(issues),
      issues,
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    };
  }

  checkXSS(issues) {
    // Detectar innerHTML sin sanitizar
    const scripts = document.querySelectorAll('script:not([src])');
    
    scripts.forEach(script => {
      if (script.textContent.includes('innerHTML') && 
          !script.textContent.includes('DOMPurify')) {
        issues.push({
          severity: 'critical',
          type: 'XSS',
          message: 'Uso de innerHTML sin sanitización',
          element: script,
          recommendation: 'Usar DOMPurify.sanitize() o textContent',
          cwe: 'CWE-79'
        });
      }
    });
  }

  checkSecretsExposure(issues) {
    const allText = document.documentElement.outerHTML;
    
    // Patterns de secrets comunes
    const patterns = [
      { regex: /api[_-]?key[=:]\s*['""]([a-zA-Z0-9_-]{20,})['""]/ gi, name: 'API Key' },
      { regex: /secret[=:]\s*['""]([a-zA-Z0-9_-]{20,})['""]/ gi, name: 'Secret' },
      { regex: /password[=:]\s*['""](.+?)['""]/ gi, name: 'Password' },
      { regex: /token[=:]\s*['""]([a-zA-Z0-9._-]{20,})['""]/ gi, name: 'Token' },
    ];

    patterns.forEach(({ regex, name }) => {
      const matches = allText.matchAll(regex);
      
      for (const match of matches) {
        issues.push({
          severity: 'critical',
          type: 'Secret Exposure',
          message: `${name} expuesta en el código`,
          value: match[1].substring(0, 10) + '...',
          recommendation: 'Usar variables de entorno y nunca hardcodear secrets',
          cwe: 'CWE-798'
        });
      }
    });
  }

  checkInsecureLinks(issues) {
    const links = document.querySelectorAll('a[target="_blank"]');
    
    links.forEach(link => {
      const rel = link.getAttribute('rel') || '';
      
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
        issues.push({
          severity: 'medium',
          type: 'Tabnabbing',
          message: 'Link externo sin rel="noopener noreferrer"',
          element: link,
          fix: () => {
            link.setAttribute('rel', 'noopener noreferrer');
          },
          autoFixable: true
        });
      }
    });
  }

  generateCSP() {
    return {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        connect-src 'self' https://generativelanguage.googleapis.com https://api.vercel.com;
      `.replace(/\s+/g, ' ').trim()
    };
  }
}
```

---

## 🟠 WORKFLOW 4: Deploy & Integrations
**Branch:** `feature/deploy-integrations`  
**Owner:** Dev DevOps  
**Duración:** 15-20 días  
**Archivos principales:** `src/deploy/`, `src/integrations/`

### 4.1 Vercel Deployment Integration
**Días:** 1-12 | **Archivos:** `src/deploy/vercelDeployer.js`

#### Descripción Técnica
Deploy con un click a Vercel usando su REST API.

#### Arquitectura Completa
```javascript
class VercelDeployer {
  constructor() {
    this.apiBaseURL = 'https://api.vercel.com';
    this.apiVersion = 'v13';
    this.token = localStorage.getItem('vercel_token');
    this.teamId = localStorage.getItem('vercel_team_id');
  }

  async deploy(projectName, files) {
    try {
      // Step 1: Upload files
      const uploadedFiles = await this.uploadFiles(files);
      
      // Step 2: Create deployment
      const deployment = await this.createDeployment(projectName, uploadedFiles);
      
      // Step 3: Monitor deployment
      const result = await this.monitorDeployment(deployment.id);
      
      return result;
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }

  async uploadFiles(files) {
    const uploaded = [];

    for (const file of files) {
      const sha = await this.calculateSHA(file.content);
      
      // Verificar si archivo ya existe en Vercel
      const exists = await this.checkFileExists(sha);
      
      if (!exists) {
        await this.uploadFile(file, sha);
      }

      uploaded.push({
        file: file.path,
        sha,
        size: file.content.length
      });
    }

    return uploaded;
  }

  async uploadFile(file, sha) {
    const response = await fetch(`${this.apiBaseURL}/v2/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/octet-stream',
        'x-now-digest': sha,
        'x-now-size': file.content.length.toString()
      },
      body: file.content
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`File upload failed: ${error.error.message}`);
    }

    return await response.json();
  }

  async createDeployment(projectName, files) {
    const deploymentConfig = {
      name: projectName,
      files,
      target: 'production',
      projectSettings: {
        framework: null, // Static site
        buildCommand: null,
        outputDirectory: null,
        installCommand: null
      }
    };

    const url = this.teamId 
      ? `${this.apiBaseURL}/${this.apiVersion}/deployments?teamId=${this.teamId}`
      : `${this.apiBaseURL}/${this.apiVersion}/deployments`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deploymentConfig)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Deployment failed: ${error.error.message}`);
    }

    return await response.json();
  }

  async monitorDeployment(deploymentId) {
    const maxAttempts = 60; // 5 minutos
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getDeploymentStatus(deploymentId);
      
      if (status.readyState === 'READY') {
        return {
          success: true,
          url: `https://${status.url}`,
          deploymentId: status.id
        };
      } else if (status.readyState === 'ERROR') {
        throw new Error('Deployment failed');
      }

      // Update progress
      this.updateProgress(status);

      await this.sleep(5000); // Wait 5 seconds
      attempts++;
    }

    throw new Error('Deployment timeout');
  }

  async getDeploymentStatus(deploymentId) {
    const response = await fetch(
      `${this.apiBaseURL}/v13/deployments/${deploymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );

    return await response.json();
  }

  async calculateSHA(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  prepareFilesForDeploy() {
    const canvas = document.getElementById('canvas');
    const clone = canvas.cloneNode(true);

    // Limpiar elementos del editor
    clone.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.remove('canvas-element', 'selected');
      el.querySelectorAll('.delete-btn, .resize-handles, .drag-handle').forEach(btn => btn.remove());
      el.removeAttribute('draggable');
    });

    // Generar archivos
    const files = [
      {
        path: 'index.html',
        content: this.generateHTML(clone.innerHTML)
      },
      {
        path: 'styles.css',
        content: this.generateCSS()
      },
      {
        path: 'script.js',
        content: this.generateJS()
      },
      {
        path: 'vercel.json',
        content: JSON.stringify({
          version: 2,
          builds: [
            { src: "index.html", use: "@vercel/static" }
          ]
        })
      }
    ];

    return files;
  }

  generateHTML(bodyContent) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title || 'Mi Sitio Web'}</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>
<body>
${bodyContent}
</body>
</html>`;
  }

  generateCSS() {
    // Extraer todos los estilos inline y convertir a CSS externo
    const canvas = document.getElementById('canvas');
    const elements = canvas.querySelectorAll('[style]');
    
    let css = `* { margin: 0; padding: 0; box-sizing: border-box; }\n`;
    css += `body { font-family: system-ui, sans-serif; }\n\n`;

    elements.forEach((el, index) => {
      const className = `auto-style-${index}`;
      el.classList.add(className);
      
      css += `.${className} {\n`;
      css += `  ${el.style.cssText.replace(/;/g, ';\n  ')}`;
      css += `}\n\n`;
    });

    return css;
  }

  generateJS() {
    // JS para componentes interactivos
    return `// Generated by DragNDrop Editor
console.log('Site loaded successfully');
`;
  }
}
```

#### UI Deploy Modal
```html
<div class="deploy-modal">
  <div class="modal-header">
    <h3>🚀 Deploy a Vercel</h3>
    <button class="close-btn">×</button>
  </div>

  <div class="modal-body">
    <!-- Step 1: Config -->
    <div class="deploy-step active" data-step="1">
      <div class="vercel-status">
        ${this.token ? `
          <span class="status-badge connected">✅ Conectado</span>
          <button onclick="disconnectVercel()">Desconectar</button>
        ` : `
          <span class="status-badge not-connected">⚠️ No conectado</span>
          <button class="btn-primary" onclick="connectVercel()">
            Conectar con Vercel
          </button>
        `}
      </div>

      <div class="form-group">
        <label>Nombre del proyecto:</label>
        <input id="deployProjectName" placeholder="my-awesome-site">
        <small>Solo letras, números y guiones</small>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" id="deployProduction" checked>
          Deploy a producción (si no, será preview)
        </label>
      </div>

      <button class="btn btn-primary" onclick="startDeploy()">
        🚀 Iniciar Deploy
      </button>
    </div>

    <!-- Step 2: Deploying -->
    <div class="deploy-step" data-step="2">
      <div class="deploy-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        
        <div class="deploy-logs">
          <div class="log-entry">📦 Preparando archivos...</div>
          <div class="log-entry">⬆️ Subiendo a Vercel...</div>
          <div class="log-entry">🔨 Building...</div>
          <div class="log-entry">✅ Deploy exitoso!</div>
        </div>
      </div>
    </div>

    <!-- Step 3: Success -->
    <div class="deploy-step" data-step="3">
      <div class="deploy-success">
        <div class="success-icon">🎉</div>
        <h3>¡Deploy Exitoso!</h3>
        
        <div class="deploy-urls">
          <div class="url-item">
            <label>URL de Producción:</label>
            <div class="url-box">
              <input readonly id="deployURL" value="">
              <button onclick="copyURL()">📋</button>
              <button onclick="openURL()">🔗</button>
            </div>
          </div>
        </div>

        <div class="deploy-info">
          <p>Deployment ID: <code id="deploymentId"></code></p>
          <p>Tiempo: <span id="deployTime"></span></p>
        </div>

        <button class="btn btn-secondary" onclick="viewInVercel()">
          Ver en Vercel Dashboard
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Vercel OAuth Flow
```javascript
function connectVercel() {
  const clientId = process.env.VERCEL_CLIENT_ID;
  const redirectURI = encodeURIComponent(window.location.origin + '/vercel/callback');
  
  const authURL = `https://vercel.com/integrations/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectURI}&` +
    `response_type=code`;
  
  // Abrir popup
  const popup = window.open(authURL, 'Vercel Auth', 'width=600,height=700');
  
  // Listener para callback
  window.addEventListener('message', async (e) => {
    if (e.data.type === 'vercel-auth') {
      const { code } = e.data;
      
      // Exchange code for token
      const token = await exchangeCodeForToken(code);
      
      localStorage.setItem('vercel_token', token);
      popup.close();
      
      showToast('✅ Conectado con Vercel');
      updateVercelStatus();
    }
  });
}

async function exchangeCodeForToken(code) {
  const response = await fetch('/api/vercel/exchange-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const { access_token } = await response.json();
  return access_token;
}
```

---

### 4.2 Git Integration
**Días:** 13-20 | **Archivos:** `src/integrations/gitIntegration.js`

#### Descripción Técnica
Control de versiones integrado usando isomorphic-git o GitHub API.

#### Stack
```json
{
  "library": "isomorphic-git",
  "fs": "BrowserFS o LightningFS",
  "http": "isomorphic-git http client"
}
```

#### Implementation (Simplified con GitHub API)
```javascript
class GitIntegration {
  constructor() {
    this.githubAPI = 'https://api.github.com';
    this.token = localStorage.getItem('github_token');
    this.currentRepo = null;
    this.currentBranch = 'main';
  }

  async connectGitHub() {
    // OAuth flow similar a Vercel
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectURI = encodeURIComponent(window.location.origin + '/github/callback');
    
    const authURL = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectURI}&` +
      `scope=repo`;
    
    window.location.href = authURL;
  }

  async createRepo(name, description, isPrivate = true) {
    const response = await fetch(`${this.githubAPI}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true
      })
    });

    const repo = await response.json();
    this.currentRepo = repo;
    
    return repo;
  }

  async commit(message, files) {
    if (!this.currentRepo) {
      throw new Error('No repository selected');
    }

    // Get current commit SHA
    const refResponse = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/refs/heads/${this.currentBranch}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    const refData = await refResponse.json();
    const currentCommitSHA = refData.object.sha;

    // Get tree
    const commitResponse = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/commits/${currentCommitSHA}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    const commitData = await commitResponse.json();
    const baseTreeSHA = commitData.tree.sha;

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(file => this.createBlob(file.content))
    );

    // Create tree
    const tree = await this.createTree(
      baseTreeSHA,
      files.map((file, i) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobs[i]
      }))
    );

    // Create commit
    const newCommit = await this.createCommit(message, tree, currentCommitSHA);

    // Update reference
    await this.updateRef(newCommit);

    return newCommit;
  }

  async createBlob(content) {
    const response = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/blobs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: btoa(content),
          encoding: 'base64'
        })
      }
    );

    const blob = await response.json();
    return blob.sha;
  }

  async createTree(baseTree, files) {
    const response = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base_tree: baseTree,
          tree: files
        })
      }
    );

    const tree = await response.json();
    return tree.sha;
  }

  async createCommit(message, treeSHA, parentSHA) {
    const response = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          tree: treeSHA,
          parents: [parentSHA]
        })
      }
    );

    const commit = await response.json();
    return commit.sha;
  }

  async updateRef(commitSHA) {
    const response = await fetch(
      `${this.githubAPI}/repos/${this.currentRepo.full_name}/git/refs/heads/${this.currentBranch}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sha: commitSHA,
          force: false
        })
      }
    );

    return await response.json();
  }

  calculateSHA(content) {
    // Implement SHA-1 hash
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 🔄 Merge Strategy

### Frecuencia de Merge
- **Diario**: Push a branch propio
- **Cada 2-3 días**: Merge local de `main` a tu branch
- **Cada semana**: Pull Request para review
- **Al completar feature**: Merge final a `main`

### Protocolo de Merge Local
```bash
# Workflow diario
git checkout feature/ui-core
git add .
git commit -m "feat: layers panel progress"
git push origin feature/ui-core

# Cada 2-3 días: sincronizar con main
git checkout main
git pull origin main
git checkout feature/ui-core
git merge main
# Resolver conflictos si los hay
git push origin feature/ui-core
```

### Zonas de Potencial Conflicto

#### ❌ ALTO RIESGO (evitar modificar simultáneamente)
- `index.html` - Toolbar y estructura principal
- `script.js` - Funciones globales
- `style.css` - CSS global

#### 🟡 MEDIO RIESGO (coordinar)
- `src/core/` - Nuevos archivos OK, modificar existentes coordinar
- `package.json` - Comunicar antes de agregar dependencias

#### ✅ BAJO RIESGO (independientes)
- `src/ai/*` - Workflow 2
- `backend/*` - Workflow 3
- `src/deploy/*` - Workflow 4
- `src/components/*` - Cada uno su componente
- `src/styles/*` - Archivos CSS modulares

### API Contracts (Definir ANTES de empezar)

```javascript
// ============================================
// CONTRACTS - NO MODIFICAR SIN CONSENSO
// ============================================

// Global Objects que TODOS pueden usar
window.selectElement(element);        // Workflow 1 provee
window.showToast(message, type);      // Core provee
window.createComponent(type);         // Core provee

// Events que TODOS pueden escuchar
window.addEventListener('element:selected', (e) => {
  // e.detail = { element, elementId }
});

window.addEventListener('element:updated', (e) => {
  // e.detail = { element, property, value }
});

window.addEventListener('project:saved', (e) => {
  // e.detail = { projectId, timestamp }
});

// API Client (Workflow 3 provee)
window.apiClient.getProjects();
window.apiClient.createProject(data);
window.apiClient.updateProject(id, data);

// Auth (Workflow 3 provee)
window.authClient.getSession();
window.authClient.signIn.email({ email, password });
window.authClient.signOut();

// Session Manager (Workflow 3 provee)
window.sessionManager.isAuthenticated();
window.sessionManager.getUser();

// Deploy (Workflow 4 provee)
window.vercelDeployer.deploy(name, files);
window.gitIntegration.commit(message, files);

// AI (Workflow 2 provee)
window.aiComponentGenerator.generate(description, options);
window.accessibilityChecker.scan();
window.seoOptimizer.analyze();

// Layers (Workflow 1 provee)
window.layersManager.selectLayer(id);
window.multiSelectManager.selectMultiple(ids);
```

---

## 📦 Dependencies por Workflow

### Workflow 1 (UI/UX)
```json
{
  "dependencies": {
    "sortablejs": "^1.15.0"
  }
}
```

### Workflow 2 (AI)
```json
{
  "dependencies": {}
}
```
Solo Fetch API nativa.

### Workflow 3 (Backend/Auth)
```json
{
  "dependencies": {
    "better-auth": "^1.0.0",
    "drizzle-orm": "^0.36.0",
    "postgres": "^3.4.0",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28.0"
  }
}
```

### Workflow 4 (Deploy)
```json
{
  "dependencies": {
    "jszip": "^3.10.0"
  }
}
```

---

## 🧪 Testing Strategy

### Por Workflow
```bash
# Workflow 1
npm run test:ui

# Workflow 2
npm run test:ai

# Workflow 3
npm run test:backend

# Workflow 4
npm run test:deploy

# Integration tests (todos los workflows)
npm run test:integration
```

### Test Coverage Mínimo
- **Unit tests**: 70%
- **Integration tests**: 50%
- **E2E critical paths**: 100%

---

## 📅 Timeline Estimado

```
Semana 1-2:   Workflow 1 (Layers) + Workflow 3 (Auth setup)
Semana 3-4:   Workflow 1 (Multi-select) + Workflow 2 (Component Gen)
Semana 5-6:   Workflow 2 (A11y) + Workflow 4 (Vercel)
Semana 7-8:   Workflow 1 (Inspector) + Workflow 2 (SEO)
Semana 9-10:  Integration + Testing + Bug fixes
Semana 11-12: Polish + Documentation + Launch prep
```

---

## ✅ Definition of Done

### Por Feature
- ✅ Código implementado y funcional
- ✅ Tests unitarios pasando (coverage >70%)
- ✅ Documentación JSDoc completa
- ✅ UI/UX revisada y aprobada
- ✅ Performance test pasando (Lighthouse >85)
- ✅ Security scan sin issues críticos
- ✅ Code review aprobado
- ✅ Merged a main

### Para v1.0
- ✅ Todos los MUST-HAVE completados
- ✅ E2E tests pasando 100%
- ✅ Beta testing con 10+ usuarios
- ✅ Documentation completa
- ✅ Deployment pipeline funcionando
- ✅ Rollback plan documentado
- ✅ Monitoring configurado

---

## 🚀 Quick Start Para Cada Workflow

### Workflow 1: UI/UX
```bash
git checkout -b feature/ui-core
mkdir -p src/core src/components/layers src/styles
touch src/core/layersManager.js
npm run dev
# Desarrollar...
npm run test:ui
git add .
git commit -m "feat(layers): implement layers panel"
git push origin feature/ui-core
```

### Workflow 2: AI
```bash
git checkout -b feature/ai-smart
mkdir -p src/ai
touch src/ai/componentGenerator.js
# Configurar Gemini API key
npm run dev
# Desarrollar...
npm run test:ai
git push origin feature/ai-smart
```

### Workflow 3: Backend/Auth
```bash
git checkout -b feature/backend-auth
mkdir -p backend/auth backend/db backend/api
npm install better-auth drizzle-orm postgres express cors
touch backend/server.js backend/auth/config.js
npx drizzle-kit generate
npx drizzle-kit migrate
node backend/server.js
# Desarrollar...
npm run test:backend
git push origin feature/backend-auth
```

### Workflow 4: Deploy
```bash
git checkout -b feature/deploy-integrations
mkdir -p src/deploy src/integrations
touch src/deploy/vercelDeployer.js
npm run dev
# Desarrollar...
npm run test:deploy
git push origin feature/deploy-integrations
```

---

## 📊 Tracking Progress

### GitHub Projects
Crear 4 project boards:
1. **UI/UX Core**
2. **AI & Smart Features**
3. **Backend & Auth**
4. **Deploy & Integrations**

### Daily Standup (Async)
Cada dev postea en Slack/Discord:
- ✅ Completado ayer
- 🚧 Trabajando hoy
- ⚠️ Blockers

### Weekly Demo
Viernes: Demo de features completadas

---

## 🎯 Next Steps

1. **Crear branches** en GitHub
2. **Asignar workflows** a desarrolladores
3. **Definir API contracts** en reunión kickoff
4. **Setup environment** (.env files, database, etc.)
5. **Primera semana**: Foundation de cada workflow
6. **Primer merge**: Semana 2

**¿Listo para empezar? ¿Qué workflow atacas primero?**
