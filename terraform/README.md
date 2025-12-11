# 🏗️ DragNDrop Editor - Infrastructure as Code

This directory contains Terraform configurations for managing the DragNDrop HTML Editor infrastructure across multiple environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [Modules](#modules)
- [Environments](#environments)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This Infrastructure as Code (IaC) setup manages:

- **Cloudflare Pages**: Static site hosting with global CDN
- **DNS Configuration**: Domain management and routing
- **Security Headers**: OWASP-recommended security headers
- **Rate Limiting**: Protection against abuse and DDoS
- **WAF Rules**: Web Application Firewall for security
- **Monitoring**: Uptime monitoring and alerting

### Key Features

| Feature | Description |
|---------|-------------|
| 🌍 Multi-environment | Separate configurations for dev, staging, and prod |
| 🔒 Security-first | WAF, rate limiting, and security headers |
| 📊 Monitoring | Uptime checks, alerting, and dashboards |
| 🔄 CI/CD Integration | Automated validation and deployment |
| 📝 Documentation | Comprehensive inline documentation |

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   master     │    │   staging    │    │   develop    │       │
│  │   branch     │    │   branch     │    │   branch     │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
└─────────┼───────────────────┼───────────────────┼───────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Cloudflare Pages                             │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Production  │    │   Staging    │    │     Dev      │       │
│  │   Project    │    │   Project    │    │   Project    │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Custom Domain│    │ *.pages.dev  │    │ *.pages.dev  │       │
│  │ + SSL + CDN  │    │   + SSL      │    │   + SSL      │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Security Layer (Production)                   │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Security  │  │    Rate    │  │    WAF     │  │   Cache    │ │
│  │  Headers   │  │  Limiting  │  │   Rules    │  │   Rules    │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Monitoring Layer                            │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │   Uptime   │  │   Alert    │  │  Grafana   │  │   Status   │ │
│  │   Checks   │  │   Rules    │  │ Dashboard  │  │    Page    │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Required Tools

| Tool | Version | Installation |
|------|---------|--------------|
| Terraform | >= 1.5.0 | [Install Guide](https://developer.hashicorp.com/terraform/downloads) |
| Git | >= 2.0 | [Install Guide](https://git-scm.com/downloads) |

### Required Accounts & Credentials

1. **Cloudflare Account**
   - Account ID (found in dashboard sidebar)
   - API Token with permissions:
     - `Cloudflare Pages:Edit`
     - `Zone:Edit` (for DNS)
     - `Firewall:Edit` (for WAF/rate limiting)
     - `Zone Settings:Edit` (for security headers)

2. **GitHub Repository**
   - Repository connected to Cloudflare Pages
   - GitHub Secrets configured (see [CI/CD Pipeline](#cicd-pipeline))

### Creating Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Add permissions:
   ```
   Account - Cloudflare Pages - Edit
   Zone - Zone - Read
   Zone - Zone Settings - Edit
   Zone - DNS - Edit
   Zone - Firewall Services - Edit
   ```
5. Set Zone Resources to your domain
6. Save the token securely

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
cd terraform/environments/dev
```

### 2. Create Variables File

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 3. Initialize Terraform

```bash
terraform init
```

### 4. Plan Changes

```bash
terraform plan
```

### 5. Apply Changes

```bash
terraform apply
```

## 📁 Directory Structure

```
terraform/
├── modules/                    # Reusable Terraform modules
│   ├── cloudflare/            # Cloudflare Pages, DNS, Security
│   │   ├── main.tf            # Main resource definitions
│   │   ├── variables.tf       # Input variables
│   │   └── outputs.tf         # Output values
│   └── monitoring/            # Uptime monitoring and alerting
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/              # Environment-specific configurations
│   ├── dev/                   # Development environment
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── backend.tf
│   │   └── terraform.tfvars.example
│   ├── staging/               # Staging environment
│   │   └── ...
│   └── prod/                  # Production environment
│       └── ...
└── README.md                  # This file
```

## 📦 Modules

### Cloudflare Module

Manages Cloudflare Pages deployment and security configurations.

#### Features

| Feature | Description |
|---------|-------------|
| Pages Project | Cloudflare Pages deployment configuration |
| Custom Domain | Optional custom domain with SSL |
| DNS Records | Automatic DNS record creation |
| Security Headers | X-Frame-Options, CSP, HSTS, etc. |
| Rate Limiting | Request rate limiting per IP |
| WAF Rules | Web Application Firewall rules |
| Cache Rules | Static asset caching optimization |

#### Usage

```hcl
module "cloudflare" {
  source = "../../modules/cloudflare"

  cloudflare_account_id = var.cloudflare_account_id
  project_name          = "my-project"
  github_owner          = "username"
  github_repo           = "repo-name"
  
  # Optional: Custom domain
  zone_id       = var.cloudflare_zone_id
  custom_domain = "app.example.com"
  
  # Security settings
  enable_security_headers = true
  enable_rate_limiting    = true
  enable_waf              = true
}
```

### Monitoring Module

Generates monitoring configurations for external tools.

#### Features

| Feature | Description |
|---------|-------------|
| Uptime Monitors | HTTP health check configurations |
| Alert Rules | Configurable alerting thresholds |
| Health Check Script | Bash script for manual checks |
| Prometheus Config | Optional Prometheus targets |
| Grafana Dashboard | Optional Grafana dashboard JSON |
| Status Page | Status page configuration |

#### Usage

```hcl
module "monitoring" {
  source = "../../modules/monitoring"

  production_url = "https://app.example.com"
  staging_url    = "https://staging.example.com"
  
  # Alert configuration
  alert_channels = ["email", "slack"]
  alert_email    = "alerts@example.com"
  
  # Thresholds
  response_time_warning_ms  = 1000
  response_time_critical_ms = 3000
}
```

## 🌍 Environments

### Development (`dev`)

- **Branch**: `develop`
- **Security**: Relaxed (no WAF, no rate limiting)
- **Monitoring**: 5-minute intervals, relaxed thresholds
- **Use case**: Feature development and testing

### Staging (`staging`)

- **Branch**: `staging`
- **Security**: Moderate (WAF enabled, permissive rate limits)
- **Monitoring**: 2-minute intervals, moderate thresholds
- **Use case**: Pre-production testing, QA

### Production (`prod`)

- **Branch**: `master`
- **Security**: Maximum (strict WAF, rate limiting, all headers)
- **Monitoring**: 1-minute intervals, strict thresholds
- **Use case**: Live production traffic

### Environment Comparison

| Setting | Dev | Staging | Prod |
|---------|-----|---------|------|
| Security Headers | ❌ | ✅ | ✅ |
| Rate Limiting | ❌ | ✅ (150/min) | ✅ (100/min) |
| WAF | ❌ | ✅ | ✅ |
| Check Interval | 5 min | 2 min | 1 min |
| Response Time Warning | 2000ms | 1500ms | 1000ms |
| Alert Channels | Email | Email, Slack | Email, Slack, PagerDuty |

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The Terraform workflow (`.github/workflows/terraform.yml`) provides:

1. **Format Check**: Validates Terraform formatting
2. **Validate**: Validates configuration syntax
3. **Security Scan**: Runs tfsec and Checkov
4. **Plan**: Shows planned changes on PRs
5. **Apply**: Manual deployment with approval

### Required GitHub Secrets

| Secret | Description | Required |
|--------|-------------|----------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | ✅ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | ✅ |
| `CLOUDFLARE_ZONE_ID` | Cloudflare zone ID | For DNS/security |
| `ALERT_EMAIL` | Alert notification email | ✅ |
| `CUSTOM_DOMAIN` | Custom domain | For prod |
| `API_URL` | Backend API URL | For prod |
| `SLACK_WEBHOOK_URL` | Slack webhook | Optional |
| `PAGERDUTY_KEY` | PagerDuty integration key | Optional |
| `SENTRY_DSN` | Sentry DSN | Optional |
| `GA_ID` | Google Analytics ID | Optional |

### Workflow Triggers

| Trigger | Action |
|---------|--------|
| PR to master/develop | Format, Validate, Security, Plan |
| Push to master | Format, Validate, Security |
| Manual dispatch | Plan, Apply, or Destroy |

### Manual Deployment

1. Go to Actions → Terraform
2. Click "Run workflow"
3. Select environment and action
4. For `apply`, approval is required

## 🔒 Security

### Security Best Practices

1. **Never commit secrets**: Use `.tfvars` files (gitignored) or environment variables
2. **Use remote state**: Enable state locking for team environments
3. **Encrypt state**: Enable encryption at rest for state files
4. **Least privilege**: Use minimal API token permissions
5. **Review plans**: Always review `terraform plan` before applying

### Security Headers (Production)

| Header | Value |
|--------|-------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Restrictive policy |
| Content-Security-Policy | Customizable |

### Rate Limiting

| Environment | General | API |
|-------------|---------|-----|
| Dev | Disabled | Disabled |
| Staging | 150/min | 50/min |
| Prod | 100/min | 30/min |

## 🔧 Troubleshooting

### Common Issues

#### "Error: Invalid provider configuration"

```bash
# Ensure API token is set
export TF_VAR_cloudflare_api_token="your-token"
```

#### "Error: zone_id is required"

Security features (headers, rate limiting, WAF) require a zone_id. Either:
- Provide the zone_id variable
- Disable security features for development

#### "Error: Pages project already exists"

The project name must be unique. Either:
- Use a different project name
- Import the existing resource: `terraform import module.cloudflare.cloudflare_pages_project.dragndrop <account_id>/<project_name>`

#### State Lock Issues

```bash
# Force unlock (use with caution)
terraform force-unlock <lock-id>
```

### Useful Commands

```bash
# Format all files
terraform fmt -recursive

# Validate configuration
terraform validate

# Show current state
terraform show

# List resources
terraform state list

# Import existing resource
terraform import <resource_address> <resource_id>

# Destroy specific resource
terraform destroy -target=<resource_address>
```

## 🤝 Contributing

### Making Changes

1. Create a feature branch from `develop`
2. Make changes to Terraform files
3. Run `terraform fmt -recursive`
4. Run `terraform validate` in each environment
5. Create a PR to `develop`
6. Review the plan output in PR comments
7. Merge after approval

### Code Style

- Use 2-space indentation
- Add comments for complex logic
- Use descriptive variable names
- Group related resources with comments
- Always include variable descriptions

### Testing Changes

```bash
# Test in dev first
cd terraform/environments/dev
terraform init
terraform plan

# Then staging
cd ../staging
terraform init
terraform plan

# Finally prod (plan only, apply via CI/CD)
cd ../prod
terraform init
terraform plan
```

## 📚 Additional Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Cloudflare Provider Docs](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

**Maintained by**: @devops  
**Last Updated**: 2025-12-09  
**Version**: 1.0.0
