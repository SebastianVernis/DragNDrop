# DEVOPS-004: Security Hardening & Compliance

**Tipo**: DevOps/Security  
**Prioridad**: 🔴 CRÍTICA  
**Estimación**: 12h  
**Agente Recomendado**: @devops  
**Estado**: ⏳ ESPERANDO ASIGNACIÓN  

## 📋 Descripción

Implementar medidas de seguridad comprehensivas y asegurar compliance con mejores prácticas de la industria.

## 🎯 Objetivos

1. Implementar Content Security Policy (CSP) estricta
2. Setup de WAF (Web Application Firewall)
3. Gestión segura de secretos
4. Análisis de vulnerabilidades automatizado
5. Auditoría y compliance checks

## 📝 Tareas Específicas

### 1. Content Security Policy

```javascript
// src/security/csp.js
export const generateCSP = () => {
  const policies = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'nonce-{{nonce}}'",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com",
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Temporary - replace with nonces
      "https://fonts.googleapis.com",
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:",
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
    ],
    'connect-src': [
      "'self'",
      "https://api.dragndrop.dev",
      "https://sentry.io",
      "wss://dragndrop.dev",
    ],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  };

  return Object.entries(policies)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

// backend-node/middleware/security.js
const crypto = require('crypto');

function securityHeaders(req, res, next) {
  // Generate nonce for inline scripts
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  // Security headers
  res.setHeader('Content-Security-Policy', generateCSP().replace('{{nonce}}', nonce));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
}
```

### 2. Web Application Firewall Rules

```javascript
// cloudflare/waf-rules.js
const wafRules = [
  {
    name: "Block SQL Injection",
    expression: `(http.request.uri.query contains "union" and http.request.uri.query contains "select") or
                 (http.request.uri.query contains "1=1") or
                 (http.request.body.raw contains "'; DROP TABLE")`,
    action: "block",
  },
  {
    name: "Block XSS Attempts",
    expression: `(http.request.uri.query contains "<script") or
                 (http.request.body.raw contains "<script") or
                 (http.request.uri.query contains "javascript:")`,
    action: "block",
  },
  {
    name: "Rate Limiting",
    expression: `(http.request.uri.path eq "/api/login")`,
    action: "rate_limit",
    rateLimit: {
      requests: 5,
      period: 60,
      action: "block",
    },
  },
  {
    name: "Block Known Bad IPs",
    expression: `(ip.src in $bad_ips)`,
    action: "block",
  },
  {
    name: "Geo Blocking",
    expression: `(ip.geoip.country in {"CN" "RU" "KP"} and not ip.src in $whitelist)`,
    action: "challenge",
  },
];

// terraform/modules/cloudflare/waf.tf
resource "cloudflare_ruleset" "waf_custom" {
  zone_id = var.zone_id
  name    = "DragNDrop WAF Rules"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  dynamic "rules" {
    for_each = var.waf_rules
    content {
      action     = rules.value.action
      expression = rules.value.expression
      description = rules.value.name
    }
  }
}
```

### 3. Secrets Management

```yaml
# .github/workflows/secrets-rotation.yml
name: Rotate Secrets
on:
  schedule:
    - cron: '0 0 1 * *' # Monthly
  workflow_dispatch:

jobs:
  rotate-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Rotate API Keys
        uses: ./.github/actions/rotate-secrets
        with:
          services:
            - sentry
            - cloudflare
            - database
          
      - name: Update Vault
        run: |
          vault write secret/dragndrop/api-keys \
            sentry_dsn=${{ steps.rotate.outputs.sentry_dsn }} \
            cloudflare_api=${{ steps.rotate.outputs.cloudflare_api }}
```

```javascript
// src/security/secrets.js
class SecretsManager {
  constructor() {
    this.cache = new Map();
    this.ttl = 3600000; // 1 hour
  }

  async getSecret(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }

    const secret = await this.fetchFromVault(key);
    this.cache.set(key, {
      value: secret,
      expires: Date.now() + this.ttl,
    });

    return secret;
  }

  async fetchFromVault(key) {
    const response = await fetch(`${process.env.VAULT_URL}/v1/secret/data/${key}`, {
      headers: {
        'X-Vault-Token': process.env.VAULT_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch secret: ${key}`);
    }

    const data = await response.json();
    return data.data.data.value;
  }

  // Encrypt sensitive data at rest
  encrypt(data) {
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
      crypto.randomBytes(16)
    );
    
    const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    return encrypted + cipher.final('hex');
  }
}
```

### 4. Security Scanning Integration

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [master, dev]
  pull_request:
  schedule:
    - cron: '0 0 * * *' # Daily

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk.sarif

  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/javascript
            p/typescript
            
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'dragndrop:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### 5. Security Middleware

```javascript
// backend-node/middleware/security/index.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        userId: req.user?.id,
      });
      res.status(429).json({ error: message });
    },
  });
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Input validation middleware
const validateInput = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Log potential attack
    logger.warn('Input validation failed', {
      errors: errors.array(),
      ip: req.ip,
      body: req.body,
    });
    
    res.status(400).json({ errors: errors.array() });
  };
};

