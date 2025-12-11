#!/bin/bash
# =============================================================================
# DragNDrop - Service Verification Script
# =============================================================================
# Verifies all services are running correctly after deployment or failover
# Usage: ./verify-services.sh [--region <region>] [--verbose]
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
LOG_FILE="$PROJECT_ROOT/logs/verify-services-$TIMESTAMP.log"

# Default values
REGION="primary"
VERBOSE=false
TIMEOUT=10

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
        OK)    echo -e "${GREEN}[✓]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[!]${NC} $message" ;;
        ERROR) echo -e "${RED}[✗]${NC} $message" ;;
        DEBUG) [ "$VERBOSE" = true ] && echo -e "[DEBUG] $message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Verify all services are running correctly.

OPTIONS:
    --region <region>    Region to verify (primary|secondary|all)
    --verbose            Show detailed output
    --timeout <seconds>  Request timeout (default: 10)
    -h, --help           Show this help message

EXAMPLES:
    $0
    $0 --region secondary
    $0 --region all --verbose

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --region)
            REGION="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
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

# Service endpoints by region
get_endpoints() {
    local region=$1
    
    case $region in
        primary)
            echo "https://dragndrop.dev"
            echo "http://localhost:8080"  # Local development
            ;;
        secondary)
            echo "https://secondary.dragndrop.dev"
            ;;
    esac
}

# Check HTTP endpoint
check_http() {
    local url=$1
    local expected_status=${2:-200}
    
    log DEBUG "Checking HTTP: $url"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        "$url" 2>/dev/null || echo "000:0")
    
    local status=$(echo "$response" | cut -d: -f1)
    local time=$(echo "$response" | cut -d: -f2)
    
    if [ "$status" = "$expected_status" ]; then
        log OK "$url (HTTP $status, ${time}s)"
        return 0
    elif [ "$status" = "000" ]; then
        log ERROR "$url (Connection failed)"
        return 1
    else
        log WARN "$url (HTTP $status, expected $expected_status)"
        return 1
    fi
}

# Check static assets
check_static_assets() {
    local base_url=$1
    local failed=0
    
    log INFO "Checking static assets..."
    
    local assets=(
        "/index.html"
        "/script.js"
        "/style.css"
    )
    
    for asset in "${assets[@]}"; do
        if ! check_http "${base_url}${asset}"; then
            ((failed++))
        fi
    done
    
    return $failed
}

# Check API endpoints (if applicable)
check_api() {
    local base_url=$1
    local failed=0
    
    log INFO "Checking API endpoints..."
    
    # Health endpoint
    if ! check_http "${base_url}/api/health" 2>/dev/null; then
        log DEBUG "No API health endpoint (this is OK for static sites)"
    fi
    
    return $failed
}

# Check SSL certificate
check_ssl() {
    local url=$1
    
    # Skip for localhost
    if [[ "$url" == *"localhost"* ]] || [[ "$url" == *"127.0.0.1"* ]]; then
        log DEBUG "Skipping SSL check for localhost"
        return 0
    fi
    
    log INFO "Checking SSL certificate..."
    
    local domain=$(echo "$url" | sed -e 's|https://||' -e 's|/.*||')
    
    local expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
        openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$expiry" ]; then
        local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || echo "0")
        local now_epoch=$(date +%s)
        local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
        
        if [ $days_left -gt 30 ]; then
            log OK "SSL certificate valid ($days_left days remaining)"
        elif [ $days_left -gt 0 ]; then
            log WARN "SSL certificate expiring soon ($days_left days remaining)"
        else
            log ERROR "SSL certificate expired!"
            return 1
        fi
    else
        log WARN "Could not check SSL certificate"
    fi
    
    return 0
}

# Check response time
check_performance() {
    local url=$1
    local threshold=${2:-2}  # 2 seconds default
    
    log INFO "Checking response time..."
    
    local time=$(curl -s -o /dev/null -w "%{time_total}" \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        "$url" 2>/dev/null || echo "999")
    
    if (( $(echo "$time < $threshold" | bc -l 2>/dev/null || echo "0") )); then
        log OK "Response time: ${time}s (threshold: ${threshold}s)"
        return 0
    else
        log WARN "Response time: ${time}s (threshold: ${threshold}s)"
        return 1
    fi
}

# Check content integrity
check_content() {
    local url=$1
    
    log INFO "Checking content integrity..."
    
    local content=$(curl -s --connect-timeout "$TIMEOUT" "$url" 2>/dev/null)
    
    # Check for expected content markers
    if echo "$content" | grep -q "DragNDrop\|dragndrop\|Visual HTML Editor" 2>/dev/null; then
        log OK "Content integrity verified"
        return 0
    else
        log WARN "Expected content markers not found"
        return 1
    fi
}

# Verify single region
verify_region() {
    local region=$1
    local total_checks=0
    local failed_checks=0
    
    log INFO "Verifying $region region..."
    echo ""
    
    local endpoints=$(get_endpoints "$region")
    
    for endpoint in $endpoints; do
        log INFO "Checking endpoint: $endpoint"
        echo ""
        
        # Basic HTTP check
        if ! check_http "$endpoint"; then
            ((failed_checks++))
            log WARN "Skipping further checks for $endpoint"
            continue
        fi
        ((total_checks++))
        
        # Static assets
        if ! check_static_assets "$endpoint"; then
            ((failed_checks++))
        fi
        ((total_checks++))
        
        # SSL (for HTTPS endpoints)
        if [[ "$endpoint" == https://* ]]; then
            if ! check_ssl "$endpoint"; then
                ((failed_checks++))
            fi
            ((total_checks++))
        fi
        
        # Performance
        if ! check_performance "$endpoint"; then
            ((failed_checks++))
        fi
        ((total_checks++))
        
        # Content
        if ! check_content "$endpoint"; then
            ((failed_checks++))
        fi
        ((total_checks++))
        
        echo ""
    done
    
    return $failed_checks
}

# Main verification
main() {
    echo ""
    echo "=============================================="
    echo "  DragNDrop Service Verification"
    echo "=============================================="
    echo ""
    echo "  Region: $REGION"
    echo "  Timeout: ${TIMEOUT}s"
    echo "  Verbose: $VERBOSE"
    echo ""
    echo "=============================================="
    echo ""
    
    local total_failed=0
    
    if [ "$REGION" = "all" ]; then
        for r in primary secondary; do
            verify_region "$r"
            total_failed=$((total_failed + $?))
        done
    else
        verify_region "$REGION"
        total_failed=$?
    fi
    
    # Summary
    echo ""
    echo "=============================================="
    echo "  Verification Summary"
    echo "=============================================="
    echo ""
    
    if [ $total_failed -eq 0 ]; then
        echo -e "  Status: ${GREEN}ALL CHECKS PASSED${NC}"
        log OK "All service checks passed"
    else
        echo -e "  Status: ${YELLOW}$total_failed CHECK(S) FAILED${NC}"
        log WARN "$total_failed service check(s) failed"
    fi
    
    echo ""
    echo "  Log: $LOG_FILE"
    echo ""
    echo "=============================================="
    
    exit $total_failed
}

# Run main
main
