#!/bin/bash
# ============================================
# Security Headers Validation Script
# DragNDrop HTML Editor
# ============================================
# Validates security headers configuration and
# optionally tests live endpoints.
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Default URL (can be overridden)
TEST_URL="${1:-}"

# ============================================
# Required Security Headers
# ============================================

declare -A REQUIRED_HEADERS
REQUIRED_HEADERS=(
    ["Content-Security-Policy"]="Controls resources the browser can load"
    ["X-Content-Type-Options"]="Prevents MIME type sniffing"
    ["X-Frame-Options"]="Prevents clickjacking"
    ["Strict-Transport-Security"]="Enforces HTTPS"
    ["Referrer-Policy"]="Controls referrer information"
    ["Permissions-Policy"]="Controls browser features"
)

declare -A RECOMMENDED_HEADERS
RECOMMENDED_HEADERS=(
    ["X-XSS-Protection"]="Legacy XSS protection"
    ["Cross-Origin-Opener-Policy"]="Isolates browsing context"
    ["Cross-Origin-Embedder-Policy"]="Controls cross-origin embedding"
    ["Cross-Origin-Resource-Policy"]="Controls cross-origin resources"
)

# ============================================
# Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ============================================
# Validate Configuration Files
# ============================================

validate_vercel_config() {
    print_header "Validating vercel.json"
    
    local config_file="$PROJECT_ROOT/vercel.json"
    local errors=0
    
    if [ ! -f "$config_file" ]; then
        log_error "vercel.json not found"
        return 1
    fi
    
    # Validate JSON syntax
    if ! node -e "JSON.parse(require('fs').readFileSync('$config_file'))" 2>/dev/null; then
        log_error "vercel.json is not valid JSON"
        return 1
    fi
    
    log_success "vercel.json is valid JSON"
    
    # Check for required headers
    for header in "${!REQUIRED_HEADERS[@]}"; do
        if grep -q "\"$header\"" "$config_file"; then
            log_success "$header: configured"
        else
            log_error "$header: MISSING - ${REQUIRED_HEADERS[$header]}"
            errors=$((errors + 1))
        fi
    done
    
    # Check for recommended headers
    echo ""
    log_info "Checking recommended headers..."
    for header in "${!RECOMMENDED_HEADERS[@]}"; do
        if grep -q "\"$header\"" "$config_file"; then
            log_success "$header: configured"
        else
            log_warning "$header: not configured - ${RECOMMENDED_HEADERS[$header]}"
        fi
    done
    
    return $errors
}

validate_security_headers_json() {
    print_header "Validating security-headers.json"
    
    local config_file="$PROJECT_ROOT/config/security/security-headers.json"
    
    if [ ! -f "$config_file" ]; then
        log_warning "security-headers.json not found (optional)"
        return 0
    fi
    
    # Validate JSON syntax
    if ! node -e "JSON.parse(require('fs').readFileSync('$config_file'))" 2>/dev/null; then
        log_error "security-headers.json is not valid JSON"
        return 1
    fi
    
    log_success "security-headers.json is valid JSON"
    
    # Check structure
    node -e "
        const config = JSON.parse(require('fs').readFileSync('$config_file'));
        
        if (!config.headers) {
            console.error('Missing headers section');
            process.exit(1);
        }
        
        const requiredHeaders = [
            'Content-Security-Policy',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'Strict-Transport-Security',
            'Referrer-Policy',
            'Permissions-Policy'
        ];
        
        let errors = 0;
        for (const header of requiredHeaders) {
            if (config.headers[header]) {
                console.log('✓ ' + header + ' defined');
            } else {
                console.error('✗ ' + header + ' missing');
                errors++;
            }
        }
        
        process.exit(errors > 0 ? 1 : 0);
    " 2>&1 | while read line; do
        if [[ $line == ✓* ]]; then
            log_success "${line:2}"
        elif [[ $line == ✗* ]]; then
            log_error "${line:2}"
        else
            echo "$line"
        fi
    done
    
    return ${PIPESTATUS[0]}
}

# ============================================
# Test Live Headers
# ============================================

