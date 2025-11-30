# 🎯 SUPERVISOR COMMANDS - READ ONLY

> **IMPORTANTE:** Este archivo es de SOLO LECTURA para agents.
> Solo el supervisor humano puede modificarlo.
> Los agents DEBEN leer y seguir las instrucciones aquí definidas.

---

## 📋 Sistema de Comandos

### Formato de Comandos

```yaml
---
command_id: CMD-001
date: 2025-11-29
priority: [critical|high|medium|low]
agent: [@dev|@test|@qa|@devops|@docs|@all]
status: [pending|in-progress|completed|cancelled]
---

## Command: [TÍTULO]

### Instruction
[Instrucción clara y específica]

### Context
[Contexto necesario]

### Expected Output
[Qué debe entregar el agent]

### Acceptance Criteria
- [ ] Criterio 1
- [ ] Criterio 2

### Deadline
[Fecha límite]
```

---

## 🚨 COMANDOS ACTIVOS

### CMD-001: LEER PRIMERO - Protocolo de Trabajo

```yaml
---
command_id: CMD-001
date: 2025-11-29
priority: critical
agent: @all
status: active
---
```

**Instruction:**
Todos los agents DEBEN seguir este protocolo:

1. **SIEMPRE leer este archivo PRIMERO** antes de ejecutar cualquier task
2. **NO modificar** este archivo bajo ninguna circunstancia
3. **Reportar** al supervisor antes de decisiones críticas
4. **Esperar aprobación** para cambios que afecten arquitectura
5. **Documentar** todas las decisiones tomadas

**Acceptance Criteria:**
- [ ] Agent confirma lectura de este archivo
- [ ] Agent entiende que NO puede modificarlo
- [ ] Agent conoce el proceso de escalación

**Status:** ✅ MANDATORY - Siempre activo

---

### CMD-002: Modelo de Supervisión

```yaml
---
command_id: CMD-002
date: 2025-11-29
priority: critical
agent: @all
status: active
---
```

**Instruction:**

**MODELO RECOMENDADO: "Supervisión por Checkpoints"**

#### Checkpoint-Based Model

Los agents trabajan de forma autónoma entre checkpoints, pero DEBEN pausar y reportar en puntos clave:

**Checkpoints Obligatorios:**

1. **Antes de Implementar** (Planning Checkpoint)
   - Agent presenta plan de implementación
   - Supervisor aprueba o ajusta
   - Agent procede

2. **Después de Código** (Code Review Checkpoint)  
   - Agent completa implementación
   - Agent ejecuta tests locales
   - Supervisor revisa código
   - Agent ajusta si necesario

3. **Después de Tests** (QA Checkpoint)
   - Agent completa tests
   - Coverage y calidad verificados
   - Supervisor aprueba
   - Agent procede a deploy

4. **Antes de Deploy** (Pre-Deploy Checkpoint)
   - Agent prepara deploy
   - Supervisor da go/no-go
   - Agent ejecuta deploy

**Ventajas de este modelo:**
✅ Agents trabajan autónomamente 80% del tiempo
✅ Supervisor tiene control en puntos críticos
✅ Balance perfecto autonomía/control
✅ Previene errores costosos
✅ Permite correcciones tempranas

**Status:** ✅ MODELO ACTIVO

---

### CMD-003: Reglas de Escalación

```yaml
---
command_id: CMD-003
date: 2025-11-29
priority: high
agent: @all
status: active
---
```

**Instruction:**

Los agents DEBEN escalar al supervisor en estos casos:

**Escalación Inmediata (STOP & REPORT):**
1. ❌ Tests fallan y no se puede fix en <30min
2. ❌ Breaking change necesario
3. ❌ Dependencia nueva requerida
4. ❌ Cambio de arquitectura necesario
5. ❌ Security concern identificado
6. ❌ Performance degradation >20%
7. ❌ Conflicto con task existente

**Escalación Informativa (REPORT & CONTINUE):**
1. ⚠️ Decisión de diseño tomada
2. ⚠️ Alternativa implementada
3. ⚠️ Edge case encontrado
4. ⚠️ Documentación ambigua
5. ⚠️ Optimization opportunity

