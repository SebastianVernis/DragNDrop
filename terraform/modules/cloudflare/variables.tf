# =============================================================================
# Cloudflare Module - Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Required Variables
# -----------------------------------------------------------------------------

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
  default     = "dragndrop-editor"
}

variable "github_owner" {
  description = "GitHub repository owner (username or organization)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

# -----------------------------------------------------------------------------
# Build Configuration
# -----------------------------------------------------------------------------

variable "production_branch" {
  description = "Production branch name"
  type        = string
  default     = "master"
}

variable "preview_branches" {
  description = "Branches that trigger preview deployments"
  type        = list(string)
  default     = ["develop", "feature/*", "fix/*"]
}

variable "build_command" {
  description = "Build command for the project"
  type        = string
  default     = "npm run build"
}

variable "build_output_dir" {
  description = "Build output directory"
  type        = string
  default     = "dist"
}

variable "build_root_dir" {
  description = "Root directory for the build"
  type        = string
  default     = ""
}

variable "compatibility_date" {
  description = "Workers compatibility date"
  type        = string
  default     = "2024-01-01"
}

variable "compatibility_flags" {
  description = "Workers compatibility flags"
  type        = list(string)
  default     = []
}

# -----------------------------------------------------------------------------
# Environment Variables
# -----------------------------------------------------------------------------

variable "preview_env_vars" {
  description = "Environment variables for preview deployments"
  type        = map(string)
  default = {
    NODE_ENV = "development"
  }
  sensitive = true
}

variable "production_env_vars" {
  description = "Environment variables for production deployment"
  type        = map(string)
  default = {
    NODE_ENV = "production"
  }
  sensitive = true
}

# -----------------------------------------------------------------------------
# DNS Configuration (Optional)
# -----------------------------------------------------------------------------

variable "zone_id" {
  description = "Cloudflare Zone ID (required for DNS, security headers, and rate limiting)"
  type        = string
  default     = ""
}

variable "custom_domain" {
  description = "Custom domain for the Pages project"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Security Configuration
# -----------------------------------------------------------------------------

variable "enable_security_headers" {
  description = "Enable security headers transform rule"
  type        = bool
  default     = true
}

variable "csp_policy" {
  description = "Content Security Policy header value"
  type        = string
  default     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://*.supabase.co https://generativelanguage.googleapis.com;"
}

variable "enable_waf" {
  description = "Enable Web Application Firewall rules"
  type        = bool
  default     = true
}

variable "challenge_anonymous_proxies" {
  description = "Challenge requests from anonymous proxies (Tor, VPNs)"
  type        = bool
  default     = false
}

# -----------------------------------------------------------------------------
# Rate Limiting Configuration
# -----------------------------------------------------------------------------

variable "enable_rate_limiting" {
  description = "Enable rate limiting rules"
  type        = bool
  default     = true
}

variable "rate_limit_requests_per_minute" {
  description = "Maximum requests per minute per IP (general)"
  type        = number
  default     = 100
}

variable "api_rate_limit_requests_per_minute" {
  description = "Maximum API requests per minute per IP"
  type        = number
  default     = 30
}

# -----------------------------------------------------------------------------
# Tags and Metadata
# -----------------------------------------------------------------------------

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    project   = "dragndrop-editor"
    managed   = "terraform"
    component = "cloudflare"
  }
}
