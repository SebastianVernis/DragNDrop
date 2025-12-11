# ✨ Mejores Prácticas

**Versión**: 1.0  
**Última Actualización**: 2025-12-10  
**Estado**: 🟢 ACTIVO

---

## 📖 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Prácticas de Orquestación](#-prácticas-de-orquestación)
3. [Prácticas de Desarrollo](#-prácticas-de-desarrollo)
4. [Prácticas de Testing](#-prácticas-de-testing)
5. [Prácticas de Documentación](#-prácticas-de-documentación)
6. [Prácticas de Comunicación](#-prácticas-de-comunicación)
7. [Prácticas de Calidad](#-prácticas-de-calidad)
8. [Anti-Patrones a Evitar](#-anti-patrones-a-evitar)
9. [Checklists](#-checklists)

---

## 🎯 Visión General

Este documento recopila las mejores prácticas para trabajar eficientemente dentro del sistema de orquestación de DragNDrop. Seguir estas prácticas garantiza:

- ✅ **Cero colisiones** entre agentes
- ✅ **Máxima productividad** del equipo
- ✅ **Código de alta calidad** consistente
- ✅ **Comunicación clara** y efectiva
- ✅ **Trazabilidad completa** de decisiones

---

## 🎭 Prácticas de Orquestación

### 1. Gestión de Tareas

#### ✅ DO: Tareas Bien Definidas

```markdown
# ✅ Buena definición de tarea

## FEAT-015: Implementar Sistema de Capas

### Objetivo
Permitir a usuarios organizar elementos en capas con drag-to-reorder.

### Criterios de Aceptación
- [ ] Usuario puede crear nuevas capas
- [ ] Usuario puede renombrar capas
- [ ] Usuario puede reordenar capas con drag & drop
- [ ] Elementos se mueven entre capas
- [ ] Estado persiste en localStorage

### Archivos a Modificar
- src/core/layerSystem.js (CREAR)
- src/components/LayerPanel.js (CREAR)
- index.html (MODIFICAR - agregar panel)

### Estimación: 8h
### Prioridad: MEDIA
```

#### ❌ DON'T: Tareas Vagas

```markdown
# ❌ Mala definición de tarea

## TASK-001: Mejorar el editor

Hacer que el editor sea mejor y más fácil de usar.
```

### 2. Sistema de Bloqueos

#### ✅ DO: Solicitar Bloqueos Proactivamente

```markdown
# Antes de empezar a trabajar:

1. Identificar TODOS los archivos que modificarás
2. Solicitar bloqueos para todos ellos
3. Esperar confirmación
4. Comenzar trabajo
5. Liberar inmediatamente al terminar
```

#### ❌ DON'T: Modificar Sin Bloqueo

```markdown
# Nunca:
- Modificar archivo sin bloqueo
- Asumir que nadie más lo está usando
- Olvidar liberar bloqueos al terminar
- Mantener bloqueos "por si acaso"
```

### 3. Reportes de Progreso

#### ✅ DO: Reportes Frecuentes y Detallados

```markdown
# Reporte de Progreso - 14:00

**Tarea**: FEAT-015
**Progreso**: 45%

## Completado (últimas 2h)
- [x] Estructura de datos de capas
- [x] Funciones CRUD básicas

## En Progreso
- [ ] UI del panel de capas (30%)

## Próximas 2h
- Completar UI del panel
- Implementar drag & drop

## Bloqueadores
- Ninguno

## Notas
- Decidí usar array en lugar de linked list por simplicidad
```

#### ❌ DON'T: Reportes Escasos

```markdown
# ❌ Mal reporte

Progreso: 45%
Todo bien.
```

---

## 💻 Prácticas de Desarrollo

### 1. Código Limpio

#### ✅ DO: Código Auto-Documentado

```javascript
// ✅ Bueno: Nombres descriptivos, estructura clara

class LayerManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.layers = [];
    this.activeLayerId = null;
    this.maxLayers = 50;
  }

  /**
   * Crea una nueva capa con el nombre especificado
   * @param {string} name - Nombre de la capa
   * @returns {Layer} La capa creada
   * @throws {Error} Si se excede el límite de capas
   */
  createLayer(name) {
    if (this.layers.length >= this.maxLayers) {
      throw new Error(`Límite de ${this.maxLayers} capas alcanzado`);
    }

    const layer = {
      id: this._generateUniqueId(),
      name: name || `Capa ${this.layers.length + 1}`,
      visible: true,
      locked: false,
      elements: [],
      createdAt: new Date().toISOString()
    };

    this.layers.push(layer);
    this._notifyLayerCreated(layer);
    
    return layer;
  }

  _generateUniqueId() {
    return `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _notifyLayerCreated(layer) {
    window.dispatchEvent(new CustomEvent('layer:created', { detail: layer }));
  }
}
```

#### ❌ DON'T: Código Críptico

```javascript
// ❌ Malo: Nombres cortos, sin documentación

class LM {
  constructor(c) {
    this.c = c;
    this.l = [];
    this.a = null;
  }

  add(n) {
    if (this.l.length >= 50) return null;
    const x = { id: Date.now(), n: n || 'L' + this.l.length, v: true, e: [] };
    this.l.push(x);
    return x;
  }
}
```

### 2. Manejo de Errores

#### ✅ DO: Errores Informativos

```javascript
// ✅ Bueno: Errores claros con contexto

function loadProject(projectId) {
  if (!projectId) {
    throw new Error('loadProject: projectId es requerido');
  }

  const data = localStorage.getItem(`project_${projectId}`);
  
  if (!data) {
    throw new Error(`Proyecto no encontrado: ${projectId}`);
  }

  try {
    const project = JSON.parse(data);
    
    if (!project.version) {
      console.warn(`Proyecto ${projectId} sin versión, asumiendo v1`);
      project.version = 1;
    }
    
    return project;
  } catch (parseError) {
    throw new Error(`Error parseando proyecto ${projectId}: ${parseError.message}`);
  }
}
```

#### ❌ DON'T: Errores Silenciosos

```javascript
// ❌ Malo: Errores silenciosos o genéricos

function loadProject(id) {
  try {
    return JSON.parse(localStorage.getItem('project_' + id));
  } catch (e) {
    return null; // ¿Qué pasó? Nadie sabe
  }
}
```

### 3. Arquitectura Modular

#### ✅ DO: Módulos Independientes

```javascript
// ✅ Bueno: Módulo con API clara y sin dependencias circulares

// layerSystem.js
export class LayerSystem {
  constructor(options = {}) {
    this.options = {
      maxLayers: 50,
      defaultLayerName: 'Nueva Capa',
      ...options
    };
    this.layers = [];
    this.listeners = new Map();
  }

  // API Pública
  createLayer(name) { /* ... */ }
  deleteLayer(id) { /* ... */ }
  moveLayer(id, newIndex) { /* ... */ }
  getLayer(id) { /* ... */ }
  getAllLayers() { return [...this.layers]; }

  // Eventos
  on(event, callback) { /* ... */ }
  off(event, callback) { /* ... */ }

  // Serialización
  toJSON() { /* ... */ }
  fromJSON(data) { /* ... */ }
}

// Uso
const layers = new LayerSystem({ maxLayers: 100 });
layers.on('layer:created', (layer) => console.log('Nueva capa:', layer));
```

### 4. Performance

#### ✅ DO: Optimizar Operaciones Costosas

```javascript
// ✅ Bueno: Debounce, throttle, y lazy loading

class CanvasRenderer {
  constructor() {
    // Debounce para operaciones frecuentes
    this.debouncedRender = this._debounce(this._render.bind(this), 16);
    
    // Cache para evitar recálculos
    this._elementCache = new Map();
    
    // Intersection Observer para lazy rendering
    this._setupLazyRendering();
  }

  _debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  _setupLazyRendering() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._renderElement(entry.target);
        }
      });
    }, { rootMargin: '100px' });
  }

  render() {
    this.debouncedRender();
  }
}
```

---

## 🧪 Prácticas de Testing

### 1. Tests Descriptivos

#### ✅ DO: Tests que Documentan Comportamiento

```javascript
// ✅ Bueno: Tests claros y descriptivos

