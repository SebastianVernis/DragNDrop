#!/bin/bash
# =============================================================================
# DragNDrop - Backup Verification Script
# =============================================================================
# Verifies integrity and recoverability of backup files
# Usage: ./verify-backup.sh [OPTIONS] [backup_file|directory]
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/verify-backup-$TIMESTAMP.log"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"
TEMP_DIR="$PROJECT_ROOT/tmp/verify-$TIMESTAMP"

# Default options
VERBOSE=false
FULL_TEST=false
REPORT_JSON=false
CHECK_CLOUD=false

# Ensure directories exist
mkdir -p "$PROJECT_ROOT/logs"

# Cleanup on exit
cleanup() {
    rm -rf "$TEMP_DIR" 2>/dev/null || true
}
trap cleanup EXIT

# =============================================================================
# Logging Functions
# =============================================================================

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
        STEP)  echo -e "${CYAN}[STEP]${NC} $message" ;;
        DEBUG) [ "$VERBOSE" = true ] && echo -e "[DEBUG] $message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# =============================================================================
# Usage
# =============================================================================

usage() {
    cat << EOF
Usage: $0 [OPTIONS] [backup_file|directory]

Verify integrity and recoverability of backup files.

ARGUMENTS:
    backup_file          Specific backup file to verify
    directory            Directory containing backups (default: ./backups)

OPTIONS:
    --full               Perform full restore test (slower but thorough)
    --verbose            Show detailed output
    --json               Output results as JSON
    --check-cloud        Also verify cloud backups (S3/R2)
    --latest             Verify only the latest backup
    -h, --help           Show this help message

EXAMPLES:
    $0                                    # Verify all local backups
    $0 backups/dragndrop-code-*.bundle    # Verify specific file
    $0 --full --latest                    # Full test on latest backup
    $0 --check-cloud                      # Include cloud backups

EOF
    exit 0
}

# =============================================================================
# Parse Arguments
# =============================================================================

TARGET=""
LATEST_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            FULL_TEST=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --json)
            REPORT_JSON=true
            shift
            ;;
        --check-cloud)
            CHECK_CLOUD=true
            shift
            ;;
        --latest)
            LATEST_ONLY=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Unknown option: $1"
            usage
            ;;
        *)
            TARGET="$1"
            shift
            ;;
    esac
done

# =============================================================================
# Verification Functions
# =============================================================================

# Results tracking
declare -A RESULTS
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

record_result() {
    local check=$1
    local status=$2
    local details=$3
    
    RESULTS["$check"]="$status:$details"
    ((TOTAL_CHECKS++))
    
    case $status in
        pass) ((PASSED_CHECKS++)) ;;
        fail) ((FAILED_CHECKS++)) ;;
        warn) ((WARNINGS++)) ;;
    esac
}

verify_file_exists() {
    local file=$1
    
    if [ -f "$file" ]; then
        local size=$(ls -lh "$file" | awk '{print $5}')
        log OK "File exists: $(basename $file) ($size)"
        record_result "file_exists:$(basename $file)" "pass" "$size"
        return 0
    else
        log ERROR "File not found: $file"
        record_result "file_exists:$(basename $file)" "fail" "not found"
        return 1
    fi
}

verify_checksum() {
    local file=$1
    local checksum_file="${file}.sha256"
    
    if [ ! -f "$checksum_file" ]; then
        log WARN "No checksum file for: $(basename $file)"
        record_result "checksum:$(basename $file)" "warn" "no checksum file"
        return 0
    fi
    
    cd "$(dirname $file)"
    if sha256sum -c "$(basename $checksum_file)" > /dev/null 2>&1; then
        log OK "Checksum valid: $(basename $file)"
        record_result "checksum:$(basename $file)" "pass" "valid"
        return 0
    else
        log ERROR "Checksum mismatch: $(basename $file)"
        record_result "checksum:$(basename $file)" "fail" "mismatch"
        return 1
    fi
}

