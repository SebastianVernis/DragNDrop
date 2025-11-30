# 📋 Checkpoint Report Template

> **Uso:** Los agents copian este template para reportar en checkpoints

---

## Checkpoint Report

**Task ID:** [TASK-XXX]
**Task Name:** [Nombre de la task]
**Agent:** @[dev|test|qa|devops|docs]
**Checkpoint:** [1-Planning | 2-Code Review | 3-Pre-Deploy | 4-Verification]
**Date:** YYYY-MM-DD HH:MM
**Status:** ⏳ Awaiting Supervisor Approval

---

## 📊 Summary

[Resumen conciso de qué se hizo hasta este checkpoint]

**Time Invested:** [Xh Xm]
**Completion:** [XX%]

---

## 📁 Current State

### Files Modified
```
- src/core/ejemplo.js (created, +150 lines)
- src/core/otro.js (modified, +20 -5 lines)
- index.html (modified, +3 lines)
- style.css (modified, +80 lines)
```

### Tests Status
```
Unit Tests: ✅ X passing, ❌ Y failing
E2E Tests: ⏳ Not yet written
Coverage: XX%
```

### Build Status
```
Build: ✅ Successful
Lint: ✅ No errors
Type Check: ✅ Passed (if applicable)
```

---

## 💡 Decisions Made

### Decision 1: [Título]
**What:** [Qué se decidió]
**Why:** [Rationale]
**Alternatives considered:** [Otras opciones]
**Impact:** [Alto/Medio/Bajo]

### Decision 2: [Título]
**What:** [Qué se decidió]
**Why:** [Rationale]
**Alternatives considered:** [Otras opciones]
**Impact:** [Alto/Medio/Bajo]

---

## ❓ Questions for Supervisor

1. **Question 1:**
   - Context: [contexto]
   - Options: [A, B, C]
   - Recommendation: [cuál recomiendas y por qué]

2. **Question 2:**
   - Context: [contexto]
   - Clarification needed: [qué necesitas aclarar]

---

## 🎯 Proposed Next Steps

**If approved, agent will:**

1. [ ] Step 1: [Descripción]
   - ETA: [tiempo]
   - Risk: [Bajo/Medio/Alto]

2. [ ] Step 2: [Descripción]
   - ETA: [tiempo]
   - Risk: [Bajo/Medio/Alto]

3. [ ] Step 3: [Descripción]
   - ETA: [tiempo]
   - Risk: [Bajo/Medio/Alto]

**Total ETA if approved:** [Xh]
**Next checkpoint:** [Checkpoint N+1] in [tiempo]

---

## 🚧 Blockers & Risks

### Current Blockers
- [ ] Blocker 1: [descripción]
  - Impact: [Alto/Medio/Bajo]
  - Needs: [qué se necesita para desblocar]

- [ ] Blocker 2: [descripción]
  - Impact: [Alto/Medio/Bajo]
  - Needs: [qué se necesita para desblocar]

### Identified Risks
- ⚠️ Risk 1: [descripción]
  - Probability: [Alta/Media/Baja]
  - Mitigation: [plan de mitigación]

- ⚠️ Risk 2: [descripción]
  - Probability: [Alta/Media/Baja]
  - Mitigation: [plan de mitigación]

---

## 📊 Metrics

### Code Metrics
```
Lines added: +XXX
Lines removed: -XXX
Files changed: X
Functions created: X
Complexity: [low|medium|high]
```

### Test Metrics (if applicable)
```
Tests written: X
Coverage increase: +XX%
Test execution time: Xs
```

### Performance Impact (if known)
```
Load time impact: [+/-]Xms
Bundle size impact: [+/-]XKB
Memory impact: [+/-]XMB
```

---

## 🔍 Quality Self-Check

**Agent self-assessment:**

### Code Quality
- [ ] Follows project code style
- [ ] No console.logs left
- [ ] No TODOs without tickets
- [ ] Functions are focused (SRP)
- [ ] Names are descriptive
- [ ] Error handling present

### Testing Quality (if checkpoint 2+)
- [ ] Tests written for new code
- [ ] Coverage target met
- [ ] Edge cases covered
- [ ] Tests are fast
- [ ] No flaky tests

### Documentation Quality
- [ ] JSDoc present
- [ ] Comments explain WHY not WHAT
- [ ] Public API documented
- [ ] Complex logic explained

---

## 📷 Evidence (Optional)

### Screenshots
[Links or embedded images]

### Logs
```
[Relevant logs if any]
```

### Demo
[Link to demo/preview if available]

---

## ✅ Readiness for Next Phase

**Agent believes task is ready for:**
- [ ] Supervisor review
- [ ] Next checkpoint
- [ ] Deployment (if final checkpoint)

**Confidence level:** [High | Medium | Low]

**Additional notes:**
[Any additional context for supervisor]

---

## 🎯 Supervisor Response Section

> **RESERVED:** Solo supervisor puede editar esta sección

### Decision

**Command:** [APPROVE | ADJUST | STOP | CANCEL]
**Date:** YYYY-MM-DD HH:MM

### Feedback

**Approved:**
- [x] Item 1
- [x] Item 2

**Needs Adjustment:**
- [ ] Adjustment 1: [specific instruction]
- [ ] Adjustment 2: [specific instruction]

### Additional Instructions

[Instrucciones adicionales del supervisor]

### Next Checkpoint Expected

**Checkpoint:** [number]
**ETA:** [tiempo estimado]
**Focus:** [qué verificar en próximo checkpoint]

---

**Supervisor Signature:** _______________
**Agent may proceed:** ✅ YES | ❌ NO | ⚠️ WITH ADJUSTMENTS

---

*Template Version: 1.0*
*Last Updated: 2025-11-29*
