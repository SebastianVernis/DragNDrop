# 🔧 Especificaciones Técnicas Detalladas - v1.0

## 📐 Arquitectura General del Sistema

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Canvas  │  │  Layers  │  │Properties│  │Toolbar  │ │
│  │  Panel   │  │  Panel   │  │  Panel   │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Layers  │  │  Multi   │  │ Enhanced │  │ Resize  │ │
│  │ Manager  │  │  Select  │  │ DragDrop │  │ Manager │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Component │  │   A11y   │  │   SEO    │  │  Gemini │ │
│  │Generator │  │ Checker  │  │Optimizer │  │Validator│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Auth   │  │   API    │  │  Cloud   │  │  Deploy │ │
│  │ Service  │  │  Client  │  │   Sync   │  │ Service │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Gemini  │  │  Vercel  │  │  GitHub  │  │  Better │ │
│  │   API    │  │   API    │  │   API    │  │   Auth  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────────────────────────┐
│                      API GATEWAY                         │
│              Express.js + CORS + Rate Limiting           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   AUTHENTICATION                         │
│                    Better Auth                           │
│        ┌────────┐  ┌────────┐  ┌────────┐              │
│        │ Email/ │  │ Google │  │ GitHub │              │
│        │Password│  │  OAuth │  │  OAuth │              │
│        └────────┘  └────────┘  └────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Projects  │  │Components│  │ Deploy   │  │  Users  │ │
│  │  CRUD    │  │  Library │  │ Handler  │  │  Mgmt   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                     │
│                     Drizzle ORM                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                       DATABASE                           │
│              PostgreSQL (Supabase)                       │
│   ┌──────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│   │Users │  │Sessions │  │ Projects │  │Components │  │
│   └──────┘  └─────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Sistema de Layers - Especificación Completa

### Data Models

```typescript
interface Layer {
  id: string;
  elementId: string;
  name: string;
  type: string; // 'div', 'section', 'img', etc.
  icon: string; // emoji
  depth: number;
  parent: string | null;
  children: string[];
  isLocked: boolean;
  isHidden: boolean;
  isCollapsed: boolean;
  order: number;
}

interface LayerTree {
  root: Layer;
  layers: Map<string, Layer>;
  selectedIds: Set<string>;
  expandedIds: Set<string>;
}
```

### State Management
```javascript
class LayersState {
  constructor() {
    this.tree = null;
    this.selectedIds = new Set();
    this.expandedIds = new Set();
    this.lockedIds = new Set();
    this.hiddenIds = new Set();
    this.subscribers = new Set();
  }

  // State mutations
  selectLayer(id, isMultiSelect = false) {
    if (!isMultiSelect) {
      this.selectedIds.clear();
    }
    this.selectedIds.add(id);
    this.notify('selection');
  }

  toggleExpanded(id) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
    this.notify('expand');
  }

  // Subscribe to changes
  subscribe(callback, event = 'all') {
    this.subscribers.add({ callback, event });
  }

  notify(event) {
    this.subscribers.forEach(sub => {
      if (sub.event === 'all' || sub.event === event) {
        sub.callback(this.getState(), event);
      }
    });
  }

  getState() {
    return {
      tree: this.tree,
      selectedIds: Array.from(this.selectedIds),
      expandedIds: Array.from(this.expandedIds),
      lockedIds: Array.from(this.lockedIds),
      hiddenIds: Array.from(this.hiddenIds)
    };
  }
}
```

### Performance Optimizations

**A. Virtual Scrolling para >1000 elementos**
```javascript
class VirtualLayersList {
  constructor(container, items, rowHeight = 32) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.scrollTop = 0;
    
    this.init();
  }

  init() {
    this.container.style.height = (this.items.length * this.rowHeight) + 'px';
    this.container.style.position = 'relative';
    
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.render();
    });
    
    this.render();
  }

  render() {
    const containerHeight = this.container.clientHeight;
    
    this.visibleStart = Math.floor(this.scrollTop / this.rowHeight);
    this.visibleEnd = Math.ceil((this.scrollTop + containerHeight) / this.rowHeight);
    
    // Buffer para smooth scrolling
    const bufferSize = 5;
    const start = Math.max(0, this.visibleStart - bufferSize);
    const end = Math.min(this.items.length, this.visibleEnd + bufferSize);
    
    // Renderizar solo items visibles
    const visibleItems = this.items.slice(start, end);
    
    this.container.innerHTML = visibleItems
      .map((item, index) => {
        const actualIndex = start + index;
        return this.renderItem(item, actualIndex);
      })
      .join('');
  }

  renderItem(item, index) {
    const top = index * this.rowHeight;
    
    return `
      <div class="layer-node" 
           style="position: absolute; top: ${top}px; left: 0; right: 0; height: ${this.rowHeight}px;"
           data-id="${item.id}">
        ${item.content}
      </div>
    `;
  }
}
```

**B. Debounced DOM Observer**
```javascript
class DebouncedDOMObserver {
  constructor(callback, delay = 300) {
    this.callback = callback;
    this.delay = delay;
    this.timeout = null;
    this.observer = null;
  }

  observe(target) {
    this.observer = new MutationObserver((mutations) => {
      clearTimeout(this.timeout);
      
      this.timeout = setTimeout(() => {
        this.callback(mutations);
      }, this.delay);
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class', 'style']
    });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      clearTimeout(this.timeout);
    }
  }
}
```

---

## 🎯 Multi-Selección - Especificación Completa

### Keyboard Shortcuts
```javascript
const multiSelectShortcuts = {
  'Ctrl+A': 'selectAll',           // Seleccionar todos
  'Ctrl+Shift+A': 'selectNone',    // Deseleccionar todos
  'Ctrl+G': 'groupSelected',       // Agrupar
  'Ctrl+Shift+G': 'ungroupSelected', // Desagrupar
  'Ctrl+D': 'duplicateSelected',   // Duplicar
  'Delete': 'deleteSelected',       // Eliminar
  
  // Alignment
  'Ctrl+Shift+L': 'alignLeft',
  'Ctrl+Shift+C': 'alignCenter',
  'Ctrl+Shift+R': 'alignRight',
  'Ctrl+Shift+T': 'alignTop',
  'Ctrl+Shift+M': 'alignMiddle',
  'Ctrl+Shift+B': 'alignBottom',
  
  // Distribution
  'Ctrl+Shift+H': 'distributeHorizontally',
  'Ctrl+Shift+V': 'distributeVertically'
};
```

### Alignment Algorithms

