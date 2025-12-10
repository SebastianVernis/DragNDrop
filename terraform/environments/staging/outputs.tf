# =============================================================================
# Staging Environment - Outputs
# =============================================================================

output "environment" {
  description = "Environment name"
  value       = local.environment
}

output "pages_url" {
  description = "Cloudflare Pages URL"
  value       = module.cloudflare.pages_url
}

output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = module.cloudflare.pages_project_name
}

output "custom_domain" {
  description = "Custom domain (if configured)"
  value       = module.cloudflare.custom_domain
}

output "security_status" {
  description = "Security features status"
  value = {
    security_headers = module.cloudflare.security_headers_enabled
    rate_limiting    = module.cloudflare.rate_limiting_enabled
    waf              = module.cloudflare.waf_enabled
  }
}

output "cloudflare_summary" {
  description = "Cloudflare configuration summary"
  value       = module.cloudflare.configuration_summary
}

output "monitoring_summary" {
  description = "Monitoring configuration summary"
  value       = module.monitoring.configuration_summary
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    environment    = local.environment
    pages_url      = module.cloudflare.pages_url
    custom_domain  = var.custom_domain != "" ? var.custom_domain : "Not configured"
    branch         = "staging"
    api_url        = var.api_url
  }
}
