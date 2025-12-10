# =============================================================================
# Production Environment - Outputs
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

output "production_url" {
  description = "Production URL (custom domain or Pages URL)"
  value       = var.custom_domain != "" ? "https://${var.custom_domain}" : module.cloudflare.pages_url
}

output "custom_domain" {
  description = "Custom domain"
  value       = module.cloudflare.custom_domain
}

output "custom_domain_status" {
  description = "Custom domain status"
  value       = module.cloudflare.custom_domain_status
}

output "dns_records" {
  description = "DNS records created"
  value       = module.cloudflare.dns_records
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

output "alert_thresholds" {
  description = "Configured alert thresholds"
  value       = module.monitoring.alert_thresholds
}

output "generated_files" {
  description = "Generated monitoring configuration files"
  value       = module.monitoring.generated_files
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    environment    = local.environment
    pages_url      = module.cloudflare.pages_url
    production_url = var.custom_domain != "" ? "https://${var.custom_domain}" : module.cloudflare.pages_url
    custom_domain  = var.custom_domain
    branch         = "master"
    api_url        = var.api_url
  }
}

# -----------------------------------------------------------------------------
# Sensitive Outputs (marked sensitive)
# -----------------------------------------------------------------------------

output "pages_project_id" {
  description = "Cloudflare Pages project ID"
  value       = module.cloudflare.pages_project_id
  sensitive   = true
}