**A. Smart Guides (Figma-style)**
```javascript
class SmartGuides {
  constructor() {
    this.guides = [];
    this.snapThreshold = 5; // px
    this.guidesContainer = this.createGuidesContainer();
  }

  calculateGuides(movingElement, staticElements) {
    const guides = [];
    const movingRect = movingElement.getBoundingClientRect();
    
    staticElements.forEach(staticEl => {
      const staticRect = staticEl.getBoundingClientRect();
      
      // Vertical guides
      // Left edges
      if (Math.abs(movingRect.left - staticRect.left) < this.snapThreshold) {
        guides.push({
          type: 'vertical',
          position: staticRect.left,
          label: 'Left',
          color: '#ff0000'
        });
      }
      
      // Centers
      const movingCenter = movingRect.left + movingRect.width / 2;
      const staticCenter = staticRect.left + staticRect.width / 2;
      
      if (Math.abs(movingCenter - staticCenter) < this.snapThreshold) {
        guides.push({
          type: 'vertical',
          position: staticCenter,
          label: 'Center',
          color: '#ff00ff'
        });
      }
      
      // Right edges
      if (Math.abs(movingRect.right - staticRect.right) < this.snapThreshold) {
        guides.push({
          type: 'vertical',
          position: staticRect.right,
          label: 'Right',
          color: '#ff0000'
        });
      }
      
      // Horizontal guides (similar logic)
      // ...
    });
    
    return guides;
  }

  showGuides(guides) {
    this.clearGuides();
    
    guides.forEach(guide => {
      const line = document.createElement('div');
      line.className = 'smart-guide';
      line.style.cssText = `
        position: fixed;
        ${guide.type === 'vertical' ? `
          left: ${guide.position}px;
          top: 0;
          width: 1px;
          height: 100vh;
        ` : `
          top: ${guide.position}px;
          left: 0;
          width: 100vw;
          height: 1px;
        `}
        background: ${guide.color};
        z-index: 9999;
        pointer-events: none;
      `;
      
      this.guidesContainer.appendChild(line);
    });
  }

  snapToGuide(element, guide) {
    const rect = element.getBoundingClientRect();
    
    if (guide.type === 'vertical') {
      if (guide.label === 'Left') {
        element.style.left = guide.position + 'px';
      } else if (guide.label === 'Center') {
        element.style.left = (guide.position - rect.width / 2) + 'px';
      } else if (guide.label === 'Right') {
        element.style.left = (guide.position - rect.width) + 'px';
      }
    } else {
      // Horizontal snapping logic
    }
  }
}
```

**B. Distribution Algorithm**
```javascript
class DistributionEngine {
  distributeHorizontally(elements) {
    // Ordenar por posición X
    const sorted = elements.sort((a, b) => {
      return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
    });

    const first = sorted[0].getBoundingClientRect();
    const last = sorted[sorted.length - 1].getBoundingClientRect();
    
    // Calcular espacio total disponible
    const totalSpace = last.right - first.left;
    
    // Calcular ancho total de elementos
    const totalWidth = sorted.reduce((sum, el) => {
      return sum + el.getBoundingClientRect().width;
    }, 0);
    
    // Calcular espacio entre elementos
    const gaps = sorted.length - 1;
    const gapSize = (totalSpace - totalWidth) / gaps;
    
    // Aplicar distribución
    let currentX = first.left;
    
    sorted.forEach((el, index) => {
      if (index > 0) {
        el.style.position = 'absolute';
        el.style.left = currentX + 'px';
      }
      
      currentX += el.getBoundingClientRect().width + gapSize;
    });
  }

  distributeVertically(elements) {
    // Similar logic para eje Y
  }

  distributeEvenly(elements, direction = 'horizontal') {
    // Distribuir con espaciado igual entre centros
    const sorted = elements.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      
      return direction === 'horizontal'
        ? (rectA.left + rectA.width / 2) - (rectB.left + rectB.width / 2)
        : (rectA.top + rectA.height / 2) - (rectB.top + rectB.height / 2);
    });

    const first = sorted[0].getBoundingClientRect();
    const last = sorted[sorted.length - 1].getBoundingClientRect();
    
    const totalDistance = direction === 'horizontal'
      ? (last.left + last.width / 2) - (first.left + first.width / 2)
      : (last.top + last.height / 2) - (first.top + first.height / 2);
    
    const spacing = totalDistance / (sorted.length - 1);
    
    sorted.forEach((el, index) => {
      if (index > 0 && index < sorted.length - 1) {
        const center = direction === 'horizontal'
          ? first.left + first.width / 2 + (spacing * index)
          : first.top + first.height / 2 + (spacing * index);
        
        const rect = el.getBoundingClientRect();
        
        if (direction === 'horizontal') {
          el.style.left = (center - rect.width / 2) + 'px';
        } else {
          el.style.top = (center - rect.height / 2) + 'px';
        }
      }
    });
  }
}
```

---

## 🧠 AI Component Generator - Especificación Completa

### Prompt Engineering Best Practices

**Template Structure**
```javascript
const componentPromptTemplate = {
  system: `You are an expert web developer specializing in creating beautiful, accessible, and responsive HTML components.

Your output must:
- Be valid HTML5 with semantic tags
- Include only inline CSS (no external stylesheets)
- Be production-ready and pixel-perfect
- Follow WCAG 2.1 AA accessibility guidelines
- Be mobile-first responsive
- Use modern CSS (flexbox, grid, custom properties)

IMPORTANT: Return ONLY the HTML code. No explanations, no markdown, no code blocks.`,

  user: (description, style, options) => `Create a ${style} component for: ${description}

Style characteristics for "${style}":
${styleDefinitions[style]}

Requirements:
- Semantic HTML5 elements
- Inline CSS only
- ${options.responsive ? 'Mobile-first (320px+), responsive up to 1920px' : 'Fixed width'}
- ${options.accessibility ? 'ARIA labels, semantic structure, keyboard navigation' : ''}
- ${options.interactive ? 'Include minimal vanilla JS for interactions in <script> tag' : 'No JavaScript'}
- Color scheme: ${options.colors || 'Modern and professional'}
- Font: ${options.font || 'System fonts'}

Constraints:
- Max 300 lines of code
- Inline styles only (style="...")
- No external dependencies
- No Lorem Ipsum (use real example text)
- Production-ready quality