describe('LayerSystem', () => {
  describe('createLayer', () => {
    it('debe crear una capa con nombre por defecto si no se proporciona', () => {
      const system = new LayerSystem();
      const layer = system.createLayer();
      
      expect(layer.name).toBe('Nueva Capa');
      expect(layer.id).toBeDefined();
      expect(layer.visible).toBe(true);
    });

    it('debe crear una capa con el nombre proporcionado', () => {
      const system = new LayerSystem();
      const layer = system.createLayer('Mi Capa');
      
      expect(layer.name).toBe('Mi Capa');
    });

    it('debe lanzar error cuando se alcanza el límite de capas', () => {
      const system = new LayerSystem({ maxLayers: 2 });
      system.createLayer('Capa 1');
      system.createLayer('Capa 2');
      
      expect(() => system.createLayer('Capa 3'))
        .toThrow('Límite de 2 capas alcanzado');
    });

    it('debe emitir evento layer:created al crear capa', () => {
      const system = new LayerSystem();
      const callback = jest.fn();
      system.on('layer:created', callback);
      
      const layer = system.createLayer('Test');
      
      expect(callback).toHaveBeenCalledWith(layer);
    });
  });
});
```

#### ❌ DON'T: Tests Vagos

```javascript
// ❌ Malo: Tests que no dicen nada

