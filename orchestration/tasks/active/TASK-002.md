# TASK-002: Fix 38 Failing Tests

**Tipo**: Bug Fix  
**Prioridad**: 🔴 CRÍTICA  
**Estimación**: 4h  
**Deadline**: 2025-12-11 (2 días)  
**Agente Recomendado**: @test  

---

## 📋 Descripción

Corregir los 38 tests que están fallando actualmente en el proyecto. Esto está bloqueando el desarrollo y CI/CD.

## 🎯 Objetivos

- [ ] Identificar causa de cada fallo
- [ ] Corregir tests sin modificar funcionalidad
- [ ] Asegurar que todos pasen consistentemente
- [ ] No introducir nuevos fallos
- [ ] Documentar cambios necesarios

## 📁 Archivos a Revisar

### Tests Fallando (Principales)
```
tests/unit/multiSelect.test.js (múltiples fallos)
tests/unit/core/*.test.js
tests/unit/components/*.test.js
```

### Archivos de Soporte (Solo Lectura)
```
src/core/multiSelect.js
src/core/keyboardShortcuts.js
src/components/fileLoader.js
jest.config.js
```

## 🔧 Análisis Inicial

### Errores Comunes Detectados
1. **ReferenceError**: Variables no definidas
2. **TypeError**: Cannot read property of undefined
3. **Mocking Issues**: Dependencias no mockeadas correctamente
4. **DOM Issues**: JSDOM no configurado properly
5. **Event Handling**: Eventos no disparándose correctamente

### Ejemplo de Error
```
ReferenceError: showToast is not defined
  at Object.showToast (tests/unit/multiSelect.test.js:178:7)
```

## ✅ Definition of Done

- [ ] 0 tests fallando
- [ ] Coverage se mantiene o mejora
- [ ] Tests corren en <5 segundos
- [ ] No warnings en consola
- [ ] CI/CD pipeline verde
- [ ] Documentación de cambios

## 🚫 Restricciones

- NO modificar lógica de negocio
- NO desactivar tests
- NO reducir assertions
- Mantener mocks mínimos
- Seguir patrones AAA

## 📊 Estado Actual vs Objetivo

### Actual
```
Test Suites: 4 failed, 7 passed, 11 total
Tests:       38 failed, 147 passed, 185 total
```

### Objetivo
```
Test Suites: 11 passed, 11 total
Tests:       185 passed, 185 total
Coverage:    >40% (actual)
```

## 🐛 Tests Específicos a Corregir

1. MultiSelect module (15 fallos)
2. KeyboardShortcuts (8 fallos)
3. FileLoader (5 fallos)
4. Otros componentes (10 fallos)

---

**Comando para ejecutar**: `npm test`  
**Ver errores completos**: `npm test -- --verbose`