Return ONLY the HTML code starting with the opening tag.`
};

const styleDefinitions = {
  modern: `
    - Clean lines and minimal design
    - Gradients (subtle, 135deg)
    - Box shadows (0 4px 6px rgba(0,0,0,0.1))
    - Border radius (6-8px)
    - Colors: Blues (#2563eb, #3b82f6), neutrals
    - Sans-serif fonts
    - Ample whitespace
  `,
  classic: `
    - Traditional and professional
    - Serif fonts for headings
    - Borders instead of shadows
    - Conservative color palette (navy, gray, white)
    - Formal spacing
    - Minimal border radius (0-2px)
  `,
  playful: `
    - Bright, vibrant colors
    - Large border radius (12-20px)
    - Fun illustrations/emojis
    - Bouncy animations
    - Colorful gradients
    - Rounded, friendly fonts
  `,
  minimal: `
    - Black and white only
    - Maximum whitespace
    - No decorations or effects
    - Simple typography
    - No shadows
    - Clean lines
  `,
  corporate: `
    - Professional blues and grays
    - Formal typography
    - Structured layouts
    - Conservative design
    - Trust-inspiring
    - Business-appropriate
  `
};
```

### Response Parsing
```javascript
class ResponseParser {
  extractHTML(geminiResponse) {
    try {
      const text = geminiResponse.candidates[0].content.parts[0].text;
      
      // Limpiar markdown si existe
      let html = text
        .replace(/```html\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Validar que es HTML válido
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      if (doc.querySelector('parsererror')) {
        throw new Error('HTML inválido generado');
      }
      
      return html;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('No se pudo parsear la respuesta de IA');
    }
  }

  extractCSS(html) {
    // Extraer estilos inline para preview separado
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('[style]');
    
    let css = '';
    elementsWithStyle.forEach((el, index) => {
      const className = `generated-${index}`;
      css += `.${className} {\n${el.style.cssText}\n}\n\n`;
    });
    
    return css;
  }

  extractJS(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script');
    
    return Array.from(scripts)
      .map(s => s.textContent)
      .join('\n\n');
  }
}
```

### Refinement Engine
```javascript
class RefinementEngine {
  async refineComponent(originalHTML, feedback, iterations = 0) {
    const MAX_ITERATIONS = 3;
    
    if (iterations >= MAX_ITERATIONS) {
      throw new Error('Max refinement iterations reached');
    }

    const prompt = `Improve this HTML component based on user feedback.

Current component:
${originalHTML.substring(0, 1500)}

User feedback: "${feedback}"

Instructions:
- Make ONLY the changes requested
- Keep the same overall structure
- Maintain inline CSS style
- Return ONLY the improved HTML code

Return the complete improved component.`;

    const result = await this.callGemini(prompt, {
      temperature: 0.5, // Más determinista para refinamiento
      maxOutputTokens: 2048
    });

    return result;
  }

  async generateVariations(originalHTML, count = 3) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const prompt = `Create a variation of this component with a different ${['color scheme', 'layout', 'style'][i]}:

${originalHTML.substring(0, 1500)}

Keep the same content but change the ${['colors and backgrounds', 'element positioning', 'visual design'][i]}.
Return ONLY the HTML code.`;

      const variation = await this.callGemini(prompt, {
        temperature: 0.8, // Más creativo para variaciones
        maxOutputTokens: 2048
      });

      variations.push({
        html: variation,
        type: ['color', 'layout', 'style'][i]
      });
    }

    return variations;
  }
}
```

### Cost Management
```javascript
class AITokenTracker {
  constructor() {
    this.usage = {
      today: 0,
      thisMonth: 0,
      total: 0
    };
    
    this.limits = {
      dailyTokens: 100000,  // 100k tokens/día
      monthlyCost: 10       // $10/mes
    };
    
    this.loadUsage();
  }

  trackUsage(tokensUsed) {
    const cost = this.calculateCost(tokensUsed);
    
    this.usage.today += tokensUsed;
    this.usage.thisMonth += tokensUsed;
    this.usage.total += tokensUsed;
    
    this.saveUsage();
    this.checkLimits();
    
    return {
      tokens: tokensUsed,
      cost,
      remaining: this.limits.dailyTokens - this.usage.today
    };
  }

  calculateCost(tokens) {
    // gemini-2.0-flash-lite pricing
    const inputCost = 0.075 / 1000000;  // $0.075 per 1M tokens
    const outputCost = 0.30 / 1000000;  // $0.30 per 1M tokens
    
    // Aproximación: 70% input, 30% output
    return (tokens * 0.7 * inputCost) + (tokens * 0.3 * outputCost);
  }

  checkLimits() {
    if (this.usage.today >= this.limits.dailyTokens) {
      this.showLimitWarning();
      return false;
    }
    
    const costThisMonth = this.calculateCost(this.usage.thisMonth);
    if (costThisMonth >= this.limits.monthlyCost) {
      this.showCostWarning();
      return false;
    }
    
    return true;
  }

  showUsageDashboard() {
    const costToday = this.calculateCost(this.usage.today);
    const costMonth = this.calculateCost(this.usage.thisMonth);
    
    return `
      <div class="ai-usage-dashboard">
        <h4>📊 Uso de IA</h4>
        
        <div class="usage-stats">
          <div class="stat">
            <label>Hoy:</label>
            <span>${this.usage.today.toLocaleString()} tokens</span>
            <span class="cost">~$${costToday.toFixed(4)}</span>
          </div>

          <div class="stat">
            <label>Este mes:</label>
            <span>${this.usage.thisMonth.toLocaleString()} tokens</span>
            <span class="cost">~$${costMonth.toFixed(2)}</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" 
                 style="width: ${(costMonth / this.limits.monthlyCost) * 100}%">
            </div>
          </div>
          <small>${((costMonth / this.limits.monthlyCost) * 100).toFixed(1)}% del límite mensual</small>
        </div>
      </div>
    `;
  }
}
```

---

## 🔐 Security - Especificación Completa

### Content Security Policy Generator
```javascript
class CSPGenerator {
  generatePolicy(options = {}) {
    const {
      allowInlineScripts = false,
      allowInlineStyles = true,
      allowedDomains = [],
      reportOnly = false
    } = options;

    const policy = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        ...(allowInlineScripts ? ["'unsafe-inline'"] : []),
        'https://generativelanguage.googleapis.com'
      ],
      'style-src': [
        "'self'",
        ...(allowInlineStyles ? ["'unsafe-inline'"] : [])
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        ...allowedDomains
      ],
      'font-src': ["'self'", 'data:'],
      'connect-src': [
        "'self'",
        'https://generativelanguage.googleapis.com',
        'https://api.vercel.com',
        'https://api.github.com',
        ...allowedDomains
      ],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };

    const policyString = Object.entries(policy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');

    const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';

    return {
      [headerName]: policyString
    };
  }

  injectCSPMeta(policy) {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', policy['Content-Security-Policy']);
    document.head.appendChild(meta);
  }
}
```

### XSS Prevention
```javascript
class XSSPrevention {
  sanitizeHTML(html) {
    // Implementar sanitización básica sin DOMPurify
    const temp = document.createElement('div');
    temp.textContent = html; // Escapa automáticamente
    
    return temp.innerHTML;
  }

