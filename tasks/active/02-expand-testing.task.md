---
type: testing
priority: high
agent: @test
estimated: 10h
created: 2025-11-29
dueDate: 2025-12-06
status: active
---

# Task: Expand Test Coverage to 80%

## 📋 Objetivo

Expandir la cobertura de tests del proyecto de actual (~20%) a 80%+ para garantizar estabilidad y calidad.

## 🎯 Motivación

**Actual:** Solo 1 test básico, coverage muy bajo
**Target:** 80% coverage con tests comprehensivos
**Beneficio:** Confianza en deploys, menos bugs en producción

## 📊 Estado Actual

```bash
# Coverage actual
Test Suites: 1 passed
Tests: 1 passed
Coverage: ~20% (estimado)
```

### Módulos Sin Tests
1. ❌ `src/core/responsiveTester.js` (0% coverage)
2. ❌ `src/core/livePreview.js` (0% coverage)
3. ❌ `src/components/fileLoader.js` (0% coverage)
4. ❌ `src/components/htmlParser.js` (0% coverage)
5. ❌ `src/storage/projectManager.js` (0% coverage)
6. ❌ `src/utils/componentExtractor.js` (0% coverage)

### Módulos Con Tests Parciales
1. ⚠️ `src/core/undoRedo.js` (tests creados, no ejecutados aún)
2. ⚠️ `src/core/keyboardShortcuts.js` (tests creados, no ejecutados aún)

## 📝 Plan de Testing

### Fase 1: Tests para Módulos Core (4h)

#### 1.1 ResponsiveTester Tests
**File:** `tests/unit/core/responsiveTester.test.js`

```javascript
describe('ResponsiveTester', () => {
  // Setup/Init (3 tests)
  test('debe crear instancia correctamente')
  test('debe cargar dispositivos predefinidos')
  test('debe cargar custom sizes desde localStorage')
  
  // Device Selection (5 tests)
  test('debe cambiar a mobile correctamente')
  test('debe cambiar a tablet correctamente')
  test('debe cambiar a desktop correctamente')
  test('debe aplicar tamaño custom')
  test('debe validar tamaños mínimos')
  
  // Orientation (3 tests)
  test('debe cambiar a landscape')
  test('debe cambiar a portrait')
  test('debe invertir dimensiones en landscape')
  
  // UI Updates (4 tests)
  test('debe actualizar display de tamaño')
  test('debe actualizar breakpoint display')
  test('debe actualizar botones activos')
  test('debe mostrar/ocultar panel')
  
  // Edge Cases (3 tests)
  test('debe manejar canvas inexistente')
  test('debe validar inputs de custom size')
  test('debe persistir preferencias')
  
  // Total: 18 tests
  // Target coverage: >80%
});
```

#### 1.2 LivePreview Tests
**File:** `tests/unit/core/livePreview.test.js`

```javascript
describe('LivePreview', () => {
  // Lifecycle (4 tests)
  test('debe inicializar correctamente')
  test('debe abrir ventana de preview')
  test('debe cerrar ventana correctamente')
  test('debe detectar ventana cerrada')
  
  // Content Generation (5 tests)
  test('debe generar HTML limpio')
  test('debe incluir estilos')
  test('debe incluir scripts')
  test('debe remover elementos del editor')
  test('debe incluir componentes CSS')
  
  // Updates (4 tests)
  test('debe actualizar en cambios de canvas')
  test('debe debounce updates correctamente')
  test('debe usar MutationObserver')
  test('debe limpiar observer al cerrar')
  
  // Edge Cases (2 tests)
  test('debe manejar popup blocker')
  test('debe manejar canvas vacío')
  
  // Total: 15 tests
  // Target coverage: >80%
});
```

### Fase 2: Tests para Components (3h)

#### 2.1 FileLoader Tests
**File:** `tests/unit/components/fileLoader.test.js`

```javascript
describe('FileLoader', () => {
  // File Type Detection (4 tests)
  test('debe detectar archivo HTML')
  test('debe detectar archivo CSS')
  test('debe detectar archivo JS')
  test('debe detectar imagen')
  
  // File Processing (6 tests)
  test('debe cargar HTML correctamente')
  test('debe mostrar preview antes de cargar')
  test('debe cargar CSS y aplicar estilos')
  test('debe validar JS antes de ejecutar')
  test('debe cargar imagen como elemento')
  test('debe manejar múltiples archivos')
  
  // Drag & Drop (3 tests)
  test('debe setup drop zone')
  test('debe highlight al dragover')
  test('debe procesar files al drop')
  
  // Error Handling (2 tests)
  test('debe rechazar tipos no soportados')
  test('debe manejar errores de lectura')
  
  // Total: 15 tests
});
```

