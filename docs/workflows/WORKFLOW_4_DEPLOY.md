# 🟠 Workflow 4: Deploy & Integrations

**Branch:** `feature/deploy-integrations`  
**Duración:** 20 días  
**Responsable:** DevOps Developer  

---

## 🎯 Objetivos

1. ✅ Vercel deployment con 1 click
2. ✅ Git integration (GitHub API)
3. ✅ Interactive tutorial system
4. ✅ Deployment monitoring y history

---

## 📅 Timeline

### Semana 1-2: Vercel Integration (Días 1-10)
- [ ] Días 1-5: Vercel API (OAuth, upload, deploy)
- [ ] Días 6-10: Deploy UI modal + monitoring

### Semana 2-3: Git Integration (Días 11-16)
- [ ] Días 11-14: GitHub API (OAuth, create repo, commit)
- [ ] Días 15-16: Git panel UI

### Semana 3+: Tutorial System (Días 17-20)
- [ ] Días 17-19: Tutorial engine + steps
- [ ] Día 20: Integration y polish

---

## 📁 Archivos a Crear

```
src/
  deploy/
    ✅ vercelDeployer.js         # Main deployer
    ✅ fileUploader.js           # File upload logic
    ✅ deploymentMonitor.js      # Status monitoring
    ✅ envVarsManager.js         # Environment variables
    ✅ deploymentHistory.js      # History tracking
  
  integrations/
    ✅ gitIntegration.js         # GitHub API wrapper
    ✅ repoManager.js            # Repo operations
    ✅ commitBuilder.js          # Create commits
  
  tutorial/
    ✅ tutorialEngine.js         # Tutorial system
    ✅ steps.js                  # Tutorial steps definition
    ✅ spotlight.js              # Highlight components
  
  components/
    ✅ DeployModal.js            # Deploy UI
    ✅ DeploymentHistory.js      # History list
    ✅ GitPanel.js               # Git operations UI
    ✅ TutorialTooltip.js        # Tutorial tooltip

  styles/
    ✅ deploy.css
    ✅ git-panel.css
    ✅ tutorial.css

tests/
  deploy/
    ✅ vercelDeployer.test.js
    ✅ fileUploader.test.js
  
  integration/
    ✅ deployment-flow.test.js
```

---

## 🔗 API Contracts (Proveer para otros workflows)

```javascript
// Exponer globalmente
window.vercelDeployer = {
  deploy(projectName, files),
  getDeploymentStatus(id),
  monitorDeployment(id),
  getDeploymentHistory(),
  connectVercel(),
  disconnectVercel(),
  isConnected()
};

window.gitIntegration = {
  connectGitHub(),
  createRepo(name, description, isPrivate),
  commit(message, files),
  push(),
  getCurrentRepo(),
  getBranches(),
  isConnected()
};

window.tutorial = {
  start(),
  next(),
  prev(),
  skip(),
  reset(),
  complete()
};

// Events
window.addEventListener('deploy:start', ({ detail }) => {});
window.addEventListener('deploy:progress', ({ detail }) => {});
window.addEventListener('deploy:complete', ({ detail }) => {});
window.addEventListener('deploy:error', ({ detail }) => {});

window.addEventListener('git:commit', ({ detail }) => {});
window.addEventListener('git:push', ({ detail }) => {});

window.addEventListener('tutorial:step', ({ detail }) => {});
window.addEventListener('tutorial:complete', ({ detail }) => {});
```

---

## 🔑 API Keys Necesarias

### Vercel Token
```
1. Ir a: https://vercel.com/account/tokens
2. Create Token
3. Name: DragNDrop Editor
4. Scope: Full Account
5. Expiration: 1 year
6. Copiar token (empieza con vercel_...)
```

### Vercel OAuth (para user connections)
```
1. Ir a: https://vercel.com/dashboard/integrations
2. Create Integration
3. Configure OAuth
4. Redirect URI: http://localhost:8080/vercel/callback
5. Copiar Client ID y Secret
```

### GitHub Token (para Git integration)
```
1. GitHub Settings: https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: repo, workflow
4. Copiar token (empieza con ghp_...)
```

### GitHub OAuth
```
1. GitHub Settings: https://github.com/settings/developers
2. New OAuth App
3. Callback: http://localhost:8080/github/callback
4. Copiar Client ID y Secret
```