  sanitizeAttribute(value) {
    return value
      .replace(/[<>'"]/g, char => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        };
        return entities[char];
      });
  }

  validateURL(url) {
    try {
      const parsed = new URL(url);
      
      // Solo permitir http/https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 🚀 Vercel Deployer - Especificación Completa

### Complete Deployment Flow

```javascript
class CompleteVercelDeployment {
  async deployProject(projectName) {
    const steps = [
      { name: 'Preparando archivos', progress: 0 },
      { name: 'Subiendo a Vercel', progress: 20 },
      { name: 'Creando deployment', progress: 40 },
      { name: 'Building', progress: 60 },
      { name: 'Deployando', progress: 80 },
      { name: 'Verificando', progress: 90 },
      { name: 'Completado', progress: 100 }
    ];

    const deploymentId = Date.now();
    
    try {
      // Step 1: Prepare files
      this.updateProgress(steps[0]);
      const files = this.prepareFilesForDeploy();
      
      // Step 2: Upload files
      this.updateProgress(steps[1]);
      const uploadedFiles = await this.uploadFiles(files);
      
      // Step 3: Create deployment
      this.updateProgress(steps[2]);
      const deployment = await this.createDeployment(projectName, uploadedFiles);
      
      // Step 4-6: Monitor until ready
      for (let i = 3; i < steps.length; i++) {
        this.updateProgress(steps[i]);
        await this.sleep(2000);
      }
      
      const result = await this.monitorDeployment(deployment.id);
      
      // Save deployment history
      this.saveDeploymentHistory({
        id: deploymentId,
        projectName,
        url: result.url,
        timestamp: Date.now(),
        status: 'success'
      });
      
      return result;

    } catch (error) {
      this.saveDeploymentHistory({
        id: deploymentId,
        projectName,
        error: error.message,
        timestamp: Date.now(),
        status: 'failed'
      });
      
      throw error;
    }
  }

  updateProgress(step) {
    const modal = document.getElementById('deployModal');
    const progressBar = modal.querySelector('.progress-fill');
    const logEntry = document.createElement('div');
    
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
      <span class="log-icon">${step.progress === 100 ? '✅' : '⏳'}</span>
      <span class="log-text">${step.name}</span>
    `;
    
    modal.querySelector('.deploy-logs').appendChild(logEntry);
    progressBar.style.width = step.progress + '%';
  }

  saveDeploymentHistory(deployment) {
    const history = JSON.parse(localStorage.getItem('deployment_history') || '[]');
    history.unshift(deployment);
    
    // Mantener solo últimos 20
    if (history.length > 20) {
      history.length = 20;
    }
    
    localStorage.setItem('deployment_history', JSON.stringify(history));
  }

  showDeploymentHistory() {
    const history = JSON.parse(localStorage.getItem('deployment_history') || '[]');
    
    const modal = `
      <div class="deployment-history-modal">
        <h3>📜 Historial de Deployments</h3>
        
        <div class="history-list">
          ${history.map(d => `
            <div class="history-item ${d.status}">
              <div class="item-header">
                <span class="status-icon">${d.status === 'success' ? '✅' : '❌'}</span>
                <span class="project-name">${d.projectName}</span>
                <span class="timestamp">${new Date(d.timestamp).toLocaleString()}</span>
              </div>
              
              ${d.status === 'success' ? `
                <div class="item-body">
                  <a href="${d.url}" target="_blank">${d.url}</a>
                  <button onclick="copyURL('${d.url}')">📋</button>
                </div>
              ` : `
                <div class="item-error">
                  <small>Error: ${d.error}</small>
                </div>
              `}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    return modal;
  }
}
```

### Environment Variables Management
```javascript
class EnvVarsManager {
  async setEnvVar(projectId, key, value, target = 'production') {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/env`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          value,
          type: 'encrypted',
          target: [target]
        })
      }
    );

    return await response.json();
  }

  async getEnvVars(projectId) {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/env`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );

    return await response.json();
  }
}
```

---

## 📊 Database Schema Complete

### Extended Schema
```javascript
// backend/db/schema.js
import { pgTable, text, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";

// Better Auth tables (ya definidas arriba)
export const user = pgTable("user", { /* ... */ });
export const session = pgTable("session", { /* ... */ });
export const account = pgTable("account", { /* ... */ });
export const verification = pgTable("verification", { /* ... */ });

// App-specific tables
export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  
  // Project data
  data: json("data").notNull(), // Estructura completa del proyecto
  thumbnail: text("thumbnail"), // Base64 or URL
  
  // Metadata
  version: integer("version").default(1),
  isPublic: boolean("isPublic").default(false),
  isTemplate: boolean("isTemplate").default(false),
  
  // Stats
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  forks: integer("forks").default(0),
  
  // Deployment
  lastDeployedURL: text("lastDeployedURL"),
  lastDeployedAt: timestamp("lastDeployedAt"),
  deploymentProvider: text("deploymentProvider"), // vercel, netlify, etc.
  
  // Timestamps
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const component = pgTable("component", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  
  // Component code
  html: text("html").notNull(),
  css: text("css"),
  js: text("js"),
  
  // Classification
  category: text("category"), // layout, form, navigation, etc.
  tags: json("tags"), // ['responsive', 'dark-mode', ...]
  framework: text("framework").default("vanilla"), // vanilla, react, vue
  
  // Metadata
  isPublic: boolean("isPublic").default(false),
  isAIGenerated: boolean("isAIGenerated").default(false),
  
  // Stats
  downloads: integer("downloads").default(0),
  likes: integer("likes").default(0),
  
  // Preview
  thumbnail: text("thumbnail"),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const projectVersion = pgTable("projectVersion", {
  id: text("id").primaryKey(),
  projectId: text("projectId")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  
  version: integer("version").notNull(),
  data: json("data").notNull(),
  changelog: text("changelog"),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id),
});

export const deployment = pgTable("deployment", {
  id: text("id").primaryKey(),
  projectId: text("projectId")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  
  provider: text("provider").notNull(), // vercel, netlify, etc.
  providerDeploymentId: text("providerDeploymentId"),
  
  url: text("url").notNull(),
  status: text("status").notNull(), // pending, building, ready, error
  
  buildLogs: text("buildLogs"),
  errorMessage: text("errorMessage"),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
});

export const aiUsage = pgTable("aiUsage", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  
  feature: text("feature").notNull(), // component-generation, validation, seo, etc.
  tokensUsed: integer("tokensUsed").notNull(),
  cost: integer("cost").notNull(), // en centavos
  
  prompt: text("prompt"),
  response: text("response"),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
```

### Migrations
```sql
-- migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "plan" TEXT NOT NULL DEFAULT 'free',
  "projectsQuota" INTEGER NOT NULL DEFAULT 10,
  "storageUsed" INTEGER NOT NULL DEFAULT 0
);

-- ... resto de tablas
```

---

## 🎓 Interactive Tutorial - Especificación

### Tutorial Steps Definition
```javascript
const tutorialSteps = [
  {
    id: 'welcome',
    title: '👋 Bienvenido al Editor',
    description: 'Aprende a crear páginas web visualmente',
    target: null,
    position: 'center',
    actions: [
      { label: 'Comenzar Tutorial', action: 'next' },
      { label: 'Saltar Tutorial', action: 'skip' }
    ]
  },
  {
    id: 'components-panel',
    title: '🧩 Panel de Componentes',
    description: 'Arrastra componentes desde aquí al canvas',
    target: '.components-panel',
    position: 'right',
    highlight: true,
    action: {
      type: 'drag',
      from: '.component-item[data-type="h1"]',
      to: '#canvas',
      instruction: 'Arrastra el "Título H1" al canvas'
    }
  },
  {
    id: 'select-element',
    title: '🎯 Seleccionar Elementos',
    description: 'Haz clic en un elemento para seleccionarlo',
    target: '#canvas .canvas-element:first-child',
    position: 'top',
    action: {
      type: 'click',
      target: '#canvas .canvas-element:first-child',
      instruction: 'Haz clic en el elemento que acabas de crear'
    }
  },
  {
    id: 'properties-panel',
    title: '⚙️ Panel de Propiedades',
    description: 'Edita los estilos del elemento seleccionado',
    target: '.properties-panel',
    position: 'left',
    highlight: true
  },
  {
    id: 'edit-text',
    title: '✏️ Editar Texto',
    description: 'Doble clic para editar el texto directamente',
    target: '#canvas .canvas-element:first-child',
    action: {
      type: 'dblclick',
      target: '#canvas .canvas-element:first-child',
      instruction: 'Haz doble clic para editar'
    }
  },
  {
    id: 'resize',
    title: '📐 Redimensionar',
    description: 'Usa los handles para cambiar el tamaño',
    target: '.resize-handle',
    position: 'bottom'
  },
  {
    id: 'layers',
    title: '📚 Panel de Capas',
    description: 'Visualiza la jerarquía de elementos',
    target: '.layers-panel',
    position: 'right',
    highlight: true
  },
  {
    id: 'undo-redo',
    title: '↶↷ Deshacer/Rehacer',
    description: 'Usa Ctrl+Z y Ctrl+Y para deshacer cambios',
    target: '#undoBtn',
    position: 'bottom'
  },
  {
    id: 'export',
    title: '📥 Exportar',
    description: 'Descarga tu HTML completo',
    target: 'button[onclick="exportHTML()"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: '🎉 ¡Completado!',
    description: 'Ya sabes lo básico. ¡Explora más funciones!',
    target: null,
    position: 'center',
    actions: [
      { label: 'Ver Video Tutorials', action: 'videos' },
      { label: 'Explorar Features', action: 'features' },
      { label: 'Comenzar a Crear', action: 'start' }
    ]
  }
];
```

### Tutorial Engine
```javascript
class TutorialEngine {
  constructor(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.completed = false;
    this.overlay = null;
    this.tooltip = null;
    this.spotlight = null;
  }

  start() {
    // Crear overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    document.body.appendChild(this.overlay);
    
    // Mostrar primer paso
    this.showStep(0);
  }

  showStep(index) {
    if (index >= this.steps.length) {
      this.complete();
      return;
    }

    this.currentStep = index;
    const step = this.steps[index];
    
    // Limpiar spotlight anterior
    if (this.spotlight) {
      this.spotlight.remove();
    }

    // Si hay target, crear spotlight
    if (step.target) {
      const targetEl = document.querySelector(step.target);
      
      if (targetEl) {
        this.createSpotlight(targetEl, step.highlight);
      }
    }

    // Mostrar tooltip
    this.showTooltip(step);
    
    // Setup action listener
    if (step.action) {
      this.setupActionListener(step.action);
    }
  }

  createSpotlight(element, highlight = false) {
    const rect = element.getBoundingClientRect();
    
    this.spotlight = document.createElement('div');
    this.spotlight.className = 'tutorial-spotlight';
    this.spotlight.style.cssText = `
      position: fixed;
      top: ${rect.top - 8}px;
      left: ${rect.left - 8}px;
      width: ${rect.width + 16}px;
      height: ${rect.height + 16}px;
      border: 3px solid #2563eb;
      border-radius: 8px;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5),
                  0 0 20px rgba(37, 99, 235, 0.5);
      z-index: 10001;
      pointer-events: none;
      ${highlight ? 'animation: pulse 2s infinite;' : ''}
    `;
    
    document.body.appendChild(this.spotlight);
  }

  showTooltip(step) {
    if (this.tooltip) {
      this.tooltip.remove();
    }

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tutorial-tooltip';
    
    this.tooltip.innerHTML = `
      <div class="tooltip-header">
        <h4>${step.title}</h4>
        <button class="tooltip-close" onclick="tutorial.skip()">×</button>
      </div>
      
      <div class="tooltip-body">
        <p>${step.description}</p>
        ${step.action?.instruction ? `
          <div class="tooltip-instruction">
            💡 ${step.action.instruction}
          </div>
        ` : ''}
      </div>

      <div class="tooltip-footer">
        <div class="tutorial-progress">
          <span>${this.currentStep + 1} / ${this.steps.length}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${((this.currentStep + 1) / this.steps.length) * 100}%"></div>
          </div>
        </div>
        
        <div class="tooltip-actions">
          ${this.currentStep > 0 ? `
            <button class="btn-secondary" onclick="tutorial.prev()">← Anterior</button>
          ` : ''}
          
          ${step.actions ? step.actions.map(action => `
            <button class="btn-primary" onclick="tutorial.handleAction('${action.action}')">
              ${action.label}
            </button>
          `).join('') : `
            <button class="btn-primary" onclick="tutorial.next()">
              Siguiente →
            </button>
          `}
        </div>
      </div>
    `;

    // Posicionar tooltip
    this.positionTooltip(step);
    
    document.body.appendChild(this.tooltip);
  }

  positionTooltip(step) {
    if (!step.target) {
      // Centrar
      this.tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10002;
      `;
      return;
    }

    const targetEl = document.querySelector(step.target);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const positions = {
      top: { top: rect.top - 200, left: rect.left },
      bottom: { top: rect.bottom + 20, left: rect.left },
      left: { top: rect.top, left: rect.left - 320 },
      right: { top: rect.top, left: rect.right + 20 },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    const pos = positions[step.position] || positions.bottom;
    
    this.tooltip.style.cssText = `
      position: fixed;
      top: ${pos.top}px;
      left: ${pos.left}px;
      ${pos.transform ? `transform: ${pos.transform};` : ''}
      z-index: 10002;
    `;
  }

  setupActionListener(action) {
    const handler = (e) => {
      if (action.type === 'click') {
        const target = e.target.closest(action.target);
        if (target) {
          this.next();
          document.removeEventListener('click', handler);
        }
      } else if (action.type === 'drag') {
        // Listener para drop event
        document.addEventListener('drop', () => {
          this.next();
        }, { once: true });
      }
    };

    if (action.type === 'click') {
      document.addEventListener('click', handler);
    } else if (action.type === 'dblclick') {
      document.addEventListener('dblclick', handler);
    }
  }

  next() {
    this.showStep(this.currentStep + 1);
  }

  prev() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  skip() {
    this.cleanup();
    localStorage.setItem('tutorial_completed', 'skipped');
  }

  complete() {
    this.cleanup();
    localStorage.setItem('tutorial_completed', 'true');
    
    showToast('🎉 ¡Tutorial completado!');
    
    // Mostrar achievement modal
    this.showCompletionModal();
  }

  cleanup() {
    if (this.overlay) this.overlay.remove();
    if (this.tooltip) this.tooltip.remove();
    if (this.spotlight) this.spotlight.remove();
  }

  handleAction(actionType) {
    switch(actionType) {
      case 'next':
        this.next();
        break;
      case 'skip':
        this.skip();
        break;
      case 'start':
        this.cleanup();
        break;
      case 'videos':
        window.open('/tutorials/videos', '_blank');
        this.cleanup();
        break;
      case 'features':
        showHelp();
        this.cleanup();
        break;
    }
  }
}

// Auto-start on first visit
window.addEventListener('load', () => {
  const hasSeenTutorial = localStorage.getItem('tutorial_completed');
  
  if (!hasSeenTutorial) {
    setTimeout(() => {
      window.tutorial = new TutorialEngine(tutorialSteps);
      window.tutorial.start();
    }, 1000);
  }
});
```

---

## 🔄 Cloud Sync - Conflict Resolution Spec

### Three-Way Merge Algorithm
```javascript
class ThreeWayMerge {
  async merge(base, local, remote) {
    const conflicts = [];
    const merged = JSON.parse(JSON.stringify(base));

    // Comparar árbol de elementos
    const baseElements = this.flattenElements(base.data.elements);
    const localElements = this.flattenElements(local.data.elements);
    const remoteElements = this.flattenElements(remote.data.elements);

    // Elementos agregados
    localElements.forEach(el => {
      if (!baseElements.has(el.id) && !remoteElements.has(el.id)) {
        // Solo en local - agregar
        merged.data.elements.push(el);
      } else if (!baseElements.has(el.id) && remoteElements.has(el.id)) {
        // Agregado en ambos - posible duplicado
        conflicts.push({
          type: 'duplicate',
          element: el,
          resolution: 'keep-both'
        });
      }
    });

    // Elementos modificados
    localElements.forEach(localEl => {
      const baseEl = baseElements.get(localEl.id);
      const remoteEl = remoteElements.get(localEl.id);

      if (baseEl && remoteEl) {
        // Existe en los 3
        const localChanged = !this.areEqual(baseEl, localEl);
        const remoteChanged = !this.areEqual(baseEl, remoteEl);

        if (localChanged && remoteChanged) {
          // Modificado en ambos - CONFLICTO
          conflicts.push({
            type: 'modification',
            elementId: localEl.id,
            base: baseEl,
            local: localEl,
            remote: remoteEl,
            resolution: 'manual' // Requiere intervención
          });
        } else if (localChanged) {
          // Solo cambió en local
          Object.assign(merged.data.elements.find(e => e.id === localEl.id), localEl);
        } else if (remoteChanged) {
          // Solo cambió en remote
          Object.assign(merged.data.elements.find(e => e.id === remoteEl.id), remoteEl);
        }
      }
    });

    return {
      merged,
      conflicts,
      needsManualResolution: conflicts.some(c => c.resolution === 'manual')
    };
  }

  areEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  flattenElements(elements) {
    const map = new Map();
    
    const flatten = (els) => {
      els.forEach(el => {
        map.set(el.id, el);
        if (el.children) {
          flatten(el.children);
        }
      });
    };
    
    flatten(elements);
    return map;
  }
}
```

---

## 📦 Export System - Especificación

### Multi-Format Export Engine
```javascript
class ExportEngine {
  async export(format, options = {}) {
    const exporters = {
      'html': () => this.exportHTML(options),
      'react': () => this.exportReact(options),
      'vue': () => this.exportVue(options),
      'svelte': () => this.exportSvelte(options),
      'email': () => this.exportEmail(options),
      'pdf': () => this.exportPDF(options),
      'wordpress': () => this.exportWordPress(options)
    };

    const exporter = exporters[format];
    if (!exporter) {
      throw new Error(`Unsupported format: ${format}`);
    }

    return await exporter();
  }

  exportReact(options) {
    const canvas = document.getElementById('canvas');
    const elements = this.parseElements(canvas);

    const component = `
import React from 'react';
import './styles.css';

export default function GeneratedComponent() {
  return (
    <>
      ${this.elementsToJSX(elements)}
    </>
  );
}
    `.trim();

    const css = this.extractStyles(elements);

    return {
      'Component.jsx': component,
      'styles.css': css,
      'package.json': this.generatePackageJson('react')
    };
  }

  elementsToJSX(elements) {
    return elements.map(el => {
      const tag = el.tagName.toLowerCase();
      const props = this.htmlAttributesToJSX(el.attributes);
      const style = this.cssToJSXStyle(el.style.cssText);
      const children = el.children.length > 0 
        ? this.elementsToJSX(Array.from(el.children))
        : el.textContent;

      return `
        <${tag} ${props} style={${JSON.stringify(style)}}>
          ${children}
        </${tag}>
      `.trim();
    }).join('\n');
  }

  htmlAttributesToJSX(attributes) {
    const jsx = [];
    
    for (const attr of attributes) {
      const name = attr.name === 'class' ? 'className' : attr.name;
      const value = attr.value;
      
      if (name !== 'style') {
        jsx.push(`${name}="${value}"`);
      }
    }
    
    return jsx.join(' ');
  }

  cssToJSXStyle(cssText) {
    const style = {};
    
    cssText.split(';').forEach(declaration => {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        // camelCase
        const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        style[camelProperty] = value;
      }
    });
    
    return style;
  }

  exportVue(options) {
    const canvas = document.getElementById('canvas');
    const html = canvas.innerHTML;
    const css = this.extractStyles(canvas);

    const component = `
<template>
  <div class="generated-component">
    ${html}
  </div>
</template>

<script>
export default {
  name: 'GeneratedComponent',
  data() {
    return {}
  }
}
</script>

<style scoped>
${css}
</style>
    `.trim();

    return {
      'Component.vue': component,
      'package.json': this.generatePackageJson('vue')
    };
  }

  exportEmail(options) {
    // MJML or table-based HTML para emails
    const canvas = document.getElementById('canvas');
    
    const emailHTML = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Template</title>
  <style type="text/css">
    /* Email-safe CSS */
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0">
          ${this.convertToEmailTable(canvas)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return {
      'email-template.html': emailHTML
    };
  }

  convertToEmailTable(element) {
    // Convertir divs a tables para compatibilidad con email clients
    // Complejo pero necesario para Outlook, etc.
  }
}
```

---

## 📈 Performance Benchmarks

### Target Metrics
```javascript
const performanceTargets = {
  // Load time
  initialLoad: '< 2s',           // Time to Interactive
  moduleLoad: '< 500ms',         // Cada módulo JS
  
  // Runtime
  dragStart: '< 16ms',           // 60fps
  resize: '< 16ms',              // 60fps
  layerUpdate: '< 100ms',        // Rebuild layer tree
  saveProject: '< 500ms',        // Serialize & save
  
  // API calls
  geminiValidation: '< 3s',      // Incluye network
  componentGeneration: '< 5s',   // Incluye network
  vercelDeploy: '< 60s',         // Deployment completo
  
  // Memory
  maxMemoryUsage: '< 100MB',     // Para proyectos grandes
  
  // Lighthouse
  performance: '> 90',
  accessibility: '> 95',
  bestPractices: '> 90',
  seo: '> 90'
};
```

### Monitoring
```javascript
class PerformanceMonitor {
  static measure(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const duration = end - start;
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    
    // Log to analytics
    this.logMetric(label, duration);
    
    return result;
  }

  static async measureAsync(label, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    const duration = end - start;
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    this.logMetric(label, duration);
    
    return result;
  }

  static logMetric(label, duration) {
    // Enviar a analytics backend
    if (window.apiClient) {
      window.apiClient.logMetric({
        metric: label,
        value: duration,
        timestamp: Date.now()
      }).catch(() => {}); // Silent fail
    }
  }
}

// Usage
const layers = PerformanceMonitor.measure('Build Layers Tree', () => {
  return layersManager.buildTree(canvas);
});

await PerformanceMonitor.measureAsync('Generate Component', async () => {
  return await aiComponentGenerator.generate(description);
});
```

---

## 🧪 Testing Infrastructure

### Test Utils
```javascript
// tests/utils/testHelpers.js

export function createMockElement(type = 'div', styles = {}) {
  const el = document.createElement(type);
  el.id = 'test-element-' + Date.now();
  el.className = 'canvas-element';
  
  Object.entries(styles).forEach(([prop, value]) => {
    el.style[prop] = value;
  });
  
  return el;
}

export function createMockCanvas(elements = []) {
  const canvas = document.createElement('div');
  canvas.id = 'canvas';
  
  elements.forEach(el => canvas.appendChild(el));
  
  return canvas;
}

export async function mockGeminiResponse(response) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{
          content: {
            parts: [{ text: response }]
          }
        }],
        usageMetadata: {
          totalTokenCount: 100
        }
      })
    })
  );
}

export function waitForEvent(target, eventName, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Event ${eventName} not fired within ${timeout}ms`));
    }, timeout);

    target.addEventListener(eventName, (e) => {
      clearTimeout(timer);
      resolve(e.detail);
    }, { once: true });
  });
}
```

### E2E Test Examples
```javascript
// tests/e2e/workflows.spec.js
import { test, expect } from '@playwright/test';

