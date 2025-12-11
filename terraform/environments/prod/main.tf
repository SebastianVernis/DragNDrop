# =============================================================================
# DragNDrop Editor - Production Environment
# =============================================================================
# This configuration manages the production environment infrastructure.
# Production has the strictest security and monitoring settings.
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# =============================================================================
# Provider Configuration
# =============================================================================

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# =============================================================================
# Local Variables
# =============================================================================

locals {
  environment  = "prod"
  project_name = "dragndrop-editor"
  
  common_tags = {
    project     = "dragndrop-editor"
    environment = local.environment
    managed_by  = "terraform"
    criticality = "high"
  }
}

# =============================================================================
# Cloudflare Module
# =============================================================================

module "cloudflare" {
  source = "../../modules/cloudflare"

  # Account Configuration
  cloudflare_account_id = var.cloudflare_account_id
  project_name          = local.project_name
  
  # GitHub Configuration
  github_owner = var.github_owner
  github_repo  = var.github_repo
  
  # Build Configuration
  production_branch = "master"
  preview_branches  = []  # No preview deployments in prod
  build_command     = "npm run build"
  build_output_dir  = "dist"
  
  # Environment Variables
  preview_env_vars = {}  # No preview in prod
  
  production_env_vars = {
    NODE_ENV           = "production"
    VITE_APP_NAME      = "DragNDrop Editor"
    VITE_DEBUG_MODE    = "false"
    VITE_API_URL       = var.api_url
    VITE_SENTRY_DSN    = var.sentry_dsn
    VITE_GA_ID         = var.google_analytics_id
  }
  
  # DNS Configuration
  zone_id       = var.cloudflare_zone_id
  custom_domain = var.custom_domain
  
  # Security Configuration (maximum security for production)
  enable_security_headers = true
  enable_rate_limiting    = true
  enable_waf              = true
  
  # Content Security Policy (strict for production)
  csp_policy = var.csp_policy
  
  # Rate Limiting (strict for production)
  rate_limit_requests_per_minute     = 100
  api_rate_limit_requests_per_minute = 30
  
  # WAF Settings (strict for production)
  challenge_anonymous_proxies = var.challenge_anonymous_proxies
  
  # Metadata
  environment = local.environment
  tags        = local.common_tags
}

# =============================================================================
# Monitoring Module
# =============================================================================

module "monitoring" {
  source = "../../modules/monitoring"

  # Endpoint Configuration
  production_url = var.custom_domain != "" ? "https://${var.custom_domain}" : module.cloudflare.pages_url
  staging_url    = var.staging_url
  
  # Check Configuration (frequent checks for production)
  check_interval_seconds     = 60   # 1 minute
  check_timeout_seconds      = 30
  consecutive_failures_alert = 2    # Alert quickly
  
  # Alert Thresholds (strict for production)
  response_time_warning_ms    = 1000
  response_time_critical_ms   = 3000
  error_rate_warning_percent  = 1
  error_rate_critical_percent = 5
  ssl_expiry_warning_days     = 30
  
  # Alert Channels (all channels for production)
  alert_channels = compact([
    "email",
    var.slack_webhook_url != "" ? "slack" : "",
    var.pagerduty_integration_key != "" ? "pagerduty" : ""
  ])
  alert_email               = var.alert_email
  slack_webhook_url         = var.slack_webhook_url
  pagerduty_integration_key = var.pagerduty_integration_key
  
  # Configuration Generation
  generate_config_files    = true
  enable_prometheus_config = var.enable_prometheus
  enable_grafana_dashboard = var.enable_grafana
  enable_status_page       = true
  
  # Prometheus Configuration
  blackbox_exporter_address = var.blackbox_exporter_address
  
  # Metadata
  environment = local.environment
  tags        = local.common_tags
}
