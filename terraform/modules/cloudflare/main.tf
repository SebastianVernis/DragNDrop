# =============================================================================
# Cloudflare Module - Main Configuration
# =============================================================================
# This module manages Cloudflare Pages deployment, DNS, security headers,
# and rate limiting for the DragNDrop HTML Editor project.
# =============================================================================

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# =============================================================================
# Cloudflare Pages Project
# =============================================================================

resource "cloudflare_pages_project" "dragndrop" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config {
    build_command   = var.build_command
    destination_dir = var.build_output_dir
    root_dir        = var.build_root_dir
  }

  source {
    type = "github"
    config {
      owner                         = var.github_owner
      repo_name                     = var.github_repo
      production_branch             = var.production_branch
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = var.preview_branches
    }
  }

  deployment_configs {
    preview {
      environment_variables = var.preview_env_vars
      compatibility_date    = var.compatibility_date
      compatibility_flags   = var.compatibility_flags
    }

    production {
      environment_variables = var.production_env_vars
      compatibility_date    = var.compatibility_date
      compatibility_flags   = var.compatibility_flags
    }
  }
}

# =============================================================================
# Custom Domain (Optional - requires zone_id)
# =============================================================================

resource "cloudflare_pages_domain" "custom_domain" {
  count = var.custom_domain != "" ? 1 : 0

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.dragndrop.name
  domain       = var.custom_domain
}

# =============================================================================
# DNS Records (Optional - requires zone_id)
# =============================================================================

resource "cloudflare_record" "root" {
  count = var.zone_id != "" && var.custom_domain != "" ? 1 : 0

  zone_id = var.zone_id
  name    = "@"
  type    = "CNAME"
  content = "${cloudflare_pages_project.dragndrop.name}.pages.dev"
  proxied = true
  ttl     = 1 # Auto TTL when proxied
  comment = "DragNDrop Editor - Root domain"
}

resource "cloudflare_record" "www" {
  count = var.zone_id != "" && var.custom_domain != "" ? 1 : 0

  zone_id = var.zone_id
  name    = "www"
  type    = "CNAME"
  content = "${cloudflare_pages_project.dragndrop.name}.pages.dev"
  proxied = true
  ttl     = 1
  comment = "DragNDrop Editor - WWW subdomain"
}

# =============================================================================
# Security Headers (Transform Rules)
# =============================================================================

resource "cloudflare_ruleset" "security_headers" {
  count = var.zone_id != "" ? 1 : 0

  zone_id     = var.zone_id
  name        = "Security Headers"
  description = "Add security headers to all responses"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }
      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "DENY"
      }
      headers {
        name      = "X-XSS-Protection"
        operation = "set"
        value     = "1; mode=block"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
      headers {
        name      = "Permissions-Policy"
        operation = "set"
        value     = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
      }
      headers {
        name      = "Content-Security-Policy"
        operation = "set"
        value     = var.csp_policy
      }
    }
    expression  = "true"
    description = "Apply security headers to all requests"
    enabled     = var.enable_security_headers
  }
}

# =============================================================================
# Rate Limiting Rules
# =============================================================================

resource "cloudflare_ruleset" "rate_limiting" {
  count = var.zone_id != "" && var.enable_rate_limiting ? 1 : 0

  zone_id     = var.zone_id
  name        = "Rate Limiting Rules"
  description = "Rate limiting for DragNDrop Editor"
  kind        = "zone"
  phase       = "http_ratelimit"

  # General rate limiting - 100 requests per minute per IP
  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60
      requests_per_period = var.rate_limit_requests_per_minute
      mitigation_timeout  = 60
    }
    expression  = "true"
    description = "General rate limiting - ${var.rate_limit_requests_per_minute} req/min per IP"
    enabled     = true
  }

  # API rate limiting - stricter limits for API endpoints
  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60
      requests_per_period = var.api_rate_limit_requests_per_minute
      mitigation_timeout  = 120
    }
    expression  = "(http.request.uri.path contains \"/api/\")"
    description = "API rate limiting - ${var.api_rate_limit_requests_per_minute} req/min per IP"
    enabled     = true
  }
}

# =============================================================================
# WAF Rules (Web Application Firewall)
# =============================================================================

resource "cloudflare_ruleset" "waf_custom" {
  count = var.zone_id != "" && var.enable_waf ? 1 : 0

  zone_id     = var.zone_id
  name        = "Custom WAF Rules"
  description = "Custom WAF rules for DragNDrop Editor"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  # Block known bad bots
  rules {
    action      = "block"
    expression  = "(cf.client.bot) and not (cf.verified_bot_category in {\"Search Engine Crawler\" \"Monitoring & Analytics\"})"
    description = "Block unverified bots"
    enabled     = true
  }

  # Block requests from Tor exit nodes (optional)
  rules {
    action      = "challenge"
    expression  = "(ip.src in $cf.anonymizer)"
    description = "Challenge anonymous proxies"
    enabled     = var.challenge_anonymous_proxies
  }

  # Block SQL injection attempts
  rules {
    action      = "block"
    expression  = "(http.request.uri.query contains \"UNION SELECT\") or (http.request.uri.query contains \"' OR '1'='1\")"
    description = "Block SQL injection attempts"
    enabled     = true
  }
}

# =============================================================================
# Cache Rules
# =============================================================================

resource "cloudflare_ruleset" "cache_rules" {
  count = var.zone_id != "" ? 1 : 0

  zone_id     = var.zone_id
  name        = "Cache Rules"
  description = "Caching configuration for DragNDrop Editor"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  # Cache static assets aggressively
  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = 31536000 # 1 year
      }
      browser_ttl {
        mode    = "override_origin"
        default = 31536000
      }
    }
    expression  = "(http.request.uri.path.extension in {\"js\" \"css\" \"png\" \"jpg\" \"jpeg\" \"gif\" \"svg\" \"ico\" \"woff\" \"woff2\" \"ttf\" \"eot\"})"
    description = "Cache static assets for 1 year"
    enabled     = true
  }

  # Don't cache HTML (for SPA routing)
  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = false
    }
    expression  = "(http.request.uri.path.extension eq \"html\") or (http.request.uri.path eq \"/\")"
    description = "Bypass cache for HTML files"
    enabled     = true
  }
}