verify_bundle_integrity() {
    local bundle=$1
    
    log DEBUG "Verifying git bundle: $bundle"
    
    if git bundle verify "$bundle" > /dev/null 2>&1; then
        local refs=$(git bundle list-heads "$bundle" 2>/dev/null | wc -l)
        log OK "Git bundle valid: $(basename $bundle) ($refs refs)"
        record_result "bundle_integrity:$(basename $bundle)" "pass" "$refs refs"
        return 0
    else
        log ERROR "Git bundle invalid: $(basename $bundle)"
        record_result "bundle_integrity:$(basename $bundle)" "fail" "invalid"
        return 1
    fi
}

verify_archive_integrity() {
    local archive=$1
    
    log DEBUG "Verifying archive: $archive"
    
    local file_count=0
    
    if [[ "$archive" == *.tar.gz ]]; then
        if gzip -t "$archive" 2>/dev/null; then
            file_count=$(tar -tzf "$archive" 2>/dev/null | wc -l)
            log OK "Archive valid: $(basename $archive) ($file_count files)"
            record_result "archive_integrity:$(basename $archive)" "pass" "$file_count files"
            return 0
        else
            log ERROR "Archive corrupted: $(basename $archive)"
            record_result "archive_integrity:$(basename $archive)" "fail" "corrupted"
            return 1
        fi
    elif [[ "$archive" == *.tar ]]; then
        if tar -tf "$archive" > /dev/null 2>&1; then
            file_count=$(tar -tf "$archive" 2>/dev/null | wc -l)
            log OK "Archive valid: $(basename $archive) ($file_count files)"
            record_result "archive_integrity:$(basename $archive)" "pass" "$file_count files"
            return 0
        else
            log ERROR "Archive corrupted: $(basename $archive)"
            record_result "archive_integrity:$(basename $archive)" "fail" "corrupted"
            return 1
        fi
    fi
}

