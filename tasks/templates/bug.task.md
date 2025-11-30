---
type: bug
severity: [critical|high|medium|low]
priority: [p0|p1|p2|p3]
agent: @dev
assignee: TBD
estimated: 2h
created: YYYY-MM-DD
---

# Bug: [TÍTULO DESCRIPTIVO]

## 🐛 Descripción

[Descripción clara del bug]

## 🔍 Pasos para Reproducir

1. Ir a [página/sección]
2. Hacer click en [elemento]
3. Observar [comportamiento]

## ❌ Comportamiento Actual

[Qué pasa actualmente - incluir screenshots/videos si posible]

## ✅ Comportamiento Esperado

[Qué debería pasar]

## 🌍 Contexto del Entorno

### Browser
- [ ] Chrome (versión: ___)
- [ ] Firefox (versión: ___)
- [ ] Safari (versión: ___)
- [ ] Edge (versión: ___)

### Sistema Operativo
- [ ] Windows (versión: ___)
- [ ] macOS (versión: ___)
- [ ] Linux (distro: ___)

### Dispositivo
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

### App Version
- Version: [2.0.0]
- Commit: [hash]
- Environment: [production|staging|local]

## 📊 Impacto

### Severidad
- **Critical (P0):** App unusable, data loss, security issue
- **High (P1):** Major functionality broken, affects many users
- **Medium (P2):** Minor functionality broken, affects some users
- **Low (P3):** Cosmetic, minimal impact

**Este bug es:** [critical|high|medium|low]

### Afectados
- % de usuarios afectados: [estimado]
- Funcionalidad afectada: [cuál]
- Workaround disponible: [sí/no] - [descripción]

## 🔧 Análisis Técnico

### Root Cause
[Qué está causando el bug - investigar antes de fix]

### Archivos Afectados
```
src/
├── core/
│   └── [archivo].js (línea XX)
└── ...
```

### Logs/Errores
```
[Pegar logs relevantes aquí]
```

### Stack Trace
```
[Pegar stack trace si está disponible]
```

## 💡 Solución Propuesta

### Approach
[Cómo planeas fixear el bug]

### Cambios Requeridos
- [ ] Cambio en archivo 1
- [ ] Cambio en archivo 2
- [ ] Actualizar tests

### Alternativas Consideradas
1. **Opción A:** [descripción] - Pros: [...] - Cons: [...]
2. **Opción B:** [descripción] - Pros: [...] - Cons: [...]

**Opción elegida:** [A/B] porque [razón]

## 🧪 Testing Plan

### Regression Tests
```javascript
// Test específico para prevenir regresión
test('Bug #XXX - [descripción]', () => {
  // Reproducir scenario del bug
  // Verificar que esté fixed
});
```

### Manual Testing
- [ ] Verificar fix en scenario original
- [ ] Verificar edge cases relacionados
- [ ] Verificar no rompe otras funcionalidades
- [ ] Verificar en múltiples browsers
- [ ] Verificar en mobile

## 📖 Documentación

### Docs a Actualizar
- [ ] CHANGELOG.md (en sección Fixed)
- [ ] Known Issues (remover si estaba)
- [ ] FAQ (si es bug común)

### Communication
- [ ] Notificar usuarios afectados
- [ ] Update issue/ticket
- [ ] Discord announcement si critical

## 🎯 Definition of Done

### Fix
- [ ] Root cause identificado
- [ ] Fix implementado
- [ ] Code review aprobado
- [ ] No new bugs introducidos

### Testing
- [ ] Regression test agregado
- [ ] Tests existentes pasan
- [ ] Manual QA en múltiples browsers
- [ ] Edge cases verificados

### Deployment
- [ ] Deployed a staging
- [ ] Verificado en staging
- [ ] Deployed a production
- [ ] Verified en production

### Communication
- [ ] Issue cerrado
- [ ] Usuarios notificados
- [ ] Docs actualizadas
- [ ] Post-mortem (si P0/P1)

## 🚨 Hotfix Procedure (Solo P0/P1)

### Si es Critical
```bash
# 1. Create hotfix branch
git checkout master
git checkout -b hotfix/bug-XXX

# 2. Fix + minimal test
[make changes]

# 3. Fast-track deploy
git commit -m "hotfix: [descripción]"
git push origin hotfix/bug-XXX

# 4. Emergency deploy
vercel --prod

# 5. Post-mortem después
```

## 📊 Métricas

### Time to Resolution
- Reported: [timestamp]
- Started: [timestamp]
- Fixed: [timestamp]
- Deployed: [timestamp]
- **TTR:** [tiempo total]

### Impact Metrics
- Users affected: [número]
- Downtime: [si aplica]
- Revenue impact: [si aplica]

## 🔗 Referencias

- **Issue:** #[número]
- **PR:** #[número]
- **Related bugs:** [links]
- **Discussion:** [link a Discord/GitHub]

---

## 📝 Notas de Desarrollo

### Investigation Notes
[Notas durante investigación]

### Fix Notes
[Notas durante el fix]

### Post-Mortem (Si P0/P1)
- **What happened?**
- **Why did it happen?**
- **How did we fix it?**
- **How do we prevent it?**
- **Action items:**

---

**Creado:** YYYY-MM-DD
**Severity:** [critical|high|medium|low]
**Assignee:** @dev
**Status:** 🔴 Open | 🟡 In Progress | 🟢 Fixed | ✅ Verified
**Progress:** [    ] 0% → [████] 100%
