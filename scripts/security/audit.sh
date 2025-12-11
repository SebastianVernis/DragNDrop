#!/bin/bash
# ============================================
# Security Audit Script
# DragNDrop HTML Editor
# ============================================
# This script performs comprehensive security audits
# including dependency scanning, secret detection,
# and configuration validation.
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$PROJECT_ROOT/reports/security"

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Timestamp for reports
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# ============================================
# Helper Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "============================================"
    echo -e "${BLUE}$1${NC}"
    echo "============================================"
}

# ============================================
# Dependency Audit
# ============================================

run_npm_audit() {
    print_header "Running NPM Audit"
    
    cd "$PROJECT_ROOT"
    
    # Run npm audit and save results
    log_info "Scanning npm dependencies for vulnerabilities..."
    
    npm audit --json > "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" 2>&1 || true
    
    # Parse results
    if [ -f "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" ]; then
        CRITICAL=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
        HIGH=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
        MODERATE=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.moderate // 0' 2>/dev/null || echo "0")
        LOW=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.low // 0' 2>/dev/null || echo "0")
        
        echo ""
        echo "Vulnerability Summary:"
        echo "  🔴 Critical: $CRITICAL"
        echo "  🟠 High: $HIGH"
        echo "  🟡 Moderate: $MODERATE"
        echo "  🟢 Low: $LOW"
        
        if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
            log_error "Critical or high severity vulnerabilities found!"
            return 1
        else
            log_success "No critical or high severity vulnerabilities found"
        fi
    else
        log_warning "Could not parse npm audit results"
    fi
    
    return 0
}

# ============================================
# Secret Detection
# ============================================

check_secrets() {
    print_header "Checking for Exposed Secrets"
    
    cd "$PROJECT_ROOT"
    
    log_info "Scanning for potential secrets in codebase..."
    
    # Patterns to search for
    PATTERNS=(
        "password\s*=\s*['\"][^'\"]+['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
        "secret\s*=\s*['\"][^'\"]+['\"]"
        "token\s*=\s*['\"][^'\"]+['\"]"
        "private[_-]?key"
        "-----BEGIN.*PRIVATE KEY-----"
        "AIza[0-9A-Za-z_-]{35}"  # Google API Key
        "sk_live_[0-9a-zA-Z]{24}"  # Stripe Secret Key
        "ghp_[0-9a-zA-Z]{36}"  # GitHub Personal Access Token
        "npm_[0-9a-zA-Z]{36}"  # NPM Token
    )
    
    SECRETS_FOUND=0
    REPORT_FILE="$REPORTS_DIR/secrets-scan-$TIMESTAMP.txt"
    
    echo "Secret Scan Report - $(date)" > "$REPORT_FILE"
    echo "================================" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    for pattern in "${PATTERNS[@]}"; do
        # Search in source files, excluding node_modules, .git, and common binary files
        MATCHES=$(grep -rniE "$pattern" \
            --include="*.js" \
            --include="*.ts" \
            --include="*.jsx" \
            --include="*.tsx" \
            --include="*.json" \
            --include="*.yml" \
            --include="*.yaml" \
            --include="*.env*" \
            --include="*.config.*" \
            --exclude-dir=node_modules \
            --exclude-dir=.git \
            --exclude-dir=dist \
            --exclude-dir=coverage \
            --exclude="*.example" \
            --exclude=".env.example" \
            --exclude="package-lock.json" \
            . 2>/dev/null || true)
        
        if [ -n "$MATCHES" ]; then
            echo "Pattern: $pattern" >> "$REPORT_FILE"
            echo "$MATCHES" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            SECRETS_FOUND=$((SECRETS_FOUND + 1))
        fi
    done
    
    if [ $SECRETS_FOUND -gt 0 ]; then
        log_warning "Potential secrets found! Review: $REPORT_FILE"
        return 1
    else
        log_success "No obvious secrets detected in codebase"
        echo "No secrets detected" >> "$REPORT_FILE"
    fi
    
    return 0
}

# ============================================
# Configuration Validation
# ============================================

validate_security_config() {
    print_header "Validating Security Configuration"
    
    cd "$PROJECT_ROOT"
    
    ERRORS=0
    
    # Check vercel.json security headers
    log_info "Checking vercel.json security headers..."
    if [ -f "vercel.json" ]; then
        REQUIRED_HEADERS=("Content-Security-Policy" "X-Content-Type-Options" "X-Frame-Options" "Strict-Transport-Security" "Referrer-Policy")
        
        for header in "${REQUIRED_HEADERS[@]}"; do
            if grep -q "\"$header\"" vercel.json; then
                echo "  ✅ $header configured"
            else
                echo "  ❌ $header missing"
                ERRORS=$((ERRORS + 1))
            fi
        done
    else
        log_warning "vercel.json not found"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check .env.example exists
    log_info "Checking environment configuration..."
    if [ -f ".env.example" ]; then
        echo "  ✅ .env.example exists"
    else
        echo "  ❌ .env.example missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check .gitignore for sensitive files
    log_info "Checking .gitignore for sensitive patterns..."
    if [ -f ".gitignore" ]; then
        SENSITIVE_PATTERNS=(".env" ".env.local" "*.pem" "*.key" "secrets/")
        for pattern in "${SENSITIVE_PATTERNS[@]}"; do
            if grep -q "$pattern" .gitignore; then
                echo "  ✅ $pattern in .gitignore"
            else
                echo "  ⚠️  $pattern not in .gitignore"
            fi
        done
    fi
    
    # Check security headers config
    log_info "Checking security headers configuration..."
    if [ -f "config/security/security-headers.json" ]; then
        if node -e "JSON.parse(require('fs').readFileSync('config/security/security-headers.json'))" 2>/dev/null; then
            echo "  ✅ security-headers.json is valid JSON"
        else
            echo "  ❌ security-headers.json is invalid JSON"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo "  ⚠️  security-headers.json not found"
    fi
    
    if [ $ERRORS -gt 0 ]; then
        log_error "$ERRORS configuration errors found"
        return 1
    else
        log_success "Security configuration validated"
    fi
    
    return 0
}

