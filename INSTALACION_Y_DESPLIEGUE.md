# 🚀 Guía de Instalación y Despliegue

## Editor HTML Drag & Drop - Versión Profesional

---

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** 14+ (para servidor de desarrollo)
- **Python** 3.6+ (alternativa para servidor)
- **Git** (para control de versiones)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Conocimientos Recomendados
- Básicos de HTML/CSS/JavaScript
- Uso de terminal/línea de comandos
- Git básico (opcional)

---

## 📦 Instalación Local

### Opción 1: Servidor con Node.js

```bash
# 1. Clonar o descargar el proyecto
cd /ruta/al/proyecto

# 2. Instalar http-server globalmente (si no lo tienes)
npm install -g http-server

# 3. Iniciar servidor
http-server -p 3000 -c-1 --cors

# 4. Abrir en navegador
# http://localhost:3000/index.html
```

### Opción 2: Servidor con Python

```bash
# 1. Navegar al directorio del proyecto
cd /ruta/al/proyecto

# 2. Iniciar servidor Python
python3 -m http.server 3000

# 3. Abrir en navegador
# http://localhost:3000/index.html
```

### Opción 3: Abrir directamente (limitado)

```bash
# Simplemente abre el archivo index.html en tu navegador
# Nota: Algunas características pueden no funcionar por CORS
```

---

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

**Ventajas:** Gratis, rápido, SSL automático, CDN global

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Navegar al proyecto
cd /ruta/al/proyecto

# 3. Desplegar
vercel

# 4. Seguir las instrucciones en pantalla
# - Confirmar proyecto
# - Configurar settings (usar defaults)
# - Esperar despliegue

# 5. Tu app estará en: https://tu-proyecto.vercel.app
```

**Configuración adicional (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

### Opción 2: Netlify

**Ventajas:** Gratis, fácil, SSL automático, formularios integrados

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Navegar al proyecto
cd /ruta/al/proyecto

# 3. Iniciar sesión
netlify login

# 4. Desplegar
netlify deploy --prod

# 5. Seleccionar directorio: .
# 6. Tu app estará en: https://tu-proyecto.netlify.app
```

**Configuración adicional (netlify.toml):**
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Opción 3: GitHub Pages

**Ventajas:** Gratis, integrado con GitHub, fácil actualización

```bash
# 1. Crear repositorio en GitHub
# 2. Subir código al repositorio

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main

# 3. Ir a Settings → Pages
# 4. Seleccionar branch: main
# 5. Seleccionar folder: / (root)
# 6. Save

# 7. Tu app estará en: https://tu-usuario.github.io/tu-repo
```

---

### Opción 4: Servidor Propio (VPS)

**Ventajas:** Control total, personalización completa

```bash
# 1. Conectar a tu servidor
ssh usuario@tu-servidor.com

# 2. Instalar Nginx
sudo apt update
sudo apt install nginx

# 3. Copiar archivos al servidor
scp -r /ruta/local/* usuario@tu-servidor.com:/var/www/html/

# 4. Configurar Nginx
sudo nano /etc/nginx/sites-available/default

# Agregar:
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 5. Reiniciar Nginx
sudo systemctl restart nginx

# 6. Configurar SSL con Let's Encrypt (opcional)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 🔧 Configuración Post-Despliegue

### 1. Configurar Dominio Personalizado

**Vercel:**
```bash
vercel domains add tu-dominio.com
# Seguir instrucciones para configurar DNS
```

**Netlify:**
```bash
netlify domains:add tu-dominio.com
# Seguir instrucciones para configurar DNS
```

### 2. Configurar Variables de Entorno (si es necesario)

**Vercel:**
```bash
vercel env add VARIABLE_NAME
```

**Netlify:**
```bash
netlify env:set VARIABLE_NAME valor
```

### 3. Configurar HTTPS (si no es automático)

- Vercel y Netlify: Automático ✅
- GitHub Pages: Automático ✅
- Servidor propio: Usar Let's Encrypt (ver arriba)

---

## 🔒 Seguridad

### Headers de Seguridad Recomendados

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Netlify (_headers file):**
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📊 Monitoreo y Analytics

### Google Analytics (opcional)

```html
<!-- Agregar en index.html antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (alternativa privacy-friendly)

```html
<!-- Agregar en index.html antes de </head> -->
<script defer data-domain="tu-dominio.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🔄 Actualización y Mantenimiento

### Actualizar Código

**Vercel:**
```bash
# Simplemente hacer push a Git
git add .
git commit -m "Update"
git push

