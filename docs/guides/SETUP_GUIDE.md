# 🔐 Guía de Configuración de API Keys

## 📋 Checklist de Keys Necesarias

### ✅ Mínimo para Desarrollo Local
- [ ] Gemini API Key (para features de IA)

### ✅ Para Funcionalidad Completa
- [ ] Gemini API Key
- [ ] Supabase Database URL
- [ ] Google OAuth credentials
- [ ] GitHub OAuth credentials

### ✅ Para Deployment
- [ ] Vercel Token
- [ ] Better Auth Secret

### ⚠️ Opcional
- [ ] Blackbox AI API (solo si usas multi-agent)
- [ ] Email service (SMTP o SendGrid)
- [ ] Analytics (Google Analytics, Sentry)

---

## 🔑 1. Gemini API Key

### Obtener la Key (GRATIS)
1. Ir a: https://makersuite.google.com/app/apikey
2. Hacer clic en "Create API Key"
3. Seleccionar proyecto de Google Cloud (o crear uno nuevo)
4. Copiar la key: `AIza...`

### Configurar en el Editor
**Opción A: Via UI (Recomendado)**
```
1. Abrir editor: npm run dev
2. Clic en botón "🔧 Gemini" en toolbar
3. Pegar API key
4. Guardar
```

**Opción B: Via Código**
```javascript
// En consola del navegador
localStorage.setItem('gemini_api_key', 'AIzaYourKeyHere');
window.location.reload();
```

**Opción C: Via Environment Variable**
```bash
# .env
VITE_GEMINI_API_KEY=AIzaYourKeyHere

# Se cargará automáticamente al iniciar
```

### Límites (Free Tier)
- **Requests**: 15 por minuto
- **Tokens**: 1,500,000 por día
- **Costo**: $0 (gratis para desarrollo)

### Verificar que Funciona
```
1. Abrir editor
2. Crear un elemento (ej: botón)
3. Seleccionarlo
4. Esperar 2 segundos
5. Debería aparecer badge "💡 Mejora disponible" si hay errores
```

---

## 🗄️ 2. Supabase Database

### Crear Database (GRATIS)
1. Ir a: https://supabase.com
2. Crear cuenta (si no tienes)
3. "New project"
4. Nombre: `dragndrop-db`
5. Database Password: (generar segura)
6. Region: (más cercana a ti)
7. Esperar ~2 minutos

### Obtener Connection String
```
1. Project Settings → Database
2. Copiar "Connection string"
3. Reemplazar [YOUR-PASSWORD] con tu password
```

**Formato:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Configurar en Backend
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres
```

### Correr Migrations
```bash
cd backend
npm install
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Verificar
```bash
# Test connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'ERROR:' + err : 'Connected! Time:', res.rows[0].now);
  pool.end();
});
"
```

---

## 🔐 3. Google OAuth

### Crear OAuth App
1. Ir a: https://console.cloud.google.com/apis/credentials
2. Seleccionar proyecto (o crear nuevo)
3. "Create Credentials" → "OAuth client ID"
4. Application type: "Web application"
5. Name: `DragNDrop Editor Dev`
6. Authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (producción)
7. "Create"
8. Copiar:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxx`

### Configurar
```bash
# backend/.env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
```

### Verificar
```
1. Iniciar backend: cd backend && node server.js
2. Ir a: http://localhost:8080/login
3. Clic "Continuar con Google"
4. Debería redirigir a Google OAuth
5. Aceptar permisos
6. Debería redirigir de vuelta y crear sesión
```

---

## 🐙 4. GitHub OAuth

### Crear OAuth App
1. Ir a: https://github.com/settings/developers
2. "New OAuth App"
3. Application name: `DragNDrop Editor Dev`
4. Homepage URL: `http://localhost:8080`
5. Authorization callback URL: `http://localhost:3001/api/auth/callback/github`
6. "Register application"
7. "Generate a new client secret"
8. Copiar:
   - Client ID: `Iv1.xxxxx`
   - Client Secret: `xxxxx`

### Configurar
```bash
# backend/.env
GITHUB_CLIENT_ID=Iv1.your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### Verificar
```
1. Login con GitHub
2. Debería funcionar similar a Google
```

---

## 🚀 5. Vercel Token (Para Deployments)

### Obtener Token
1. Ir a: https://vercel.com/account/tokens
2. "Create Token"
3. Token Name: `DragNDrop Editor`
4. Scope: "Full Account" (o team específico)
5. Expiration: 1 year
6. "Create Token"
7. **Copiar inmediatamente** (no se volverá a mostrar)

### Configurar
**Opción A: Via UI del Editor**
```
1. Abrir editor
2. Botón "🚀 Deploy" → "Conectar con Vercel"
3. Pegar token
4. Guardar
```

**Opción B: Via Environment**
```bash
# .env
VERCEL_TOKEN=your-vercel-token
```

### Verificar
```
1. Crear proyecto simple en editor
2. Clic "🚀 Deploy"
3. Nombre: test-project
4. "Iniciar Deploy"
5. Debería crear deployment en Vercel
6. Verificar en: https://vercel.com/dashboard
```

---

## 🔐 6. Better Auth Secret

### Generar Secret
```bash
# Método 1: OpenSSL
openssl rand -base64 32

