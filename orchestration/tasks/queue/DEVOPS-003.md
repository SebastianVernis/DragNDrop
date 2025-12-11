# DEVOPS-003: Monitoring & Observability Stack

**Tipo**: DevOps/Monitoring  
**Prioridad**: 🟠 ALTA  
**Estimación**: 10h  
**Agente Recomendado**: @devops  
**Estado**: ⏳ ESPERANDO ASIGNACIÓN  

## 📋 Descripción

Implementar stack completo de monitoreo y observabilidad para detectar y resolver problemas proactivamente.

## 🎯 Objetivos

1. Configurar Sentry para error tracking
2. Implementar Application Performance Monitoring (APM)
3. Setup de logging centralizado
4. Real User Monitoring (RUM) para frontend
5. Dashboards y alertas automatizadas

## 📝 Tareas Específicas

### 1. Sentry Integration

#### Frontend Setup
```javascript
// src/monitoring/sentry.js
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

export function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      beforeSend(event, hint) {
        // Filter sensitive data
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        return event;
      },
    });
  }
}

// Error boundary component
export class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }
}
```

#### Backend Node.js Setup
```javascript
// backend-node/monitoring/sentry.js
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");

function initSentry(app) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

module.exports = { initSentry };
```

### 2. Custom Performance Monitoring

```javascript
// src/monitoring/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observer = null;
  }

  init() {
    // Web Vitals monitoring
    this.observeWebVitals();
    
    // Custom metrics
    this.trackCustomMetrics();
    
    // Send metrics every 30 seconds
    setInterval(() => this.sendMetrics(), 30000);
  }

  observeWebVitals() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.set('lcp', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            this.metrics.set('fid', entry.processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            const cls = this.metrics.get('cls') || 0;
            this.metrics.set('cls', cls + entry.value);
          }
        }
      });

      this.observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    }
  }

  trackCustomMetrics() {
    // Track drag & drop operations
    window.addEventListener('dragstart', () => {
      this.startTimer('dragOperation');
    });

    window.addEventListener('drop', () => {
      const duration = this.endTimer('dragOperation');
      this.recordMetric('dragDropDuration', duration);
    });

    // Track file load times
    this.trackFileLoadTimes();
  }

  async sendMetrics() {
    const payload = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      this.metrics.clear();
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

### 3. Structured Logging

```javascript
// src/utils/logger.js
class Logger {
  constructor(context) {
    this.context = context;
    this.logBuffer = [];
    this.flushInterval = 5000; // 5 seconds
    
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
    };

    if (process.env.NODE_ENV === 'development') {
      console[level](message, meta);
    }

    this.logBuffer.push(logEntry);
    
    if (this.logBuffer.length >= 100 || level === 'error') {
      this.flush();
    }
  }

  async flush() {
    if (this.logBuffer.length === 0) return;
    
    const logs = [...this.logBuffer];
    this.logBuffer = [];
    
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Fallback to console
      console.error('Failed to send logs:', logs);
    }
  }

  info(message, meta) { this.log('info', message, meta); }
  warn(message, meta) { this.log('warn', message, meta); }
  error(message, meta) { this.log('error', message, meta); }
  debug(message, meta) { this.log('debug', message, meta); }
}

export const createLogger = (context) => new Logger(context);
```

### 4. Health Check Endpoints

```javascript
// backend-node/routes/health.js
const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
  });
});

router.get('/health/detailed', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage(),
    externalAPIs: await checkExternalAPIs(),
  };

  const status = Object.values(checks).every(c => c.status === 'ok') ? 'healthy' : 'degraded';
  
  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    checks,
    timestamp: new Date().toISOString(),
  });
});

async function checkDatabase() {
  try {
    await db.raw('SELECT 1');
    return { status: 'ok', latency: 0 };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}
```

### 5. Grafana Dashboards Configuration

```json
// monitoring/dashboards/dragndrop.json
{
  "dashboard": {
    "title": "DragNDrop Editor Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
        }]
      },
      {
        "title": "Response Time P95",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
        }]
      },
      {
        "title": "Active Users",
        "targets": [{
          "expr": "dragndrop_active_users"
        }]
      },
      {
        "title": "Web Vitals",
        "targets": [
          { "expr": "dragndrop_lcp_seconds" },
          { "expr": "dragndrop_fid_seconds" },
          { "expr": "dragndrop_cls_score" }
        ]
      }
    ]
  }
}
```

### 6. Alerting Rules

```yaml
# monitoring/alerts/rules.yml
groups:
  - name: dragndrop_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow response times"
          description: "95th percentile response time is {{ $value }}s"

      - alert: LowDiskSpace
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Only {{ $value | humanizePercentage }} disk space left"
```

### 7. Integration Scripts

```bash
#!/bin/bash
# scripts/monitoring/setup.sh

# Install monitoring stack locally
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for services
sleep 30

# Import dashboards
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @monitoring/dashboards/dragndrop.json

# Setup alerts
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d @monitoring/alerts/config.json

echo "Monitoring stack ready at:"
echo "- Grafana: http://localhost:3000"
echo "- Prometheus: http://localhost:9090"
echo "- AlertManager: http://localhost:9093"
```

## 📂 Archivos a Crear/Modificar

- `/src/monitoring/sentry.js`
- `/src/monitoring/performance.js`
- `/src/utils/logger.js`
- `/backend-node/monitoring/sentry.js`
- `/backend-node/routes/health.js`
- `/backend-node/middleware/metrics.js`
- `/monitoring/dashboards/*.json`
- `/monitoring/alerts/rules.yml`
- `/monitoring/docker-compose.yml`
- `/.github/workflows/monitoring.yml`
- `/docs/monitoring/README.md`
- `/scripts/monitoring/setup.sh`

## 🔧 Variables de Entorno

```bash
# .env.example additions
SENTRY_DSN=
VITE_SENTRY_DSN=
GRAFANA_API_KEY=
PROMETHEUS_REMOTE_WRITE_URL=
SLACK_WEBHOOK_URL=
PAGERDUTY_API_KEY=
```

## 📋 Criterios de Aceptación

- [ ] Errores se capturan automáticamente en Sentry
- [ ] Métricas de rendimiento se recolectan cada 30s
- [ ] Dashboards muestran métricas en tiempo real
- [ ] Alertas se disparan según umbrales definidos
- [ ] Logs estructurados se envían a backend
- [ ] Health checks responden correctamente
- [ ] Documentación incluye guía de troubleshooting

## 🔗 Dependencias

- DEVOPS-002 (para monitoring containers)

## 🏷️ Tags

`monitoring`, `observability`, `sentry`, `grafana`, `prometheus`, `logging`, `alerts`