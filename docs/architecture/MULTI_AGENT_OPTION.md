# 🤖 Opción: Desarrollo Acelerado con Multi-Agent AI

## 💡 Concepto

En lugar de 4 desarrolladores humanos trabajando en paralelo, usar **4 agentes de IA** (Blackbox API) trabajando simultáneamente en los 4 workflows, con un **AI Judge** seleccionando las mejores implementaciones.

---

## 🎯 Cómo Funciona

### Blackbox Multi-Agent Task API
```
POST https://cloud.blackbox.ai/api/multi-agent-tasks
```

**Features clave:**
- ✅ 2-5 agentes trabajan en paralelo en la misma tarea
- ✅ Cada agente crea su propia implementación
- ✅ AI Judge analiza y compara todas las soluciones
- ✅ Automáticamente selecciona la mejor
- ✅ Crea PR con la mejor solución
- ✅ Incluye diff analysis y comparación

**Agentes disponibles:**
- **Claude Agent**: Sonnet 4.5, Sonnet 4, Opus 4
- **Blackbox Agent**: BLACKBOX PRO, Claude Sonnet 4.5, GPT-5 Codex, Grok Code Fast (gratis ilimitado)
- **Codex Agent**: GPT-5, GPT-5 Codex, GPT-4.1
- **Gemini Agent**: Gemini 2.0 Flash, Gemini 2.5 Pro

---

## 🚀 Implementación Propuesta

### Workflow de Desarrollo con Multi-Agent

```javascript
// Script de automatización
const workflows = [
  {
    name: 'UI/UX Core',
    branch: 'feature/ui-core',
    tasks: [
      {
        prompt: `Implement a Layers/Hierarchy Panel for DragNDrop HTML Editor.

Requirements:
- Create LayersManager class in src/core/layersManager.js
- Tree view of all canvas elements with indentation
- Icons per element type (div, section, img, etc.)
- Drag & drop to reorder in tree
- Lock/unlock functionality
- Show/hide functionality
- Rename on double-click
- Search/filter
- Sync with canvas selection bidirectionally
- MutationObserver for DOM changes
- Virtual scrolling for 100+ elements
- Full JSDoc documentation
- Unit tests in tests/unit/layersManager.test.js

Files to create:
- src/core/layersManager.js
- src/components/LayersPanel.js
- src/styles/layers.css
- tests/unit/layersManager.test.js

Follow existing code patterns from src/core/resizeManager.js`,
        
        agents: [
          { agent: 'claude', model: 'claude-sonnet-4.5' },
          { agent: 'blackbox', model: 'blackboxai/blackbox-pro' },
          { agent: 'gemini', model: 'gemini-2.0-flash' },
          { agent: 'codex', model: 'gpt-5-codex' }
        ]
      },
      {
        prompt: `Implement Multi-Selection system for DragNDrop Editor...`,
        agents: [/* same 4 agents */]
      }
    ]
  },
  
  {
    name: 'AI & Smart',
    branch: 'feature/ai-smart',
    tasks: [
      {
        prompt: `Implement AI Component Generator using Gemini API.

Requirements:
- Create AIComponentGenerator class in src/ai/componentGenerator.js
- Direct fetch() calls to Gemini API (no SDK)
- Support 5 style presets (modern, classic, playful, minimal, corporate)
- Prompt optimization for token economy
- Response parsing robust
- UI modal with 3 steps (describe, generating, preview)
- Refinement loop capability
- Generate variations (3 different)
- Token tracking and cost calculation
- Cache similar generations
- Full error handling with retries
- JSDoc documentation
- Tests with mocked Gemini responses

Files:
- src/ai/componentGenerator.js
- src/ai/promptBuilder.js
- src/ai/responseParser.js
- src/components/aiGenerator/GeneratorModal.js
- tests/ai/componentGenerator.test.js

Follow pattern from src/core/geminiValidator.js`,
        
        agents: [
          { agent: 'claude', model: 'claude-sonnet-4.5' },
          { agent: 'blackbox', model: 'blackboxai/blackbox-pro' },
          { agent: 'gemini', model: 'gemini-2.5-pro' }
        ]
      }
    ]
  },
  
  {
    name: 'Backend & Auth',
    branch: 'feature/backend-auth',
    tasks: [
      {
        prompt: `Implement Better Auth integration for DragNDrop Editor backend.

