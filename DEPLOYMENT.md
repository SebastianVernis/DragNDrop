# 🚀 Deployment Guide - Cloudflare Pages

Guía completa para deployar DragNDrop Editor a Cloudflare Pages con gestión segura de secretos.

---

## 📋 Pre-requisitos

1. **Wrangler CLI instalado**
   ```bash
   npm install -g wrangler
   ```

2. **Autenticado en Cloudflare**
   ```bash
   wrangler login
   ```

3. **Proyecto creado en Cloudflare Pages**
   - Ya existe: `dragndrop-editor`
   - URL: https://dragndrop-editor.pages.dev

---

## 🔐 Gestión de Secretos

### Arquitectura de Secrets

**Variables Públicas (VITE_*):**
- Se incluyen en el build de Vite
- Son visibles en el código del cliente
- Se configuran en `.env` localmente
- En producción: se pasan como env vars al build

**Variables Secretas:**
- NO se incluyen en el build
- Solo accesibles en Cloudflare Edge Functions
- Se configuran con `wrangler pages secret put`

### Configurar Secretos

#### 1. Opción Automática (Recomendada)

```bash
# Sube todos los secrets desde .env
./scripts/deploy-secrets.sh
```

Este script:
- ✅ Lee `.env`
- ✅ Skippea variables públicas (VITE_*)
- ✅ Sube solo secretos al proyecto de Cloudflare
- ✅ Muestra resumen de subida

#### 2. Opción Manual

```bash
# Subir un secret individual
echo "tu-api-key-aqui" | wrangler pages secret put GEMINI_API_KEY --project-name=dragndrop-editor

# Subir varios
echo "key1" | wrangler pages secret put BLACKBOX_API_KEY --project-name=dragndrop-editor
echo "key2" | wrangler pages secret put DATABASE_URL --project-name=dragndrop-editor
```

### Listar Secretos

```bash
./scripts/list-secrets.sh

# O manualmente:
wrangler pages secret list --project-name=dragndrop-editor
```

### Eliminar Secret

```bash
./scripts/delete-secret.sh SECRET_NAME

# O manualmente:
wrangler pages secret delete SECRET_NAME --project-name=dragndrop-editor
```

---

## 🚀 Deploy

### Opción 1: Script Automatizado (Recomendada)

```bash
./scripts/deploy.sh
```

Este script:
1. ✅ Verifica pre-requisitos
2. ✅ Instala dependencias
3. ✅ Build con Vite
4. ✅ Deploy a Cloudflare Pages
5. ✅ Muestra URLs y next steps

### Opción 2: Deploy Manual

```bash
# 1. Install
npm ci

# 2. Build
npm run build

# 3. Deploy
wrangler pages deploy dist/ \
  --project-name=dragndrop-editor \
  --commit-dirty=true \
  --branch=master
```

### Opción 3: Deploy con Variables de Entorno

```bash
# Build con env vars específicas
VITE_API_URL=https://api.custom.com npm run build

# Deploy
wrangler pages deploy dist/ --project-name=dragndrop-editor
```

---

## 🔧 Configuración de Variables

### Variables Públicas (en build)

Edita `.env` o crea `.env.production`:

```bash
# Gemini API (público - va en el bundle)
VITE_GEMINI_API_KEY=AIza...

# URLs públicas
VITE_API_URL=https://api.dragndrop.com
VITE_APP_URL=https://dragndrop-editor.pages.dev

# Feature flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CLOUD_SYNC=false
```

Estas variables:
- Se reemplazan en tiempo de build
- Son visibles en el código del cliente
- Prefijo `VITE_` es obligatorio

### Variables Secretas (servidor)

Cuando se implemente backend con Edge Functions:

```bash
# Subir secrets (NO visibles en cliente)
echo "tu-secret" | wrangler pages secret put DATABASE_URL --project-name=dragndrop-editor
echo "tu-secret" | wrangler pages secret put BETTER_AUTH_SECRET --project-name=dragndrop-editor
```

Acceso en Edge Functions:

```javascript
// functions/api/[[path]].js
export async function onRequest(context) {
  const { env } = context;
  
  // Acceder a secrets
  const dbUrl = env.DATABASE_URL;
  const authSecret = env.BETTER_AUTH_SECRET;
  
  // ...
}
```

---

## 📊 Environments

### Development

```bash
# Local dev server
npm run dev
# → http://localhost:8080

# Variables: .env
```

### Preview (Staging)

```bash
# Deploy a preview
wrangler pages deploy dist/ --project-name=dragndrop-editor --branch=develop

# URL: https://develop.dragndrop-editor.pages.dev
```

### Production

```bash
# Deploy a producción
wrangler pages deploy dist/ --project-name=dragndrop-editor --branch=master

# URL: https://dragndrop-editor.pages.dev
```

---

## 🔄 CI/CD con GitHub Actions

### Setup GitHub Actions (Futuro)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
          VITE_API_URL: https://api.dragndrop.com
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist/ --project-name=dragndrop-editor
```

Configurar en GitHub:
1. Settings → Secrets → New repository secret
2. Agregar:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `VITE_GEMINI_API_KEY` (si es público)

---

## 🛠️ Troubleshooting

### Error: "No project found"

```bash
# Verifica el nombre del proyecto
wrangler pages project list

# Usa el nombre correcto
wrangler pages deploy dist/ --project-name=dragndrop-editor
```

### Error: "Build failed"

```bash
# Limpiar cache
rm -rf node_modules dist
npm ci
npm run build
```

### Error: "Secret not found"

```bash
# Listar secrets actuales
wrangler pages secret list --project-name=dragndrop-editor

# Subir el secret faltante
echo "value" | wrangler pages secret put SECRET_NAME --project-name=dragndrop-editor
```

### Variables no se actualizan

```bash
# Rebuildeaer completamente
rm -rf dist node_modules/.vite
npm ci
npm run build
wrangler pages deploy dist/ --project-name=dragndrop-editor
```

---

## 📝 Checklist de Deploy

Antes de cada deploy:

- [ ] `npm test` pasa
- [ ] `npm run build` funciona sin errores
- [ ] Variables de entorno actualizadas en `.env.production`
- [ ] Secrets sincronizados con `./scripts/deploy-secrets.sh`
- [ ] Lighthouse score >90
- [ ] No `console.log` en producción
- [ ] No secrets hardcodeados
- [ ] `.gitignore` actualizado
- [ ] CHANGELOG actualizado (si aplica)

Después del deploy:

- [ ] Verificar URL de producción funciona
- [ ] Verificar features críticas (drag & drop, export, etc.)
- [ ] Verificar en múltiples navegadores
- [ ] Verificar responsive en mobile
- [ ] Verificar console sin errores
- [ ] Verificar analytics funcionando (si está configurado)

---

## 🔗 URLs Útiles

- **Producción:** https://dragndrop-editor.pages.dev
- **Cloudflare Dashboard:** https://dash.cloudflare.com/pages
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Pages Docs:** https://developers.cloudflare.com/pages/

---

## 🎯 Quick Commands

```bash
# Deploy completo (automático)
./scripts/deploy.sh

# Subir secrets
./scripts/deploy-secrets.sh

# Listar secrets
./scripts/list-secrets.sh

# Build local
npm run build

# Preview local del build
npm run preview

# Dev local
npm run dev
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa logs en Cloudflare Dashboard
2. Verifica secretos con `./scripts/list-secrets.sh`
3. Revisa la documentación oficial de Cloudflare Pages
4. Crea un issue en el repo