**Formato de Reporte:**
```markdown
## Escalation Report

**Agent:** @[agent-name]
**Task:** [task-id]
**Issue:** [descripción]
**Proposed Solution:** [propuesta]
**Awaiting:** Supervisor approval
```

**Status:** ✅ ACTIVE

---

### CMD-004: Prohibiciones Absolutas

```yaml
---
command_id: CMD-004
date: 2025-11-29
priority: critical
agent: @all
status: active
---
```

**Instruction:**

Los agents NO PUEDEN hacer lo siguiente sin aprobación explícita:

**🚫 PROHIBIDO SIN APROBACIÓN:**

1. ❌ Modificar `SUPERVISOR_COMMANDS.md` (este archivo)
2. ❌ Deploy directo a producción sin checkpoint
3. ❌ Eliminar tests existentes
4. ❌ Cambiar API pública de módulos
5. ❌ Agregar dependencias npm nuevas
6. ❌ Modificar configuración de CI/CD
7. ❌ Cambiar estructura de archivos principal
8. ❌ Alterar git history (rebase, force push)
9. ❌ Modificar archivos de configuración críticos
10. ❌ Deshabilitar security checks

**Consecuencia:** Task cancelada + reporte obligatorio

**Status:** ✅ STRICT - No excepciones

---

### CMD-005: Quality Gates

```yaml
---
command_id: CMD-005
date: 2025-11-29
priority: high
agent: @all
status: active
---
```

**Instruction:**

**Quality Gates Obligatorios:**

Ningún código puede avanzar sin pasar estos gates:

**Gate 1: Code Quality**
- [ ] ESLint: 0 errors
- [ ] Code style: Consistente
- [ ] No console.logs
- [ ] No TODOs sin ticket
- [ ] Functions documented (JSDoc)

**Gate 2: Testing**
- [ ] Unit tests: Coverage >80%
- [ ] E2E tests: Scenarios críticos cubiertos
- [ ] All tests passing
- [ ] No flaky tests
- [ ] Performance tests (si aplica)

**Gate 3: Documentation**
- [ ] Code comments: Suficientes
- [ ] JSDoc: Completo
- [ ] README: Actualizado si necesario
- [ ] CHANGELOG: Entry agregado
- [ ] User docs: Actualizadas si necesario

**Gate 4: Review**
- [ ] Self-review: Completado
- [ ] Checklist: Todos items checked
- [ ] No known issues
- [ ] Ready for human review

**Status:** ✅ MANDATORY - Todos los gates requeridos

---

## 📝 CORRECCIONES DIRECTAS

### Formato para Correcciones Inmediatas

```yaml
---
correction_id: CORR-001
date: YYYY-MM-DD
agent: @[agent]
task: [task-id]
severity: [critical|high|medium|low]
---

## Correction: [TÍTULO]

### Issue Found
[Qué está mal]

### Required Fix
[Qué debe hacerse]

### Files Affected
- path/to/file.js:line

### Action Required
[Acción específica del agent]

### Verification
- [ ] Fix aplicado
- [ ] Tests passing
- [ ] Verified by supervisor
```

---

## 🎯 MODELO DE SUPERVISIÓN RECOMENDADO

### Opción A: "Trust but Verify" (Recomendado)

**Filosofía:** Agents trabajan autónomamente, supervisor verifica en checkpoints

**Workflow:**
```
Agent Task Assignment
    ↓
Agent Planning (5-10 min)
    ↓
[CHECKPOINT 1] Supervisor aprueba plan
    ↓
Agent Implementation (autónomo)
    ↓
Agent Self-QA (tests, lint)
    ↓
[CHECKPOINT 2] Supervisor code review
    ↓
Agent Fix issues (si hay)
    ↓
[CHECKPOINT 3] Supervisor aprueba deploy
    ↓
Agent Deploy
    ↓
[CHECKPOINT 4] Supervisor verifica producción
```

**Ventajas:**
✅ 80% del tiempo agents trabajan sin interrupciones
✅ 20% del tiempo supervisor verifica puntos críticos
✅ Previene problemas antes de producción
✅ Agents aprenden de feedback
✅ Balance perfecto autonomía/control