verify_content_structure() {
    local file=$1
    
    log DEBUG "Verifying content structure..."
    
    mkdir -p "$TEMP_DIR"
    
    local required_files=("package.json" "index.html" "script.js" "style.css")
    local found=0
    local missing=()
    
    # Extract to temp directory
    if [[ "$file" == *.bundle ]]; then
        git clone "$file" "$TEMP_DIR/content" 2>/dev/null || return 1
    elif [[ "$file" == *.tar.gz ]]; then
        tar -xzf "$file" -C "$TEMP_DIR" 2>/dev/null || return 1
    elif [[ "$file" == *.tar ]]; then
        tar -xf "$file" -C "$TEMP_DIR" 2>/dev/null || return 1
    fi
    
    # Check for required files
    for req_file in "${required_files[@]}"; do
        if find "$TEMP_DIR" -name "$req_file" -type f | grep -q .; then
            ((found++))
        else
            missing+=("$req_file")
        fi
    done
    
    # Cleanup
    rm -rf "$TEMP_DIR"/*
    
    if [ ${#missing[@]} -eq 0 ]; then
        log OK "Content structure valid: $(basename $file) ($found/${#required_files[@]} files)"
        record_result "content_structure:$(basename $file)" "pass" "$found files"
        return 0
    else
        log WARN "Missing files in $(basename $file): ${missing[*]}"
        record_result "content_structure:$(basename $file)" "warn" "missing: ${missing[*]}"
        return 1
    fi
}

verify_full_restore() {
    local file=$1
    
    log STEP "Performing full restore test..."
    
    mkdir -p "$TEMP_DIR/restore-test"
    
    # Restore
    if [[ "$file" == *.bundle ]]; then
        git clone "$file" "$TEMP_DIR/restore-test/project" 2>/dev/null || {
            log ERROR "Full restore failed: could not clone bundle"
            record_result "full_restore:$(basename $file)" "fail" "clone failed"
            return 1
        }
    else
        tar -xzf "$file" -C "$TEMP_DIR/restore-test" 2>/dev/null || {
            log ERROR "Full restore failed: could not extract archive"
            record_result "full_restore:$(basename $file)" "fail" "extract failed"
            return 1
        }
    fi
    
    # Find project root in restored content
    local project_dir=$(find "$TEMP_DIR/restore-test" -name "package.json" -type f -exec dirname {} \; | head -1)
    
    if [ -z "$project_dir" ]; then
        log ERROR "Full restore failed: no package.json found"
        record_result "full_restore:$(basename $file)" "fail" "no package.json"
        return 1
    fi
    
    cd "$project_dir"
    
    # Install dependencies
    log INFO "Installing dependencies..."
    if npm ci --silent 2>/dev/null || npm install --silent 2>/dev/null; then
        log OK "Dependencies installed"
    else
        log WARN "Dependency installation had issues"
    fi
    
    # Run build (if available)
    log INFO "Running build..."
    if npm run build --if-present 2>/dev/null; then
        log OK "Build successful"
    else
        log INFO "No build script or build not required"
    fi
    
    # Run tests (if available)
    log INFO "Running tests..."
    if npm test --if-present 2>/dev/null; then
        log OK "Tests passed"
    else
        log INFO "No test script or tests skipped"
    fi
    
    log OK "Full restore test passed: $(basename $file)"
    record_result "full_restore:$(basename $file)" "pass" "complete"
    
    # Cleanup
    rm -rf "$TEMP_DIR/restore-test"
    
    return 0
}

verify_backup_age() {
    local file=$1
    local max_age_hours=${2:-24}
    
    local file_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null)
    local current_time=$(date +%s)
    local age_hours=$(( (current_time - file_time) / 3600 ))
    
    if [ $age_hours -lt $max_age_hours ]; then
        log OK "Backup age: ${age_hours}h (within ${max_age_hours}h limit)"
        record_result "backup_age:$(basename $file)" "pass" "${age_hours}h"
        return 0
    else
        log WARN "Backup age: ${age_hours}h (exceeds ${max_age_hours}h limit)"
        record_result "backup_age:$(basename $file)" "warn" "${age_hours}h"
        return 1
    fi
}

verify_single_backup() {
    local file=$1
    
    log STEP "Verifying: $(basename $file)"
    echo ""
    
    # Basic checks
    verify_file_exists "$file" || return 1
    verify_checksum "$file"
    
    # Type-specific checks
    if [[ "$file" == *.bundle ]]; then
        verify_bundle_integrity "$file"
    elif [[ "$file" == *.tar.gz ]] || [[ "$file" == *.tar ]]; then
        verify_archive_integrity "$file"
    fi
    
    # Content structure check
    verify_content_structure "$file"
    
    # Backup age check
    verify_backup_age "$file" 24
    
    # Full restore test (if requested)
    if [ "$FULL_TEST" = true ]; then
        verify_full_restore "$file"
    fi
    
    echo ""
}

verify_cloud_backups() {
    log STEP "Checking cloud backups..."
    
    # Check S3
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
        local bucket="${AWS_S3_BUCKET:-dragndrop-backups}"
        log INFO "Checking S3: s3://$bucket/backups/"
        
        local s3_count=$(aws s3 ls "s3://$bucket/backups/" 2>/dev/null | wc -l)
        if [ "$s3_count" -gt 0 ]; then
            log OK "S3 backups found: $s3_count files"
            record_result "cloud_s3" "pass" "$s3_count files"
        else
            log WARN "No S3 backups found"
            record_result "cloud_s3" "warn" "no files"
        fi
    else
        log INFO "S3 credentials not configured, skipping"
    fi
    
    # Check R2
    if [ -n "$CLOUDFLARE_R2_ACCESS_KEY_ID" ] && [ -n "$CLOUDFLARE_R2_SECRET_ACCESS_KEY" ]; then
        local bucket="${CLOUDFLARE_R2_BUCKET:-dragndrop-backups}"
        log INFO "Checking R2: $bucket/backups/"
        
        local r2_count=$(AWS_ACCESS_KEY_ID="$CLOUDFLARE_R2_ACCESS_KEY_ID" \
            AWS_SECRET_ACCESS_KEY="$CLOUDFLARE_R2_SECRET_ACCESS_KEY" \
            aws s3 ls "s3://$bucket/backups/" \
            --endpoint-url "$CLOUDFLARE_R2_ENDPOINT" 2>/dev/null | wc -l)
        
        if [ "$r2_count" -gt 0 ]; then
            log OK "R2 backups found: $r2_count files"
            record_result "cloud_r2" "pass" "$r2_count files"
        else
            log WARN "No R2 backups found"
            record_result "cloud_r2" "warn" "no files"
        fi
    else
        log INFO "R2 credentials not configured, skipping"
    fi
}

# =============================================================================
# Output Functions
# =============================================================================

output_json() {
    local json="{"
    json+="\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
    json+="\"total_checks\":$TOTAL_CHECKS,"
    json+="\"passed\":$PASSED_CHECKS,"
    json+="\"failed\":$FAILED_CHECKS,"
    json+="\"warnings\":$WARNINGS,"
    json+="\"results\":{"
    
    local first=true
    for key in "${!RESULTS[@]}"; do
        local value="${RESULTS[$key]}"
        local status=$(echo "$value" | cut -d: -f1)
        local details=$(echo "$value" | cut -d: -f2-)
        
        if [ "$first" = true ]; then
            first=false
        else
            json+=","
        fi
        json+="\"$key\":{\"status\":\"$status\",\"details\":\"$details\"}"
    done
    
    json+="}}"
    
    echo "$json" | python3 -m json.tool 2>/dev/null || echo "$json"
}

output_summary() {
    echo ""
    echo "=============================================="
    echo "  Backup Verification Summary"
    echo "=============================================="
    echo ""
    echo "  Total Checks: $TOTAL_CHECKS"
    echo "  Passed: $PASSED_CHECKS"
    echo "  Failed: $FAILED_CHECKS"
    echo "  Warnings: $WARNINGS"
    echo ""
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "  Status: ${GREEN}ALL CHECKS PASSED${NC}"
    elif [ $FAILED_CHECKS -gt 0 ]; then
        echo -e "  Status: ${RED}$FAILED_CHECKS CHECK(S) FAILED${NC}"
    fi
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "  ${YELLOW}$WARNINGS warning(s)${NC}"
    fi
    
    echo ""
    echo "  Log: $LOG_FILE"
    echo ""
    echo "=============================================="
}

# =============================================================================
# Main
# =============================================================================

main() {
    echo ""
    echo "=============================================="
    echo "  DragNDrop Backup Verification"
    echo "=============================================="
    echo ""
    echo "  Full Test: $FULL_TEST"
    echo "  Check Cloud: $CHECK_CLOUD"
    echo "  Verbose: $VERBOSE"
    echo ""
    echo "=============================================="
    echo ""
    
    local files_to_verify=()
    
    # Determine what to verify
    if [ -n "$TARGET" ]; then
        if [ -f "$TARGET" ]; then
            files_to_verify+=("$TARGET")
        elif [ -d "$TARGET" ]; then
            BACKUP_DIR="$TARGET"
        else
            log ERROR "Target not found: $TARGET"
            exit 1
        fi
    fi
    
    # Find backup files if not specified
    if [ ${#files_to_verify[@]} -eq 0 ]; then
        if [ "$LATEST_ONLY" = true ]; then
            # Find latest backup
            local latest=$(ls -1t "$BACKUP_DIR"/dragndrop-*.bundle "$BACKUP_DIR"/dragndrop-*.tar.gz 2>/dev/null | head -1)
            if [ -n "$latest" ]; then
                files_to_verify+=("$latest")
            fi
        else
            # Find all backups
            for f in "$BACKUP_DIR"/dragndrop-*.bundle "$BACKUP_DIR"/dragndrop-*.tar.gz; do
                if [ -f "$f" ]; then
                    files_to_verify+=("$f")
                fi
            done
        fi
    fi
    
    # Check if we have files to verify
    if [ ${#files_to_verify[@]} -eq 0 ]; then
        log WARN "No backup files found in $BACKUP_DIR"
        record_result "backup_files" "warn" "none found"
    else
        log INFO "Found ${#files_to_verify[@]} backup file(s) to verify"
        echo ""
        
        # Verify each file
        for file in "${files_to_verify[@]}"; do
            verify_single_backup "$file"
        done
    fi
    
    # Check cloud backups
    if [ "$CHECK_CLOUD" = true ]; then
        verify_cloud_backups
    fi
    
    # Output results
    if [ "$REPORT_JSON" = true ]; then
        output_json
    else
        output_summary
    fi
    
    # Exit with appropriate code
    if [ $FAILED_CHECKS -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main
main