describe('LayerSystem', () => {
  it('works', () => {
    const s = new LayerSystem();
    expect(s.createLayer()).toBeTruthy();
  });

  it('test 2', () => {
    // ...
  });
});
```

### 2. Coverage Significativo

#### ✅ DO: Cubrir Casos Importantes

```javascript
// ✅ Bueno: Cubrir happy path, edge cases, y errores

describe('moveLayer', () => {
  // Happy path
  it('debe mover capa a nueva posición', () => { /* ... */ });
  
  // Edge cases
  it('debe manejar mover a posición 0', () => { /* ... */ });
  it('debe manejar mover a última posición', () => { /* ... */ });
  it('debe no hacer nada si posición es la misma', () => { /* ... */ });
  
  // Errores
  it('debe lanzar error si capa no existe', () => { /* ... */ });
  it('debe lanzar error si índice es negativo', () => { /* ... */ });
  it('debe lanzar error si índice excede límite', () => { /* ... */ });
});
```

### 3. Tests E2E Realistas

#### ✅ DO: Simular Flujos de Usuario

```javascript
// ✅ Bueno: Test E2E que simula uso real

test('Usuario puede crear y organizar capas', async ({ page }) => {
  await page.goto('/');
  
  // Crear primera capa
  await page.click('[data-testid="add-layer-btn"]');
  await page.fill('[data-testid="layer-name-input"]', 'Header');
  await page.click('[data-testid="confirm-layer-btn"]');
  
  // Verificar capa creada
  await expect(page.locator('[data-testid="layer-item"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="layer-item"]')).toContainText('Header');
  
  // Crear segunda capa
  await page.click('[data-testid="add-layer-btn"]');
  await page.fill('[data-testid="layer-name-input"]', 'Content');
  await page.click('[data-testid="confirm-layer-btn"]');
  
  // Reordenar capas con drag & drop
  const header = page.locator('[data-testid="layer-item"]:has-text("Header")');
  const content = page.locator('[data-testid="layer-item"]:has-text("Content")');
  
  await header.dragTo(content);
  
  // Verificar nuevo orden
  const layers = await page.locator('[data-testid="layer-item"]').allTextContents();
  expect(layers).toEqual(['Content', 'Header']);
});
```

---

## 📚 Prácticas de Documentación

### 1. Documentación de Código

#### ✅ DO: JSDoc Completo

```javascript
/**
 * Sistema de gestión de capas para el editor visual.
 * Permite organizar elementos en capas con soporte para
 * reordenamiento, visibilidad y bloqueo.
 * 
 * @class LayerSystem
 * @example
 * const layers = new LayerSystem({ maxLayers: 100 });
 * const layer = layers.createLayer('Header');
 * layers.addElementToLayer(layer.id, element);
 * 
 * @fires LayerSystem#layer:created
 * @fires LayerSystem#layer:deleted
 * @fires LayerSystem#layer:reordered
 */
class LayerSystem {
  /**
   * Crea una instancia del sistema de capas.
   * @param {Object} options - Opciones de configuración
   * @param {number} [options.maxLayers=50] - Número máximo de capas
   * @param {string} [options.defaultLayerName='Nueva Capa'] - Nombre por defecto
   */
  constructor(options = {}) {
    // ...
  }

  /**
   * Crea una nueva capa.
   * @param {string} [name] - Nombre de la capa (opcional)
   * @returns {Layer} La capa creada
   * @throws {LayerLimitError} Si se excede el límite de capas
   * 
   * @example
   * const layer = system.createLayer('Mi Capa');
   * console.log(layer.id); // 'layer_1234567890_abc123'
   */
  createLayer(name) {
    // ...
  }
}
```

### 2. README de Módulos

#### ✅ DO: README por Módulo Complejo

```markdown
# Layer System

