# =============================================================================
# Production Environment - Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Cloudflare Configuration (Required)
# -----------------------------------------------------------------------------

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages, DNS, and Firewall permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for DNS and security rules"
  type        = string
}

# -----------------------------------------------------------------------------
# GitHub Configuration (Required)
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
# Domain Configuration (Required for Production)
# -----------------------------------------------------------------------------

variable "custom_domain" {
  description = "Custom domain for production"
  type        = string
}

variable "api_url" {
  description = "Backend API URL for production"
  type        = string
}

variable "staging_url" {
  description = "Staging URL for comparison monitoring"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Security Configuration
# -----------------------------------------------------------------------------

variable "csp_policy" {
  description = "Content Security Policy header value"
  type        = string
  default     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://*.supabase.co https://generativelanguage.googleapis.com;"
}

variable "challenge_anonymous_proxies" {
  description = "Challenge requests from anonymous proxies (Tor, VPNs)"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Analytics & Error Tracking
# -----------------------------------------------------------------------------

variable "sentry_dsn" {
  description = "Sentry DSN for error tracking"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_analytics_id" {
  description = "Google Analytics measurement ID"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Alerting Configuration (Required)
# -----------------------------------------------------------------------------

variable "alert_email" {
  description = "Primary email address for alerts"
  type        = string
  sensitive   = true
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  default     = ""
  sensitive   = true
}

variable "pagerduty_integration_key" {
  description = "PagerDuty integration key for critical alerts"
  type        = string
  default     = ""
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Monitoring Configuration
# -----------------------------------------------------------------------------

variable "enable_prometheus" {
  description = "Enable Prometheus configuration generation"
  type        = bool
  default     = true
}

variable "enable_grafana" {
  description = "Enable Grafana dashboard generation"
  type        = bool
  default     = true
}

variable "blackbox_exporter_address" {
  description = "Address of the Blackbox exporter for Prometheus"
  type        = string
  default     = "blackbox-exporter:9115"
}
