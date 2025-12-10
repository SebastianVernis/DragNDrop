#!/bin/bash
# =============================================================================
# DragNDrop - Restore Script
# =============================================================================
# Restores the project from backup files (git bundle or tar archive)
# Usage: ./restore.sh [OPTIONS] <backup_file>
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
LOG_FILE="$PROJECT_ROOT/logs/restore-$TIMESTAMP.log"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"

# Default options
RESTORE_DIR=""
VERIFY_ONLY=false
FORCE=false
INSTALL_DEPS=true
RUN_BUILD=false
DRY_RUN=false

# Ensure log directory exists
mkdir -p "$PROJECT_ROOT/logs"

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
        OK)    echo -e "${GREEN}[OK]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" ;;
        STEP)  echo -e "${CYAN}[STEP]${NC} $message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# =============================================================================
# Usage
# =============================================================================

usage() {
    cat << EOF
Usage: $0 [OPTIONS] <backup_file>

Restore DragNDrop project from a backup file.

ARGUMENTS:
    backup_file          Path to backup file (.bundle, .tar.gz, or .tar)
                         Can also be 'latest' to use most recent backup

OPTIONS:
    --output <dir>       Restore to specific directory (default: ./restored-TIMESTAMP)
    --verify-only        Only verify backup integrity, don't restore
    --force              Overwrite existing files without confirmation
    --no-deps            Don't install dependencies after restore
    --build              Run build after restore
    --dry-run            Show what would be done without making changes
    --from-s3 <key>      Download and restore from S3
    --from-r2 <key>      Download and restore from R2
    -h, --help           Show this help message

EXAMPLES:
    $0 backups/dragndrop-code-20251209.bundle
    $0 latest
    $0 --output ./my-restore backups/dragndrop-code-20251209.tar.gz
    $0 --verify-only backups/dragndrop-code-20251209.bundle
    $0 --from-s3 backups/dragndrop-code-20251209.tar.gz

EOF
    exit 0
}

# =============================================================================
# Parse Arguments
# =============================================================================

BACKUP_FILE=""
FROM_S3=""
FROM_R2=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --output)
            RESTORE_DIR="$2"
            shift 2
            ;;
        --verify-only)
            VERIFY_ONLY=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --no-deps)
            INSTALL_DEPS=false
            shift
            ;;
        --build)
            RUN_BUILD=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --from-s3)
            FROM_S3="$2"
            shift 2
            ;;
        --from-r2)
            FROM_R2="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        -*)
            echo "Unknown option: $1"
            usage
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# =============================================================================
# Helper Functions
# =============================================================================

find_latest_backup() {
    local latest=""
    
    # Find most recent bundle or tar.gz
    latest=$(ls -1t "$BACKUP_DIR"/dragndrop-code-*.bundle 2>/dev/null | head -1)
    
    if [ -z "$latest" ]; then
        latest=$(ls -1t "$BACKUP_DIR"/dragndrop-code-*.tar.gz 2>/dev/null | head -1)
    fi
    
    echo "$latest"
}

download_from_s3() {
    local key=$1
    local output=$2
    local bucket="${AWS_S3_BUCKET:-dragndrop-backups}"
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        log ERROR "AWS credentials not configured"
        return 1
    fi
    
    log INFO "Downloading from S3: s3://$bucket/$key"
    
    aws s3 cp "s3://$bucket/$key" "$output" --quiet
    
    # Also download checksum if available
    aws s3 cp "s3://$bucket/${key}.sha256" "${output}.sha256" --quiet 2>/dev/null || true
    
    log OK "Downloaded from S3"
}

download_from_r2() {
    local key=$1
    local output=$2
    local bucket="${CLOUDFLARE_R2_BUCKET:-dragndrop-backups}"
    
    if [ -z "$CLOUDFLARE_R2_ACCESS_KEY_ID" ] || [ -z "$CLOUDFLARE_R2_SECRET_ACCESS_KEY" ]; then
        log ERROR "R2 credentials not configured"
        return 1
    fi
    
    log INFO "Downloading from R2: $bucket/$key"
    
    AWS_ACCESS_KEY_ID="$CLOUDFLARE_R2_ACCESS_KEY_ID" \
    AWS_SECRET_ACCESS_KEY="$CLOUDFLARE_R2_SECRET_ACCESS_KEY" \
    aws s3 cp "s3://$bucket/$key" "$output" \
        --endpoint-url "$CLOUDFLARE_R2_ENDPOINT" \
        --quiet
    
    log OK "Downloaded from R2"
}