Sistema de gestión de capas para DragNDrop Editor.

## Instalación

El módulo se carga automáticamente en `index.html`.

## Uso Básico

```javascript
// Crear sistema de capas
const layers = new LayerSystem();

// Crear capa
const layer = layers.createLayer('Header');

// Agregar elemento a capa
layers.addElementToLayer(layer.id, document.getElementById('my-element'));

// Escuchar eventos
layers.on('layer:created', (layer) => {
  console.log('Nueva capa:', layer.name);
});
```

## API

### `createLayer(name?: string): Layer`
Crea una nueva capa.

### `deleteLayer(id: string): boolean`
Elimina una capa por ID.

### `moveLayer(id: string, newIndex: number): void`
Mueve una capa a nueva posición.

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `layer:created` | `Layer` | Capa creada |
| `layer:deleted` | `{ id: string }` | Capa eliminada |
| `layer:reordered` | `Layer[]` | Capas reordenadas |

## Arquitectura

```
LayerSystem
├── layers: Layer[]
├── activeLayerId: string | null
└── listeners: Map<string, Function[]>

Layer
├── id: string
├── name: string
├── visible: boolean
├── locked: boolean
├── elements: Element[]
└── createdAt: string
```
```

---

## 💬 Prácticas de Comunicación

### 1. Mensajes Claros

#### ✅ DO: Mensajes Estructurados

```markdown
# Mensaje: Solicitud de Tests

**De**: @dev
**Para**: @test
**Fecha**: 2025-12-10T14:00:00Z
**Prioridad**: ALTA

## Contexto
He completado la implementación del sistema de capas (FEAT-015).
El código está en `src/core/layerSystem.js`.

## Solicitud
Por favor crear tests unitarios para:
1. `createLayer()` - incluyendo límite de capas
2. `deleteLayer()` - incluyendo capa inexistente
3. `moveLayer()` - incluyendo edge cases de índices
4. Eventos - verificar que se emiten correctamente

## Archivos Relevantes
- `src/core/layerSystem.js` - Implementación
- `docs/LAYER_SYSTEM.md` - Documentación de API

## Deadline
Antes de EOD 2025-12-11 para poder integrar en release.

## Notas
- El módulo usa eventos custom, ver `_notifyLayerCreated()`
- Hay un límite configurable de capas (default 50)
```

#### ❌ DON'T: Mensajes Vagos

```markdown
# ❌ Malo

Hola, necesito tests para el código nuevo. Gracias.
```

### 2. Escalamiento Efectivo

#### ✅ DO: Escalar con Contexto

```markdown
# Escalamiento a Orchestrator

**De**: @dev
**Nivel**: 3 (Bloqueo Mayor)
**Timestamp**: 2025-12-10T15:30:00Z

## Situación
Necesito modificar `src/core/eventManager.js` para FEAT-015,
pero está bloqueado por @test para TASK-023.

## Impacto
- FEAT-015 bloqueada (prioridad ALTA)
- Deadline en riesgo: 2025-12-11

## Intentos de Resolución
1. Contacté a @test hace 2h - sin respuesta
2. Revisé si puedo trabajar sin ese archivo - no es posible

## Solicitud
Por favor mediar para:
1. Obtener ETA de @test
2. O forzar liberación si FEAT-015 tiene mayor prioridad
```

---

## 🎯 Prácticas de Calidad

### 1. Code Review

#### ✅ DO: Reviews Constructivos

```markdown
# Code Review: FEAT-015

## Resumen
Implementación sólida del sistema de capas. Algunos puntos a mejorar.

## ✅ Lo Bueno
- Arquitectura modular y extensible
- Buen manejo de eventos
- Documentación JSDoc completa

## 🔧 Sugerencias

### 1. Performance en `moveLayer()`
**Archivo**: `src/core/layerSystem.js:45`
**Actual**:
```javascript
this.layers.splice(oldIndex, 1);
this.layers.splice(newIndex, 0, layer);
```
**Sugerencia**: Considerar usar `Array.prototype.copyWithin()` para mejor performance con muchas capas.

### 2. Validación de Input
**Archivo**: `src/core/layerSystem.js:23`
**Sugerencia**: Agregar validación de tipo para `name` parameter.

## ❓ Preguntas
1. ¿Por qué límite de 50 capas? ¿Es configurable?
2. ¿Hay plan para persistencia de capas?

