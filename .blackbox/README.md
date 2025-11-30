# 🤖 Blackbox Agents System - DragNDrop

## Descripción

Sistema de supervisión y automatización para desarrollo con Blackbox CLI agents.

## 📁 Estructura

```
.blackbox/
├── SUPERVISOR_COMMANDS.md    🔒 READ-ONLY - Comandos del supervisor
├── agents.config.json        ⚙️  Configuración de agents
├── templates/                📋 Templates para reportes
│   └── checkpoint-report.md
└── README.md                 📖 Esta documentación
```

## 🔒 Archivo Protegido

### SUPERVISOR_COMMANDS.md

**Permisos:** `r--r--r--` (444) - Solo lectura

**Contenido:**
- Protocolo de trabajo para agents
- Modelo de supervisión (Trust but Verify)
- Reglas de escalación
- Prohibiciones absolutas
- Quality gates
- Comandos activos
- Instrucciones específicas por agent

**Importante:** 
- ❌ Agents NO pueden modificar
- ✅ Agents DEBEN leer antes de cada task
- ✅ Supervisor puede actualizar cuando necesario

## 🤖 Agents Configurados

### @dev - Developer Agent
**Responsabilidades:**
- Implementar features
- Fix bugs
- Refactoring
- Code reviews

**Checkpoints:**
1. Planning - Antes de implementar
2. Code Review - Después de código
3. Pre-Deploy - Antes de deploy
4. Verification - Después de deploy

### @test - Tester Agent
**Responsabilidades:**
- Write unit tests
- Write E2E tests
- Coverage reports
- Regression testing

**Target:** 80%+ coverage

### @qa - QA Agent
**Responsabilidades:**
- Manual testing
- Accessibility audits
- Performance audits
- Cross-browser testing

**Target:** Lighthouse >90 all scores

### @devops - DevOps Agent
**Responsabilidades:**
- Deploy staging/production
- Monitoring
- Infrastructure
- CI/CD

**Rule:** Production deploys require supervisor approval

### @docs - Documentation Agent
**Responsabilidades:**
- Documentation
- API docs
- Tutorials
- Blog posts

## 📋 Workflow

### Typical Feature Flow

```
1. Agent reads SUPERVISOR_COMMANDS.md
2. Agent reads task file
3. [CHECKPOINT 1] Agent proposes plan
4. Supervisor approves/adjusts
5. Agent implements (autonomous)
6. [CHECKPOINT 2] Agent reports code complete
7. Supervisor reviews code
8. Agent fixes if needed
9. [CHECKPOINT 3] Agent ready for deploy
10. Supervisor approves deploy
11. Agent deploys
12. [CHECKPOINT 4] Agent verifies
13. Supervisor confirms
14. Task complete
```

## 🎯 Quality Gates

Mandatory for all tasks:

- ✅ Code Quality (lint, format, style)
- ✅ Testing (>80% coverage, all passing)
- ✅ Documentation (JSDoc, README, CHANGELOG)
- ✅ Review (self-review + supervisor)

## 🚨 Escalation

Agents MUST escalate:

**Immediate (Stop & Report):**
- Tests failing >30min
- Breaking change needed
- New dependency required
- Architecture change
- Security concern

**Informative (Report & Continue):**
- Design decision made
- Alternative implemented
- Edge case found

## 📊 Reporting

### Checkpoints
Location: `reports/checkpoints/`
Format: `[task-id]-checkpoint-[1-4].md`
Template: `.blackbox/templates/checkpoint-report.md`

### Daily Reports
Location: `reports/daily/`
Generated: Automated (if configured)

### Logs
Location: `.blackbox/tmp/`
Retention: 7 days

## 🔧 Configuration

### Edit Agent Config
```bash
vim .blackbox/agents.config.json
```

### Update Supervisor Commands (Supervisor Only)
```bash
# Remove read-only protection
chmod 644 .blackbox/SUPERVISOR_COMMANDS.md

# Edit
vim .blackbox/SUPERVISOR_COMMANDS.md

# Restore read-only
chmod 444 .blackbox/SUPERVISOR_COMMANDS.md
```

## 📞 Support

**For Agents:**
- Read: SUPERVISOR_COMMANDS.md
- Check: agents.config.json
- Report: Use checkpoint template

**For Supervisor:**
- Main docs: WORKFLOW.md
- Quick ref: workflows/WORKFLOWS_README.md
- Model explanation: SUPERVISOR_COMMANDS.md

---

*Last Updated: 2025-11-29*
*System Version: 1.0*