# Método 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Método 3: Online
# https://generate-secret.vercel.app/32
```

### Configurar
```bash
# backend/.env
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3001
```

**IMPORTANTE:** 
- ⚠️ Nunca commitear este secret
- ⚠️ Usar uno diferente para producción
- ⚠️ Rotar cada 3-6 meses

---

## 📧 7. Email Service (Opcional)

### Opción A: Gmail (Desarrollo)
```
1. Ir a: https://myaccount.google.com/security
2. Activar "2-Step Verification"
3. Ir a: https://myaccount.google.com/apppasswords
4. Crear "App Password" → Nombre: DragNDrop
5. Copiar password de 16 caracteres
```

```bash
# backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Opción B: Resend (Recomendado para Producción)
```
1. Ir a: https://resend.com
2. Crear cuenta
3. API Keys → Create
4. Copiar key: re_xxxxx
```

```bash
# backend/.env
RESEND_API_KEY=re_your-key
```

### Opción C: SendGrid
```
1. Ir a: https://sendgrid.com
2. Settings → API Keys → Create
3. Copiar: SG.xxxxx
```

```bash
# backend/.env
SENDGRID_API_KEY=SG.your-key
```

---

## 🤖 8. Blackbox AI (Opcional - Multi-Agent)

### Obtener API Key
1. Ir a: https://www.blackbox.ai
2. Crear cuenta
3. Dashboard → API Keys
4. "Create API Key"
5. Copiar: `bb_xxxxx`

### Configurar
```bash
# .env
BLACKBOX_API_KEY=bb_your-key
```

### Límites
- **Free Tier**: Unlimited con Grok Code Fast
- **Paid Models**: Según modelo (~$0.15-0.50 por task)

---

## 📊 9. Analytics (Opcional)

### Google Analytics 4
```
1. Ir a: https://analytics.google.com
2. Admin → Create Property
3. Property name: DragNDrop Editor
4. Copiar Measurement ID: G-XXXXXXXXXX
```

```bash
# .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Sentry (Error Tracking)
```
1. Ir a: https://sentry.io
2. Create Project → Platform: JavaScript
3. Copiar DSN
```

```bash
# .env
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## ✅ Verificación Final

### Checklist
```bash
# 1. Verificar que .env existe
ls -la .env backend/.env

# 2. Cargar variables
source .env

# 3. Verificar cada una
echo "Gemini: ${VITE_GEMINI_API_KEY:0:10}..."
echo "Database: ${DATABASE_URL:0:20}..."
echo "Google Client: ${GOOGLE_CLIENT_ID:0:20}..."
echo "GitHub Client: ${GITHUB_CLIENT_ID:0:15}..."
echo "Vercel: ${VERCEL_TOKEN:0:10}..."
echo "Auth Secret: ${BETTER_AUTH_SECRET:0:10}..."

# 4. Test frontend
npm run dev
# Abrir http://localhost:8080

# 5. Test backend (en otra terminal)
cd backend
npm run dev
# Debería mostrar: 🚀 Server running on http://localhost:3001

# 6. Test database connection
cd backend
npx drizzle-kit studio
# Abrir https://local.drizzle.studio
```

### Tests Funcionales

**Test 1: Gemini API**
```
1. Abrir editor
2. Crear un botón
3. Editar style para tener error: "colr: red" (typo)
4. Seleccionar elemento
5. Esperar ~2s
6. Debería aparecer badge "💡 Mejora disponible"
✅ PASS si aparece badge
❌ FAIL si no aparece → revisar API key
```

**Test 2: Backend + Auth**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
curl http://localhost:3001/api/auth/session
# Debería retornar JSON (null si no hay sesión)
✅ PASS si retorna JSON
❌ FAIL si error → revisar DATABASE_URL
```

**Test 3: Google OAuth**
```
1. Ir a http://localhost:8080/login
2. Clic "Continuar con Google"
3. Debería redirigir a Google
4. Aceptar permisos
5. Debería volver y mostrar dashboard
✅ PASS si login exitoso
❌ FAIL → revisar GOOGLE_CLIENT_ID/SECRET y redirect URI
```

**Test 4: Vercel Deploy**
```
1. Configurar Vercel token en UI
2. Crear proyecto simple
3. Clic "🚀 Deploy"
4. Debería crear deployment
5. Verificar en Vercel dashboard
✅ PASS si aparece deployment
❌ FAIL → revisar VERCEL_TOKEN
```

---

## 🔒 Seguridad de Keys

### ⚠️ NUNCA COMMITEAR
```bash
# Ya está en .gitignore, pero verificar:
cat .gitignore | grep .env

