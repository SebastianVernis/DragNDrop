# 📋 Checkpoint 1: Planning - Tema Oscuro

## Checkpoint Report

**Task ID:** 03-theme-oscuro
**Task Name:** Implementar Tema Oscuro (Dark Mode)
**Agent:** @dev
**Checkpoint:** 1-Planning
**Date:** 2025-11-29 15:10
**Status:** ⏳ Awaiting Supervisor Approval

---

## 📊 Summary

Propuesta de implementación para tema oscuro/claro con toggle, persistencia y detección automática de preferencia del sistema.

**Scope:** Feature completa en ~4 horas
**Impact:** Alto - Feature muy solicitada por developers
**Risk:** Bajo - No afecta funcionalidad existente

---

## 🎯 Implementation Plan

### Archivos a Crear

#### 1. `src/core/themeManager.js` (~200 líneas)
```javascript
class ThemeManager {
  // Constructor e init
  // loadTheme() - Cargar desde localStorage o detectar preferencia
  // detectPreference() - Usar prefers-color-scheme
  // toggle() - Cambiar entre light/dark
  // applyTheme(theme) - Aplicar CSS attribute
  // saveTheme() - Guardar en localStorage
  // updateUI(theme) - Actualizar botón
  // setupToggle() - Event listener para botón
  // setupKeyboardShortcut() - Ctrl+Shift+D
}
```

### Archivos a Modificar

#### 2. `index.html` (agregar ~10 líneas)
```html
<!-- En toolbar, después de botón Live Preview -->
<button class="toolbar-btn" id="themeToggle" onclick="window.themeManager && window.themeManager.toggle()" title="Cambiar tema (Ctrl+Shift+D)">
  🌙 Oscuro
</button>

<!-- Cargar módulo -->
<script type="module" src="src/core/themeManager.js"></script>

<!-- Inicializar -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
  });
</script>
```

#### 3. `style.css` (agregar ~150 líneas)

**Sección 1: CSS Variables** (~50 líneas)
```css
:root {
  /* Light mode (default) - usar colores actuales */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-primary: #e2e8f0;
  --accent-primary: #2563eb;
  --shadow: rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  /* Dark mode - colores oscuros */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-primary: #334155;
  --accent-primary: #3b82f6;
  --shadow: rgba(0,0,0,0.3);
}
```

**Sección 2: Aplicar Variables** (~100 líneas)
Reemplazar todos los colores hardcoded por variables:
```css
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.toolbar {
  background: var(--bg-primary);
  border-bottom-color: var(--border-primary);
}

/* ... etc para todos los componentes */
```

---

## 💡 Decisions Made

### Decision 1: CSS Variables vs Class-based
**What:** Usar CSS variables con `data-theme` attribute
**Why:** 
- Más mantenible
- Smooth transitions
- Menos código duplicado
- Fácil agregar más themes después
**Alternatives:** Class-based (.dark-mode) - más verboso
**Impact:** Medio - Mejor arquitectura a largo plazo

### Decision 2: localStorage Key
**What:** Usar `'dragndrop_theme'` como storage key
**Why:** Consistente con otras keys del proyecto (`dragndrop_projects`, etc)
**Impact:** Bajo

### Decision 3: Detectar Preferencia Sistema
**What:** Usar `prefers-color-scheme` media query al primer uso
**Why:** UX mejorada - respetar preferencia del usuario
**Impact:** Bajo - Mejora inicial UX

### Decision 4: Ubicación del Toggle
**What:** En toolbar, después de botón "👁️ Vista Previa"
**Why:** 
- Visible pero no intrusivo
- Agrupado con otras funcionalidades de vista
- Fácil acceso
**Impact:** Bajo

---

## ❓ Questions for Supervisor

### Question 1: Scope de Aplicación
**Context:** ¿Aplicamos dark mode también a los modals/panels overlay?
**Options:**
- A) Solo editor principal (más rápido)
- B) Todo incluyendo modals (más completo)

**Recommendation:** Opción B - Experiencia consistente es importante

### Question 2: Canvas Background
**Context:** ¿El canvas (área de trabajo blanca) debe cambiar a oscuro?
**Options:**
- A) Canvas siempre blanco (simula página final)
- B) Canvas sigue el theme (menos contraste)

