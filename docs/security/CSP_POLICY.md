# Content Security Policy (CSP) Documentation

## Overview

Content Security Policy (CSP) is a security standard that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks. This document describes the CSP configuration for DragNDrop HTML Editor.

## Current Policy

### Production CSP

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://generativelanguage.googleapis.com https://api.vercel.com https://api.github.com wss: ws:;
  frame-src 'self' blob:;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests
```

## Directive Breakdown

### default-src 'self'

**Purpose**: Fallback for other directives not explicitly set.

**Value**: `'self'` - Only allow resources from the same origin.

### script-src

**Purpose**: Controls which scripts can be executed.

**Values**:
- `'self'` - Scripts from same origin
- `'unsafe-inline'` - Inline scripts (required for Monaco Editor)
- `'unsafe-eval'` - eval() and similar (required for Monaco Editor)
- `https://cdn.jsdelivr.net` - CDN for libraries
- `https://unpkg.com` - NPM CDN
- `https://cdnjs.cloudflare.com` - Cloudflare CDN

**Why unsafe-inline/unsafe-eval?**

Monaco Editor, our code editor component, requires these directives to function properly. It uses:
- Inline scripts for syntax highlighting
- eval() for language services and IntelliSense

**Future Improvement**: Consider using nonces or hashes for inline scripts.

### style-src

**Purpose**: Controls which stylesheets can be applied.

**Values**:
- `'self'` - Styles from same origin
- `'unsafe-inline'` - Inline styles (required for dynamic styling)
- `https://fonts.googleapis.com` - Google Fonts CSS
- `https://cdn.jsdelivr.net` - CDN stylesheets

### font-src

**Purpose**: Controls which fonts can be loaded.

**Values**:
- `'self'` - Fonts from same origin
- `https://fonts.gstatic.com` - Google Fonts files
- `data:` - Data URI fonts (for embedded fonts)

### img-src

**Purpose**: Controls which images can be loaded.

**Values**:
- `'self'` - Images from same origin
- `data:` - Data URI images (for inline images)
- `blob:` - Blob URLs (for generated images)
- `https:` - Any HTTPS image (for user content)

### connect-src

**Purpose**: Controls which URLs can be loaded via scripts (fetch, XHR, WebSocket).

**Values**:
- `'self'` - Same origin connections
- `https://generativelanguage.googleapis.com` - Gemini AI API
- `https://api.vercel.com` - Vercel deployment API
- `https://api.github.com` - GitHub API
- `wss:` - Secure WebSocket (for collaboration)
- `ws:` - WebSocket (for local development)

### frame-src

**Purpose**: Controls which URLs can be embedded in frames.

**Values**:
- `'self'` - Same origin frames
- `blob:` - Blob URLs (for preview iframe)

### worker-src

**Purpose**: Controls which URLs can be loaded as workers.

**Values**:
- `'self'` - Same origin workers
- `blob:` - Blob URLs (for Monaco Editor workers)

### object-src 'none'

**Purpose**: Prevents loading of plugins (Flash, Java, etc.).

**Value**: `'none'` - No plugins allowed.

### base-uri 'self'

**Purpose**: Restricts URLs that can be used in `<base>` element.

**Value**: `'self'` - Only same origin.

### form-action 'self'

**Purpose**: Restricts URLs that can be used as form action.

**Value**: `'self'` - Only same origin.

### frame-ancestors 'none'

**Purpose**: Prevents the page from being embedded in frames (clickjacking protection).

**Value**: `'none'` - Cannot be embedded anywhere.

### upgrade-insecure-requests

**Purpose**: Automatically upgrades HTTP requests to HTTPS.

## Environment-Specific Policies

### Development

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://cdn.jsdelivr.net https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https: http://localhost:*;
  connect-src 'self' http://localhost:* ws://localhost:* https://generativelanguage.googleapis.com;
  frame-src 'self' blob:;
  worker-src 'self' blob:;
  object-src 'none'
```

**Differences from production**:
- Allows `http://localhost:*` for local development
- Allows `ws://localhost:*` for local WebSocket
- No HSTS (Strict-Transport-Security)

### Staging (Report-Only)

```
Content-Security-Policy-Report-Only:
  [same as production];
  report-uri /api/csp-report
```

**Purpose**: Test CSP changes without breaking functionality.

## CSP Violation Reporting

### Setting Up Reporting

1. Create a CSP report endpoint:

```javascript
// api/csp-report.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('CSP Violation:', req.body);
    // Log to monitoring service
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
```

2. Add report-uri to CSP:

```
Content-Security-Policy: ...; report-uri /api/csp-report
```

### Monitoring Violations

CSP violations are logged to:
- Console (development)
- Sentry (production)
- Custom endpoint (optional)

## Testing CSP

### Browser DevTools

1. Open DevTools (F12)
2. Go to Console tab
3. Look for CSP violation messages

### Online Tools

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### Local Testing

```bash
# Validate CSP configuration
./scripts/security/validate-headers.sh

# Test against live URL
./scripts/security/validate-headers.sh https://your-app.vercel.app
```

## Common Issues and Solutions

### Issue: Monaco Editor not working

**Symptom**: Code editor doesn't load or syntax highlighting fails.

**Solution**: Ensure `'unsafe-inline'` and `'unsafe-eval'` are in `script-src`.

### Issue: Fonts not loading

**Symptom**: Text appears in fallback font.

**Solution**: Add font CDN to `font-src` and CSS CDN to `style-src`.

### Issue: Images not displaying

**Symptom**: Images show broken icon.

**Solution**: Check `img-src` includes the image source (data:, blob:, or specific domain).

### Issue: API calls failing

**Symptom**: Network requests blocked.

**Solution**: Add API domain to `connect-src`.

### Issue: Preview iframe not working

**Symptom**: Preview shows blank or error.

**Solution**: Ensure `blob:` is in `frame-src`.

## Security Considerations

### Why We Use unsafe-inline/unsafe-eval

Monaco Editor requires these directives. Alternatives considered:

1. **Nonces**: Would require server-side rendering
2. **Hashes**: Impractical for dynamic content
3. **Strict-dynamic**: Not fully supported

**Mitigation**: Other CSP directives provide defense in depth.

### Recommended Improvements

1. **Implement nonces** for inline scripts when possible
2. **Use Subresource Integrity (SRI)** for CDN resources
3. **Reduce CDN dependencies** by bundling more resources
4. **Regular CSP audits** to remove unused sources

## Configuration Files

- **Production**: `vercel.json`
- **Development**: `config/security/csp-policy.js`
- **Reference**: `config/security/security-headers.json`

## Resources

- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Google CSP Guide](https://developers.google.com/web/fundamentals/security/csp)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

*Last updated: December 2024*