Requirements:
- Express.js server in backend/server.js
- Better Auth config in backend/auth/config.js
- Drizzle ORM setup with PostgreSQL
- Email/password authentication
- Google OAuth
- GitHub OAuth
- Session management
- Auth middleware
- Database schema (user, session, account, verification)
- Extended schema (project, component, deployment tables)
- CRUD API for projects (/api/projects)
- Quota enforcement
- Frontend auth client in src/services/authService.js
- Tests for auth flows

Files:
- backend/server.js
- backend/auth/config.js
- backend/auth/middleware.js
- backend/db/schema.js
- backend/db/client.js
- backend/api/projects.js
- src/services/authService.js
- tests/backend/auth.test.js

Use Better Auth docs and Drizzle ORM best practices.`,
        
        agents: [
          { agent: 'claude', model: 'claude-sonnet-4.5' },
          { agent: 'blackbox', model: 'blackboxai/claude-sonnet-4.5' },
          { agent: 'codex', model: 'gpt-5' }
        ]
      }
    ]
  },
  
  {
    name: 'Deploy & Integrations',
    branch: 'feature/deploy-integrations',
    tasks: [
      {
        prompt: `Implement Vercel Deployment integration for DragNDrop Editor.

Requirements:
- VercelDeployer class in src/deploy/vercelDeployer.js
- OAuth flow for Vercel connection
- File upload with SHA-1 hashing
- Deployment creation via Vercel API v13
- Status monitoring with polling
- Progress updates in UI
- Deploy modal with 3 steps (config, deploying, success)
- Deployment history tracking
- Environment variables management
- Error handling and retry logic
- Tests with mocked Vercel API

Files:
- src/deploy/vercelDeployer.js
- src/deploy/fileUploader.js
- src/deploy/deploymentMonitor.js
- src/components/DeployModal.js
- tests/deploy/vercelDeployer.test.js

Follow Vercel API docs: https://vercel.com/docs/rest-api
Pattern similar to src/core/geminiValidator.js for API calls`,
        
        agents: [
          { agent: 'claude', model: 'claude-sonnet-4.5' },
          { agent: 'blackbox', model: 'blackboxai/gpt-5-codex' },
          { agent: 'gemini', model: 'gemini-2.0-flash' }
        ]
      }
    ]
  }
];
```

### Script de Automatización
```javascript
// scripts/run-multi-agent-tasks.js
import fetch from 'node-fetch';

const BLACKBOX_API_KEY = process.env.BLACKBOX_API_KEY;
const REPO_URL = 'https://github.com/SebastianVernis/DragNDrop.git';

async function createMultiAgentTask(workflow, task) {
  console.log(`\n🚀 Launching ${workflow.name}: ${task.prompt.split('\n')[0]}`);
  
  const response = await fetch('https://cloud.blackbox.ai/api/multi-agent-tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BLACKBOX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: task.prompt,
      repoUrl: REPO_URL,
      selectedBranch: workflow.branch,
      selectedAgents: task.agents
    })
  });

  const data = await response.json();
  
  console.log(`✅ Task created: ${data.task.id}`);
  console.log(`   Agents: ${task.agents.map(a => a.agent).join(', ')}`);
  
  return data.task;
}

async function monitorTask(taskId) {
  let status = 'pending';
  
  while (status === 'pending' || status === 'running') {
    await sleep(10000); // Check every 10s
    
    const response = await fetch(`https://cloud.blackbox.ai/api/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${BLACKBOX_API_KEY}`
      }
    });
    
    const data = await response.json();
    status = data.task.status;
    
    console.log(`   Progress: ${data.task.progress}% - ${status}`);
    
    // Mostrar logs
    if (data.task.logs && data.task.logs.length > 0) {
      const lastLog = data.task.logs[data.task.logs.length - 1];
      console.log(`   📝 ${lastLog}`);
    }
  }
  
  if (status === 'completed') {
    console.log(`✅ Task completed!`);
    
    // Mostrar análisis del AI Judge
    if (data.task.diffAnalysis) {
      console.log(`\n🏆 AI Judge Decision:`);
      console.log(`   Best Agent: ${data.task.diffAnalysis.bestAgent}`);
      console.log(`   Analysis:\n${data.task.diffAnalysis.analysis}`);
      
      // Mostrar stats de cada agente
      console.log(`\n📊 Agent Statistics:`);
      data.task.agentExecutions.forEach(exec => {
        const duration = new Date(exec.completedAt) - new Date(exec.executedAt);
        console.log(`   ${exec.agent}:`);
        console.log(`     Status: ${exec.status}`);
        console.log(`     Duration: ${(duration / 1000).toFixed(1)}s`);
        console.log(`     Branch: ${exec.branchName}`);
      });
    }
    
    // Mostrar PR
    if (data.task.prUrl) {
      console.log(`\n📝 Pull Request: ${data.task.prUrl}`);
    }
  } else {
    console.log(`❌ Task failed: ${data.task.error}`);
  }
  
  return data.task;
}

