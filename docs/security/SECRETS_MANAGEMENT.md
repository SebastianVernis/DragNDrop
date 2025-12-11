# Secrets Management Guide

## Overview

This document describes best practices for managing secrets, API keys, and sensitive configuration in the DragNDrop HTML Editor project.

## Golden Rules

1. **NEVER commit secrets** to version control
2. **NEVER log secrets** in application logs
3. **NEVER expose secrets** in client-side code
4. **ALWAYS use environment variables** for secrets
5. **ALWAYS rotate secrets** regularly

## Secret Categories

### High Sensitivity (Rotate every 30 days)

| Secret | Purpose | Storage |
|--------|---------|---------|
| `BETTER_AUTH_SECRET` | Session encryption | Environment variable |
| `DATABASE_URL` | Database connection | Environment variable |
| `GOOGLE_CLIENT_SECRET` | OAuth authentication | Environment variable |
| `GITHUB_CLIENT_SECRET` | OAuth authentication | Environment variable |

### Medium Sensitivity (Rotate every 90 days)

| Secret | Purpose | Storage |
|--------|---------|---------|
| `VERCEL_TOKEN` | Deployment API | Environment variable |
| `SNYK_TOKEN` | Security scanning | GitHub Secrets |
| `SMTP_PASSWORD` | Email sending | Environment variable |

### Low Sensitivity (Rotate annually)

| Secret | Purpose | Storage |
|--------|---------|---------|
| `GA_MEASUREMENT_ID` | Analytics | Environment variable |
| `SENTRY_DSN` | Error tracking | Environment variable |

## Environment Setup

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your development values:
   ```bash
   # Edit .env with your values
   nano .env
   ```

3. Verify .env is in .gitignore:
   ```bash
   grep ".env" .gitignore
   ```

### Production (Vercel)

1. Go to Vercel Dashboard → Project → Settings → Environment Variables

2. Add each secret:
   - Name: `BETTER_AUTH_SECRET`
   - Value: `your-secret-value`
   - Environment: Production

3. Use Vercel CLI for bulk import:
   ```bash
   vercel env pull .env.local
   vercel env add BETTER_AUTH_SECRET production
   ```

### CI/CD (GitHub Actions)

1. Go to Repository → Settings → Secrets and variables → Actions

2. Add repository secrets:
   - `SNYK_TOKEN`
   - `VERCEL_TOKEN`
   - `NETLIFY_AUTH_TOKEN`

3. Use in workflows:
   ```yaml
   env:
     SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
   ```

## Secret Generation

### Generating Secure Secrets

```bash
# Generate 32-character secret
openssl rand -base64 32

# Generate 64-character secret
openssl rand -hex 32

# Generate UUID
uuidgen

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Minimum Requirements

| Secret Type | Minimum Length | Character Set |
|-------------|----------------|---------------|
| Auth secrets | 32 characters | Base64 |
| API keys | Provider-specific | Alphanumeric |
| Passwords | 16 characters | Mixed case + numbers + symbols |

## Secret Rotation

### Rotation Procedure

1. **Generate new secret**
   ```bash
   NEW_SECRET=$(openssl rand -base64 32)
   echo "New secret: $NEW_SECRET"
   ```

2. **Update in secrets manager**
   - Vercel: Dashboard → Environment Variables
   - GitHub: Settings → Secrets

3. **Deploy with new secret**
   ```bash
   vercel --prod
   ```

4. **Verify functionality**
   - Test authentication
   - Test API integrations
   - Monitor for errors

5. **Revoke old secret** (if applicable)
   - OAuth: Revoke in provider dashboard
   - API keys: Delete old key

### Rotation Schedule

| Frequency | Secrets |
|-----------|---------|
| Monthly | Auth secrets, database credentials |
| Quarterly | API keys, OAuth secrets |
| Annually | Analytics IDs, monitoring tokens |
| Immediately | After suspected compromise |

## Secret Detection

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
./scripts/security/check-secrets.sh
if [ $? -ne 0 ]; then
    echo "Secrets detected! Commit blocked."
    exit 1
fi
```