verify_backup() {
    local file=$1
    
    log STEP "Verifying backup integrity..."
    
    # Check file exists
    if [ ! -f "$file" ]; then
        log ERROR "Backup file not found: $file"
        return 1
    fi
    
    # Verify checksum if available
    if [ -f "${file}.sha256" ]; then
        log INFO "Verifying checksum..."
        cd "$(dirname $file)"
        if sha256sum -c "$(basename ${file}.sha256)" > /dev/null 2>&1; then
            log OK "Checksum verified"
        else
            log ERROR "Checksum verification failed!"
            return 1
        fi
    else
        log WARN "No checksum file found, skipping checksum verification"
    fi
    
    # Verify file integrity based on type
    if [[ "$file" == *.bundle ]]; then
        log INFO "Verifying git bundle..."
        if git bundle verify "$file" > /dev/null 2>&1; then
            log OK "Git bundle is valid"
            
            # Show bundle info
            log INFO "Bundle contains:"
            git bundle list-heads "$file" 2>/dev/null | head -5
        else
            log ERROR "Git bundle is invalid!"
            return 1
        fi
    elif [[ "$file" == *.tar.gz ]]; then
        log INFO "Verifying tar.gz archive..."
        if gzip -t "$file" 2>/dev/null; then
            log OK "Archive integrity verified"
            
            # Show archive contents
            log INFO "Archive contains $(tar -tzf "$file" | wc -l) files"
        else
            log ERROR "Archive is corrupted!"
            return 1
        fi
    elif [[ "$file" == *.tar ]]; then
        log INFO "Verifying tar archive..."
        if tar -tf "$file" > /dev/null 2>&1; then
            log OK "Archive integrity verified"
        else
            log ERROR "Archive is corrupted!"
            return 1
        fi
    else
        log WARN "Unknown file type, cannot verify integrity"
    fi
    
    return 0
}

restore_from_bundle() {
    local bundle=$1
    local output_dir=$2
    
    log STEP "Restoring from git bundle..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would clone bundle to $output_dir"
        return 0
    fi
    
    # Clone from bundle
    git clone "$bundle" "$output_dir"
    
    cd "$output_dir"
    
    # Checkout main branch
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
    
    # Show restore info
    log OK "Restored to: $output_dir"
    log INFO "Latest commit: $(git log --oneline -1)"
    log INFO "Branch: $(git branch --show-current)"
}

restore_from_archive() {
    local archive=$1
    local output_dir=$2
    
    log STEP "Restoring from archive..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would extract archive to $output_dir"
        return 0
    fi
    
    mkdir -p "$output_dir"
    
    # Extract based on type
    if [[ "$archive" == *.tar.gz ]]; then
        tar -xzf "$archive" -C "$output_dir"
    elif [[ "$archive" == *.tar ]]; then
        tar -xf "$archive" -C "$output_dir"
    fi
    
    log OK "Extracted to: $output_dir"
    log INFO "Files restored: $(find "$output_dir" -type f | wc -l)"
}

install_dependencies() {
    local dir=$1
    
    log STEP "Installing dependencies..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would run npm ci"
        return 0
    fi
    
    cd "$dir"
    
    if [ -f "package-lock.json" ]; then
        npm ci --silent
    elif [ -f "package.json" ]; then
        npm install --silent
    else
        log WARN "No package.json found, skipping dependency installation"
        return 0
    fi
    
    log OK "Dependencies installed"
}

run_build() {
    local dir=$1
    
    log STEP "Running build..."
    
    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY RUN] Would run npm run build"
        return 0
    fi
    
    cd "$dir"
    
    if npm run build --if-present 2>/dev/null; then
        log OK "Build completed"
    else
        log WARN "Build script not found or failed"
    fi
}

