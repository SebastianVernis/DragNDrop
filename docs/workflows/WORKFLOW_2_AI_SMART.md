# 🟢 Workflow 2: AI & Smart Features

**Branch:** `feature/ai-smart`  
**Duración:** 25 días  
**Responsable:** AI/ML Developer  

---

## 🎯 Objetivos

1. ✅ Generación de componentes con IA (5 estilos)
2. ✅ Validador de accesibilidad WCAG 2.1 AA
3. ✅ Optimizador SEO con IA
4. ✅ Token tracking y cost management

---

## 📅 Timeline

### Semana 1-2: Component Generator (Días 1-8)
- [ ] Días 1-4: Core generator (Gemini API wrapper, prompts, parsing)
- [ ] Días 5-8: UI modal + refinement engine

### Semana 3-4: Accessibility Checker (Días 9-16)
- [ ] Días 9-12: WCAG rules implementation (15+ rules)
- [ ] Días 13-16: Auto-fix system + UI panel

### Semana 4-5: SEO Optimizer (Días 17-25)
- [ ] Días 17-22: SEO analysis engine
- [ ] Días 23-25: Integration & polish

---

## 📁 Archivos a Crear

```
src/
  ai/
    ✅ componentGenerator.js      # Main generator
    ✅ promptBuilder.js            # Prompt templates
    ✅ responseParser.js           # Parse Gemini responses
    ✅ refinementEngine.js         # Iterative refinement
    ✅ tokenTracker.js             # Usage tracking
    
    ✅ accessibilityChecker.js     # A11y validator
    ✅ wcagRules.js                # WCAG rules
    ✅ accessibilityFixes.js       # Auto-fix implementations
    
    ✅ seoOptimizer.js             # SEO analyzer
    ✅ seoRules.js                 # SEO checks
    ✅ metaGenerator.js            # Meta tags with AI

  components/
    aiGenerator/
      ✅ GeneratorModal.js         # UI for generation
      ✅ StyleSelector.js          # Style presets
      ✅ PreviewFrame.js           # Preview iframe
    
    ✅ A11yPanel.js                # Accessibility panel
    ✅ SEOPanel.js                 # SEO panel
    ✅ AIUsageDashboard.js         # Token usage stats

  styles/
    ✅ ai-generator.css
    ✅ a11y-panel.css
    ✅ seo-panel.css

tests/
  ai/
    ✅ componentGenerator.test.js
    ✅ accessibilityChecker.test.js
    ✅ seoOptimizer.test.js
    ✅ promptBuilder.test.js
```

---

## 🔗 API Contracts (Proveer para otros workflows)

```javascript
// Exponer globalmente
window.aiComponentGenerator = {
  generate(description, options),
  refine(html, feedback),
  generateVariations(html, count),
  estimateTokens(prompt)
};

window.accessibilityChecker = {
  scan(),
  scanElement(element),
  autoFixAll(),
  autoFixIssue(issueIndex),
  getScore(),
  generateReport()
};

window.seoOptimizer = {
  analyze(),
  generateTitle(),
  generateMetaDescription(),
  generateOGTags(),
  generateStructuredData(),
  getScore()
};

window.tokenTracker = {
  track(tokensUsed, feature),
  getUsage(),
  checkLimits(),
  showDashboard()
};

// Events a disparar
window.dispatchEvent(new CustomEvent('ai:generation:start'));
window.dispatchEvent(new CustomEvent('ai:generation:complete', { detail }));
window.dispatchEvent(new CustomEvent('ai:validation:complete', { detail }));
```

---

## 🔑 API Keys Necesarias

### Gemini API
```
1. Obtener: https://makersuite.google.com/app/apikey
2. Configurar en localStorage o .env
3. Verificar en código: window.geminiValidator.isEnabled()
```

### Configuración
```javascript
// Ya implementado en src/core/geminiValidator.js
// Solo necesitas extender para nuevas features

// Ejemplo: Usar en Component Generator
const geminiAPI = 'https://generativelanguage.googleapis.com/v1beta/models/';
const model = 'gemini-2.0-flash-lite'; // Para economizar
const apiKey = localStorage.getItem('gemini_api_key');
```

---

## 📚 Referencias

### Documentación
- Ver: `workflow-docs/IMPLEMENTATION_PLAN.md` → Workflow 2
- Ver: `workflow-docs/TECHNICAL_SPECS.md` → AI Section
- Ver: `workflow-docs/MULTI_AGENT_OPTION.md` → AI agents

### Código de Referencia
- `src/core/geminiValidator.js` - API calls pattern
- Prompt templates ya optimizados
- Token tracking ya implementado

---

## 🧪 Testing

```bash
# Tests con mocked Gemini API
npm run test -- --testPathPattern=ai

# Coverage mínimo: 70%
npm run test:coverage -- src/ai/

# Test manual
npm run dev
# Probar generación de componentes
```

### Mock de Gemini API
```javascript
// tests/ai/componentGenerator.test.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      candidates: [{
        content: {
          parts: [{ text: '<div>Generated component</div>' }]
        }
      }],
      usageMetadata: { totalTokenCount: 450 }
    })
  })
);
```

---

## 💡 Tips de Implementación

### Optimización de Prompts
```javascript
// ✅ BIEN: Conciso y específico
const prompt = `Generate ${style} component: ${description}
Rules: Inline CSS, max 300 lines, semantic HTML5, accessible
Return ONLY HTML code`;

// ❌ MAL: Demasiado verbose
const prompt = `Hello! I need you to please generate a component...
(explicaciones innecesarias que gastan tokens)`;
```

### Token Economy
- Usar `maxOutputTokens: 512` para validación
- Usar `maxOutputTokens: 2048` para generación
- Temperature: 0.1 (validación), 0.7 (generación)
- Cache generaciones similares

### Error Handling
```javascript
try {
  const result = await callGemini(prompt);
} catch (error) {
  if (error.message.includes('429')) {
    // Rate limit - esperar y reintentar
    await sleep(2000);
    return await callGemini(prompt, retryCount + 1);
  }
  throw error;
}
```

---

## 🚀 Quick Start

```bash
# Verificar branch
git checkout feature/ai-smart

# Crear estructura
mkdir -p src/ai src/components/aiGenerator src/styles
mkdir -p tests/ai

# Primer archivo
touch src/ai/componentGenerator.js

# Implementar siguiendo:
# workflow-docs/IMPLEMENTATION_PLAN.md → Workflow 2 → 2.1

# Configurar Gemini API key
# Via UI del editor o localStorage

# Test
npm run dev

# Commit
git add .
git commit -m "feat(ai): implement component generator core"
git push
```

---

## 📝 Notas Importantes

- ✅ Reutilizar `src/core/geminiValidator.js` como base
- ✅ Todos los prompts deben ser token-optimized
- ✅ Implementar retry logic con backoff exponencial
- ✅ Cache de generaciones para economizar
- ⚠️ NO hardcodear API keys en código
- ⚠️ SIEMPRE validar responses de Gemini
- ⚠️ Rate limiting client-side implementado

---

## 🎯 Definition of Done

- [ ] Todas las features implementadas
- [ ] Tests unitarios pasando (>70% coverage)
- [ ] Gemini API funcionando correctamente
- [ ] Token tracking implementado
- [ ] UI modals funcionales
- [ ] JSDoc documentation completa
- [ ] Integración con toolbar
- [ ] No console errors
- [ ] Code review aprobado

---

**🎯 Siguiente:** Implementar `AIComponentGenerator` class
