# 🟣 Workflow 3: Backend & Auth

**Branch:** `feature/backend-auth`  
**Duración:** 30 días  
**Responsable:** Backend Developer  

---

## 🎯 Objetivos

1. ✅ Better Auth completamente integrado (email + 2 OAuth)
2. ✅ Database schema completo (Drizzle + PostgreSQL)
3. ✅ API REST para projects y components
4. ✅ Cloud sync con auto-save
5. ✅ Security checker

---

## 📅 Timeline

### Semana 1-2: Better Auth Setup (Días 1-12)
- [ ] Días 1-3: Express server + Drizzle config
- [ ] Días 4-7: Better Auth implementation
- [ ] Días 8-12: Database schema + migrations

### Semana 3-4: API REST (Días 13-24)
- [ ] Días 13-18: Projects API (CRUD completo)
- [ ] Días 19-24: Components Library API

### Semana 5-6: Cloud Sync (Días 25-30)
- [ ] Días 25-28: Auto-save system
- [ ] Días 29-30: Conflict resolution

---

## 📁 Archivos a Crear

```
backend/
  ✅ server.js                  # Express app
  ✅ package.json               # Dependencies
  
  auth/
    ✅ config.js                # Better Auth config
    ✅ middleware.js            # Auth middleware
    ✅ routes.js                # Auth routes (optional)
  
  db/
    ✅ client.js                # Database connection
    ✅ schema.js                # Drizzle schema
    migrations/
      ✅ 0001_initial.sql       # Initial tables
      ✅ 0002_projects.sql      # Projects table
      ✅ 0003_components.sql    # Components table
  
  api/
    ✅ projects.js              # Projects CRUD
    ✅ components.js            # Components CRUD
    ✅ deployments.js           # Deployment tracking
  
  utils/
    ✅ validation.js            # Input validation
    ✅ jwt.js                   # JWT helpers (if needed)
  
  ✅ .env.example               # Environment template

src/
  services/
    ✅ authService.js           # Frontend auth client
    ✅ apiClient.js             # API wrapper
    ✅ cloudSync.js             # Sync manager
    ✅ sessionManager.js        # Session handling
    ✅ conflictResolver.js      # Conflict resolution

  security/
    ✅ securityChecker.js       # Security scanner
    ✅ cspGenerator.js          # CSP generator
    ✅ xssPrevent.js            # XSS prevention

tests/
  backend/
    ✅ auth.test.js
    ✅ projects.test.js
    ✅ components.test.js
  
  integration/
    ✅ auth-flow.test.js
    ✅ cloud-sync.test.js
```

---

## 🔗 API Contracts (Proveer para otros workflows)

```javascript
// Frontend - Exponer globalmente
window.authClient = {
  signUp: {
    email({ email, password, name })
  },
  signIn: {
    email({ email, password }),
    social({ provider }) // google, github
  },
  signOut(),
  getSession(),
  updateUser(data),
  useSession() // React hook style
};

window.apiClient = {
  // Projects
  getProjects(),
  createProject(data),
  updateProject(id, data),
  deleteProject(id),
  getProject(id),
  
  // Components
  getComponents(filters),
  saveComponent(data),
  deleteComponent(id),
  
  // Generic request
  request(endpoint, options)
};

window.sessionManager = {
  isAuthenticated(),
  getUser(),
  subscribe(callback),
  refreshSession()
};

window.cloudSync = {
  markDirty(),
  save(),
  load(projectId),
  sync(),
  resolveConflict(strategy)
};

// Events
window.addEventListener('auth:login', handleLogin);
window.addEventListener('auth:logout', handleLogout);
window.addEventListener('sync:complete', handleSyncComplete);
window.addEventListener('sync:conflict', handleConflict);
window.addEventListener('sync:error', handleSyncError);
```

---

## 🛠️ Stack Tecnológico

### Backend
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "auth": "Better Auth",
  "orm": "Drizzle ORM",
  "database": "PostgreSQL (Supabase)",
  "validation": "Zod (optional)"
}
```

### Dependencies
```bash
# Install
npm install better-auth drizzle-orm postgres express cors dotenv
npm install -D drizzle-kit