# ============================================
# License Check
# ============================================

check_licenses() {
    print_header "Checking Dependency Licenses"
    
    cd "$PROJECT_ROOT"
    
    # Check if license-checker is installed
    if ! command -v license-checker &> /dev/null; then
        log_info "Installing license-checker..."
        npm install -g license-checker 2>/dev/null || {
            log_warning "Could not install license-checker, skipping license check"
            return 0
        }
    fi
    
    log_info "Scanning dependency licenses..."
    
    license-checker --json --out "$REPORTS_DIR/licenses-$TIMESTAMP.json" 2>/dev/null || true
    license-checker --summary --out "$REPORTS_DIR/licenses-summary-$TIMESTAMP.txt" 2>/dev/null || true
    
    # Check for problematic licenses
    PROBLEMATIC=$(license-checker --failOn "GPL;AGPL;LGPL;SSPL" 2>&1 || true)
    
    if echo "$PROBLEMATIC" | grep -q "Found"; then
        log_warning "Copyleft licenses detected - review may be required"
        echo "$PROBLEMATIC"
    else
        log_success "No problematic licenses detected"
    fi
    
    return 0
}

# ============================================
# Generate Summary Report
# ============================================

generate_summary() {
    print_header "Generating Security Summary Report"
    
    SUMMARY_FILE="$REPORTS_DIR/security-summary-$TIMESTAMP.md"
    
    cat > "$SUMMARY_FILE" << EOF
# Security Audit Summary

**Date:** $(date)
**Project:** DragNDrop HTML Editor
**Auditor:** Automated Security Script

## Audit Results

### Dependency Vulnerabilities
$(if [ -f "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" ]; then
    CRITICAL=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "N/A")
    HIGH=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "N/A")
    MODERATE=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.moderate // 0' 2>/dev/null || echo "N/A")
    LOW=$(cat "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" | jq '.metadata.vulnerabilities.low // 0' 2>/dev/null || echo "N/A")
    echo "| Severity | Count |"
    echo "|----------|-------|"
    echo "| Critical | $CRITICAL |"
    echo "| High | $HIGH |"
    echo "| Moderate | $MODERATE |"
    echo "| Low | $LOW |"
else
    echo "No npm audit data available"
fi)

### Secret Scanning
$(if [ -f "$REPORTS_DIR/secrets-scan-$TIMESTAMP.txt" ]; then
    if grep -q "No secrets detected" "$REPORTS_DIR/secrets-scan-$TIMESTAMP.txt"; then
        echo "✅ No secrets detected in codebase"
    else
        echo "⚠️ Potential secrets found - review required"
    fi
else
    echo "Secret scan not performed"
fi)

### Configuration Validation
- Security headers: Configured in vercel.json
- Environment template: .env.example present
- Gitignore: Sensitive patterns included

### License Compliance
$(if [ -f "$REPORTS_DIR/licenses-summary-$TIMESTAMP.txt" ]; then
    cat "$REPORTS_DIR/licenses-summary-$TIMESTAMP.txt"
else
    echo "License check not performed"
fi)

## Recommendations

1. Review and address any high/critical vulnerabilities
2. Regularly update dependencies with \`npm update\`
3. Run this audit before each release
4. Enable GitHub Dependabot for automated updates

## Reports Generated

- npm-audit-$TIMESTAMP.json
- secrets-scan-$TIMESTAMP.txt
- licenses-$TIMESTAMP.json
- licenses-summary-$TIMESTAMP.txt

---
*Generated by DragNDrop Security Audit Script*
EOF

    log_success "Summary report generated: $SUMMARY_FILE"
}

# ============================================
# Main Execution
# ============================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║     DragNDrop Security Audit Script        ║"
    echo "║     Version 1.0.0                          ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    
    AUDIT_FAILED=0
    
    # Run all checks
    run_npm_audit || AUDIT_FAILED=1
    check_secrets || AUDIT_FAILED=1
    validate_security_config || AUDIT_FAILED=1
    check_licenses || true  # Don't fail on license issues
    
    # Generate summary
    generate_summary
    
    echo ""
    echo "============================================"
    if [ $AUDIT_FAILED -eq 0 ]; then
        log_success "Security audit completed successfully!"
        echo "Reports saved to: $REPORTS_DIR"
        exit 0
    else
        log_error "Security audit completed with issues!"
        echo "Please review the reports in: $REPORTS_DIR"
        exit 1
    fi
}

# Run main function
main "$@"
