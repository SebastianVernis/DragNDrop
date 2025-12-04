# Guía de Deployment - DragNDrop

Esta guía explica cómo desplegar el editor DragNDrop en diferentes plataformas de hosting.

## 🚀 Plataformas Soportadas

### 1. **Vercel** (Recomendado)
- ✅ Deployment automático desde Git
- ✅ Preview deployments para PRs
- ✅ CDN global
- ✅ Funciones serverless
- ✅ SSL automático

### 2. **Netlify**
- ✅ Deployment continuo
- ✅ Form handling
- ✅ Edge functions
- ✅ Split testing
- ✅ SSL automático

### 3. **GitHub Pages**
- ✅ Hosting gratuito
- ✅ Integración con GitHub
- ✅ Actions automáticas
- ✅ Dominio personalizado
- ⚠️ Solo sitios estáticos

## 🛠️ Scripts de Deployment

### Script Maestro
```bash
# Deployment interactivo
./scripts/deploy.sh

# Deployment específico
./scripts/deploy.sh vercel production
./scripts/deploy.sh netlify preview
./scripts/deploy.sh github-pages
./scripts/deploy.sh all production
```

### Scripts Individuales
```bash
# Vercel
./scripts/deploy-vercel.sh [production|preview]

# Netlify
./scripts/deploy-netlify.sh [production|preview]

# GitHub Pages
./scripts/deploy-github-pages.sh
```

## 📋 Prerrequisitos

### Generales
- Node.js 16+
- npm 8+
- Git configurado
- Proyecto en repositorio Git

### Por Plataforma

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Vincular proyecto (opcional)
vercel link
```

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Vincular sitio (opcional)
netlify link
```

#### GitHub Pages
```bash
# Instalar gh-pages
npm install -g gh-pages

# Configurar Git
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Agregar remote origin
git remote add origin https://github.com/usuario/repo.git
```

## 🔧 Configuración Detallada

### Vercel

#### Configuración Automática
1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

#### Variables de Entorno
```bash
VITE_APP_NAME=DragNDrop HTML Editor
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

#### Configuración Manual
```bash
# Deployment de preview
vercel

# Deployment de producción
vercel --prod

# Con configuración personalizada
cp deploy/vercel/vercel.json ./
vercel --prod
```

### Netlify

#### Configuración Automática
1. Conectar repositorio en [netlify.com](https://netlify.com)
2. Configurar build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Base Directory**: (vacío)

#### Configuración Manual
```bash
# Crear nuevo sitio
netlify sites:create --name dragndrop-editor

# Deployment de preview
netlify deploy --dir=dist

# Deployment de producción
netlify deploy --prod --dir=dist

# Con configuración personalizada
cp deploy/netlify/netlify.toml ./
netlify deploy --prod --dir=dist
```

#### Funciones Netlify (Opcional)
```javascript
// netlify/functions/contact.js
exports.handler = async (event, context) => {
  // Manejar formularios de contacto
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
};
```

### GitHub Pages

#### Configuración Automática
1. Habilitar GitHub Pages en configuración del repositorio
2. Seleccionar source: "GitHub Actions"
3. El workflow se ejecutará automáticamente

#### Configuración Manual
```bash
# Build y deploy
npm run build
npx gh-pages -d dist

# Con mensaje personalizado
npx gh-pages -d dist -m "Deploy v1.0.0"

# Con branch personalizado
npx gh-pages -d dist -b gh-pages
```

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          path: './dist'
```

## 🔍 Verificación de Deployment

### Checklist Post-Deployment
- [ ] Sitio carga correctamente
- [ ] Todas las funcionalidades funcionan
- [ ] Drag & drop operativo
- [ ] Export/import funciona
- [ ] Responsive design correcto
- [ ] Performance aceptable
- [ ] SSL habilitado
- [ ] SEO básico configurado

### Herramientas de Verificación
```bash
# Lighthouse audit
npx lighthouse https://tu-sitio.com --output html

# Performance testing
npx @web/test-runner --coverage

# Accessibility testing
npx axe-cli https://tu-sitio.com
```

## 🐛 Troubleshooting

### Errores Comunes

#### Build Failures
```bash
# Error: Module not found
npm ci
npm run build

# Error: Out of memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Deployment Failures
```bash
# Vercel: Function timeout
# Solución: Optimizar código o aumentar timeout

# Netlify: Build timeout
# Solución: Optimizar build process

# GitHub Pages: Action failed
# Solución: Verificar permisos y configuración
```

#### Runtime Errors
```bash
# CORS errors
# Solución: Configurar headers en plataforma

# 404 errors
# Solución: Configurar redirects para SPA

# SSL errors
# Solución: Verificar configuración de dominio
```

### Logs y Debugging
```bash
# Vercel logs
vercel logs

# Netlify logs
netlify logs

# GitHub Actions logs
# Ver en GitHub > Actions tab
```

## 🔒 Seguridad

### Headers de Seguridad
```javascript
// Configurados automáticamente en todas las plataformas
{
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Content Security Policy
```javascript
// Configurado en netlify.toml y vercel.json
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

## 📊 Monitoreo

### Analytics
- Google Analytics (opcional)
- Vercel Analytics
- Netlify Analytics

### Performance Monitoring
- Web Vitals
- Lighthouse CI
- Real User Monitoring

### Error Tracking
- Sentry (opcional)
- LogRocket (opcional)
- Browser console monitoring

## 🔄 CI/CD Pipeline

### Workflow Completo
1. **Desarrollo**: Feature branch
2. **Testing**: Automated tests
3. **Preview**: Deploy preview
4. **Review**: Code review
5. **Merge**: Merge to main
6. **Deploy**: Automatic production deploy
7. **Monitor**: Performance monitoring

### Branch Strategy
```
main (production)
├── develop (staging)
├── feature/nueva-funcionalidad
├── fix/correccion-bug
└── hotfix/correccion-critica
```

## 📈 Optimización

### Performance
- Code splitting
- Lazy loading
- Image optimization
- CDN utilization
- Caching strategies

### SEO
- Meta tags
- Sitemap.xml
- Robots.txt
- Open Graph tags
- Schema markup

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

## 🆘 Soporte

### Recursos
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://docs.github.com/pages)

### Contacto
- GitHub Issues
- Email: soporte@dragndrop.com
- Discord: DragNDrop Community

---

## 📝 Notas Adicionales

### Costos Estimados
- **Vercel**: Gratis para proyectos personales, $20/mes para equipos
- **Netlify**: Gratis para proyectos personales, $19/mes para equipos  
- **GitHub Pages**: Gratis para repositorios públicos

### Limitaciones
- **Vercel**: 100GB bandwidth/mes (plan gratuito)
- **Netlify**: 100GB bandwidth/mes (plan gratuito)
- **GitHub Pages**: 1GB storage, 100GB bandwidth/mes

### Recomendaciones
- **Para desarrollo personal**: GitHub Pages
- **Para proyectos profesionales**: Vercel o Netlify
- **Para máximo control**: VPS con deployment personalizado