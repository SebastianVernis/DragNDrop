# =============================================================================
# Monitoring Module - Main Configuration
# =============================================================================
# This module manages uptime monitoring, alerting, and observability
# for the DragNDrop HTML Editor project.
# =============================================================================

terraform {
  required_providers {
    # Using HTTP provider for generic health checks
    http = {
      source  = "hashicorp/http"
      version = "~> 3.0"
    }
    # Using null provider for local-exec provisioners
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

# =============================================================================
# Local Variables
# =============================================================================

locals {
  # Monitoring endpoints configuration
  endpoints = {
    production = {
      url         = var.production_url
      name        = "DragNDrop Production"
      environment = "production"
    }
    staging = var.staging_url != "" ? {
      url         = var.staging_url
      name        = "DragNDrop Staging"
      environment = "staging"
    } : null
  }

  # Filter out null endpoints
  active_endpoints = { for k, v in local.endpoints : k => v if v != null }

  # Alert thresholds
  alert_thresholds = {
    response_time_warning  = var.response_time_warning_ms
    response_time_critical = var.response_time_critical_ms
    error_rate_warning     = var.error_rate_warning_percent
    error_rate_critical    = var.error_rate_critical_percent
  }

  # Common tags for all resources
  common_tags = merge(var.tags, {
    module      = "monitoring"
    managed_by  = "terraform"
    project     = "dragndrop-editor"
  })
}

# =============================================================================
# Uptime Check Configuration (JSON output for external tools)
# =============================================================================

# Generate uptime monitoring configuration for external tools
# (e.g., UptimeRobot, Pingdom, Better Uptime, etc.)
resource "local_file" "uptime_config" {
  count = var.generate_config_files ? 1 : 0

  filename = "${path.module}/generated/uptime-monitors.json"
  content = jsonencode({
    version = "1.0"
    generated_at = timestamp()
    monitors = [
      for key, endpoint in local.active_endpoints : {
        name        = endpoint.name
        url         = endpoint.url
        type        = "http"
        method      = "GET"
        interval    = var.check_interval_seconds
        timeout     = var.check_timeout_seconds
        environment = endpoint.environment
        
        # Expected response
        expected_status_codes = [200, 301, 302]
        
        # Alert configuration
        alerts = {
          enabled = true
          channels = var.alert_channels
          thresholds = {
            consecutive_failures = var.consecutive_failures_alert
            response_time_ms     = local.alert_thresholds.response_time_warning
          }
        }
        
        # Health check endpoints
        health_checks = [
          {
            path        = "/"
            description = "Main page"
          },
          {
            path        = "/index.html"
            description = "Index HTML"
          }
        ]
        
        # Tags
        tags = [endpoint.environment, "frontend", "spa"]
      }
    ]
  })

  lifecycle {
    ignore_changes = [content]
  }
}

# =============================================================================
# Alert Rules Configuration
# =============================================================================

resource "local_file" "alert_rules" {
  count = var.generate_config_files ? 1 : 0

  filename = "${path.module}/generated/alert-rules.json"
  content = jsonencode({
    version = "1.0"
    generated_at = timestamp()
    
    rules = [
      # Availability Alert
      {
        name        = "Site Unavailable"
        description = "Alert when site is not responding"
        severity    = "critical"
        condition = {
          type      = "availability"
          threshold = 0
          duration  = "${var.consecutive_failures_alert * var.check_interval_seconds}s"
        }
        actions = var.alert_channels
      },
      
      # Response Time Warning
      {
        name        = "High Response Time (Warning)"
        description = "Response time exceeds warning threshold"
        severity    = "warning"
        condition = {
          type      = "response_time"
          operator  = ">"
          threshold = local.alert_thresholds.response_time_warning
          duration  = "5m"
        }
        actions = var.alert_channels
      },
      
      # Response Time Critical
      {
        name        = "High Response Time (Critical)"
        description = "Response time exceeds critical threshold"
        severity    = "critical"
        condition = {
          type      = "response_time"
          operator  = ">"
          threshold = local.alert_thresholds.response_time_critical
          duration  = "2m"
        }
        actions = var.alert_channels
      },
      
      # SSL Certificate Expiry
      {
        name        = "SSL Certificate Expiring"
        description = "SSL certificate expires within ${var.ssl_expiry_warning_days} days"
        severity    = "warning"
        condition = {
          type      = "ssl_expiry"
          threshold = var.ssl_expiry_warning_days
        }
        actions = var.alert_channels
      },
      
      # Error Rate Alert
      {
        name        = "High Error Rate"
        description = "Error rate exceeds threshold"
        severity    = "critical"
        condition = {
          type      = "error_rate"
          operator  = ">"
          threshold = local.alert_thresholds.error_rate_critical
          duration  = "5m"
        }
        actions = var.alert_channels
      }
    ]
  })

  lifecycle {
    ignore_changes = [content]
  }
}

# =============================================================================
# Prometheus/Grafana Configuration (Optional)
# =============================================================================

resource "local_file" "prometheus_config" {
  count = var.generate_config_files && var.enable_prometheus_config ? 1 : 0

  filename = "${path.module}/generated/prometheus-targets.yml"
  content = yamlencode({
    # Prometheus scrape targets
    scrape_configs = [
      {
        job_name = "dragndrop-blackbox"
        metrics_path = "/probe"
        params = {
          module = ["http_2xx"]
        }
        static_configs = [
          {
            targets = [for endpoint in local.active_endpoints : endpoint.url]
            labels = {
              project = "dragndrop-editor"
            }
          }
        ]
        relabel_configs = [
          {
            source_labels = ["__address__"]
            target_label  = "__param_target"
          },
          {
            source_labels = ["__param_target"]
            target_label  = "instance"
          },
          {
            target_label = "__address__"
            replacement  = var.blackbox_exporter_address
          }
        ]
      }
    ]
  })
}

# =============================================================================
# Grafana Dashboard Configuration
# =============================================================================

resource "local_file" "grafana_dashboard" {
  count = var.generate_config_files && var.enable_grafana_dashboard ? 1 : 0

  filename = "${path.module}/generated/grafana-dashboard.json"
  content = jsonencode({
    dashboard = {
      id            = null
      uid           = "dragndrop-monitoring"
      title         = "DragNDrop Editor - Monitoring Dashboard"
      tags          = ["dragndrop", "monitoring", "uptime"]
      timezone      = "browser"
      schemaVersion = 38
      version       = 1
      refresh       = "30s"
      
      annotations = {
        list = [
          {
            builtIn    = 1
            datasource = { type = "grafana", uid = "-- Grafana --" }
            enable     = true
            hide       = true
            iconColor  = "rgba(0, 211, 255, 1)"
            name       = "Annotations & Alerts"
            type       = "dashboard"
          }
        ]
      }
      
      panels = [
        # Uptime Panel
        {
          id       = 1
          type     = "stat"
          title    = "Uptime"
          gridPos  = { h = 4, w = 6, x = 0, y = 0 }
          targets = [
            {
              expr         = "avg_over_time(probe_success{job=\"dragndrop-blackbox\"}[24h]) * 100"
              legendFormat = "Uptime %"
            }
          ]
          fieldConfig = {
            defaults = {
              unit       = "percent"
              thresholds = {
                mode = "absolute"
                steps = [
                  { color = "red", value = null },
                  { color = "yellow", value = 95 },
                  { color = "green", value = 99 }
                ]
              }
            }
          }
        },
        
        # Response Time Panel
        {
          id       = 2
          type     = "gauge"
          title    = "Response Time"
          gridPos  = { h = 4, w = 6, x = 6, y = 0 }
          targets = [
            {
              expr         = "probe_duration_seconds{job=\"dragndrop-blackbox\"} * 1000"
              legendFormat = "Response Time (ms)"
            }
          ]
          fieldConfig = {
            defaults = {
              unit = "ms"
              min  = 0
              max  = 5000
              thresholds = {
                mode = "absolute"
                steps = [
                  { color = "green", value = null },
                  { color = "yellow", value = local.alert_thresholds.response_time_warning },
                  { color = "red", value = local.alert_thresholds.response_time_critical }
                ]
              }
            }
          }
        },
        
        # SSL Certificate Days Remaining
        {
          id       = 3
          type     = "stat"
          title    = "SSL Certificate Days Remaining"
          gridPos  = { h = 4, w = 6, x = 12, y = 0 }
          targets = [
            {
              expr         = "(probe_ssl_earliest_cert_expiry{job=\"dragndrop-blackbox\"} - time()) / 86400"
              legendFormat = "Days"
            }
          ]
          fieldConfig = {
            defaults = {
              unit = "d"
              thresholds = {
                mode = "absolute"
                steps = [
                  { color = "red", value = null },
                  { color = "yellow", value = 14 },
                  { color = "green", value = 30 }
                ]
              }
            }
          }
        },
        
        # Response Time Graph
        {
          id       = 4
          type     = "timeseries"
          title    = "Response Time Over Time"
          gridPos  = { h = 8, w = 24, x = 0, y = 4 }
          targets = [
            {
              expr         = "probe_duration_seconds{job=\"dragndrop-blackbox\"} * 1000"
              legendFormat = "{{ instance }}"
            }
          ]
          fieldConfig = {
            defaults = {
              unit = "ms"
              custom = {
                lineWidth = 2
                fillOpacity = 10
              }
            }
          }
        }
      ]
    }
  })
}

# =============================================================================
# Health Check Script
# =============================================================================

resource "local_file" "health_check_script" {
  count = var.generate_config_files ? 1 : 0

  filename        = "${path.module}/generated/health-check.sh"
  file_permission = "0755"
  content         = <<-EOF
#!/bin/bash
# =============================================================================
# DragNDrop Editor - Health Check Script
# Generated by Terraform
# =============================================================================

set -e

# Configuration
TIMEOUT=${var.check_timeout_seconds}
EXPECTED_STATUS="200"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check endpoint
check_endpoint() {
    local name="$1"
    local url="$2"
    
    echo -n "Checking $name ($url)... "
    
    start_time=$(date +%s%N)
    http_status=$(curl -s -o /dev/null -w "%%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$http_status" = "$EXPECTED_STATUS" ]; then
        echo -e "$${GREEN}✓ OK$${NC} (HTTP $http_status, $${response_time}ms)"
        return 0
    else
        echo -e "$${RED}✗ FAILED$${NC} (HTTP $http_status)"
        return 1
    fi
}

# Main
echo "=========================================="
echo "DragNDrop Editor - Health Check"
echo "=========================================="
echo ""

FAILED=0

%{ for key, endpoint in local.active_endpoints ~}
check_endpoint "${endpoint.name}" "${endpoint.url}" || FAILED=$((FAILED + 1))
%{ endfor ~}

echo ""
echo "=========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "$${GREEN}All checks passed!$${NC}"
    exit 0
else
    echo -e "$${RED}$FAILED check(s) failed!$${NC}"
    exit 1
fi
EOF
}

# =============================================================================
# Status Page Configuration
# =============================================================================

resource "local_file" "status_page_config" {
  count = var.generate_config_files && var.enable_status_page ? 1 : 0

  filename = "${path.module}/generated/status-page.json"
  content = jsonencode({
    name        = "DragNDrop Editor Status"
    description = "Real-time status of DragNDrop HTML Editor services"
    
    components = [
      {
        name        = "Web Application"
        description = "Main DragNDrop Editor application"
        group       = "Core Services"
        monitors    = [for key, endpoint in local.active_endpoints : endpoint.name]
      },
      {
        name        = "API Services"
        description = "Backend API endpoints"
        group       = "Core Services"
        monitors    = []
      },
      {
        name        = "Authentication"
        description = "User authentication services"
        group       = "Supporting Services"
        monitors    = []
      },
      {
        name        = "Cloud Storage"
        description = "Project storage and sync"
        group       = "Supporting Services"
        monitors    = []
      }
    ]
    
    incidents = {
      enabled = true
      history_days = 90
    }
    
    maintenance = {
      enabled = true
      scheduled_window = "Sundays 02:00-04:00 UTC"
    }
  })
}

# =============================================================================
# Ensure generated directory exists
# =============================================================================

resource "null_resource" "create_generated_dir" {
  count = var.generate_config_files ? 1 : 0

  provisioner "local-exec" {
    command = "mkdir -p ${path.module}/generated"
  }

  triggers = {
    always_run = timestamp()
  }
}