test.describe('Complete User Workflow', () => {
  test('should create project end-to-end', async ({ page }) => {
    // 1. Sign up
    await page.goto('/signup');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');

    // 2. Create new project
    await page.click('button:has-text("Nuevo Proyecto")');
    await page.fill('input[name="projectName"]', 'Test Project');
    await page.click('button:has-text("Crear")');

    // 3. Add components
    const h1 = page.locator('.component-item[data-type="h1"]');
    const canvas = page.locator('#canvas');
    
    await h1.dragTo(canvas);
    
    await expect(canvas.locator('h1')).toBeVisible();

    // 4. Edit text
    await page.dblclick('#canvas h1');
    await page.keyboard.type('My Awesome Title');
    await page.keyboard.press('Escape');

    // 5. Resize
    await page.click('#canvas h1');
    const resizeHandle = page.locator('.resize-handle-se');
    await resizeHandle.dragTo(page.locator('#canvas'), {
      targetPosition: { x: 200, y: 100 }
    });

    // 6. Save
    await page.click('button:has-text("Guardar")');
    await expect(page.locator('.toast:has-text("guardado")')).toBeVisible();

    // 7. Deploy
    await page.click('button:has-text("Deploy")');
    await page.fill('#deployProjectName', 'test-project');
    await page.click('button:has-text("Iniciar Deploy")');
    
    await expect(page.locator('.deploy-success')).toBeVisible({ timeout: 60000 });
    
    const deployURL = await page.locator('#deployURL').inputValue();
    expect(deployURL).toContain('vercel.app');
  });

  test('should handle multi-selection and alignment', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Crear 3 elementos
    const canvas = page.locator('#canvas');
    
    for (let i = 0; i < 3; i++) {
      await page.locator('.component-item[data-type="button"]').dragTo(canvas);
    }

    // Multi-select con Ctrl+Click
    const buttons = page.locator('#canvas button.canvas-element');
    
    await buttons.nth(0).click();
    await buttons.nth(1).click({ modifiers: ['Control'] });
    await buttons.nth(2).click({ modifiers: ['Control'] });

    // Verificar selección múltiple
    await expect(page.locator('.multi-select-toolbar')).toBeVisible();
    await expect(page.locator('.selection-count')).toHaveText('3 elementos');

    // Alinear a la izquierda
    await page.click('button[onclick="alignSelected(\'left\')"]');

    // Verificar alineación
    const rects = await Promise.all([
      buttons.nth(0).boundingBox(),
      buttons.nth(1).boundingBox(),
      buttons.nth(2).boundingBox()
    ]);

    expect(rects[0].x).toBeCloseTo(rects[1].x, 1);
    expect(rects[1].x).toBeCloseTo(rects[2].x, 1);
  });
});
```

---

## 🎯 API Rate Limiting

### Client-side Rate Limiter
```javascript
class RateLimiter {
  constructor(options = {}) {
    this.requests = [];
    this.limits = {
      gemini: {
        perMinute: 15,
        perDay: 1500
      },
      vercel: {
        perMinute: 20,
        perHour: 100
      },
      github: {
        perMinute: 60,
        perHour: 5000
      },
      ...options
    };
  }

