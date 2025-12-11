# =============================================================================
# Development Environment - Outputs
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
    branch         = "develop"
  }
}