async function runWorkflow(workflow) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔵 Starting Workflow: ${workflow.name}`);
  console.log(`   Branch: ${workflow.branch}`);
  console.log(`   Tasks: ${workflow.tasks.length}`);
  console.log(`${'='.repeat(60)}`);
  
  for (const task of workflow.tasks) {
    const createdTask = await createMultiAgentTask(workflow, task);
    const completedTask = await monitorTask(createdTask.id);
    
    // Wait a bit antes de siguiente task
    await sleep(5000);
  }
}

async function runAllWorkflows() {
  console.log('🚀 DragNDrop Multi-Agent Development\n');
  
  // Ejecutar workflows en paralelo
  await Promise.all(
    workflows.map(workflow => runWorkflow(workflow))
  );
  
  console.log('\n✅ All workflows completed!');
  console.log('📝 Review PRs and merge the best implementations.');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run
runAllWorkflows().catch(console.error);
```

### Ejecutar
```bash
# Setup
export BLACKBOX_API_KEY="your_api_key_here"

# Run
node scripts/run-multi-agent-tasks.js
```

---

## 💰 Análisis de Costos

### Blackbox Multi-Agent Pricing

**Gratis (Grok Code Fast):**
- ✅ Unlimited tasks
- ✅ Funciona en multi-agent
- ⚠️ Menor calidad que modelos premium
- **Costo:** $0

**Paid Models:**
| Agent | Model | Costo Estimado/Task | Calidad |
|-------|-------|---------------------|---------|
| Claude | Sonnet 4.5 | ~$0.30 | ⭐⭐⭐⭐⭐ |
| Blackbox | BLACKBOX PRO | ~$0.20 | ⭐⭐⭐⭐ |
| Codex | GPT-5 Codex | ~$0.50 | ⭐⭐⭐⭐⭐ |
| Gemini | Gemini 2.5 Pro | ~$0.15 | ⭐⭐⭐⭐ |

**Multi-Agent Task (4 agentes):**
- **Costo**: ~$1.15 por task
- **Tasks totales estimados**: ~40 (10 por workflow)
- **Costo total**: ~$46

**Comparación:**
- **Freelancer humano**: $2,000-3,000/mes x 3 devs = $6,000-9,000
- **Multi-Agent AI**: $46 total
- **Ahorro**: ~99.5%

### Pero... (Realidad)

**Ventajas:**
- ✅ Extremadamente barato
- ✅ Trabaja 24/7
- ✅ Múltiples perspectivas
- ✅ Auto-testing
- ✅ PR automáticos

**Desventajas:**
- ❌ Requiere prompts MUY detallados (trabajo inicial alto)
- ❌ No entiende contexto complejo del proyecto
- ❌ Puede generar código que no integra bien
- ❌ Necesitas revisar TODO el código generado
- ❌ Debugging de código AI puede ser difícil
- ❌ Puede no seguir arquitectura existente
- ⚠️ Quality variable (especialmente con Grok Free)