---

## 📚 Referencias

### Documentación
- Ver: `workflow-docs/IMPLEMENTATION_PLAN.md` → Workflow 4
- Ver: `workflow-docs/TECHNICAL_SPECS.md` → Vercel Deployer
- Ver: `workflow-docs/SETUP_GUIDE.md` → Vercel token setup

### Docs Externas
- **Vercel API**: https://vercel.com/docs/rest-api
- **Vercel Deployments**: https://vercel.com/docs/rest-api/endpoints#deployments
- **GitHub API**: https://docs.github.com/en/rest

### Código de Referencia
- `src/core/geminiValidator.js` - API calls pattern
- `src/core/projectAnalyzer.js` - File handling

---

## 🧪 Testing

```bash
# Tests con mocked APIs
npm run test -- --testPathPattern=deploy

# Coverage
npm run test:coverage -- src/deploy/

# E2E deployment flow
npm run test:e2e -- deployment-flow.spec.js
```

### Mocking Vercel API
```javascript
// tests/deploy/vercelDeployer.test.js
global.fetch = jest.fn((url) => {
  if (url.includes('/v2/files')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ sha: 'abc123' })
    });
  }
  
  if (url.includes('/v13/deployments')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 'dpl_123',
        url: 'test-project.vercel.app',
        readyState: 'READY'
      })
    });
  }
});
```

---

## 💡 Tips de Implementación

### File Upload a Vercel
```javascript
// 1. Calcular SHA-1 de cada archivo
async calculateSHA(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 2. Upload file
await fetch('https://api.vercel.com/v2/files', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-now-digest': sha,
    'x-now-size': content.length,
    'Content-Type': 'application/octet-stream'
  },
  body: content
});

// 3. Crear deployment con referencias
await fetch('https://api.vercel.com/v13/deployments', {
  method: 'POST',
  body: JSON.stringify({
    name: 'project-name',
    files: [{ file: 'index.html', sha, size }],
    target: 'production'
  })
});
```

### Monitoring Deployment
```javascript
// Polling cada 5s hasta READY o ERROR
async monitorDeployment(deploymentId) {
  while (true) {
    const status = await this.getDeploymentStatus(deploymentId);
    
    if (status.readyState === 'READY') {
      return { success: true, url: status.url };
    }
    
    if (status.readyState === 'ERROR') {
      throw new Error('Deployment failed');
    }
    
    await sleep(5000);
  }
}
```

### GitHub Commits
```javascript
// Simplified: Usar GitHub API directamente
// 1. Get current commit SHA
// 2. Create blobs (files)
// 3. Create tree
// 4. Create commit
// 5. Update ref

// Ver código completo en IMPLEMENTATION_PLAN.md → Workflow 4
```

---

## 📋 Tutorial Steps

```javascript
// src/tutorial/steps.js
export const tutorialSteps = [
  {
    id: 'welcome',
    title: '👋 Bienvenido',
    description: 'Aprende a usar el editor en 2 minutos',
    position: 'center'
  },
  {
    id: 'drag-component',
    title: '🧩 Arrastra Componentes',
    target: '.components-panel',
    action: { type: 'drag', from: '.component-item', to: '#canvas' }
  },
  {
    id: 'select-element',
    title: '🎯 Selecciona',
    target: '#canvas .canvas-element',
    action: { type: 'click' }
  },
  // ... 7 más
];
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Build pasando: `npm run build`
- [ ] Tests pasando: `npm test`
- [ ] Lighthouse >90
- [ ] No secrets en código
- [ ] Environment vars configuradas

### Deployment Process
1. Preparar archivos (clean HTML/CSS/JS)
2. Upload a Vercel
3. Create deployment
4. Monitor status
5. Guardar URL y history
6. Notificar usuario

---

## 🎯 Definition of Done

- [ ] Vercel deployer funcional
- [ ] OAuth flow de Vercel implementado
- [ ] File upload con SHA funcionando
- [ ] Deployment monitoring en tiempo real
- [ ] History tracking guardado
- [ ] Git integration básica (create repo, commit, push)
- [ ] Tutorial engine completo (10 steps)
- [ ] Tests >65% coverage
- [ ] UI modals funcionales
- [ ] No errores en consola

---

**🎯 Siguiente:** Implementar `VercelDeployer` class