# Dev dependencies
npm install -D nodemon
```

---

## 🔑 API Keys Necesarias

### Database (Supabase)
```
1. Ir a: https://supabase.com/dashboard
2. Create project
3. Copiar Database URL
4. Formato: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
```

### Google OAuth
```
1. Google Cloud Console: https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client
3. Redirect URI: http://localhost:3001/api/auth/callback/google
4. Copiar Client ID y Secret
```

### GitHub OAuth
```
1. GitHub Settings: https://github.com/settings/developers
2. New OAuth App
3. Callback URL: http://localhost:3001/api/auth/callback/github
4. Copiar Client ID y Secret
```

### Better Auth Secret
```bash
# Generar
openssl rand -base64 32

# O usar
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📚 Referencias

### Documentación
- Ver: `workflow-docs/IMPLEMENTATION_PLAN.md` → Workflow 3
- Ver: `workflow-docs/TECHNICAL_SPECS.md` → Backend Architecture
- Ver: `workflow-docs/SETUP_GUIDE.md` → API keys setup

### Docs Externas
- **Better Auth**: https://www.better-auth.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **Supabase**: https://supabase.com/docs

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Integration tests
npm run test:integration

# Test auth flow
npm run test:auth

# Coverage
npm run test:coverage
```

### Test Database
```bash
# Setup test database
createdb dragndrop_test

# Run migrations
DATABASE_URL=postgresql://localhost/dragndrop_test npx drizzle-kit migrate

# Seed test data
npm run db:seed:test
```

---

## 🚀 Quick Start

```bash
# Verificar branch
git checkout feature/backend-auth

# Crear estructura backend
mkdir -p backend/auth backend/db backend/api backend/utils
cd backend

# Inicializar package.json
npm init -y

# Instalar dependencias
npm install better-auth drizzle-orm postgres express cors dotenv
npm install -D drizzle-kit nodemon

# Configurar environment
cp ../workflow-docs/.env.example .env
# Editar .env con tus keys (seguir SETUP_GUIDE.md)

# Crear servidor básico
touch server.js

# Implementar siguiendo:
# workflow-docs/IMPLEMENTATION_PLAN.md → Workflow 3 → 3.1

# Test
npm run dev
# Debería mostrar: 🚀 Server running on http://localhost:3001

# Commit
git add .
git commit -m "feat(backend): setup express and better auth"
git push
```

---

## 📝 Notas Importantes

### Database Schema
```javascript
// backend/db/schema.js
// Ya documentado en IMPLEMENTATION_PLAN.md

// Tablas Better Auth (required):
- user
- session  
- account
- verification

// Tablas de la app (custom):
- project
- component
- deployment
- aiUsage (optional)
```

### Migrations
```bash
# Generar migration
npx drizzle-kit generate

# Aplicar migration
npx drizzle-kit migrate

# Ver DB en UI
npx drizzle-kit studio
# → https://local.drizzle.studio
```

### CORS Configuration
```javascript
// server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true // IMPORTANTE para cookies
}));
```

---

## 🔒 Security Checklist

- [ ] Environment variables no commiteadas
- [ ] BETTER_AUTH_SECRET generado seguro (32+ chars)
- [ ] OAuth redirect URIs correctamente configuradas
- [ ] CORS configurado (no usar '*' en producción)
- [ ] Input validation en todos los endpoints
- [ ] SQL injection prevention (usar ORM)
- [ ] Rate limiting implementado
- [ ] Passwords hasheados (Better Auth lo hace)
- [ ] Sessions con expiración
- [ ] HTTPS en producción

---

## 🎯 Definition of Done

- [ ] Express server running sin errores
- [ ] Better Auth completamente integrado
- [ ] Email/password login funcional
- [ ] Google OAuth funcional
- [ ] GitHub OAuth funcional
- [ ] Database migrations aplicadas
- [ ] API REST completa (projects + components)
- [ ] Frontend auth client integrado
- [ ] Cloud sync funcionando
- [ ] Tests backend >70% coverage
- [ ] Security scan limpio
- [ ] Documentation actualizada

---

**🎯 Siguiente:** Setup Express server y Better Auth config