// SQL Injection prevention
const sanitizeSQL = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/['";\\]/g, '');
};

// XSS prevention
const sanitizeHTML = (input) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return input.replace(reg, (match) => (map[match]));
};

module.exports = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
  cors: cors(corsOptions),
  rateLimiters: {
    api: createRateLimiter(15 * 60 * 1000, 100, 'Too many requests'),
    auth: createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts'),
    upload: createRateLimiter(60 * 60 * 1000, 10, 'Too many uploads'),
  },
  validateInput,
  sanitizeSQL,
  sanitizeHTML,
};
```

### 6. Compliance Checks

```javascript
// scripts/compliance/audit.js
const complianceChecks = {
  // OWASP Top 10 checks
  async checkInjection() {
    const results = await scanForSQLInjection();
    return {
      name: 'A03:2021 – Injection',
      passed: results.vulnerabilities === 0,
      details: results,
    };
  },

  async checkBrokenAuth() {
    const results = await auditAuthentication();
    return {
      name: 'A07:2021 – Identification and Authentication Failures',
      passed: results.issues === 0,
      details: results,
    };
  },

  async checkDataExposure() {
    const results = await scanForSensitiveData();
    return {
      name: 'A01:2021 – Broken Access Control',
      passed: results.exposures === 0,
      details: results,
    };
  },

  // GDPR compliance
  async checkPrivacyPolicy() {
    const hasPolicy = await checkFileExists('/privacy-policy.html');
    const hasCookieBanner = await checkComponentExists('CookieBanner');
    return {
      name: 'GDPR - Privacy Policy & Cookie Consent',
      passed: hasPolicy && hasCookieBanner,
      details: { hasPolicy, hasCookieBanner },
    };
  },

  // Security headers
  async checkSecurityHeaders() {
    const response = await fetch(process.env.SITE_URL);
    const headers = response.headers;
    
    const required = [
      'content-security-policy',
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security',
    ];
    
    const missing = required.filter(h => !headers.get(h));
    
    return {
      name: 'Security Headers',
      passed: missing.length === 0,
      details: { missing },
    };
  },
};

// Generate compliance report
async function generateComplianceReport() {
  const results = await Promise.all(
    Object.values(complianceChecks).map(check => check())
  );
  
  const report = {
    timestamp: new Date().toISOString(),
    overallCompliance: results.every(r => r.passed),
    checks: results,
  };
  
  await fs.writeFile('compliance-report.json', JSON.stringify(report, null, 2));
  
  if (!report.overallCompliance) {
    console.error('❌ Compliance checks failed!');
    process.exit(1);
  }
  
  console.log('✅ All compliance checks passed!');
}
```

## 📂 Archivos a Crear/Modificar

- `/src/security/csp.js`
- `/src/security/secrets.js`
- `/backend-node/middleware/security/index.js`
- `/cloudflare/waf-rules.js`
- `/terraform/modules/security/`
- `/.github/workflows/security.yml`
- `/.github/workflows/secrets-rotation.yml`
- `/scripts/compliance/audit.js`
- `/docs/security/README.md`
- `/docs/security/incident-response.md`
- `/privacy-policy.html`
- `/security.txt`
- `/.snyk`

## 🔧 Herramientas a Configurar

```yaml
# .snyk
version: v1.0.0
ignore: {}
patches: {}
language-settings:
  javascript:
    enableLinters: true
```

```json
// .semgrep.yml
rules:
  - id: hardcoded-secret
    pattern: |
      $KEY = "..."
    message: "Hardcoded secret found"
    languages: [javascript, typescript]
    severity: ERROR
```

## 📋 Criterios de Aceptación

- [ ] CSP implementado sin errores en consola
- [ ] WAF bloquea intentos de ataque comunes
- [ ] Secretos nunca expuestos en código
- [ ] Scans de seguridad pasan sin vulnerabilidades críticas
- [ ] Headers de seguridad obtienen A+ en securityheaders.com
- [ ] Compliance report muestra 100% cumplimiento
- [ ] Incident response plan documentado

## 🔗 Dependencias

- Ninguna (alta prioridad - debe implementarse pronto)

## 🏷️ Tags

`security`, `compliance`, `waf`, `csp`, `secrets`, `scanning`, `gdpr`, `owasp`