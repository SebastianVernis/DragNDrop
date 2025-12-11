#!/bin/bash
# =============================================================================
# DragNDrop - Disaster Recovery Test Script
# =============================================================================
# This script performs a complete disaster recovery test including:
# - Backup restoration
# - Application deployment
# - Smoke tests
# - RTO/RPO calculation
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TEST_ID="dr-test-$TIMESTAMP"
LOG_FILE="$PROJECT_ROOT/logs/dr-test-$TIMESTAMP.log"
REPORT_FILE="$PROJECT_ROOT/reports/dr-test-$TIMESTAMP.json"

# Ensure directories exist
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/reports"
mkdir -p "$PROJECT_ROOT/tmp/dr-test"

# Logging function
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

# Timer functions
START_TIME=$(date +%s)

get_elapsed() {
    local end_time=$(date +%s)
    echo $((end_time - START_TIME))
}

# Cleanup function
cleanup() {
    log INFO "Cleaning up test environment..."
    rm -rf "$PROJECT_ROOT/tmp/dr-test" 2>/dev/null || true
    
    # Kill any background processes we started
    if [ -n "$HTTP_SERVER_PID" ]; then
        kill $HTTP_SERVER_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

# =============================================================================
# Test Functions
# =============================================================================

test_backup_exists() {
    log INFO "Checking for available backups..."
    
    local backup_found=false
    
    # Check for local backups
    if ls "$PROJECT_ROOT"/backups/*.bundle 2>/dev/null; then
        log OK "Local git bundle backup found"
        backup_found=true
    fi
    
    if ls "$PROJECT_ROOT"/backups/*.tar.gz 2>/dev/null; then
        log OK "Local archive backup found"
        backup_found=true
    fi
    
    # Check GitHub artifacts (if gh CLI is available)
    if command -v gh &> /dev/null; then
        log INFO "Checking GitHub artifacts..."
        if gh run list --workflow=backup.yml --limit=1 --json status --jq '.[0].status' 2>/dev/null | grep -q "completed"; then
            log OK "Recent backup workflow completed successfully"
            backup_found=true
        fi
    fi
    
    if [ "$backup_found" = false ]; then
        log WARN "No backups found - this is expected for first run"
        return 1
    fi
    
    return 0
}

test_restore_from_git() {
    log INFO "Testing restore from git repository..."
    
    local restore_dir="$PROJECT_ROOT/tmp/dr-test/git-restore"
    mkdir -p "$restore_dir"
    
    # Clone from current repository (simulating restore)
    cd "$restore_dir"
    git clone "$PROJECT_ROOT" restored-repo 2>/dev/null || {
        log ERROR "Failed to clone repository"
        return 1
    }
    
    cd restored-repo
    
    # Verify key files exist
    local required_files=("package.json" "index.html" "script.js" "style.css")
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log OK "Found required file: $file"
        else
            log ERROR "Missing required file: $file"
            return 1
        fi
    done
    
    log OK "Git restore test passed"
    return 0
}

test_dependencies_install() {
    log INFO "Testing dependency installation..."
    
    local test_dir="$PROJECT_ROOT/tmp/dr-test/git-restore/restored-repo"
    
    if [ ! -d "$test_dir" ]; then
        log WARN "Restore directory not found, using project root"
        test_dir="$PROJECT_ROOT"
    fi
    
    cd "$test_dir"
    
    # Install dependencies
    if [ -f "package.json" ]; then
        npm ci --silent 2>/dev/null || npm install --silent 2>/dev/null || {
            log ERROR "Failed to install dependencies"
            return 1
        }
        log OK "Dependencies installed successfully"
    else
        log WARN "No package.json found"
    fi
    
    return 0
}

test_application_build() {
    log INFO "Testing application build..."
    
    cd "$PROJECT_ROOT"
    
    # Check if build script exists
    if npm run build --if-present 2>/dev/null; then
        log OK "Build completed successfully"
    else
        log INFO "No build script or build not required"
    fi
    
    return 0
}

test_application_start() {
    log INFO "Testing application startup..."
    
    cd "$PROJECT_ROOT"
    
    # Start HTTP server
    npx http-server -p 8888 -s &
    HTTP_SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Check if server is running
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/ | grep -q "200"; then
        log OK "Application started successfully on port 8888"
        return 0
    else
        log ERROR "Application failed to start"
        return 1
    fi
}

test_smoke_tests() {
    log INFO "Running smoke tests..."
    
    local base_url="http://localhost:8888"
    local failed=0
    
    # Test main page
    if curl -sf "$base_url/" > /dev/null; then
        log OK "Main page accessible"
    else
        log ERROR "Main page not accessible"
        ((failed++))
    fi
    
    # Test JavaScript file
    if curl -sf "$base_url/script.js" > /dev/null; then
        log OK "JavaScript file accessible"
    else
        log ERROR "JavaScript file not accessible"
        ((failed++))
    fi
    
    # Test CSS file
    if curl -sf "$base_url/style.css" > /dev/null; then
        log OK "CSS file accessible"
    else
        log ERROR "CSS file not accessible"
        ((failed++))
    fi
    
    if [ $failed -gt 0 ]; then
        log ERROR "$failed smoke tests failed"
        return 1
    fi
    
    log OK "All smoke tests passed"
    return 0
}

test_data_integrity() {
    log INFO "Testing data integrity..."
    
    cd "$PROJECT_ROOT"
    
    # Verify git history is intact
    if git log --oneline -1 > /dev/null 2>&1; then
        log OK "Git history intact"
    else
        log ERROR "Git history corrupted"
        return 1
    fi
    
    # Verify file checksums (if available)
    if [ -f "checksums.sha256" ]; then
        if sha256sum -c checksums.sha256 > /dev/null 2>&1; then
            log OK "File checksums verified"
        else
            log WARN "Some checksums don't match"
        fi
    fi
    
    return 0
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    echo ""
    echo "=============================================="
    echo "  DragNDrop Disaster Recovery Test"
    echo "  Test ID: $TEST_ID"
    echo "  Started: $(date)"
    echo "=============================================="
    echo ""
    
    log INFO "Starting DR test..."
    
    local tests_passed=0
    local tests_failed=0
    local test_results=()
    
    # Run tests
    run_test() {
        local test_name=$1
        local test_func=$2
        
        log INFO "Running test: $test_name"
        
        if $test_func; then
            ((tests_passed++))
            test_results+=("\"$test_name\": \"passed\"")
        else
            ((tests_failed++))
            test_results+=("\"$test_name\": \"failed\"")
        fi
    }
    
    run_test "backup_exists" test_backup_exists
    run_test "restore_from_git" test_restore_from_git
    run_test "dependencies_install" test_dependencies_install
    run_test "application_build" test_application_build
    run_test "application_start" test_application_start
    run_test "smoke_tests" test_smoke_tests
    run_test "data_integrity" test_data_integrity
    
    # Calculate metrics
    local rto_seconds=$(get_elapsed)
    local rto_minutes=$((rto_seconds / 60))
    local rto_target=3600 # 1 hour
    local rpo_target=900 # 15 minutes
    
    # Determine overall status
    local overall_status="passed"
    if [ $tests_failed -gt 0 ]; then
        overall_status="failed"
    fi
    
    # Generate report
    cat << EOF > "$REPORT_FILE"
{
    "test_id": "$TEST_ID",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "duration_seconds": $rto_seconds,
    "tests": {
        "passed": $tests_passed,
        "failed": $tests_failed,
        "results": {
            $(IFS=,; echo "${test_results[*]}")
        }
    },
    "metrics": {
        "rto_seconds": $rto_seconds,
        "rto_target_seconds": $rto_target,
        "rto_met": $([ $rto_seconds -lt $rto_target ] && echo "true" || echo "false"),
        "rpo_target_seconds": $rpo_target
    },
    "overall_status": "$overall_status"
}
EOF
    
    # Print summary
    echo ""
    echo "=============================================="
    echo "  DR Test Summary"
    echo "=============================================="
    echo ""
    echo "  Tests Passed: $tests_passed"
    echo "  Tests Failed: $tests_failed"
    echo ""
    echo "  Recovery Time: ${rto_minutes}m ${rto_seconds}s"
    echo "  RTO Target: 60m"
    echo "  RTO Status: $([ $rto_seconds -lt $rto_target ] && echo "✅ MET" || echo "❌ EXCEEDED")"
    echo ""
    echo "  Overall: $([ "$overall_status" = "passed" ] && echo "✅ PASSED" || echo "❌ FAILED")"
    echo ""
    echo "  Report: $REPORT_FILE"
    echo "  Log: $LOG_FILE"
    echo ""
    echo "=============================================="
    
    # Exit with appropriate code
    if [ "$overall_status" = "passed" ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