---

## 🎯 Estrategia Híbrida Recomendada

### Opción A: AI-Assisted Development
**Mejor de ambos mundos**

```
Tú (humano) + AI Agents como asistentes

Workflow:
1. TÚ defines arquitectura y API contracts
2. TÚ implementas features core y complejas
3. AI AGENTS implementan features repetitivas/simples
4. TÚ revisas y refinas código AI
5. TÚ haces integration testing
```

**Tareas para AI Agents:**
- ✅ Boilerplate code (schemas, migrations, etc.)
- ✅ Tests unitarios
- ✅ CSS styling (siguiendo design system)
- ✅ Documentación (JSDoc, README sections)
- ✅ Refactoring simple
- ✅ Bug fixes específicos

**Tareas para TI (humano):**
- ✅ Arquitectura del sistema
- ✅ API contracts
- ✅ Core algorithms (alignment, merge, etc.)
- ✅ Integration testing
- ✅ Code review de AI
- ✅ Performance optimization
- ✅ Security review

**Timeline:**
- **Solo con AI assist**: 6-8 semanas
- **Costo**: $100-200 en API calls
- **Calidad**: Alta (tú controlas)

---

### Opción B: Multi-Agent Para Prototyping
**Acelerar prototipado inicial**

```
Workflow:
1. Usar Multi-Agent para generar 4 implementaciones
2. AI Judge selecciona la mejor
3. TÚ revisas y adaptas a tu arquitectura
4. TÚ refinas y optimizas
5. Repetir para siguiente feature
```

**Beneficios:**
- Ideas de implementación (4 enfoques diferentes)
- Código base para empezar
- Testing de diferentes architectures
- Aprendizaje de patterns

**Proceso:**
```javascript
// Ejemplo de uso
const task = {
  prompt: `Implement Layers Panel with tree view, drag & drop, lock/hide...`,
  agents: [
    { agent: 'claude', model: 'claude-sonnet-4.5' },
    { agent: 'blackbox', model: 'blackboxai/blackbox-pro' },
    { agent: 'gemini', model: 'gemini-2.5-pro' },
    { agent: 'codex', model: 'gpt-5-codex' }
  ]
};

// Resultado: 4 implementaciones diferentes
// TÚ eliges la mejor o combinas lo mejor de cada una
// Refinas y adaptas a tu código
```

**Timeline:**
- **Prototyping acelerado**: 3-4 semanas
- **Refinement humano**: 4-5 semanas
- **Total**: 7-9 semanas
- **Costo**: $200-300 en API + tu tiempo

---

## 🎯 Recomendación Final

### Para DragNDrop v1.0:

**Estrategia Híbrida (Opción A)**

#### Week 1-2: Foundation (TÚ)
```
TÚ implementas:
- ✅ Arquitectura base
- ✅ API contracts
- ✅ Core systems setup
```

#### Week 3-4: AI-Assisted Features
```
Multi-Agent para:
- ✅ Layers Panel (4 agentes comparan soluciones)
- ✅ Multi-Select (4 agentes)

TÚ:
- ✅ Review y selección de mejor implementación
- ✅ Adaptación a arquitectura
- ✅ Integration testing
```

#### Week 5-6: Complex Features (TÚ + AI)
```
TÚ implementas lógica core:
- ✅ Better Auth integration
- ✅ Cloud sync engine
- ✅ Conflict resolution

AI Agents para:
- ✅ Database migrations
- ✅ API endpoints boilerplate
- ✅ Tests unitarios
- ✅ JSDoc documentation
```

#### Week 7-8: AI Features (Multi-Agent Ideal)
```
Multi-Agent para:
- ✅ AI Component Generator (4 agentes)
- ✅ A11y Checker (3 agentes)
- ✅ SEO Optimizer (3 agentes)

TÚ:
- ✅ Integración con frontend
- ✅ Testing end-to-end
```

#### Week 9-10: Deploy & Polish
```
Multi-Agent para:
- ✅ Vercel deployer (3 agentes)
- ✅ Tutorial system (2 agentes)

TÚ:
- ✅ Integration testing
- ✅ Performance optimization
- ✅ Bug fixes
- ✅ Polish UI/UX
```