**Recommendation:** Opción A - Canvas simula resultado final que probablemente será blanco

---

## 🎯 Proposed Next Steps

**If approved, agent will:**

1. [ ] Crear `src/core/themeManager.js` con toda la lógica
   - ETA: 1 hora
   - Risk: Bajo

2. [ ] Extraer colores actuales a CSS variables en `style.css`
   - ETA: 45 minutos
   - Risk: Medio - Requiere testing cuidadoso

3. [ ] Agregar dark mode variables y aplicar a todos los componentes
   - ETA: 1 hora
   - Risk: Medio - Muchos selectores a actualizar

4. [ ] Agregar toggle button en toolbar en `index.html`
   - ETA: 15 minutos
   - Risk: Bajo

5. [ ] Integrar y inicializar ThemeManager
   - ETA: 15 minutos
   - Risk: Bajo

6. [ ] Testing manual en ambos themes
   - ETA: 30 minutos
   - Risk: Bajo

**Total ETA if approved:** ~3.5-4 horas
**Next checkpoint:** Checkpoint 2 (Code Review) en ~2.5 horas

---

## 🚧 Blockers & Risks

### Current Blockers
Ninguno identificado

### Identified Risks

**Risk 1: Muchos selectores CSS a actualizar**
- Probability: Media
- Impact: Bajo (solo estético si falta alguno)
- Mitigation: Revisión sistemática + testing en ambos themes

**Risk 2: Contraste insuficiente en dark mode**
- Probability: Baja
- Impact: Medio (accesibilidad)
- Mitigation: Usar colores probados, verificar contrast ratio >4.5:1

---

## 📊 Metrics

### Estimated Code Metrics
```
Lines to add: ~360
  ├─ themeManager.js: ~200
  ├─ style.css (variables): ~50
  ├─ style.css (aplicar): ~100
  └─ index.html: ~10

Files to change: 3
Functions to create: 8
Complexity: Low-Medium
```

---

## 🔍 Quality Self-Check

### Pre-Planning Checklist
- [x] Task file leído completamente
- [x] SUPERVISOR_COMMANDS.md leído
- [x] Código existente analizado
- [x] Plan técnico sólido
- [x] Risks identificados
- [x] Questions para supervisor listadas
- [x] ETA realista

### Confidence Level
**High** - Task bien definida, implementación clara, bajo riesgo

---

## 🎯 Readiness for Next Phase

**Agent believes ready for:**
- [x] Supervisor review de este plan
- [ ] Implementation (después de aprobación)

**Blockers para proceder:**
- Necesita aprobación de supervisor
- Necesita respuesta a Question 1 y 2

---

## 🎯 Supervisor Response Section

> **RESERVED:** Solo supervisor puede editar esta sección

### Decision

**Command:** [APPROVE | ADJUST | STOP | CANCEL]
**Date:** _______________

### Answers to Questions

**Question 1 (Scope de aplicación):**
- [ ] Opción A - Solo editor principal
- [ ] Opción B - Todo incluyendo modals
- [ ] Otra: _______________

**Question 2 (Canvas background):**
- [ ] Opción A - Canvas siempre blanco
- [ ] Opción B - Canvas sigue theme
- [ ] Otra: _______________

### Feedback

**Approved aspects:**
- [ ] Plan de implementación
- [ ] Estructura de archivos
- [ ] CSS variables approach
- [ ] Ubicación del toggle button
- [ ] Keyboard shortcut

**Adjustments needed:**
- [ ] _______________
- [ ] _______________

### Additional Instructions

[Instrucciones adicionales del supervisor]

### Authorization

- [ ] ✅ APPROVED - Proceed with implementation
- [ ] ⚠️ APPROVED WITH ADJUSTMENTS - See feedback above
- [ ] 🛑 STOP - Need to rethink approach
- [ ] ❌ CANCEL - Task cancelled

**Next Checkpoint Expected:**
- Checkpoint 2 (Code Review) 
- ETA: ~2.5 hours after approval
- Focus: Verificar CSS variables aplicadas correctamente y transitions suaves

---

**Supervisor Signature:** _______________
**Date:** _______________
**Agent may proceed:** ⏳ AWAITING

---

*Generated by: @dev Agent*
*Timestamp: 2025-11-29 15:10*
*Status: Awaiting Supervisor Review*
