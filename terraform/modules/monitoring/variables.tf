# =============================================================================
# Monitoring Module - Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Endpoint Configuration
# -----------------------------------------------------------------------------

variable "production_url" {
  description = "Production URL to monitor"
  type        = string
  default     = "https://dragndrop-editor.pages.dev"
}

variable "staging_url" {
  description = "Staging URL to monitor (optional)"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Check Configuration
# -----------------------------------------------------------------------------

variable "check_interval_seconds" {
  description = "Interval between health checks in seconds"
  type        = number
  default     = 60

  validation {
    condition     = var.check_interval_seconds >= 30 && var.check_interval_seconds <= 3600
    error_message = "Check interval must be between 30 and 3600 seconds."
  }
}

variable "check_timeout_seconds" {
  description = "Timeout for health checks in seconds"
  type        = number
  default     = 30

  validation {
    condition     = var.check_timeout_seconds >= 5 && var.check_timeout_seconds <= 120
    error_message = "Check timeout must be between 5 and 120 seconds."
  }
}

variable "consecutive_failures_alert" {
  description = "Number of consecutive failures before alerting"
  type        = number
  default     = 3

  validation {
    condition     = var.consecutive_failures_alert >= 1 && var.consecutive_failures_alert <= 10
    error_message = "Consecutive failures must be between 1 and 10."
  }
}

# -----------------------------------------------------------------------------
# Alert Thresholds
# -----------------------------------------------------------------------------

variable "response_time_warning_ms" {
  description = "Response time threshold for warning alerts (milliseconds)"
  type        = number
  default     = 1000
}

variable "response_time_critical_ms" {
  description = "Response time threshold for critical alerts (milliseconds)"
  type        = number
  default     = 3000
}

variable "error_rate_warning_percent" {
  description = "Error rate threshold for warning alerts (percentage)"
  type        = number
  default     = 1
}

variable "error_rate_critical_percent" {
  description = "Error rate threshold for critical alerts (percentage)"
  type        = number
  default     = 5
}

variable "ssl_expiry_warning_days" {
  description = "Days before SSL expiry to trigger warning"
  type        = number
  default     = 30
}

# -----------------------------------------------------------------------------
# Alert Channels
# -----------------------------------------------------------------------------

variable "alert_channels" {
  description = "List of alert notification channels"
  type        = list(string)
  default     = ["email"]

  validation {
    condition     = length(var.alert_channels) > 0
    error_message = "At least one alert channel must be specified."
  }
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
  sensitive   = true
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts (optional)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "pagerduty_integration_key" {
  description = "PagerDuty integration key for alerts (optional)"
  type        = string
  default     = ""
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Configuration Generation
# -----------------------------------------------------------------------------

variable "generate_config_files" {
  description = "Generate configuration files for external monitoring tools"
  type        = bool
  default     = true
}

variable "enable_prometheus_config" {
  description = "Generate Prometheus configuration"
  type        = bool
  default     = false
}

variable "enable_grafana_dashboard" {
  description = "Generate Grafana dashboard configuration"
  type        = bool
  default     = false
}

variable "enable_status_page" {
  description = "Generate status page configuration"
  type        = bool
  default     = true
}

variable "blackbox_exporter_address" {
  description = "Address of the Blackbox exporter for Prometheus"
  type        = string
  default     = "blackbox-exporter:9115"
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
    component = "monitoring"
  }
}
