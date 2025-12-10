---
type: feature
priority: high
agent: @dev
reviewers: [@qa]
estimated: 4h
created: 2025-11-29
dueDate: 2025-12-01
status: ready
---

# Feature: Tema Oscuro (Dark Mode)

## 📋 Descripción

Implementar tema oscuro/claro con toggle en la toolbar y persistencia de preferencia del usuario.

## 🎯 Motivación

**Problema:** Muchos desarrolladores prefieren dark mode
**Solución:** Toggle theme con persistencia
**Beneficio:** Mejor UX, menos fatiga visual, feature esperada

## 🎨 Diseño

### UI Components
```
Toolbar:
  [☀️ Claro | 🌙 Oscuro] ← Toggle button
```

### Color Scheme

#### Light Mode (Actual)
```css
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--text-primary: #1e293b
--text-secondary: #64748b
--border: #e2e8f0
--accent: #2563eb
```

#### Dark Mode (Nuevo)
```css
--bg-primary: #0f172a
--bg-secondary: #1e293b
--text-primary: #f1f5f9
--text-secondary: #cbd5e1
--border: #334155
--accent: #3b82f6
```

## 📝 Especificación

### Funcionalidad
1. Toggle button en toolbar
2. Aplicar theme inmediatamente
3. Guardar preferencia en localStorage
4. Cargar preferencia al iniciar
5. Smooth transition entre themes (0.3s)
6. Aplicar a todo el editor (panels, modals, components)

### Keyboard Shortcut
- `Ctrl+Shift+D` → Toggle dark mode

## 🔧 Implementación

### Archivos a Crear
```
src/core/themeManager.js  (nuevo módulo)
```

### Archivos a Modificar
```
index.html (agregar botón toggle + script)
style.css (agregar CSS variables + dark mode styles)
```

### Code Structure

#### themeManager.js
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.storageKey = 'dragndrop_theme';
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupToggle();
    this.setupKeyboardShortcut();
  }

  loadTheme() {
    const saved = localStorage.getItem(this.storageKey);
    this.currentTheme = saved || this.detectPreference();
    this.applyTheme(this.currentTheme);
  }

  detectPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    this.saveTheme();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateUI(theme);
  }

  saveTheme() {
    localStorage.setItem(this.storageKey, this.currentTheme);
  }

  updateUI(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';
      btn.setAttribute('aria-label', `Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`);
    }
  }

  setupToggle() {
    // Button click handler
  }

  setupKeyboardShortcut() {
    // Ctrl+Shift+D handler
  }
}

window.ThemeManager = ThemeManager;
```

#### style.css additions
```css
/* CSS Variables */
:root {
  /* Light mode (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;
  --accent-primary: #2563eb;
  --accent-secondary: #3b82f6;
  --shadow: rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  /* Dark mode */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-primary: #334155;
  --border-secondary: #475569;
  --accent-primary: #3b82f6;
  --accent-secondary: #60a5fa;
  --shadow: rgba(0,0,0,0.3);
}

/* Apply variables to elements */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.toolbar {
  background: var(--bg-primary);
  border-bottom-color: var(--border-primary);
}

.toolbar-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.toolbar-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
}

/* ... aplicar a todos los componentes ... */
```

## 🧪 Testing

### Unit Tests
```javascript
// tests/unit/core/themeManager.test.js

describe('ThemeManager', () => {
  test('debe inicializar con tema light por defecto');
  test('debe detectar preferencia del sistema');
  test('debe toggle entre light y dark');
  test('debe guardar preferencia en localStorage');
  test('debe cargar preferencia guardada');
  test('debe aplicar CSS variables correctamente');
  test('debe actualizar UI del botón');
  test('debe manejar keyboard shortcut');
  test('debe aplicar transition suave');
  test('debe manejar localStorage unavailable');
  
  // Total: 10 tests
  // Target coverage: >90%
});
```

### E2E Tests
```javascript
// tests/e2e/theme.spec.js

test('debe cambiar tema con botón', async ({ page }) => {
  await page.goto('/');
  await page.click('#themeToggle');
  const theme = await page.getAttribute('html', 'data-theme');
  expect(theme).toBe('dark');
});

test('debe persistir tema al recargar', async ({ page }) => {
  await page.goto('/');
  await page.click('#themeToggle');
  await page.reload();
  const theme = await page.getAttribute('html', 'data-theme');
  expect(theme).toBe('dark');
});

test('debe funcionar keyboard shortcut', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+Shift+D');
  const theme = await page.getAttribute('html', 'data-theme');
  expect(theme).toBe('dark');
});
```

### Manual Testing
- [ ] Toggle funciona
- [ ] Colores se ven bien en dark mode
- [ ] Contraste suficiente (WCAG AA)
- [ ] Transition es suave
- [ ] Preferencia persiste
- [ ] Funciona en todos los panels
- [ ] Funciona en modals
- [ ] Keyboard shortcut funciona

## 📖 Documentación

### User Docs
```markdown
## Tema Oscuro

DragNDrop soporta tema oscuro para reducir fatiga visual.

### Cambiar Tema
1. Click en botón "🌙 Oscuro" en la toolbar
2. O presiona `Ctrl+Shift+D`

El tema se guarda automáticamente y se aplicará en futuras sesiones.

### Detección Automática
DragNDrop detecta la preferencia de tu sistema operativo al primer uso.
```

### API Docs
```javascript
/**
 * Theme Manager - Gestiona tema claro/oscuro
 * 
 * @example
 * // Toggle theme
 * window.themeManager.toggle();
 * 
 * // Set specific theme
 * window.themeManager.applyTheme('dark');
 * 
 * // Get current theme
 * const current = window.themeManager.currentTheme;
 */
```

## 🎯 Definition of Done

### Code
- [ ] ThemeManager implementado
- [ ] CSS variables definidas
- [ ] Dark mode styles aplicados a todos los elementos
- [ ] Toggle button en toolbar
- [ ] Keyboard shortcut registrado
- [ ] Persistencia funcionando

### Testing
- [ ] 10+ unit tests
- [ ] 3 E2E tests
- [ ] Coverage >90%
- [ ] Manual QA passed
- [ ] Accessibility check passed (contrast ratios)

### Docs
- [ ] JSDoc completo
- [ ] User guide actualizado
- [ ] Keyboard shortcut documentado
- [ ] CHANGELOG.md updated

### Integration
- [ ] Módulo cargado en index.html
- [ ] Inicializado en DOMContentLoaded
- [ ] No conflicts con código existente
- [ ] Performance sin impacto

## 📊 Success Metrics

### Technical
- Load time impact: <50ms
- Transition smooth: 60fps
- localStorage usage: <1KB

### User
- Adoption rate: >30% usuarios usan dark mode
- Satisfaction: No complaints sobre colores

## 🔗 Referencias

- Material Design Dark Theme: https://material.io/design/color/dark-theme.html
- CSS Tricks Dark Mode: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
- Accessibility: https://www.a11yproject.com/posts/operating-system-and-browser-accessibility-display-modes/

---

**Status:** 🟢 READY
**Assignee:** @dev
**Estimated:** 4h
**Progress:** [░░░░░░░░░░] 0%