test_live_headers() {
    local url="$1"
    
    print_header "Testing Live Headers: $url"
    
    if ! command -v curl &> /dev/null; then
        log_error "curl is required for live testing"
        return 1
    fi
    
    # Fetch headers
    local headers=$(curl -sI "$url" 2>/dev/null)
    
    if [ -z "$headers" ]; then
        log_error "Could not fetch headers from $url"
        return 1
    fi
    
    echo ""
    log_info "Response headers:"
    echo "$headers" | head -20
    echo ""
    
    local errors=0
    
    # Check required headers
    log_info "Checking required security headers..."
    for header in "${!REQUIRED_HEADERS[@]}"; do
        if echo "$headers" | grep -qi "^$header:"; then
            local value=$(echo "$headers" | grep -i "^$header:" | cut -d: -f2- | tr -d '\r')
            log_success "$header:$value"
        else
            log_error "$header: NOT PRESENT"
            errors=$((errors + 1))
        fi
    done
    
    # Check recommended headers
    echo ""
    log_info "Checking recommended headers..."
    for header in "${!RECOMMENDED_HEADERS[@]}"; do
        if echo "$headers" | grep -qi "^$header:"; then
            local value=$(echo "$headers" | grep -i "^$header:" | cut -d: -f2- | tr -d '\r')
            log_success "$header:$value"
        else
            log_warning "$header: not present"
        fi
    done
    
    # Security score
    echo ""
    local total_required=${#REQUIRED_HEADERS[@]}
    local present=$((total_required - errors))
    local score=$((present * 100 / total_required))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Security Headers Score: $score% ($present/$total_required required headers)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ $score -eq 100 ]; then
        log_success "All required security headers are present!"
    elif [ $score -ge 80 ]; then
        log_warning "Most security headers present, but some are missing"
    else
        log_error "Critical security headers are missing!"
    fi
    
    return $errors
}

# ============================================
# CSP Validation
# ============================================

validate_csp() {
    print_header "Validating Content Security Policy"
    
    local config_file="$PROJECT_ROOT/vercel.json"
    
    if [ ! -f "$config_file" ]; then
        log_error "vercel.json not found"
        return 1
    fi
    
    # Extract CSP value
    local csp=$(node -e "
        const config = JSON.parse(require('fs').readFileSync('$config_file'));
        const headers = config.headers || [];
        for (const h of headers) {
            for (const hh of h.headers || []) {
                if (hh.key === 'Content-Security-Policy') {
                    console.log(hh.value);
                    break;
                }
            }
        }
    " 2>/dev/null)
    
    if [ -z "$csp" ]; then
        log_error "No CSP found in vercel.json"
        return 1
    fi
    
    log_info "CSP Value:"
    echo "$csp" | tr ';' '\n' | while read directive; do
        echo "  $directive"
    done
    
    echo ""
    
    # Check for common CSP issues
    local warnings=0
    
    if echo "$csp" | grep -q "'unsafe-inline'"; then
        log_warning "CSP contains 'unsafe-inline' - consider using nonces or hashes"
        warnings=$((warnings + 1))
    fi
    
    if echo "$csp" | grep -q "'unsafe-eval'"; then
        log_warning "CSP contains 'unsafe-eval' - this may be required for Monaco Editor"
        warnings=$((warnings + 1))
    fi
    
    if ! echo "$csp" | grep -q "upgrade-insecure-requests"; then
        log_warning "Consider adding 'upgrade-insecure-requests' directive"
        warnings=$((warnings + 1))
    fi
    
    if ! echo "$csp" | grep -q "frame-ancestors"; then
        log_warning "Consider adding 'frame-ancestors' directive"
        warnings=$((warnings + 1))
    fi
    
    if echo "$csp" | grep -q "default-src 'self'"; then
        log_success "default-src is properly restricted to 'self'"
    else
        log_warning "default-src should be 'self' or more restrictive"
        warnings=$((warnings + 1))
    fi
    
    if [ $warnings -eq 0 ]; then
        log_success "CSP configuration looks good!"
    else
        log_info "$warnings potential improvements identified"
    fi
    
    return 0
}

# ============================================
# Main
# ============================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║     Security Headers Validator             ║"
    echo "║     DragNDrop HTML Editor                  ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    local total_errors=0
    
    # Validate configuration files
    validate_vercel_config || total_errors=$((total_errors + $?))
    validate_security_headers_json || total_errors=$((total_errors + $?))
    validate_csp || total_errors=$((total_errors + $?))
    
    # Test live headers if URL provided
    if [ -n "$TEST_URL" ]; then
        test_live_headers "$TEST_URL" || total_errors=$((total_errors + $?))
    else
        echo ""
        log_info "To test live headers, run: $0 <URL>"
        log_info "Example: $0 https://your-app.vercel.app"
    fi
    
    # Summary
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    if [ $total_errors -eq 0 ]; then
        log_success "All security header validations passed!"
        exit 0
    else
        log_error "$total_errors validation errors found"
        exit 1
    fi
}

# Run main
main "$@"