  async checkLimit(service) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    // Limpiar requests antiguos
    this.requests = this.requests.filter(r => r.timestamp > oneDayAgo);

    const serviceRequests = this.requests.filter(r => r.service === service);
    
    const lastMinute = serviceRequests.filter(r => r.timestamp > oneMinuteAgo).length;
    const lastHour = serviceRequests.filter(r => r.timestamp > oneHourAgo).length;
    const lastDay = serviceRequests.filter(r => r.timestamp > oneDayAgo).length;

    const limits = this.limits[service];

    if (limits.perMinute && lastMinute >= limits.perMinute) {
      const waitTime = 60000 - (now - serviceRequests[serviceRequests.length - limits.perMinute].timestamp);
      throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)}s`);
    }

    if (limits.perHour && lastHour >= limits.perHour) {
      throw new Error('Hourly rate limit exceeded');
    }

    if (limits.perDay && lastDay >= limits.perDay) {
      throw new Error('Daily rate limit exceeded');
    }

    // Registrar request
    this.requests.push({
      service,
      timestamp: now
    });

    return true;
  }

  async throttle(service, fn) {
    await this.checkLimit(service);
    return await fn();
  }
}

// Usage
window.rateLimiter = new RateLimiter();

await window.rateLimiter.throttle('gemini', async () => {
  return await geminiValidator.validateElement(element);
});
```