### Resultados Esperados

**Timeline**: 10 semanas (vs 12 semanas solo humano)  
**Costo**: $250-350 en APIs  
**Calidad**: Alta (revisado por ti)  
**Esfuerzo tuyo**: 60% (vs 100% todo manual)  
**Líneas de código AI**: ~40%  
**Líneas de código tuyo**: ~60%  

---

## 🛠️ Setup para Multi-Agent

### 1. Obtener API Key de Blackbox
```
1. Ir a: https://www.blackbox.ai/
2. Crear cuenta
3. Dashboard → API Keys
4. Crear API key
5. Copiar: bb_xxxxxx
```

### 2. Configurar Repo
```bash
# Asegurar que repo está en GitHub
git remote add origin https://github.com/SebastianVernis/DragNDrop.git
git push -u origin main

# Crear branches para cada workflow
git checkout -b feature/ui-core
git push -u origin feature/ui-core

git checkout main
git checkout -b feature/ai-smart
git push -u origin feature/ai-smart

# etc...
```

### 3. Crear Task
```bash
# Opción A: Via API
curl -X POST https://cloud.blackbox.ai/api/multi-agent-tasks \
  -H "Authorization: Bearer $BLACKBOX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Implement Layers Panel...",
    "repoUrl": "https://github.com/SebastianVernis/DragNDrop.git",
    "selectedBranch": "feature/ui-core",
    "selectedAgents": [
      { "agent": "claude", "model": "claude-sonnet-4.5" },
      { "agent": "blackbox", "model": "blackboxai/blackbox-pro" },
      { "agent": "gemini", "model": "gemini-2.0-flash" }
    ]
  }'

# Opción B: Via Web UI
# https://cloud.blackbox.ai
# Seleccionar repo
# Check "Multi Agent"
# Seleccionar 3-4 agentes
# Paste prompt
# Run
```

### 4. Monitorear Progreso
```javascript
// Check task status
const taskId = 'task_xyz123';

const response = await fetch(`https://cloud.blackbox.ai/api/tasks/${taskId}`, {
  headers: {
    'Authorization': `Bearer ${BLACKBOX_API_KEY}`
  }
});

const task = await response.json();

console.log(`Status: ${task.status}`);
console.log(`Progress: ${task.progress}%`);
console.log(`Logs:`, task.logs);

// Si completed
if (task.status === 'completed') {
  console.log(`Best Agent: ${task.diffAnalysis.bestAgent}`);
  console.log(`PR: ${task.prUrl}`);
}
```

### 5. Review PRs
```bash
# Ver PRs creados
gh pr list

# Cada agente crea un branch y PR
# Ej: agent-claude-task-xyz123
#     agent-blackbox-task-xyz123
#     agent-gemini-task-xyz123

# AI Judge ya seleccionó el mejor, pero TÚ decides merge
gh pr view 123
gh pr diff 123

# Si te gusta
gh pr merge 123 --squash

# Si quieres combinar mejores partes de varios
git checkout feature/ui-core
git cherry-pick <commits from different agent branches>
```

---

## 📊 Comparación de Estrategias

| Aspecto | 100% Manual | Multi-Agent Full | Híbrido (Recomendado) |
|---------|-------------|------------------|----------------------|
| **Timeline** | 12 semanas | 4-6 semanas | 10 semanas |
| **Costo** | $0 (tu tiempo) | $50-100 | $250-350 |
| **Tu esfuerzo** | 100% | 20% (review) | 60% |
| **Calidad código** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Consistencia** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Aprendizaje** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Control** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Velocidad** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Riesgo** | Bajo | Alto | Medio |

---

## 🎯 Casos de Uso Ideales para Multi-Agent

### ✅ USAR Multi-Agent Para:
1. **Boilerplate code** - CRUD APIs, schemas, migrations
2. **Tests** - Unit tests, fixtures, mocks
3. **Styling** - CSS siguiendo design system
4. **Documentation** - JSDoc, README sections
5. **Simple features** - Forms, modals, tooltips
6. **Refactoring** - Code cleanup, modernization
7. **Prototyping** - Explorar diferentes enfoques

### ❌ NO USAR Multi-Agent Para:
1. **Arquitectura core** - Requiere visión humana
2. **Integration logic** - Necesita entender todo el sistema
3. **Performance optimization** - Requiere profiling humano
4. **Security** - Demasiado crítico
5. **Complex algorithms** - Merge, conflict resolution, etc.
6. **UX decisions** - Necesita criterio humano

---

## 📝 Template de Prompt para Multi-Agent

```markdown
Implement [FEATURE NAME] for DragNDrop HTML Editor.