**Implementación:**
```bash
# Agent reporta en checkpoints
blackbox agent @dev --checkpoint planning --task dark-mode --report

# Supervisor revisa
cat reports/checkpoints/dark-mode-planning.md

# Supervisor aprueba
echo "APPROVED" > reports/checkpoints/dark-mode-planning.approval

# Agent continúa
blackbox agent @dev --checkpoint-approved --continue
```

---

### Opción B: "Pair Programming" (Alto Control)

**Filosofía:** Supervisor trabaja junto con agent en tiempo real

**Workflow:**
```
Supervisor define task
    ↓
Agent sugiere approach
    ↓
Supervisor ajusta
    ↓
Agent implementa paso a paso
    ↓
Supervisor aprueba cada paso
    ↓
Agent ejecuta
    ↓
(Repetir para cada paso)
```

**Ventajas:**
✅ Control total en tiempo real
✅ Correcciones inmediatas
✅ Aprendizaje conjunto
✅ Cero sorpresas

**Desventajas:**
⚠️ Requiere atención constante
⚠️ Más lento
⚠️ Supervisor es bottleneck

---

### Opción C: "Review & Iterate" (Bajo Control)

**Filosofía:** Agent completa task completo, supervisor revisa al final

**Workflow:**
```
Agent recibe task
    ↓
Agent completa implementación completa
    ↓
Agent ejecuta tests
    ↓
Agent crea PR
    ↓
Supervisor revisa PR completo
    ↓
Agent aplica feedback
    ↓
Merge cuando aprobado
```

**Ventajas:**
✅ Máxima velocidad
✅ Agent totalmente autónomo
✅ Supervisor revisa solo al final

**Desventajas:**
⚠️ Riesgo de rehacer trabajo
⚠️ Correcciones tardías son costosas
⚠️ Posibles desviaciones del objetivo

---

## ✅ MODELO RECOMENDADO: OPCIÓN A

**"Trust but Verify" con 4 Checkpoints**

### Razones:

1. **Balance perfecto** entre autonomía y control
2. **Previene problemas** antes que sean costosos
3. **Agents aprenden** de feedback temprano
4. **Supervisor eficiente** - solo 20% del tiempo
5. **Escalable** - funciona con múltiples agents
6. **Probado** en equipos profesionales

### Implementación para DragNDrop:

```yaml
# Checkpoint 1: Planning (5 min)
Agent: "Voy a implementar dark mode con CSS variables"
Supervisor: "Aprobado, considera también localStorage"
Agent: "Entendido, agregando persistencia"

# [Agent trabaja 2 horas autónomamente]

# Checkpoint 2: Code Review (10 min)
Agent: "Código completo, tests pasando"
Supervisor: "Reviso... Agregar transition en cambio de theme"
Agent: "Agregado, re-testing"

# [Agent ajusta 15 minutos]

# Checkpoint 3: Pre-Deploy (5 min)
Agent: "Listo para staging"
Supervisor: "Deploy aprobado"
Agent: "Deploying..."

# [Agent deploys]

# Checkpoint 4: Verification (5 min)
Agent: "Deployed, funcionando"
Supervisor: "Verificado, excelente trabajo"
Agent: "Task completada"
```

**Tiempo total supervisor:** ~25 min de 4 horas = 10% overhead

---

## 📋 TEMPLATE: Checkpoint Report

### Agents usan este template para reportar

```markdown
## Checkpoint Report

**Task:** [task-id]
**Agent:** @[agent-name]
**Checkpoint:** [1-Planning | 2-Code Review | 3-Pre-Deploy | 4-Verification]
**Date:** YYYY-MM-DD HH:MM

### Summary
[Qué se hizo hasta ahora]

### Current State
- Files modified: [lista]
- Tests status: [passing/failing]
- Coverage: [X%]

### Decisions Made
1. [Decisión 1 y rationale]
2. [Decisión 2 y rationale]

### Questions for Supervisor
1. [Pregunta 1]
2. [Pregunta 2]

### Proposed Next Steps
[Qué hará el agent después de aprobación]

### Blockers
[Cualquier blocker identificado]

---

**Awaiting:** ✋ Supervisor Approval
**ETA if approved:** [tiempo estimado]
```

---

