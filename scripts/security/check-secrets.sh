#!/bin/bash
# ============================================
# Secret Detection Script
# DragNDrop HTML Editor
# ============================================
# Scans the codebase for potential exposed secrets,
# API keys, tokens, and sensitive information.
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ============================================
# Secret Patterns
# ============================================

# High-confidence patterns (likely real secrets)
HIGH_CONFIDENCE_PATTERNS=(
    # API Keys
    "AIza[0-9A-Za-z_-]{35}"                    # Google API Key
    "sk_live_[0-9a-zA-Z]{24}"                  # Stripe Live Secret Key
    "sk_test_[0-9a-zA-Z]{24}"                  # Stripe Test Secret Key
    "rk_live_[0-9a-zA-Z]{24}"                  # Stripe Restricted Key
    "ghp_[0-9a-zA-Z]{36}"                      # GitHub Personal Access Token
    "gho_[0-9a-zA-Z]{36}"                      # GitHub OAuth Token
    "ghu_[0-9a-zA-Z]{36}"                      # GitHub User Token
    "ghs_[0-9a-zA-Z]{36}"                      # GitHub Server Token
    "ghr_[0-9a-zA-Z]{36}"                      # GitHub Refresh Token
    "npm_[0-9a-zA-Z]{36}"                      # NPM Token
    "AKIA[0-9A-Z]{16}"                         # AWS Access Key ID
    "xox[baprs]-[0-9a-zA-Z]{10,48}"           # Slack Token
    "sk-[0-9a-zA-Z]{48}"                       # OpenAI API Key
    "SG\.[0-9A-Za-z_-]{22}\.[0-9A-Za-z_-]{43}" # SendGrid API Key
    
    # Private Keys
    "-----BEGIN RSA PRIVATE KEY-----"
    "-----BEGIN DSA PRIVATE KEY-----"
    "-----BEGIN EC PRIVATE KEY-----"
    "-----BEGIN OPENSSH PRIVATE KEY-----"
    "-----BEGIN PGP PRIVATE KEY BLOCK-----"
    
    # Database URLs with credentials
    "postgres://[^:]+:[^@]+@"
    "mysql://[^:]+:[^@]+@"
    "mongodb://[^:]+:[^@]+@"
    "mongodb\+srv://[^:]+:[^@]+@"
    "redis://:[^@]+@"
)

# Medium-confidence patterns (may be false positives)
MEDIUM_CONFIDENCE_PATTERNS=(
    # Generic patterns
    "password\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    "secret\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    "api[_-]?key\s*[:=]\s*['\"][^'\"]{16,}['\"]"
    "auth[_-]?token\s*[:=]\s*['\"][^'\"]{16,}['\"]"
    "access[_-]?token\s*[:=]\s*['\"][^'\"]{16,}['\"]"
    "bearer\s+[a-zA-Z0-9_-]{20,}"
)

# ============================================
# Exclusion Patterns
# ============================================

EXCLUDE_DIRS=(
    "node_modules"
    ".git"
    "dist"
    "build"
    "coverage"
    ".next"
    ".nuxt"
    "vendor"
    "__pycache__"
)