---

## 📊 Analytics & Telemetry

### Client-side Analytics
```javascript
class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.flushInterval = 30000; // 30s
    
    this.startFlushInterval();
  }

  track(event, properties = {}) {
    this.events.push({
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      // Restore events si falla
      this.events.unshift(...eventsToSend);
    }
  }

  startFlushInterval() {
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Track important events
window.analytics = new AnalyticsTracker();

window.analytics.track('component_created', { type: 'button' });
window.analytics.track('project_saved', { projectId: '123' });
window.analytics.track('deployment_started', { provider: 'vercel' });
window.analytics.track('ai_component_generated', { style: 'modern', tokensUsed: 450 });
```

---

## 🔧 Environment Configuration

### .env.example
```bash
# Backend
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dragndrop

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3001

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Vercel API
VERCEL_CLIENT_ID=your-vercel-client-id
VERCEL_CLIENT_SECRET=your-vercel-client-secret

# Email Service (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URLs
FRONTEND_URL=http://localhost:8080

# Analytics (opcional)
ANALYTICS_ID=UA-XXXXXXX

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_DEPLOYMENTS=true
ENABLE_GIT_INTEGRATION=false
```

### Frontend Config
```javascript
// src/config/app.config.js
export const appConfig = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 30000
  },
  
  ai: {
    geminiModel: 'gemini-2.0-flash-lite',
    maxTokensPerRequest: 2048,
    debounceDelay: 1500
  },
  
  editor: {
    autoSaveInterval: 30000,
    maxUndoStates: 50,
    defaultCanvasWidth: '100%',
    snapThreshold: 5
  },
  
  features: {
    aiValidation: true,
    aiGeneration: true,
    cloudSync: true,
    vercelDeploy: true,
    gitIntegration: false
  },
  
  limits: {
    maxProjectSize: 10 * 1024 * 1024, // 10MB
    maxFileSize: 500 * 1024,          // 500KB
    freeProjectsQuota: 10
  }
};
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Lighthouse score > 90
- [ ] Security scan clean
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API rate limits configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] CDN configured for assets
- [ ] Backup strategy in place

### Post-deployment
- [ ] Smoke tests on production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify auth flows
- [ ] Test deployments
- [ ] Monitor API usage
- [ ] Check database connections
- [ ] Verify email delivery

---

## 📚 Documentation Requirements

### For Each Feature
```markdown
# Feature Name

## Overview
Brief description (2-3 sentences)

## Usage
Step-by-step with screenshots

## API Reference
```javascript
// Code examples
```

## Configuration
Available options

## Troubleshooting
Common issues and solutions

## Performance
Benchmarks and optimization tips
```

---

## 🎯 Success Criteria

### Technical
- ✅ All MUST-HAVE features implemented
- ✅ Test coverage > 70%
- ✅ Lighthouse score > 90
- ✅ No critical security issues
- ✅ API response time < 500ms (p95)
- ✅ Zero data loss scenarios
- ✅ Works in Chrome, Firefox, Safari, Edge

### Business
- ✅ Can create landing page in < 10 minutes
- ✅ Can deploy to production with 1 click
- ✅ AI features reduce work by 50%+
- ✅ 90% feature parity with Webflow/Framer (basic features)

### User Experience
- ✅ Tutorial completion rate > 60%
- ✅ NPS > 50
- ✅ Weekly Active Users retention > 40%
- ✅ Average session time > 15 minutes
- ✅ Error rate < 1%

---

**🎯 ¿Listo para empezar? Selecciona tu workflow y comencemos.**