#### 2.2 HTMLParser Tests
**File:** `tests/unit/components/htmlParser.test.js`

```javascript
describe('HTMLParser', () => {
  // Parsing (5 tests)
  test('debe parsear HTML simple')
  test('debe parsear HTML complejo')
  test('debe preservar estilos inline')
  test('debe extraer estilos del head')
  test('debe manejar scripts')
  
  // Component Detection (6 tests)
  test('debe detectar navbar')
  test('debe detectar hero section')
  test('debe detectar card')
  test('debe detectar footer')
  test('debe detectar custom components')
  test('debe asignar tipos correctos')
  
  // Element Conversion (4 tests)
  test('debe convertir elementos a editables')
  test('debe agregar IDs únicos')
  test('debe agregar botón delete')
  test('debe aplicar eventos del editor')
  
  // Total: 15 tests
});
```

### Fase 3: Tests para Storage & Utils (3h)

#### 3.1 ProjectManager Tests
**File:** `tests/unit/storage/projectManager.test.js`

```javascript
describe('ProjectManager', () => {
  // Project Creation (3 tests)
  test('debe crear proyecto nuevo')
  test('debe generar ID único')
  test('debe set metadata correcta')
  
  // Saving (5 tests)
  test('debe guardar proyecto actual')
  test('debe capturar contenido del canvas')
  test('debe generar thumbnail')
  test('debe persistir en localStorage')
  test('debe actualizar timestamp')
  
  // Loading (4 tests)
  test('debe cargar proyecto por ID')
  test('debe cargar proyecto al canvas')
  test('debe re-aplicar eventos')
  test('debe set como current project')
  
  // Auto-Save (3 tests)
  test('debe auto-guardar cada 30s')
  test('debe guardar antes de unload')
  test('debe detectar cambios en canvas')
  
  // Operations (5 tests)
  test('debe duplicar proyecto')
  test('debe renombrar proyecto')
  test('debe eliminar proyecto')
  test('debe exportar a JSON')
  test('debe importar desde JSON')
  
  // Total: 20 tests
});
```

#### 3.2 ComponentExtractor Tests
**File:** `tests/unit/utils/componentExtractor.test.js`

```javascript
describe('ComponentExtractor', () => {
  // Extraction (4 tests)
  test('debe extraer componentes de HTML')
  test('debe identificar patrones')
  test('debe validar componentes')
  test('debe limpiar elementos')
  
  // Component Types (8 tests)
  test('debe detectar navbar')
  test('debe detectar card')
  test('debe detectar hero')
  test('debe detectar footer')
  test('debe detectar form')
  test('debe detectar gallery')
  test('debe detectar testimonial')
  test('debe detectar pricing')
  
  // Storage (3 tests)
  test('debe guardar componentes extraídos')
  test('debe limitar a 50 componentes')
  test('debe cargar desde localStorage')
  
  // Search (2 tests)
  test('debe buscar por nombre')
  test('debe buscar por tags')
  
  // Total: 17 tests
});
```

## 🎯 Definition of Done

### Coverage Targets
```
Overall:           >80%
src/core/:         >85%
src/components/:   >80%
src/storage/:      >80%
src/utils/:        >75%
```

### Test Quality
- [ ] All tests descriptive
- [ ] Happy paths covered
- [ ] Edge cases covered
- [ ] Error scenarios covered
- [ ] Mocks used appropriately
- [ ] No flaky tests
- [ ] Fast execution (<5s total)

### CI/CD
- [ ] Tests run on every PR
- [ ] Coverage reported
- [ ] Failing tests block merge
- [ ] Coverage decrease blocks merge

## 📊 Execution Plan

### Day 1 (4h)
- Morning: ResponsiveTester tests (18 tests)
- Afternoon: LivePreview tests (15 tests)

### Day 2 (3h)
- Morning: FileLoader tests (15 tests)
- Afternoon: HTMLParser tests (15 tests)

### Day 3 (3h)
- Morning: ProjectManager tests (20 tests)
- Afternoon: ComponentExtractor tests (17 tests)

**Total:** 100+ tests nuevos en 3 días

## 🚀 Commands to Execute

```bash
# Run existing tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# Specific module
npm test -- tests/unit/core/responsiveTester.test.js

# CI simulation
npm run test:all
```

## 📊 Success Metrics

### Before
```
Tests: 1
Coverage: ~20%
Confidence: Low
```

### After
```
Tests: 100+
Coverage: >80%
Confidence: High
```

---

**Status:** 🔄 READY TO START
**Assignee:** @test
**Progress:** [░░░░░░░░░░] 0% → Target: [████████░░] 80%