## 🎯 COMANDOS SUPERVISOR → AGENTS

### Comando: Aprobar y Continuar

```yaml
---
supervisor_command: APPROVE
checkpoint_id: [id]
agent: @[agent]
---

✅ APPROVED - Proceed with proposed next steps

Additional notes:
[Notas adicionales si hay]
```

### Comando: Ajustar y Re-evaluar

```yaml
---
supervisor_command: ADJUST
checkpoint_id: [id]
agent: @[agent]
---

⚠️ ADJUSTMENTS REQUIRED

Changes needed:
1. [Cambio específico 1]
2. [Cambio específico 2]

Rationale:
[Por qué estos cambios]

Re-submit checkpoint after adjustments.
```

### Comando: Detener y Replantear

```yaml
---
supervisor_command: STOP
checkpoint_id: [id]
agent: @[agent]
---

🛑 STOP - Rethink approach

Issues:
- [Issue 1]
- [Issue 2]

Required:
New proposal needed considering:
- [Consideración 1]
- [Consideración 2]

Submit new planning checkpoint.
```

### Comando: Cancelar Task

```yaml
---
supervisor_command: CANCEL
task_id: [id]
agent: @[agent]
---

❌ TASK CANCELLED

Reason:
[Razón de cancelación]

Action:
- Revert changes if any
- Close related issues
- Update task status
```

---

## 🔒 REGLAS DE PROTECCIÓN

### Este Archivo NO PUEDE:

1. ❌ Ser modificado por agents
2. ❌ Ser eliminado
3. ❌ Ser renombrado
4. ❌ Ser movido de ubicación
5. ❌ Tener permisos cambiados por agents

### Verificación de Integridad

```bash
# Hash del archivo original (supervisor guarda esto)
# sha256: [hash]

# Agents pueden verificar pero no modificar
sha256sum .blackbox/SUPERVISOR_COMMANDS.md

# Si hash cambia = modificación no autorizada = alerta
```

---

## 📊 LOG DE COMANDOS

### Historial de Comandos Emitidos

```markdown
## 2025-11-29

### CMD-001 - Protocolo de Trabajo
- Emitido: 14:00
- Agent: @all
- Status: ✅ Active
- Compliance: Pending agent acknowledgment

### CMD-002 - Modelo de Supervisión  
- Emitido: 14:05
- Agent: @all
- Status: ✅ Active
- Model: Checkpoint-Based (Opción A)

### CMD-003 - Reglas de Escalación
- Emitido: 14:10
- Agent: @all
- Status: ✅ Active
- Compliance: All agents must follow

---

## [Fecha Futura]

### CMD-XXX - [Comando Futuro]
[Template para futuros comandos]
```

---

## 🎯 INSTRUCCIONES ESPECÍFICAS ACTUALES

### Para @dev Agent

```yaml
---
agent: @dev
instruction: current-focus
priority: high
---

**Current Focus:** Tema Oscuro (Dark Mode)

**Task:** tasks/active/03-theme-oscuro.task.md

**Specific Instructions:**
1. Implementar usando CSS variables (NO hardcoded colors)
2. Seguir naming convention: --color-* para variables
3. Transición smooth de 0.3s
4. Persistir en localStorage con key: 'dragndrop_theme'
5. Detectar preferencia de sistema al primer uso
6. Toggle button en toolbar después del botón de Live Preview

**Checkpoint 1 Required:**
Antes de implementar, reportar:
- Estructura de CSS variables propuesta
- Dónde irá el toggle button
- Plan de persistencia

**DO NOT:**
- No cambiar colores existentes en style.css directamente
- No agregar librerías externas
- No modificar estructura del DOM sin necesidad

**MUST:**
- Usar CSS variables para todo
- Escribir al menos 10 tests
- Documentar con JSDoc
```

---

### Para @test Agent

