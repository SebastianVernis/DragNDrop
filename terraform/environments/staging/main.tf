# =============================================================================
# DragNDrop Editor - Staging Environment
# =============================================================================
# This configuration manages the staging environment infrastructure.
# Staging mirrors production but with relaxed monitoring thresholds.
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
  environment  = "staging"
  project_name = "dragndrop-editor-staging"
  
  common_tags = {
    project     = "dragndrop-editor"
    environment = local.environment
    managed_by  = "terraform"
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
  production_branch = "staging"
  preview_branches  = ["release/*", "hotfix/*"]
  build_command     = "npm run build"
  build_output_dir  = "dist"
  
  # Environment Variables
  preview_env_vars = {
    NODE_ENV           = "staging"
    VITE_APP_NAME      = "DragNDrop Editor (Staging)"
    VITE_DEBUG_MODE    = "false"
    VITE_API_URL       = var.api_url
  }
  
  production_env_vars = {
    NODE_ENV           = "staging"
    VITE_APP_NAME      = "DragNDrop Editor (Staging)"
    VITE_DEBUG_MODE    = "false"
    VITE_API_URL       = var.api_url
  }
  
  # DNS Configuration
  zone_id       = var.cloudflare_zone_id
  custom_domain = var.custom_domain
  
  # Security Configuration (enabled but with moderate settings)
  enable_security_headers = true
  enable_rate_limiting    = true
  enable_waf              = true
  
  # Rate Limiting (more permissive than prod)
  rate_limit_requests_per_minute     = 150
  api_rate_limit_requests_per_minute = 50
  
  # WAF Settings
  challenge_anonymous_proxies = false
  
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
  production_url = module.cloudflare.pages_url
  staging_url    = ""
  
  # Check Configuration
  check_interval_seconds     = 120  # 2 minutes
  check_timeout_seconds      = 30
  consecutive_failures_alert = 3
  
  # Alert Thresholds (slightly relaxed from prod)
  response_time_warning_ms    = 1500
  response_time_critical_ms   = 4000
  error_rate_warning_percent  = 2
  error_rate_critical_percent = 7
  ssl_expiry_warning_days     = 21
  
  # Alert Channels
  alert_channels = var.slack_webhook_url != "" ? ["email", "slack"] : ["email"]
  alert_email    = var.alert_email
  slack_webhook_url = var.slack_webhook_url
  
  # Configuration Generation
  generate_config_files    = true
  enable_prometheus_config = var.enable_prometheus
  enable_grafana_dashboard = var.enable_grafana
  enable_status_page       = true
  
  # Metadata
  environment = local.environment
  tags        = local.common_tags
}
