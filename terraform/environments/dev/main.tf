# =============================================================================
# DragNDrop Editor - Development Environment
# =============================================================================
# This configuration manages the development environment infrastructure.
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
  environment = "dev"
  project_name = "dragndrop-editor-dev"
  
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
  production_branch = "develop"
  preview_branches  = ["feature/*", "fix/*", "dev/*"]
  build_command     = "npm run build"
  build_output_dir  = "dist"
  
  # Environment Variables
  preview_env_vars = {
    NODE_ENV           = "development"
    VITE_APP_NAME      = "DragNDrop Editor (Dev)"
    VITE_DEBUG_MODE    = "true"
    VITE_API_URL       = var.api_url
  }
  
  production_env_vars = {
    NODE_ENV           = "development"
    VITE_APP_NAME      = "DragNDrop Editor (Dev)"
    VITE_DEBUG_MODE    = "true"
    VITE_API_URL       = var.api_url
  }
  
  # DNS Configuration (optional for dev)
  zone_id       = var.cloudflare_zone_id
  custom_domain = var.custom_domain
  
  # Security Configuration (relaxed for dev)
  enable_security_headers = false
  enable_rate_limiting    = false
  enable_waf              = false
  
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
  
  # Check Configuration (less frequent for dev)
  check_interval_seconds     = 300  # 5 minutes
  check_timeout_seconds      = 30
  consecutive_failures_alert = 5
  
  # Alert Thresholds (relaxed for dev)
  response_time_warning_ms    = 2000
  response_time_critical_ms   = 5000
  error_rate_warning_percent  = 5
  error_rate_critical_percent = 10
  
  # Alert Channels
  alert_channels = ["email"]
  alert_email    = var.alert_email
  
  # Configuration Generation
  generate_config_files    = true
  enable_prometheus_config = false
  enable_grafana_dashboard = false
  enable_status_page       = false
  
  # Metadata
  environment = local.environment
  tags        = local.common_tags
}