```yaml
---
agent: @test
instruction: testing-standards
priority: high
---

**Current Focus:** Expandir coverage a 80%

**Task:** tasks/active/02-expand-testing.task.md

**Testing Standards:**
1. Descriptive test names: "debe hacer X cuando Y"
2. Arrange-Act-Assert pattern
3. Un test = un concepto
4. Mock dependencies apropiadamente
5. No test interdependientes
6. Fast tests (<100ms cada uno)

**Coverage Requirements:**
- Lines: >80%
- Functions: >80%
- Branches: >75%
- Statements: >80%

**Checkpoint 1 Required:**
Después de cada módulo testeado, reportar:
- Tests escritos (count)
- Coverage alcanzado
- Issues encontrados
- Tiempo tomado

**DO NOT:**
- No skip tests
- No disable coverage thresholds
- No flaky tests (randomness)

**MUST:**
- Edge cases cubiertos
- Error scenarios tested
- Async code tested properly
```

---

### Para @qa Agent

```yaml
---
agent: @qa
instruction: quality-standards
priority: high
---

**Quality Standards Enforced:**

**Performance:**
- Lighthouse Performance: >90
- FCP: <1.8s
- LCP: <2.5s
- TTI: <3.8s
- CLS: <0.1

**Accessibility:**
- Lighthouse Accessibility: >95
- WCAG 2.1 AA: Compliant
- Keyboard navigation: Functional
- Screen reader: Compatible
- Color contrast: >4.5:1

**SEO:**
- Lighthouse SEO: >95
- Meta tags: Complete
- Structured data: Valid
- Mobile-friendly: Yes

**Checkpoint Required:**
Antes de aprobar para production:
- [ ] Full audit completado
- [ ] All scores >90
- [ ] No critical issues
- [ ] Cross-browser verified

**Report Format:**
```markdown
## QA Report

**Task:** [id]
**Date:** [date]

### Lighthouse Scores
- Performance: [score]/100
- Accessibility: [score]/100
- Best Practices: [score]/100
- SEO: [score]/100

### Issues Found
1. [Issue 1] - Severity: [level]
2. [Issue 2] - Severity: [level]

### Recommendation
[APPROVE | REJECT | NEEDS WORK]
```
```

---

### Para @devops Agent

```yaml
---
agent: @devops
instruction: deployment-rules
priority: critical
---

**Deployment Rules:**

**Staging:**
- Can deploy automatically after tests pass
- Must report deployment
- Must verify health check

**Production:**
- MUST wait for supervisor approval
- MUST have all quality gates passed
- MUST have backup plan
- MUST monitor for 30min post-deploy

**Rollback Procedure:**
If any of these occur in production:
- Error rate >1%
- Performance degradation >20%
- Critical bug reported
- Supervisor command

Execute immediate rollback:
```bash
vercel rollback --yes
# Notify supervisor
# Post-mortem required
```

**Checkpoint Before Production:**
```markdown
## Pre-Production Checklist

- [ ] All tests passing
- [ ] QA approved
- [ ] Docs updated
- [ ] CHANGELOG updated
- [ ] Backup verified
- [ ] Rollback tested
- [ ] Monitoring ready
- [ ] Supervisor APPROVED

Only proceed if ALL checked.
```
```

---

### Para @docs Agent

```yaml
---
agent: @docs
instruction: documentation-standards
priority: medium
---

**Documentation Standards:**

**Code Documentation:**
- JSDoc for all public functions
- Parameter types specified
- Return types specified
- Examples included
- Edge cases noted

**User Documentation:**
- Clear language (no jargon without explanation)
- Step-by-step instructions
- Screenshots/GIFs when helpful
- Common issues section
- Examples of usage

**API Documentation:**
- All endpoints documented
- Request/response examples
- Error codes explained
- Rate limits noted (if any)

**Checkpoint for Major Docs:**
Before publishing tutorials/major docs:
- [ ] Technical accuracy verified
- [ ] Grammar/spelling checked
- [ ] Links working
- [ ] Code examples tested
- [ ] Supervisor reviewed
```

---

## 🚨 COMANDOS DE EMERGENCIA

### EMERGENCY-001: Stop All Work

```yaml
---
command: EMERGENCY_STOP
agent: @all
priority: critical
---

🚨 STOP ALL WORK IMMEDIATELY

All agents must:
1. Stop current task
2. Save current state
3. Report status
4. Await instructions

Do NOT:
- Commit anything
- Deploy anything
- Delete anything

Reason: [Will be provided]
```

### EMERGENCY-002: Rollback Production

