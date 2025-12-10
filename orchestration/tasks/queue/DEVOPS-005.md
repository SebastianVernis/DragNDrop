# DEVOPS-005: Performance Optimization & CDN Setup

**Tipo**: DevOps/Performance  
**Prioridad**: 🟠 ALTA  
**Estimación**: 8h  
**Agente Recomendado**: @devops  
**Estado**: ⏳ ESPERANDO ASIGNACIÓN  

## 📋 Descripción

Optimizar el rendimiento de la aplicación mediante CDN, caching strategies, y build optimizations.

## 🎯 Objetivos

1. Configurar Cloudflare CDN con reglas optimizadas
2. Implementar Service Worker para offline support
3. Optimizar build con code splitting y lazy loading
4. Setup de image optimization pipeline
5. Implementar caching strategies

## 📝 Tareas Específicas

### 1. Cloudflare CDN Configuration

```javascript
// terraform/modules/cloudflare/cdn.tf
resource "cloudflare_page_rule" "cache_static" {
  zone_id = var.zone_id
  target  = "${var.domain}/assets/*"
  priority = 1

  actions {
    cache_level = "cache_everything"
    edge_cache_ttl = 86400
    browser_cache_ttl = 604800
    cache_key_fields {
      query_string {
        exclude = ["v", "t"]
      }
    }
  }
}

resource "cloudflare_page_rule" "api_bypass" {
  zone_id = var.zone_id
  target  = "${var.domain}/api/*"
  priority = 2

  actions {
    cache_level = "bypass"
    disable_performance = false
  }
}

resource "cloudflare_argo" "smart_routing" {
  zone_id = var.zone_id
  smart_routing = "on"
}

resource "cloudflare_load_balancer" "main" {
  zone_id = var.zone_id
  name = "dragndrop-lb"
  fallback_pool_id = cloudflare_load_balancer_pool.primary.id
  default_pool_ids = [cloudflare_load_balancer_pool.primary.id]
  proxied = true
}
```

### 2. Advanced Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'dragndrop-v1';
const RUNTIME_CACHE = 'dragndrop-runtime';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
];

// Cache strategies
const cacheStrategies = {
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      return cachedResponse || caches.match('/offline.html');
    }
  },

  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      return new Response('Offline', { status: 503 });
    }
  },

  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        const cache = caches.open(RUNTIME_CACHE);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
  },
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) return;

  // Routing logic
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(cacheStrategies.networkFirst(request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
  } else {
    event.respondWith(cacheStrategies.networkFirst(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-projects') {
    event.waitUntil(syncProjects());
  }
});
```

### 3. Build Optimization

```javascript
// vite.config.optimization.js
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'editor': ['@monaco-editor/react'],
          'utils': ['lodash-es', 'date-fns'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
  },
  
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'DragNDrop Editor',
        short_name: 'DragNDrop',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### 4. Image Optimization Pipeline

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

const FORMATS = {
  webp: { quality: 85 },
  avif: { quality: 80 },
  original: { quality: 90 },
};

const SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200,
  xlarge: 1920,
};

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const promises = [];

  // Generate different sizes
  for (const [sizeName, width] of Object.entries(SIZES)) {
    if (metadata.width >= width) {
      // Generate different formats for each size
      for (const [format, options] of Object.entries(FORMATS)) {
        const outputPath = path.join(
          outputDir,
          `${filename}-${sizeName}.${format === 'original' ? metadata.format : format}`
        );

        if (format === 'original') {
          promises.push(
            image
              .clone()
              .resize(width)
              .jpeg(options)
              .toFile(outputPath)
          );
        } else {
          promises.push(
            image
              .clone()
              .resize(width)
              .toFormat(format, options)
              .toFile(outputPath)
          );
        }
      }
    }
  }

  await Promise.all(promises);
  
  // Generate srcset string
  const srcset = Object.keys(SIZES)
    .filter(size => metadata.width >= SIZES[size])
    .map(size => `${filename}-${size}.webp ${SIZES[size]}w`)
    .join(', ');

  return { filename, srcset };
}