## Veredicto
✅ **APROBADO** con sugerencias menores
```

### 2. Definition of Done

#### ✅ DO: DoD Completo

```markdown
# Definition of Done - FEAT-015

## Código
- [x] Implementación completa según spec
- [x] Sin console.logs ni TODOs
- [x] JSDoc en todas las funciones públicas
- [x] Sigue code style del proyecto
- [x] Sin errores de linting

## Testing
- [x] Unit tests escritos (coverage >80%)
- [x] E2E tests para flujos principales
- [x] Todos los tests pasando
- [x] Sin tests flaky

## Documentación
- [x] README del módulo actualizado
- [x] CHANGELOG.md actualizado
- [x] Documentación de usuario si aplica

## Review
- [x] Code review aprobado por @test
- [x] QA review aprobado por @qa

## Integración
- [x] Merge a main sin conflictos
- [x] Build exitoso
- [x] Deploy a staging exitoso
- [x] Smoke test en staging pasado
```

---

## 🚫 Anti-Patrones a Evitar

### 1. Orquestación

| ❌ Anti-Patrón | ✅ Mejor Práctica |
|----------------|-------------------|
| Modificar sin bloqueo | Siempre solicitar bloqueo primero |
| Reportes esporádicos | Reportar cada 2 horas |
| Tareas sin criterios claros | Definir criterios de aceptación |
| Ignorar mensajes | Responder en <30 minutos |
| Mantener bloqueos innecesarios | Liberar inmediatamente al terminar |

### 2. Desarrollo

| ❌ Anti-Patrón | ✅ Mejor Práctica |
|----------------|-------------------|
| Código sin documentar | JSDoc en funciones públicas |
| Errores silenciosos | Errores informativos con contexto |
| Dependencias circulares | Módulos independientes |
| Optimización prematura | Medir primero, optimizar después |
| Copy-paste de código | Abstraer en funciones reutilizables |

### 3. Testing

| ❌ Anti-Patrón | ✅ Mejor Práctica |
|----------------|-------------------|
| Tests que solo verifican "truthy" | Tests que verifican comportamiento |
| Ignorar edge cases | Cubrir happy path + edge cases + errores |
| Tests dependientes entre sí | Tests independientes y aislados |
| Mocks excesivos | Mocks solo donde necesario |
| Tests lentos | Tests rápidos (<5s total) |

### 4. Comunicación

| ❌ Anti-Patrón | ✅ Mejor Práctica |
|----------------|-------------------|
| Mensajes vagos | Mensajes estructurados con contexto |
| Escalar sin intentar resolver | Documentar intentos de resolución |
| Asumir que otros saben | Explicar contexto completo |
| No responder | Responder aunque sea "recibido" |

---

## ✅ Checklists

### Checklist: Antes de Empezar Tarea

- [ ] Leí la especificación completa
- [ ] Entiendo los criterios de aceptación
- [ ] Identifiqué todos los archivos a modificar
- [ ] Solicité bloqueos necesarios
- [ ] Verifiqué que no hay conflictos
- [ ] Actualicé mi STATUS.md a WORKING

### Checklist: Durante el Trabajo

- [ ] Reporto progreso cada 2 horas
- [ ] Documento decisiones importantes
- [ ] Comunico bloqueos inmediatamente
- [ ] Sigo las convenciones del proyecto
- [ ] Escribo tests mientras desarrollo

### Checklist: Al Completar Tarea

- [ ] Código cumple todos los criterios
- [ ] Tests escritos y pasando
- [ ] Documentación actualizada
- [ ] Code review solicitado
- [ ] Bloqueos liberados
- [ ] STATUS.md actualizado a IDLE
- [ ] Reporte final generado

### Checklist: Code Review

- [ ] Código es legible y bien estructurado
- [ ] Nombres son descriptivos
- [ ] No hay código duplicado
- [ ] Errores se manejan apropiadamente
- [ ] Tests cubren casos importantes
- [ ] Documentación es clara
- [ ] No hay console.logs ni TODOs
- [ ] Performance es aceptable

---

## 🔗 Referencias

- [TASK_WORKFLOW.md](./TASK_WORKFLOW.md) - Flujo de trabajo de tareas
- [AGENT_ROLES.md](./AGENT_ROLES.md) - Roles y responsabilidades
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - Convenciones de nomenclatura
- [COMMUNICATION_PROTOCOL.md](../COMMUNICATION_PROTOCOL.md) - Protocolo de comunicación

---

**Sistema de Orquestación v1.0** - Mejores prácticas para excelencia operacional
