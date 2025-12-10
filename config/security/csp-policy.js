/**
 * Content Security Policy Configuration
 * DragNDrop HTML Editor
 * 
 * This module provides CSP configuration for different environments
 * and deployment targets (Vercel, Cloudflare, nginx).
 */

const CSP_DIRECTIVES = {
  // Base directives for all environments
  base: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Monaco Editor
      "'unsafe-eval'",   // Required for Monaco Editor
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for dynamic styles
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:'
    ],
    'connect-src': [
      "'self'",
      'https://generativelanguage.googleapis.com', // Gemini API
      'https://api.vercel.com',
      'https://api.github.com',
      'wss:', // WebSocket for collaboration
      'ws:'
    ],
    'frame-src': [
      "'self'",
      'blob:' // For preview iframe
    ],
    'worker-src': [
      "'self'",
      'blob:' // For Monaco Editor workers
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  },

  // Development-specific overrides
  development: {
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'http://localhost:*',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com'
    ],
    'connect-src': [
      "'self'",
      'http://localhost:*',
      'ws://localhost:*',
      'https://generativelanguage.googleapis.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'http://localhost:*'
    ]
  },

  // Staging-specific (report-only mode)
  staging: {
    // Same as production but with reporting
  },

  // Production-specific
  production: {
    // Uses base directives
  }
};

/**
 * Build CSP header string from directives
 * @param {Object} directives - CSP directives object
 * @returns {string} CSP header value
 */
function buildCSPString(directives) {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Get CSP configuration for environment
 * @param {string} env - Environment name (development, staging, production)
 * @returns {Object} CSP configuration
 */
function getCSPConfig(env = 'production') {
  const baseDirectives = { ...CSP_DIRECTIVES.base };
  const envOverrides = CSP_DIRECTIVES[env] || {};

  // Merge base with environment-specific overrides
  const mergedDirectives = { ...baseDirectives };
  for (const [key, value] of Object.entries(envOverrides)) {
    mergedDirectives[key] = value;
  }

  return {
    directives: mergedDirectives,
    headerValue: buildCSPString(mergedDirectives),
    reportOnly: env === 'staging'
  };
}

/**
 * Generate Vercel headers configuration
 * @param {string} env - Environment name
 * @returns {Object} Vercel headers config
 */
function generateVercelHeaders(env = 'production') {
  const csp = getCSPConfig(env);
  const headerName = csp.reportOnly 
    ? 'Content-Security-Policy-Report-Only' 
    : 'Content-Security-Policy';

  return {
    source: '/(.*)',
    headers: [
      { key: headerName, value: csp.headerValue },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
    ]
  };
}

/**
 * Generate nginx configuration snippet
 * @param {string} env - Environment name
 * @returns {string} nginx configuration
 */
function generateNginxConfig(env = 'production') {
  const csp = getCSPConfig(env);
  const headerName = csp.reportOnly 
    ? 'Content-Security-Policy-Report-Only' 
    : 'Content-Security-Policy';

  return `
# Security Headers - Generated for ${env} environment
# Add this to your nginx server block

add_header ${headerName} "${csp.headerValue}" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
`;
}

/**
 * Generate Cloudflare Workers headers
 * @param {string} env - Environment name
 * @returns {Object} Headers object for Cloudflare Workers
 */
function generateCloudflareHeaders(env = 'production') {
  const csp = getCSPConfig(env);
  const headerName = csp.reportOnly 
    ? 'Content-Security-Policy-Report-Only' 
    : 'Content-Security-Policy';

  return {
    [headerName]: csp.headerValue,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };
}

module.exports = {
  CSP_DIRECTIVES,
  buildCSPString,
  getCSPConfig,
  generateVercelHeaders,
  generateNginxConfig,
  generateCloudflareHeaders
};