// Image component with lazy loading
const ImageOptimized = `
<picture>
  <source 
    type="image/avif" 
    srcset="{{srcset.avif}}"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  >
  <source 
    type="image/webp" 
    srcset="{{srcset.webp}}"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  >
  <img 
    src="{{src}}" 
    alt="{{alt}}"
    loading="lazy"
    decoding="async"
    width="{{width}}"
    height="{{height}}"
  >
</picture>
`;
```

### 5. Performance Monitoring

```javascript
// src/performance/metrics.js
class PerformanceMetrics {
  constructor() {
    this.metrics = {};
    this.observer = null;
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      // Core Web Vitals
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
      
      // Custom metrics
      this.measureTTFB();
      this.measureResourceTiming();
      
      // Send metrics when page is about to unload
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.sendMetrics();
        }
      });
    }
  }

  observeLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeFID() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  observeCLS() {
    let clsValue = 0;
    let clsEntries = [];

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });

    // Calculate session CLS
    this.metrics.cls = clsValue;
  }

  measureTTFB() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.fetchStart;
    }
  }

  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    
    this.metrics.resources = {
      total: resources.length,
      size: resources.reduce((total, r) => total + (r.transferSize || 0), 0),
      duration: Math.max(...resources.map(r => r.responseEnd)) - 
                Math.min(...resources.map(r => r.startTime)),
      byType: {},
    };

    // Group by resource type
    resources.forEach(resource => {
      const type = this.getResourceType(resource.name);
      if (!this.metrics.resources.byType[type]) {
        this.metrics.resources.byType[type] = {
          count: 0,
          size: 0,
          duration: 0,
        };
      }
      
      this.metrics.resources.byType[type].count++;
      this.metrics.resources.byType[type].size += resource.transferSize || 0;
      this.metrics.resources.byType[type].duration += resource.duration;
    });
  }

  getResourceType(url) {
    const extension = url.split('.').pop().toLowerCase();
    const typeMap = {
      js: 'script',
      css: 'stylesheet',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      webp: 'image',
      svg: 'image',
      woff: 'font',
      woff2: 'font',
      ttf: 'font',
    };
    return typeMap[extension] || 'other';
  }

  async sendMetrics() {
    const payload = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      deviceInfo: {
        userAgent: navigator.userAgent,
        connection: navigator.connection?.effectiveType,
        memory: navigator.deviceMemory,
        cores: navigator.hardwareConcurrency,
      },
    };

    // Send to analytics endpoint
    navigator.sendBeacon('/api/analytics/performance', JSON.stringify(payload));
  }
}

// Initialize
new PerformanceMetrics();
```

### 6. Edge Functions for Dynamic Optimization

```javascript
// cloudflare-workers/image-optimizer.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Parse query parameters
    const width = url.searchParams.get('w');
    const quality = url.searchParams.get('q') || '85';
    const format = url.searchParams.get('f') || 'auto';
    
    // Build Cloudflare Image Resizing URL
    const imageURL = url.href.replace(url.search, '');
    const resizingURL = new URL(imageURL);
    
    const options = {
      cf: {
        image: {
          width: width ? parseInt(width) : undefined,
          quality: parseInt(quality),
          format: format,
          fit: 'scale-down',
          metadata: 'none',
          background: 'transparent',
          // Enable Polish for automatic format conversion
          polish: 'lossy',
        },
      },
    };

    // Cache configuration
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    
    // Check cache
    let response = await cache.match(cacheKey);
    
    if (!response) {
      // Fetch and resize image
      response = await fetch(resizingURL, options);
      
      // Add cache headers
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=31536000');
      response.headers.set('Vary', 'Accept');
      
      // Store in cache
      event.waitUntil(cache.put(cacheKey, response.clone()));
    }
    
    return response;
  },
};
```

## 📂 Archivos a Crear/Modificar

- `/public/sw.js`
- `/vite.config.optimization.js`
- `/terraform/modules/cloudflare/cdn.tf`
- `/scripts/optimize-images.js`
- `/src/performance/metrics.js`
- `/cloudflare-workers/image-optimizer.js`
- `/.github/workflows/performance.yml`
- `/docs/performance/README.md`
- `/scripts/performance/audit.sh`
- `/public/manifest.json`

## 🔧 Scripts de Performance

```bash
#!/bin/bash
# scripts/performance/audit.sh

echo "Running performance audit..."

# Lighthouse CI
npx lighthouse-ci autorun \
  --collect.url=https://dragndrop.pages.dev \
  --assert.preset=lighthouse:recommended \
  --assert.assertions.categories:performance=95 \
  --assert.assertions.categories:accessibility=95 \
  --assert.assertions.categories:best-practices=95 \
  --assert.assertions.categories:seo=95

# Bundle size check
npx bundlesize --files dist/**/*.js --max-size 150KB
npx bundlesize --files dist/**/*.css --max-size 50KB

# Performance budget
node scripts/performance/check-budget.js
```

## 📋 Criterios de Aceptación

- [ ] Core Web Vitals en verde (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Service Worker instalado y funcionando offline
- [ ] Imágenes optimizadas con formatos modernos (WebP/AVIF)
- [ ] Bundle size < 200KB (gzipped)
- [ ] 95+ score en Lighthouse
- [ ] CDN configurado con cache headers apropiados
- [ ] Performance monitoring activo

## 🔗 Dependencias

- DEVOPS-003 (para métricas de performance)

## 🏷️ Tags

`performance`, `cdn`, `optimization`, `pwa`, `service-worker`, `cloudflare`, `caching`