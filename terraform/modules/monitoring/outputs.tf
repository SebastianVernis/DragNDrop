# =============================================================================
# Monitoring Module - Outputs
# =============================================================================

# -----------------------------------------------------------------------------
# Endpoint Information
# -----------------------------------------------------------------------------

output "monitored_endpoints" {
  description = "List of monitored endpoints"
  value = {
    for key, endpoint in local.active_endpoints : key => {
      name        = endpoint.name
      url         = endpoint.url
      environment = endpoint.environment
    }
  }
}

output "production_url" {
  description = "Production URL being monitored"
  value       = var.production_url
}

output "staging_url" {
  description = "Staging URL being monitored (if configured)"
  value       = var.staging_url != "" ? var.staging_url : null
}

# -----------------------------------------------------------------------------
# Alert Configuration
# -----------------------------------------------------------------------------

output "alert_thresholds" {
  description = "Configured alert thresholds"
  value = {
    response_time_warning_ms    = var.response_time_warning_ms
    response_time_critical_ms   = var.response_time_critical_ms
    error_rate_warning_percent  = var.error_rate_warning_percent
    error_rate_critical_percent = var.error_rate_critical_percent
    ssl_expiry_warning_days     = var.ssl_expiry_warning_days
    consecutive_failures        = var.consecutive_failures_alert
  }
}

output "alert_channels" {
  description = "Configured alert channels"
  value       = var.alert_channels
}

# -----------------------------------------------------------------------------
# Check Configuration
# -----------------------------------------------------------------------------

output "check_configuration" {
  description = "Health check configuration"
  value = {
    interval_seconds = var.check_interval_seconds
    timeout_seconds  = var.check_timeout_seconds
  }
}

# -----------------------------------------------------------------------------
# Generated Files
# -----------------------------------------------------------------------------

output "generated_files" {
  description = "List of generated configuration files"
  value = var.generate_config_files ? {
    uptime_config     = "${path.module}/generated/uptime-monitors.json"
    alert_rules       = "${path.module}/generated/alert-rules.json"
    health_check      = "${path.module}/generated/health-check.sh"
    prometheus_config = var.enable_prometheus_config ? "${path.module}/generated/prometheus-targets.yml" : null
    grafana_dashboard = var.enable_grafana_dashboard ? "${path.module}/generated/grafana-dashboard.json" : null
    status_page       = var.enable_status_page ? "${path.module}/generated/status-page.json" : null
  } : {}
}

# -----------------------------------------------------------------------------
# Configuration Summary
# -----------------------------------------------------------------------------

output "configuration_summary" {
  description = "Summary of the monitoring configuration"
  value = {
    endpoints_monitored     = length(local.active_endpoints)
    check_interval          = "${var.check_interval_seconds}s"
    alert_channels          = var.alert_channels
    prometheus_enabled      = var.enable_prometheus_config
    grafana_enabled         = var.enable_grafana_dashboard
    status_page_enabled     = var.enable_status_page
    environment             = var.environment
  }
}

# -----------------------------------------------------------------------------
# Integration URLs (for documentation)
# -----------------------------------------------------------------------------

output "integration_info" {
  description = "Information for integrating with external monitoring services"
  value = {
    recommended_services = [
      {
        name        = "UptimeRobot"
        description = "Free uptime monitoring with 5-minute intervals"
        url         = "https://uptimerobot.com"
        config_file = var.generate_config_files ? "uptime-monitors.json" : null
      },
      {
        name        = "Better Uptime"
        description = "Modern status pages and incident management"
        url         = "https://betteruptime.com"
        config_file = var.generate_config_files ? "uptime-monitors.json" : null
      },
      {
        name        = "Prometheus + Grafana"
        description = "Self-hosted monitoring stack"
        url         = "https://prometheus.io"
        config_file = var.enable_prometheus_config ? "prometheus-targets.yml" : null
      }
    ]
    
    health_check_script = var.generate_config_files ? {
      path  = "${path.module}/generated/health-check.sh"
      usage = "bash health-check.sh"
    } : null
  }
}
