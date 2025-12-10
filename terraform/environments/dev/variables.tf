# =============================================================================
# Development Environment - Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Cloudflare Configuration
# -----------------------------------------------------------------------------

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages and DNS permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID (optional for dev)"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# GitHub Configuration
# -----------------------------------------------------------------------------

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "DragNDrop"
}

# -----------------------------------------------------------------------------
# Domain Configuration
# -----------------------------------------------------------------------------

variable "custom_domain" {
  description = "Custom domain for dev environment (optional)"
  type        = string
  default     = ""
}

variable "api_url" {
  description = "Backend API URL"
  type        = string
  default     = "http://localhost:3001"
}

# -----------------------------------------------------------------------------
# Alerting Configuration
# -----------------------------------------------------------------------------

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
  sensitive   = true
}