### CI/CD Scanning

The security workflow includes:
- Gitleaks for pattern matching
- TruffleHog for entropy analysis
- Custom patterns for project-specific secrets

### Manual Scanning

```bash
# Run secret scanner
./scripts/security/check-secrets.sh

# Full security audit
./scripts/security/audit.sh
```

## Handling Compromised Secrets

### Immediate Actions

1. **Rotate the secret immediately**
   ```bash
   # Generate new secret
   NEW_SECRET=$(openssl rand -base64 32)
   
   # Update in production
   vercel env add BETTER_AUTH_SECRET production
   ```

2. **Revoke the old secret**
   - OAuth: Revoke in provider dashboard
   - API keys: Delete/disable old key
   - Database: Change password

3. **Audit access logs**
   - Check for unauthorized access
   - Review API call logs
   - Check database query logs

4. **Notify stakeholders**
   - Security team
   - Affected users (if applicable)
   - Compliance team (if required)

### If Secret Was Committed

1. **Remove from history** (if not pushed):
   ```bash
   git reset --soft HEAD~1
   # Remove secret from file
   git add .
   git commit -m "Remove sensitive data"
   ```

2. **If already pushed**:
   ```bash
   # Use BFG Repo-Cleaner
   bfg --replace-text passwords.txt
   git push --force
   ```

3. **Consider the secret compromised** regardless of removal

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost:5432/dragndrop_dev
```

### Staging

```env
NODE_ENV=staging
BETTER_AUTH_URL=https://staging.dragndrop.dev
DATABASE_URL=postgresql://staging-db.example.com:5432/dragndrop_staging
```

### Production

```env
NODE_ENV=production
BETTER_AUTH_URL=https://dragndrop.dev
DATABASE_URL=postgresql://prod-db.example.com:5432/dragndrop_prod
```

## Secrets Manager Integration

### Using Doppler (Recommended)

1. Install Doppler CLI:
   ```bash
   brew install dopplerhq/cli/doppler
   ```

2. Login and setup:
   ```bash
   doppler login
   doppler setup
   ```

3. Run with secrets:
   ```bash
   doppler run -- npm start
   ```

### Using HashiCorp Vault

1. Configure Vault:
   ```bash
   export VAULT_ADDR='https://vault.example.com'
   vault login
   ```

2. Read secrets:
   ```bash
   vault kv get -field=value secret/dragndrop/auth
   ```

### Using AWS Secrets Manager

1. Store secret:
   ```bash
   aws secretsmanager create-secret \
     --name dragndrop/auth \
     --secret-string '{"BETTER_AUTH_SECRET":"xxx"}'
   ```

2. Retrieve in code:
   ```javascript
   const { SecretsManager } = require('@aws-sdk/client-secrets-manager');
   const client = new SecretsManager({ region: 'us-east-1' });
   const secret = await client.getSecretValue({ SecretId: 'dragndrop/auth' });
   ```

## Validation Script

Run the secrets validation script:

```bash
./scripts/security/check-secrets.sh
```

This script checks for:
- Hardcoded API keys
- Exposed passwords
- Private keys in code
- .env files in repository

## Checklist

### Before Committing

- [ ] No secrets in code
- [ ] .env files in .gitignore
- [ ] Secret scanner passed
- [ ] Using environment variables

### Before Deploying

- [ ] All secrets configured in production
- [ ] Secrets rotated if needed
- [ ] Access logs reviewed
- [ ] Backup of old secrets (secure storage)

### Regular Maintenance

- [ ] Monthly: Review access logs
- [ ] Quarterly: Rotate medium-sensitivity secrets
- [ ] Annually: Full secrets audit
- [ ] As needed: Rotate after team changes

## Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

*Last updated: December 2024*
