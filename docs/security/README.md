# Security Documentation

## Overview

This directory contains comprehensive security documentation for the DragNDrop HTML Editor project. Our security approach follows OWASP guidelines and industry best practices.

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Security Headers](#security-headers)
3. [Content Security Policy](#content-security-policy)
4. [Secrets Management](#secrets-management)
5. [Vulnerability Management](#vulnerability-management)
6. [Security Scanning](#security-scanning)
7. [Incident Response](#incident-response)

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN / Edge Layer                        │
│  - DDoS Protection                                          │
│  - WAF Rules                                                │
│  - Rate Limiting                                            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Security Headers                          │
│  - CSP, HSTS, X-Frame-Options                               │
│  - Permissions-Policy                                        │
│  - CORS Configuration                                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  - Input Validation                                         │
│  - Output Encoding                                          │
│  - Authentication (Better Auth)                             │
│  - Authorization (RBAC)                                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  - Encrypted at Rest                                        │
│  - Encrypted in Transit                                     │
│  - Access Controls                                          │
└─────────────────────────────────────────────────────────────┘
```

### Security Principles

1. **Least Privilege**: Users and services have minimum necessary permissions
2. **Defense in Depth**: Multiple layers of security controls
3. **Fail Secure**: System fails to a secure state
4. **Separation of Duties**: Critical operations require multiple approvals
5. **Security by Default**: Secure configurations out of the box

## Security Headers

All security headers are configured in `vercel.json` and `config/security/security-headers.json`.

### Required Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | See [CSP_POLICY.md](./CSP_POLICY.md) | Prevents XSS and injection attacks |
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing |
| X-Frame-Options | DENY | Prevents clickjacking |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | Enforces HTTPS |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information |
| Permissions-Policy | See config | Restricts browser features |

### Validation

Run the security headers validation script:

```bash
./scripts/security/validate-headers.sh

# Test against live URL
./scripts/security/validate-headers.sh https://your-app.vercel.app
```

## Content Security Policy

See [CSP_POLICY.md](./CSP_POLICY.md) for detailed CSP documentation.

### Quick Reference

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: blob: https:;
connect-src 'self' https://generativelanguage.googleapis.com wss: ws:;
frame-src 'self' blob:;
worker-src 'self' blob:;
object-src 'none';
```

## Secrets Management

See [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) for detailed secrets documentation.

### Quick Reference

1. **Never commit secrets** to version control
2. Use `.env` files for local development
3. Use environment variables in production
4. Rotate secrets every 90 days
5. Use a secrets manager for production

### Secret Detection

```bash
# Run secret scanning
./scripts/security/check-secrets.sh
```

## Vulnerability Management

### Dependency Scanning

Automated scanning is configured via:

1. **Dependabot**: Weekly dependency updates (`.github/dependabot.yml`)
2. **npm audit**: Run in CI/CD pipeline
3. **Snyk**: Optional integration for deeper scanning

### Manual Audit

```bash
# Run full security audit
./scripts/security/audit.sh

# Run npm audit only
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

### Severity Levels

| Level | Response Time | Action |
|-------|---------------|--------|
| Critical | 24 hours | Immediate patch |
| High | 7 days | Priority fix |
| Medium | 30 days | Scheduled fix |
| Low | 90 days | Next release |

## Security Scanning

### CI/CD Pipeline

The security workflow (`.github/workflows/security.yml`) runs:

1. **Dependency Audit**: npm audit for vulnerabilities
2. **Secret Scanning**: Gitleaks and TruffleHog
3. **SAST Analysis**: CodeQL for code vulnerabilities
4. **License Check**: Compliance verification

### Running Locally

```bash
# Full security audit
./scripts/security/audit.sh

# Secret detection only
./scripts/security/check-secrets.sh

# Header validation only
./scripts/security/validate-headers.sh
```

## Incident Response

### Severity Classification

| Severity | Description | Examples |
|----------|-------------|----------|
| P1 - Critical | Active exploitation, data breach | Leaked credentials, RCE |
| P2 - High | Significant vulnerability | XSS, CSRF, Auth bypass |
| P3 - Medium | Limited impact vulnerability | Information disclosure |
| P4 - Low | Minor security issue | Missing headers |

### Response Procedure

1. **Detection**: Identify and confirm the incident
2. **Containment**: Limit the impact
3. **Eradication**: Remove the threat
4. **Recovery**: Restore normal operations
5. **Lessons Learned**: Document and improve

### Contacts

- **Security Team**: security@dragndrop.dev
- **On-Call**: See internal documentation
- **Escalation**: Project maintainers

## Security Checklist

### Development

- [ ] Input validation on all user inputs
- [ ] Output encoding for all dynamic content
- [ ] Parameterized queries for database operations
- [ ] Secure session management
- [ ] CSRF protection on state-changing operations

### Deployment

- [ ] All security headers configured
- [ ] HTTPS enforced
- [ ] Secrets not in code
- [ ] Dependencies up to date
- [ ] Security scanning passed

### Operations

- [ ] Logging enabled
- [ ] Monitoring configured
- [ ] Backup procedures tested
- [ ] Incident response plan documented
- [ ] Access controls reviewed

## Resources

### Internal

- [CSP Policy](./CSP_POLICY.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [Security Workflow](../../.github/workflows/security.yml)
- [Security Scripts](../../scripts/security/)

### External

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy Reference](https://content-security-policy.com/)

---

*Last updated: December 2024*