EXCLUDE_FILES=(
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
    "*.min.js"
    "*.min.css"
    "*.map"
    "*.example"
    ".env.example"
    "*.md"  # Documentation files
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

build_exclude_args() {
    local args=""
    for dir in "${EXCLUDE_DIRS[@]}"; do
        args="$args --exclude-dir=$dir"
    done
    for file in "${EXCLUDE_FILES[@]}"; do
        args="$args --exclude=$file"
    done
    echo "$args"
}

scan_for_pattern() {
    local pattern="$1"
    local confidence="$2"
    local exclude_args=$(build_exclude_args)
    
    # Use grep with extended regex
    local matches=$(grep -rniE "$pattern" $exclude_args \
        --include="*.js" \
        --include="*.ts" \
        --include="*.jsx" \
        --include="*.tsx" \
        --include="*.json" \
        --include="*.yml" \
        --include="*.yaml" \
        --include="*.env*" \
        --include="*.config.*" \
        --include="*.sh" \
        --include="*.py" \
        --include="*.rb" \
        --include="*.php" \
        --include="*.go" \
        --include="*.java" \
        . 2>/dev/null || true)
    
    if [ -n "$matches" ]; then
        echo "$matches"
        return 0
    fi
    return 1
}

# ============================================
# Main Scan
# ============================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║     Secret Detection Scanner               ║"
    echo "║     DragNDrop HTML Editor                  ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    SECRETS_FOUND=0
    HIGH_CONFIDENCE_FOUND=0
    MEDIUM_CONFIDENCE_FOUND=0
    
    # Scan for high-confidence patterns
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Scanning for high-confidence secret patterns..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for pattern in "${HIGH_CONFIDENCE_PATTERNS[@]}"; do
        matches=$(scan_for_pattern "$pattern" "HIGH")
        if [ -n "$matches" ]; then
            log_error "HIGH CONFIDENCE: Pattern matched"
            echo "$matches" | head -5
            if [ $(echo "$matches" | wc -l) -gt 5 ]; then
                echo "  ... and more matches"
            fi
            echo ""
            HIGH_CONFIDENCE_FOUND=$((HIGH_CONFIDENCE_FOUND + 1))
            SECRETS_FOUND=$((SECRETS_FOUND + 1))
        fi
    done
    
    if [ $HIGH_CONFIDENCE_FOUND -eq 0 ]; then
        log_success "No high-confidence secrets detected"
    fi
    
    # Scan for medium-confidence patterns
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Scanning for medium-confidence patterns..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for pattern in "${MEDIUM_CONFIDENCE_PATTERNS[@]}"; do
        matches=$(scan_for_pattern "$pattern" "MEDIUM")
        if [ -n "$matches" ]; then
            log_warning "MEDIUM CONFIDENCE: Pattern matched (may be false positive)"
            echo "$matches" | head -3
            if [ $(echo "$matches" | wc -l) -gt 3 ]; then
                echo "  ... and more matches"
            fi
            echo ""
            MEDIUM_CONFIDENCE_FOUND=$((MEDIUM_CONFIDENCE_FOUND + 1))
        fi
    done
    
    if [ $MEDIUM_CONFIDENCE_FOUND -eq 0 ]; then
        log_success "No medium-confidence patterns detected"
    fi
    
    # Check for .env files that shouldn't be committed
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Checking for .env files..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    ENV_FILES=$(find . -name ".env" -o -name ".env.local" -o -name ".env.production" -o -name ".env.development" 2>/dev/null | grep -v node_modules || true)
    
    if [ -n "$ENV_FILES" ]; then
        log_warning "Found .env files (ensure they are in .gitignore):"
        echo "$ENV_FILES"
        
        # Check if they're in .gitignore
        if [ -f ".gitignore" ]; then
            for env_file in $ENV_FILES; do
                basename_file=$(basename "$env_file")
                if grep -q "$basename_file" .gitignore; then
                    log_success "  $basename_file is in .gitignore"
                else
                    log_error "  $basename_file is NOT in .gitignore!"
                    SECRETS_FOUND=$((SECRETS_FOUND + 1))
                fi
            done
        fi
    else
        log_success "No .env files found in repository"
    fi
    
    # Summary
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "SCAN SUMMARY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "High-confidence findings: $HIGH_CONFIDENCE_FOUND"
    echo "Medium-confidence findings: $MEDIUM_CONFIDENCE_FOUND"
    echo ""
    
    if [ $HIGH_CONFIDENCE_FOUND -gt 0 ]; then
        log_error "CRITICAL: High-confidence secrets detected!"
        echo ""
        echo "Recommended actions:"
        echo "  1. Immediately rotate any exposed credentials"
        echo "  2. Remove secrets from code and use environment variables"
        echo "  3. Add sensitive files to .gitignore"
        echo "  4. Consider using git-filter-branch to remove from history"
        exit 1
    elif [ $MEDIUM_CONFIDENCE_FOUND -gt 0 ]; then
        log_warning "Review medium-confidence findings for false positives"
        exit 0
    else
        log_success "No secrets detected in codebase"
        exit 0
    fi
}

# Run main
main "$@"