Context:
- This is a visual HTML editor built with vanilla JS
- Follow modular architecture (see src/core/ for examples)
- Use ES6+ modules
- Export via window object
- Include comprehensive JSDoc

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
- ...

Technical Specifications:
- Class name: [ClassName]
- File location: src/[path]/[file].js
- Dependencies: [list dependencies]
- API: [methods to expose]
- Events: [events to dispatch]

Files to Create/Modify:
- src/core/[feature].js - Main implementation
- src/components/[Feature]Panel.js - UI component
- src/styles/[feature].css - Styles
- tests/unit/[feature].test.js - Unit tests

Integration Points:
- Should integrate with: [existing module]
- Should listen to: [events]
- Should expose: [API methods]

Acceptance Criteria:
- [ ] All requirements implemented
- [ ] Tests passing (coverage > 75%)
- [ ] JSDoc complete
- [ ] Follows existing code patterns
- [ ] No console errors
- [ ] Lighthouse score not degraded

Reference Implementation:
See src/core/resizeManager.js for code style and patterns.

Additional Context:
[Any extra info, edge cases, etc.]
```

---

## 🎬 Conclusión

### Multi-Agent es Viable SI:
- ✅ Tienes tiempo para hacer prompts detallados
- ✅ Estás dispuesto a revisar TODO el código
- ✅ Puedes debuggear código que no escribiste
- ✅ Features son relativamente aisladas
- ✅ Tienes presupuesto pequeño ($50-500)

### Desarrollo Tradicional es Mejor SI:
- ✅ Quieres máximo control
- ✅ El proyecto requiere arquitectura compleja
- ✅ Tienes tiempo suficiente (3+ meses)
- ✅ Quieres aprender profundamente
- ✅ Presupuesto = 0

### Híbrido es Ideal SI:
- ✅ Quieres balance velocidad/calidad
- ✅ Presupuesto pequeño OK ($200-500)
- ✅ Timeline medio (2-3 meses)
- ✅ Quieres aprender pero también entregar rápido

---

## 🚀 Siguiente Paso

**¿Qué estrategia prefieres?**

1. **100% Manual** → Seguir con [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. **Multi-Agent Full** → Crear prompts detallados y lanzar agents
3. **Híbrido** → Usar AI para features simples, tú haces lo complejo

**Mi recomendación personal:** 
→ **Híbrido** - Usa Multi-Agent para generar primeras implementaciones de Layers, Multi-Select, y A11y Checker. TÚ haces Backend/Auth y Deploy (más crítico). Luego refinas todo.

---

**🤖 Listo para experimentar con Multi-Agent?**

**Setup inicial:**
```bash
# 1. Get API key from blackbox.ai
# 2. Install node-fetch
npm install node-fetch

# 3. Crear script
cat > scripts/multi-agent-test.js << 'EOF'
import fetch from 'node-fetch';

const task = await fetch('https://cloud.blackbox.ai/api/multi-agent-tasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bb_YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Add a simple button component to index.html',
    repoUrl: 'https://github.com/SebastianVernis/DragNDrop.git',
    selectedBranch: 'test-multi-agent',
    selectedAgents: [
      { agent: 'blackbox', model: 'blackboxai/grok-code-fast' }, // FREE
      { agent: 'gemini', model: 'gemini-2.0-flash' } // Cheap
    ]
  })
});

console.log(await task.json());
EOF

# 4. Run test
node scripts/multi-agent-test.js
```

**Ver resultado en:** https://cloud.blackbox.ai
