# 🔄 Workflows - DragNDrop

## Descripción

Este directorio contiene workflows automatizados usando Blackbox CLI y scripts bash para development, testing, deployment, y más.

## 📁 Estructura

```
workflows/
├── development/          # Dev workflows
│   ├── start-feature.sh     ✅ Iniciar nueva feature
│   └── complete-feature.sh  ✅ Completar feature + PR
├── testing/              # Testing workflows
│   └── run-full-suite.sh    ✅ Suite completa de tests
├── deployment/           # Deploy workflows
│   ├── deploy-staging.sh
│   └── deploy-production.sh
├── documentation/        # Docs workflows
│   ├── update-docs.sh
│   └── generate-api-docs.sh
└── marketing/            # Marketing workflows
    └── prepare-launch.sh
```

## 🚀 Quick Start

### Iniciar Nueva Feature

```bash
./workflows/development/start-feature.sh "dark-mode"
```

Esto hará:
1. ✅ Crear branch `feature/dark-mode`
2. ✅ Crear task file desde template
3. ✅ Verificar tests pasan
4. ✅ Abrir workspace

### Completar Feature

```bash
./workflows/development/complete-feature.sh
```

Esto hará:
1. ✅ Lint code
2. ✅ Run tests
3. ✅ Check coverage
4. ✅ Build project
5. ✅ Commit changes
6. ✅ Push to remote
7. ✅ Create PR
8. ✅ Move task to completed

### Run Full Test Suite

```bash
./workflows/testing/run-full-suite.sh
```

Esto ejecutará:
1. ✅ Unit tests
2. ✅ Coverage check (>80%)
3. ✅ E2E tests
4. ✅ Linting
5. ✅ Build check

## 🤖 Usando Blackbox CLI Agents

### Ejemplos de Uso

```bash
# Implementar feature con @dev agent
blackbox agent @dev --task tasks/active/01-landing-page.task.md

# Escribir tests con @test agent
blackbox agent @test --module src/core/themeManager.js --coverage 80

# QA audit con @qa agent
blackbox agent @qa --audit full --report

# Deploy con @devops agent
blackbox agent @devops --deploy staging

# Update docs con @docs agent
blackbox agent @docs --update feature/dark-mode
```

## 📋 Task Templates

### Crear Task desde Template

```bash
# Feature
cp tasks/templates/feature.task.md tasks/active/my-feature.task.md

# Bug
cp tasks/templates/bug.task.md tasks/active/fix-something.task.md
```

## 🔧 Configuración

### Agents Config

Ver `.blackbox/agents.config.json` para configuración de agents.

### Environment Variables

```bash
# .env (crear si necesario)
DISCORD_WEBHOOK=your_webhook_url
VERCEL_TOKEN=your_token
SENTRY_DSN=your_dsn
```

## 📊 Workflow Típico

### Feature Development

```
1. start-feature.sh "feature-name"
   └─ Crea branch + task file
   
2. Implement feature
   └─ Código + tests + docs
   
3. complete-feature.sh
   └─ Tests + commit + PR
   
4. Review & merge
   └─ Code review + QA
   
5. Deploy
   └─ Staging → Production
```

### Bug Fix

```
1. Create bug task
2. Fix issue
3. Add regression test
4. Deploy hotfix (if critical)
```

## 🎯 Best Practices

1. **Siempre usar branches** - No commits directos a master
2. **Tests antes de commit** - No romper CI
3. **Descriptive commits** - Seguir conventional commits
4. **Update task files** - Mantener tracking actualizado
5. **Review checklist** - Seguir DoD en templates

## 📞 Ayuda

Para más información ver:
- `WORKFLOW.md` - Documentación completa de workflows
- `.blackbox/agents.config.json` - Configuración de agents
- `tasks/templates/` - Templates disponibles

---

*Última actualización: 29 de Noviembre, 2025*