```yaml
---
command: EMERGENCY_ROLLBACK
agent: @devops
priority: critical
---

🚨 ROLLBACK PRODUCTION NOW

@devops execute:
1. Immediate rollback to previous version
2. Verify rollback successful
3. Check health endpoints
4. Report status
5. Investigate issue

Post-rollback:
- Post-mortem required
- Root cause analysis
- Prevention plan
```

---

## 📋 AGENT ACKNOWLEDGMENT

### Agents Must Acknowledge Reading

```yaml
---
acknowledgment_log: true
---

## @dev Agent
- [ ] Read SUPERVISOR_COMMANDS.md
- [ ] Understand checkpoint model
- [ ] Understand prohibitions
- [ ] Understand quality gates
- [ ] Ready to work under supervision

Date: ________
Signature: ________

## @test Agent
- [ ] Read SUPERVISOR_COMMANDS.md
- [ ] Understand testing standards
- [ ] Understand coverage requirements
- [ ] Ready to work under supervision

Date: ________
Signature: ________

## @qa Agent
- [ ] Read SUPERVISOR_COMMANDS.md
- [ ] Understand quality standards
- [ ] Understand audit requirements
- [ ] Ready to work under supervision

Date: ________
Signature: ________

## @devops Agent
- [ ] Read SUPERVISOR_COMMANDS.md
- [ ] Understand deployment rules
- [ ] Understand rollback procedure
- [ ] Ready to work under supervision

Date: ________
Signature: ________

## @docs Agent
- [ ] Read SUPERVISOR_COMMANDS.md
- [ ] Understand documentation standards
- [ ] Ready to work under supervision

Date: ________
Signature: ________
```

---

## 🎉 RESUMEN DEL SISTEMA

### Modelo de Supervisión: "Trust but Verify"

✅ **4 Checkpoints** por task
✅ **Agents autónomos** entre checkpoints (80% del tiempo)
✅ **Supervisor verifica** en puntos críticos (20% del tiempo)
✅ **Quality gates** automáticos
✅ **Escalation rules** claras
✅ **Emergency procedures** definidas

### Beneficios:

1. **Velocidad:** Agents trabajan sin interrupciones constantes
2. **Calidad:** Supervisor previene problemas en checkpoints
3. **Aprendizaje:** Agents mejoran con feedback
4. **Control:** Supervisor mantiene control en puntos críticos
5. **Escalabilidad:** Funciona con 1 o múltiples agents

### Overhead:

- Supervisor time: ~20-30 min por task de 4h
- Agent time: ~5-10 min por checkpoint (4 checkpoints)
- Total overhead: ~15% (worth it para prevenir errores)

---

## 📞 Contacto con Supervisor

### Cómo Reportar

**Durante checkpoints:**
```bash
# Agent genera reporte
blackbox agent @dev --checkpoint planning --report

# Reporte guardado en:
reports/checkpoints/[task-id]-[checkpoint].md

# Supervisor revisa y responde
```

**Para escalaciones:**
```bash
# Agent escala issue
blackbox agent @dev --escalate "Issue description" --severity high

# Notificación al supervisor (Discord/Email)

# Supervisor responde con comando
```

---

## ✅ STATUS DE ESTE SISTEMA

**Sistema de Supervisión: ACTIVO**

- Modelo elegido: ✅ Trust but Verify (Opción A)
- Checkpoints: ✅ 4 definidos
- Agents configurados: ✅ 5 agents
- Quality gates: ✅ Definidos
- Emergency procedures: ✅ Ready
- Agent acknowledgment: ⏳ Pending

**Próximo paso:** Agents deben acknowledg este archivo antes de comenzar trabajo.

---

**RECORDATORIO FINAL PARA AGENTS:**

🔒 Este archivo es INMUTABLE por agents
👀 SIEMPRE leer antes de comenzar task
✋ DETENER en checkpoints y reportar
🚨 ESCALAR cuando sea necesario
✅ SEGUIR quality gates siempre

---

*Creado: 29 de Noviembre, 2025*
*Supervisor: Sebastian Vernis*
*Modelo: Trust but Verify con 4 Checkpoints*
*Status: ACTIVE & ENFORCED*