# Debería mostrar:
.env
.env.local
.env.*.local
backend/.env
```

### Rotación de Secrets
```
Cada 3-6 meses:
1. Generar nuevo BETTER_AUTH_SECRET
2. Rotar OAuth secrets si es posible
3. Actualizar en producción con zero-downtime:
   - Agregar nuevo secret
   - Esperar 24h (para que expire cache)
   - Remover secret viejo
```

### Secrets en Producción
```bash
# NO usar .env en producción
# Usar environment variables del hosting

# Vercel
vercel env add BETTER_AUTH_SECRET production
vercel env add DATABASE_URL production

# Railway
railway variables set BETTER_AUTH_SECRET=xxx
railway variables set DATABASE_URL=xxx

# Render
# Via dashboard → Environment → Add Variable
```

---

## 🐛 Troubleshooting

### "Gemini API key invalid"
```
Problema: Error 400 al validar
Solución:
1. Verificar que la key empieza con "AIza"
2. Verificar que no tiene espacios al inicio/final
3. Ir a Google AI Studio y verificar que está activa
4. Crear nueva key si es necesario
```

### "Database connection failed"
```
Problema: Error conectando a PostgreSQL
Solución:
1. Verificar que DATABASE_URL tiene el password correcto
2. Verificar que IP está permitida en Supabase:
   Settings → Database → Connection Pooling → Add 0.0.0.0/0 (dev only)
3. Ping al servidor: psql "$DATABASE_URL" -c "SELECT 1"
```

### "OAuth redirect mismatch"
```
Problema: Error redirect_uri_mismatch
Solución:
1. Verificar que redirect URI en OAuth app coincide exactamente
2. Formato: http://localhost:3001/api/auth/callback/[provider]
3. NO trailing slash
4. Protocolo correcto (http para local, https para prod)
```

### "CORS error"
```
Problema: CORS policy blocking requests
Solución:
1. Verificar FRONTEND_URL en backend/.env
2. Debe coincidir con URL del frontend
3. Restart backend server
```

---

## 📝 .env File Template

```bash
# Copiar y pegar, reemplazar valores
cat > .env << 'EOF'
# Frontend
VITE_GEMINI_API_KEY=AIza...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend (en backend/.env)
# PORT=3001
# DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
# BETTER_AUTH_SECRET=generated-secret-32-chars
# GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=GOCSPX-xxx
# GITHUB_CLIENT_ID=Iv1.xxx
# GITHUB_CLIENT_SECRET=xxx
# VERCEL_TOKEN=xxx
EOF
```

---

## 🎯 Quick Start

### Desarrollo Local (Solo Frontend)
```bash
# 1. Instalar
npm install

# 2. Configurar Gemini
# Via UI cuando inicie el editor

# 3. Iniciar
npm run dev

# 4. Abrir
# http://localhost:8080
```

### Desarrollo Full (Frontend + Backend)
```bash
# Terminal 1: Frontend
npm install
npm run dev

# Terminal 2: Backend
cd backend
npm install
cp ../.env.example .env
# Editar .env con tus keys
npx drizzle-kit migrate
npm run dev

# Verificar ambos corriendo:
# Frontend: http://localhost:8080
# Backend: http://localhost:3001
```

---

## 🌐 Producción

### Variables Requeridas en Vercel (Frontend)
```
VITE_GEMINI_API_KEY=AIza...
VITE_API_URL=https://your-backend.railway.app
VITE_GA_MEASUREMENT_ID=G-XXX (opcional)
```

### Variables Requeridas en Railway/Render (Backend)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://your-backend.railway.app
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### Deployment
```bash
# Frontend a Vercel
vercel --prod

# Backend a Railway
railway up
```

---

## 📚 Links de Referencia

### Obtener Keys
- **Gemini API**: https://makersuite.google.com/app/apikey
- **Supabase**: https://supabase.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **GitHub OAuth Apps**: https://github.com/settings/developers
- **Vercel Tokens**: https://vercel.com/account/tokens
- **Blackbox AI**: https://www.blackbox.ai/api-keys

### Documentación
- **Better Auth**: https://www.better-auth.com/docs
- **Gemini API**: https://ai.google.dev/docs
- **Vercel API**: https://vercel.com/docs/rest-api
- **Drizzle ORM**: https://orm.drizzle.team/docs

---

## ✅ Resumen

### Mínimo Viable
```bash
# Solo esto para desarrollo básico:
VITE_GEMINI_API_KEY=AIza...

# Total: 1 key, 2 minutos, $0
```

### Funcionalidad Completa
```bash
# Para todas las features:
VITE_GEMINI_API_KEY=AIza...
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
BETTER_AUTH_SECRET=xxx
VERCEL_TOKEN=xxx

# Total: 8 keys, 30-40 minutos, $0
```

### Listo para Producción
```bash
# Agregar:
+ Email service (SMTP/Resend)
+ Analytics (GA4, Sentry)
+ Monitoring

# Total: 11 keys, 1 hora, $0-25/mes
```

---

**🎯 Siguiente paso:** [Configurar tu primer key →](#1-gemini-api-key)