verify_restore() {
    local dir=$1
    
    log STEP "Verifying restored files..."
    
    cd "$dir"
    
    local required_files=("package.json" "index.html" "script.js" "style.css")
    local missing=0
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log OK "Found: $file"
        else
            log WARN "Missing: $file"
            ((missing++))
        fi
    done
    
    if [ $missing -eq 0 ]; then
        log OK "All required files present"
        return 0
    else
        log WARN "$missing required file(s) missing"
        return 1
    fi
}

# =============================================================================
# Main
# =============================================================================

main() {
    local start_time=$(date +%s)
    
    echo ""
    echo "=============================================="
    echo "  DragNDrop Restore"
    echo "=============================================="
    echo ""
    
    # Handle cloud downloads
    if [ -n "$FROM_S3" ]; then
        BACKUP_FILE="$BACKUP_DIR/$(basename $FROM_S3)"
        download_from_s3 "$FROM_S3" "$BACKUP_FILE"
    elif [ -n "$FROM_R2" ]; then
        BACKUP_FILE="$BACKUP_DIR/$(basename $FROM_R2)"
        download_from_r2 "$FROM_R2" "$BACKUP_FILE"
    fi
    
    # Handle 'latest' keyword
    if [ "$BACKUP_FILE" = "latest" ]; then
        BACKUP_FILE=$(find_latest_backup)
        if [ -z "$BACKUP_FILE" ]; then
            log ERROR "No backup files found in $BACKUP_DIR"
            exit 1
        fi
        log INFO "Using latest backup: $BACKUP_FILE"
    fi
    
    # Validate backup file
    if [ -z "$BACKUP_FILE" ]; then
        echo "Error: No backup file specified"
        usage
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        log ERROR "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    # Set default restore directory
    if [ -z "$RESTORE_DIR" ]; then
        RESTORE_DIR="$PROJECT_ROOT/restored-$TIMESTAMP"
    fi
    
    echo "  Backup: $(basename $BACKUP_FILE)"
    echo "  Output: $RESTORE_DIR"
    echo "  Mode: $([ "$DRY_RUN" = true ] && echo "DRY RUN" || echo "LIVE")"
    echo ""
    echo "=============================================="
    echo ""
    
    # Verify backup
    if ! verify_backup "$BACKUP_FILE"; then
        log ERROR "Backup verification failed"
        exit 1
    fi
    
    # If verify-only, stop here
    if [ "$VERIFY_ONLY" = true ]; then
        log OK "Verification complete"
        exit 0
    fi
    
    # Check if output directory exists
    if [ -d "$RESTORE_DIR" ] && [ "$FORCE" != true ] && [ "$DRY_RUN" != true ]; then
        log WARN "Output directory already exists: $RESTORE_DIR"
        read -p "Overwrite? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            log INFO "Restore cancelled"
            exit 0
        fi
        rm -rf "$RESTORE_DIR"
    fi
    
    # Perform restore based on file type
    if [[ "$BACKUP_FILE" == *.bundle ]]; then
        restore_from_bundle "$BACKUP_FILE" "$RESTORE_DIR"
    else
        restore_from_archive "$BACKUP_FILE" "$RESTORE_DIR"
    fi
    
    # Install dependencies
    if [ "$INSTALL_DEPS" = true ]; then
        install_dependencies "$RESTORE_DIR"
    fi
    
    # Run build
    if [ "$RUN_BUILD" = true ]; then
        run_build "$RESTORE_DIR"
    fi
    
    # Verify restore
    verify_restore "$RESTORE_DIR"
    
    # Calculate duration
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Summary
    echo ""
    echo "=============================================="
    echo "  Restore Complete"
    echo "=============================================="
    echo ""
    echo "  Duration: ${duration}s"
    echo "  Restored to: $RESTORE_DIR"
    echo "  Log: $LOG_FILE"
    echo ""
    echo "  Next steps:"
    echo "    cd $RESTORE_DIR"
    if [ "$INSTALL_DEPS" != true ]; then
        echo "    npm ci"
    fi
    if [ "$RUN_BUILD" != true ]; then
        echo "    npm run build"
    fi
    echo "    npm start"
    echo ""
    echo "=============================================="
    
    log OK "Restore completed successfully in ${duration}s"
}

# Run main
main