# Vercel desplegará automáticamente
```

**Netlify:**
```bash
# Opción 1: Push a Git (si está conectado)
git push

# Opción 2: Deploy manual
netlify deploy --prod
```

**GitHub Pages:**
```bash
git add .
git commit -m "Update"
git push
```

### Rollback (Volver a Versión Anterior)

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
```bash
# Ir a Netlify Dashboard → Deploys → Seleccionar deploy anterior → Publish
```

---

## 🧪 Testing en Producción

### Checklist Post-Despliegue

- [ ] Página principal carga correctamente
- [ ] Todos los assets (CSS, JS, imágenes) cargan
- [ ] No hay errores en consola del navegador
- [ ] Todas las características funcionan:
  - [ ] Resize handles
  - [ ] Formatting toolbar
  - [ ] Canvas types
  - [ ] Panel toggle
  - [ ] Git integration (si configurado)
  - [ ] Legal modal
- [ ] HTTPS funciona correctamente
- [ ] Responsive en mobile/tablet
- [ ] Performance es aceptable (< 3s carga inicial)

### Herramientas de Testing

```bash
# Lighthouse (Performance, SEO, Accessibility)
npx lighthouse https://tu-dominio.com --view

# WebPageTest
# https://www.webpagetest.org/

# GTmetrix
# https://gtmetrix.com/
```

---

## 🐛 Solución de Problemas Comunes

### Problema: Módulos ES6 no cargan

**Solución:**
```html
<!-- Asegúrate de usar type="module" -->
<script type="module" src="./script.js"></script>
```

### Problema: CORS errors

**Solución:**
- Usar servidor HTTP (no abrir archivo directamente)
- Configurar headers CORS en servidor

### Problema: 404 en rutas

**Solución:**
- Configurar redirects a index.html
- Ver configuración de Vercel/Netlify arriba

### Problema: Assets no cargan

**Solución:**
- Verificar rutas relativas vs absolutas
- Usar rutas relativas: `./style.css` no `/style.css`

---

## 📱 PWA (Progressive Web App) - Opcional

### Agregar Service Worker

**sw.js:**
```javascript
const CACHE_NAME = 'dragndrop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**Registrar en index.html:**
```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
</script>
```

**manifest.json:**
```json
{
  "name": "Editor HTML Drag & Drop",
  "short_name": "DragNDrop",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎯 Optimización de Performance

### Minificar Assets

```bash
# Instalar herramientas
npm install -g terser cssnano-cli html-minifier

# Minificar JavaScript
terser script.js -o script.min.js -c -m

# Minificar CSS
cssnano style.css style.min.css

# Minificar HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

### Comprimir Assets

```bash
# Gzip
gzip -k -9 script.js
gzip -k -9 style.css

# Brotli (mejor compresión)
brotli -k -9 script.js
brotli -k -9 style.css
```

### CDN para Assets Estáticos

```html
<!-- Usar CDN para Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
```

---

## 📊 Métricas de Éxito

### KPIs a Monitorear

- **Tiempo de carga:** < 3 segundos
- **First Contentful Paint:** < 1.5 segundos
- **Time to Interactive:** < 3.5 segundos
- **Lighthouse Score:** > 90
- **Uptime:** > 99.9%

### Herramientas de Monitoreo

- **Uptime:** UptimeRobot, Pingdom
- **Performance:** Google Analytics, Plausible
- **Errors:** Sentry, LogRocket
- **User Behavior:** Hotjar, Microsoft Clarity

---

## 🎉 Conclusión

Tu Editor HTML Drag & Drop está listo para producción. Sigue esta guía para desplegarlo en la plataforma de tu elección.

**Recomendación:** Vercel o Netlify para despliegue rápido y gratuito.

**Próximos pasos:**
1. Elegir plataforma de despliegue
2. Seguir instrucciones específicas
3. Configurar dominio personalizado (opcional)
4. Monitorear performance y errores
5. Iterar basado en feedback de usuarios

**¡Buena suerte con tu despliegue! 🚀**

---

## 📞 Soporte

Si encuentras problemas durante el despliegue:
- Revisa la documentación de la plataforma elegida
- Verifica logs de error en la consola del navegador
- Consulta la sección de solución de problemas arriba
- Contacta soporte de la plataforma

**Fecha de última actualización:** 11 de diciembre de 2025
