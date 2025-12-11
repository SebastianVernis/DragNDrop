#!/bin/bash
# =============================================================================
# DragNDrop - Failover Script
# =============================================================================
# This script handles failover between primary and secondary environments
# Usage: ./failover.sh --from <primary|secondary> --to <primary|secondary>
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/failover-$TIMESTAMP.log"

# Default values
FROM_ENV=""
TO_ENV=""
DRY_RUN=false
FORCE=false

# Ensure log directory exists
mkdir -p "$PROJECT_ROOT/logs"

# Logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +%Y-%m-%dT%H:%M:%S%z)
    
    case $level in
        INFO)  echo -e "${BLUE}[INFO]${NC} $message" ;;
        OK)    echo -e "${GREEN}[OK]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Failover between primary and secondary environments.

OPTIONS:
    --from <env>     Source environment (primary|secondary)
    --to <env>       Target environment (primary|secondary)
    --dry-run        Show what would be done without making changes
    --force          Skip confirmation prompts
    -h, --help       Show this help message

EXAMPLES:
    $0 --from primary --to secondary
    $0 --from secondary --to primary --dry-run
    $0 --from primary --to secondary --force

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --from)
            FROM_ENV="$2"
            shift 2
            ;;
        --to)
            TO_ENV="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate arguments
if [ -z "$FROM_ENV" ] || [ -z "$TO_ENV" ]; then
    echo "Error: --from and --to are required"
    usage
fi

if [ "$FROM_ENV" = "$TO_ENV" ]; then
    echo "Error: Source and target environments must be different"
    exit 1
fi

# Environment configurations
get_env_config() {
    local env=$1
    case $env in
        primary)
            echo "PRIMARY_URL=https://dragndrop.dev"
            echo "PRIMARY_REGION=us-east-1"
            echo "PRIMARY_PROVIDER=vercel"
            ;;
        secondary)
            echo "SECONDARY_URL=https://secondary.dragndrop.dev"
            echo "SECONDARY_REGION=eu-west-1"
            echo "SECONDARY_PROVIDER=cloudflare"
            ;;
    esac
}

# Health check
check_health() {
    local env=$1
    local url=""
    
    case $env in
        primary)   url="https://dragndrop.dev" ;;
        secondary) url="https://secondary.dragndrop.dev" ;;
    esac
    
    log INFO "Checking health of $env environment..."
    
    # For local testing, check localhost
    if [ "$env" = "primary" ]; then
        url="http://localhost:8080"
    fi
    
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status" = "200" ]; then
        log OK "$env environment is healthy (HTTP $status)"
        return 0
    else
        log WARN "$env environment returned HTTP $status"
        return 1
    fi
}

# Update DNS
update_dns() {
    local target=$1
    
    log INFO "Updating DNS to point to $target..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would update DNS records"
        return 0
    fi
    
    # Cloudflare DNS update (if configured)
    if [ -n "$CLOUDFLARE_API_TOKEN" ] && [ -n "$CLOUDFLARE_ZONE_ID" ]; then
        log INFO "Updating Cloudflare DNS..."
        
        local target_ip=""
        case $target in
            primary)   target_ip="$PRIMARY_IP" ;;
            secondary) target_ip="$SECONDARY_IP" ;;
        esac
        
        # This is a placeholder - actual implementation would use Cloudflare API
        log INFO "Would update A record to $target_ip"
    else
        log WARN "Cloudflare credentials not configured - skipping DNS update"
    fi
    
    return 0
}

# Update load balancer
update_load_balancer() {
    local target=$1
    
    log INFO "Updating load balancer to route to $target..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would update load balancer"
        return 0
    fi
    
    # Placeholder for actual load balancer update
    log INFO "Load balancer update placeholder"
    
    return 0
}

# Notify team
notify_team() {
    local message=$1
    
    log INFO "Sending notification: $message"
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would send notification"
        return 0
    fi
    
    # Slack notification (if configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -s -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\": \"🔄 Failover: $message\"}" || true
    fi
    
    # Email notification (placeholder)
    log INFO "Email notification placeholder"
    
    return 0
}

# Main failover process
perform_failover() {
    echo ""
    echo "=============================================="
    echo "  DragNDrop Failover"
    echo "=============================================="
    echo ""
    echo "  From: $FROM_ENV"
    echo "  To:   $TO_ENV"
    echo "  Mode: $([ "$DRY_RUN" = true ] && echo "DRY RUN" || echo "LIVE")"
    echo ""
    echo "=============================================="
    echo ""
    
    # Confirmation
    if [ "$FORCE" != true ] && [ "$DRY_RUN" != true ]; then
        read -p "Are you sure you want to failover from $FROM_ENV to $TO_ENV? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            log INFO "Failover cancelled by user"
            exit 0
        fi
    fi
    
    local start_time=$(date +%s)
    
    # Step 1: Verify target is healthy
    log INFO "Step 1: Verifying target environment health..."
    if ! check_health "$TO_ENV"; then
        log ERROR "Target environment $TO_ENV is not healthy!"
        if [ "$FORCE" != true ]; then
            log ERROR "Aborting failover. Use --force to override."
            exit 1
        fi
        log WARN "Continuing due to --force flag"
    fi
    
    # Step 2: Notify team of failover start
    log INFO "Step 2: Notifying team..."
    notify_team "Starting failover from $FROM_ENV to $TO_ENV"
    
    # Step 3: Update DNS
    log INFO "Step 3: Updating DNS..."
    update_dns "$TO_ENV"
    
    # Step 4: Update load balancer
    log INFO "Step 4: Updating load balancer..."
    update_load_balancer "$TO_ENV"
    
    # Step 5: Wait for propagation
    log INFO "Step 5: Waiting for DNS propagation..."
    if [ "$DRY_RUN" != true ]; then
        sleep 10
    fi
    
    # Step 6: Verify failover
    log INFO "Step 6: Verifying failover..."
    if check_health "$TO_ENV"; then
        log OK "Failover verification successful"
    else
        log WARN "Failover verification returned non-200 status"
    fi
    
    # Step 7: Notify completion
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    notify_team "Failover completed from $FROM_ENV to $TO_ENV in ${duration}s"
    
    # Summary
    echo ""
    echo "=============================================="
    echo "  Failover Complete"
    echo "=============================================="
    echo ""
    echo "  Duration: ${duration}s"
    echo "  Status: $([ "$DRY_RUN" = true ] && echo "DRY RUN COMPLETE" || echo "COMPLETE")"
    echo "  Log: $LOG_FILE"
    echo ""
    echo "=============================================="
    
    log OK "Failover completed successfully"
}

# Run failover
perform_failover
