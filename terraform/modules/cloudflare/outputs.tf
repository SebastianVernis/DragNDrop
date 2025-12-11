# =============================================================================
# Cloudflare Module - Outputs
# =============================================================================

# -----------------------------------------------------------------------------
# Pages Project Outputs
# -----------------------------------------------------------------------------

output "pages_project_name" {
  description = "Name of the Cloudflare Pages project"
  value       = cloudflare_pages_project.dragndrop.name
}

output "pages_project_id" {
  description = "ID of the Cloudflare Pages project"
  value       = cloudflare_pages_project.dragndrop.id
}

output "pages_subdomain" {
  description = "Default Pages subdomain URL"
  value       = cloudflare_pages_project.dragndrop.subdomain
}

output "pages_url" {
  description = "Full Pages URL"
  value       = "https://${cloudflare_pages_project.dragndrop.subdomain}"
}

output "pages_domains" {
  description = "All domains associated with the Pages project"
  value       = cloudflare_pages_project.dragndrop.domains
}

# -----------------------------------------------------------------------------
# Custom Domain Outputs
# -----------------------------------------------------------------------------

output "custom_domain" {
  description = "Custom domain configured for the project"
  value       = var.custom_domain != "" ? var.custom_domain : null
}

output "custom_domain_status" {
  description = "Status of the custom domain"
  value       = var.custom_domain != "" ? cloudflare_pages_domain.custom_domain[0].status : null
}

# -----------------------------------------------------------------------------
# DNS Outputs
# -----------------------------------------------------------------------------

output "dns_records" {
  description = "DNS records created"
  value = var.zone_id != "" && var.custom_domain != "" ? {
    root = {
      name    = cloudflare_record.root[0].name
      type    = cloudflare_record.root[0].type
      content = cloudflare_record.root[0].content
    }
    www = {
      name    = cloudflare_record.www[0].name
      type    = cloudflare_record.www[0].type
      content = cloudflare_record.www[0].content
    }
  } : null
}

# -----------------------------------------------------------------------------
# Security Configuration Outputs
# -----------------------------------------------------------------------------

output "security_headers_enabled" {
  description = "Whether security headers are enabled"
  value       = var.enable_security_headers && var.zone_id != ""
}

output "rate_limiting_enabled" {
  description = "Whether rate limiting is enabled"
  value       = var.enable_rate_limiting && var.zone_id != ""
}

output "waf_enabled" {
  description = "Whether WAF rules are enabled"
  value       = var.enable_waf && var.zone_id != ""
}

# -----------------------------------------------------------------------------
# Configuration Summary
# -----------------------------------------------------------------------------

output "configuration_summary" {
  description = "Summary of the Cloudflare configuration"
  value = {
    project_name        = cloudflare_pages_project.dragndrop.name
    production_branch   = var.production_branch
    preview_branches    = var.preview_branches
    pages_url           = "https://${cloudflare_pages_project.dragndrop.subdomain}"
    custom_domain       = var.custom_domain != "" ? var.custom_domain : "Not configured"
    security_headers    = var.enable_security_headers && var.zone_id != "" ? "Enabled" : "Disabled (requires zone_id)"
    rate_limiting       = var.enable_rate_limiting && var.zone_id != "" ? "Enabled" : "Disabled (requires zone_id)"
    waf                 = var.enable_waf && var.zone_id != "" ? "Enabled" : "Disabled (requires zone_id)"
    environment         = var.environment
  }
}
