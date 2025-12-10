#!/bin/bash
# =============================================================================
# DragNDrop - Manual Backup Script
# =============================================================================
# Creates local backups of the project with versioning and integrity checks
# Usage: ./backup.sh [OPTIONS]
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
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"
BACKUP_PREFIX="dragndrop"
LOG_FILE="$PROJECT_ROOT/logs/backup-$TIMESTAMP.log"

# Default options
BACKUP_TYPE="all"
COMPRESS=true
VERIFY=true
UPLOAD_S3=false
UPLOAD_R2=false
RETENTION_DAYS=30
MAX_BACKUPS=50

# Ensure directories exist
mkdir -p "$BACKUP_DIR"
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
Usage: $0 [OPTIONS]

Create backups of the DragNDrop project.

OPTIONS:
    --type <type>        Backup type: all, code, assets, config (default: all)
    --output <dir>       Output directory (default: ./backups)
    --no-compress        Don't compress the backup
    --no-verify          Skip verification after backup
    --upload-s3          Upload to AWS S3 (requires AWS credentials)
    --upload-r2          Upload to Cloudflare R2 (requires R2 credentials)
    --retention <days>   Retention period in days (default: 30)
    -h, --help           Show this help message

ENVIRONMENT VARIABLES:
    BACKUP_DIR           Override default backup directory
    AWS_ACCESS_KEY_ID    AWS credentials for S3 upload
    AWS_SECRET_ACCESS_KEY
    AWS_REGION
    CLOUDFLARE_R2_ACCESS_KEY_ID    R2 credentials
    CLOUDFLARE_R2_SECRET_ACCESS_KEY
    CLOUDFLARE_R2_ENDPOINT

EXAMPLES:
    $0                           # Full backup with defaults
    $0 --type code               # Backup code only
    $0 --upload-s3               # Backup and upload to S3
    $0 --retention 7             # Keep backups for 7 days

EOF
    exit 0
}

# =============================================================================
# Parse Arguments
# =============================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --output)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --no-compress)
            COMPRESS=false
            shift
            ;;
        --no-verify)
            VERIFY=false
            shift
            ;;
        --upload-s3)
            UPLOAD_S3=true
            shift
            ;;
        --upload-r2)
            UPLOAD_R2=true
            shift
            ;;
        --retention)
            RETENTION_DAYS="$2"
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

# =============================================================================
# Backup Functions
# =============================================================================

backup_code() {
    log STEP "Creating code backup..."
    
    local bundle_file="$BACKUP_DIR/${BACKUP_PREFIX}-code-${TIMESTAMP}.bundle"
    local archive_file="$BACKUP_DIR/${BACKUP_PREFIX}-code-${TIMESTAMP}.tar"
    
    cd "$PROJECT_ROOT"
    
    # Create git bundle (includes full history)
    log INFO "Creating git bundle..."
    git bundle create "$bundle_file" --all
    log OK "Git bundle created: $(basename $bundle_file)"
    
    # Create source archive (without .git, node_modules, etc.)
    log INFO "Creating source archive..."
    tar -cf "$archive_file" \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='coverage' \
        --exclude='*.log' \
        --exclude='backups' \
        --exclude='tmp' \
        --exclude='.wrangler' \
        .
    
    if [ "$COMPRESS" = true ]; then
        gzip -f "$archive_file"
        archive_file="${archive_file}.gz"
    fi
    
    log OK "Source archive created: $(basename $archive_file)"
    
    # Generate checksums
    sha256sum "$bundle_file" > "${bundle_file}.sha256"
    sha256sum "$archive_file" > "${archive_file}.sha256"
    
    log OK "Checksums generated"
    
    echo "$bundle_file"
    echo "$archive_file"
}

backup_assets() {
    log STEP "Creating assets backup..."
    
    local archive_file="$BACKUP_DIR/${BACKUP_PREFIX}-assets-${TIMESTAMP}.tar"
    
    cd "$PROJECT_ROOT"
    
    # Create assets archive
    tar -cf "$archive_file" \
        --ignore-failed-read \
        landing/assets/ \
        docs/ \
        public/ \
        examples/ \
        2>/dev/null || true
    
    if [ -s "$archive_file" ]; then
        if [ "$COMPRESS" = true ]; then
            gzip -f "$archive_file"
            archive_file="${archive_file}.gz"
        fi
        
        sha256sum "$archive_file" > "${archive_file}.sha256"
        log OK "Assets archive created: $(basename $archive_file)"
        echo "$archive_file"
    else
        rm -f "$archive_file"
        log WARN "No assets to backup"
    fi
}

backup_config() {
    log STEP "Creating configuration backup..."
    
    local archive_file="$BACKUP_DIR/${BACKUP_PREFIX}-config-${TIMESTAMP}.tar"
    
    cd "$PROJECT_ROOT"
    
    # Create config archive
    tar -cf "$archive_file" \
        --ignore-failed-read \
        .github/ \
        .env.example \
        *.config.js \
        package.json \
        package-lock.json \
        tsconfig.json \
        vercel.json \
        wrangler.toml \
        2>/dev/null || true
    
    if [ -s "$archive_file" ]; then
        if [ "$COMPRESS" = true ]; then
            gzip -f "$archive_file"
            archive_file="${archive_file}.gz"
        fi
        
        sha256sum "$archive_file" > "${archive_file}.sha256"
        log OK "Config archive created: $(basename $archive_file)"
        echo "$archive_file"
    else
        rm -f "$archive_file"
        log WARN "No config files to backup"
    fi
}

# =============================================================================
# Upload Functions
# =============================================================================

upload_to_s3() {
    local file=$1
    local bucket="${AWS_S3_BUCKET:-dragndrop-backups}"
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        log WARN "AWS credentials not configured, skipping S3 upload"
        return 1
    fi
    
    log INFO "Uploading to S3: s3://$bucket/$(basename $file)"
    
    aws s3 cp "$file" "s3://$bucket/backups/" \
        --storage-class STANDARD_IA \
        --quiet
    
    # Also upload checksum
    if [ -f "${file}.sha256" ]; then
        aws s3 cp "${file}.sha256" "s3://$bucket/backups/" --quiet
    fi
    
    log OK "Uploaded to S3"
}

upload_to_r2() {
    local file=$1
    local bucket="${CLOUDFLARE_R2_BUCKET:-dragndrop-backups}"
    
    if [ -z "$CLOUDFLARE_R2_ACCESS_KEY_ID" ] || [ -z "$CLOUDFLARE_R2_SECRET_ACCESS_KEY" ]; then
        log WARN "R2 credentials not configured, skipping R2 upload"
        return 1
    fi
    
    log INFO "Uploading to R2: $bucket/$(basename $file)"
    
    AWS_ACCESS_KEY_ID="$CLOUDFLARE_R2_ACCESS_KEY_ID" \
    AWS_SECRET_ACCESS_KEY="$CLOUDFLARE_R2_SECRET_ACCESS_KEY" \
    aws s3 cp "$file" "s3://$bucket/backups/" \
        --endpoint-url "$CLOUDFLARE_R2_ENDPOINT" \
        --quiet
    
    # Also upload checksum
    if [ -f "${file}.sha256" ]; then
        AWS_ACCESS_KEY_ID="$CLOUDFLARE_R2_ACCESS_KEY_ID" \
        AWS_SECRET_ACCESS_KEY="$CLOUDFLARE_R2_SECRET_ACCESS_KEY" \
        aws s3 cp "${file}.sha256" "s3://$bucket/backups/" \
            --endpoint-url "$CLOUDFLARE_R2_ENDPOINT" \
            --quiet
    fi
    
    log OK "Uploaded to R2"
}

# =============================================================================
# Verification
# =============================================================================

verify_backup() {
    local file=$1
    
    log INFO "Verifying backup: $(basename $file)"
    
    # Verify checksum
    if [ -f "${file}.sha256" ]; then
        cd "$(dirname $file)"
        if sha256sum -c "$(basename ${file}.sha256)" > /dev/null 2>&1; then
            log OK "Checksum verified"
        else
            log ERROR "Checksum verification failed!"
            return 1
        fi
    fi
    
    # Verify archive integrity
    if [[ "$file" == *.tar.gz ]]; then
        if gzip -t "$file" 2>/dev/null; then
            log OK "Archive integrity verified"
        else
            log ERROR "Archive is corrupted!"
            return 1
        fi
    elif [[ "$file" == *.bundle ]]; then
        if git bundle verify "$file" > /dev/null 2>&1; then
            log OK "Git bundle verified"
        else
            log ERROR "Git bundle is invalid!"
            return 1
        fi
    fi
    
    return 0
}

# =============================================================================
# Cleanup
# =============================================================================

cleanup_old_backups() {
    log STEP "Cleaning up old backups..."
    
    local cutoff_date=$(date -d "-${RETENTION_DAYS} days" +%Y%m%d 2>/dev/null || \
                        date -v-${RETENTION_DAYS}d +%Y%m%d 2>/dev/null)
    
    local deleted=0
    
    # Delete old local backups
    for file in "$BACKUP_DIR"/${BACKUP_PREFIX}-*; do
        if [ -f "$file" ]; then
            local file_date=$(echo "$file" | grep -oP '\d{8}' | head -1)
            if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
                rm -f "$file"
                ((deleted++))
            fi
        fi
    done
    
    # Keep only MAX_BACKUPS most recent
    local count=$(ls -1 "$BACKUP_DIR"/${BACKUP_PREFIX}-*.tar.gz 2>/dev/null | wc -l)
    if [ "$count" -gt "$MAX_BACKUPS" ]; then
        ls -1t "$BACKUP_DIR"/${BACKUP_PREFIX}-*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
        log INFO "Removed excess backups (keeping $MAX_BACKUPS)"
    fi
    
    if [ $deleted -gt 0 ]; then
        log OK "Deleted $deleted old backup(s)"
    else
        log INFO "No old backups to delete"
    fi
}

# =============================================================================
# Main
# =============================================================================

main() {
    local start_time=$(date +%s)
    
    echo ""
    echo "=============================================="
    echo "  DragNDrop Backup"
    echo "=============================================="
    echo ""
    echo "  Type: $BACKUP_TYPE"
    echo "  Output: $BACKUP_DIR"
    echo "  Compress: $COMPRESS"
    echo "  Verify: $VERIFY"
    echo "  Timestamp: $TIMESTAMP"
    echo ""
    echo "=============================================="
    echo ""
    
    local backup_files=()
    
    # Create backups based on type
    case $BACKUP_TYPE in
        all)
            backup_files+=($(backup_code))
            backup_files+=($(backup_assets))
            backup_files+=($(backup_config))
            ;;
        code)
            backup_files+=($(backup_code))
            ;;
        assets)
            backup_files+=($(backup_assets))
            ;;
        config)
            backup_files+=($(backup_config))
            ;;
        *)
            log ERROR "Unknown backup type: $BACKUP_TYPE"
            exit 1
            ;;
    esac
    
    # Verify backups
    if [ "$VERIFY" = true ]; then
        log STEP "Verifying backups..."
        for file in "${backup_files[@]}"; do
            if [ -f "$file" ]; then
                verify_backup "$file" || log WARN "Verification failed for $file"
            fi
        done
    fi
    
    # Upload to cloud storage
    if [ "$UPLOAD_S3" = true ]; then
        log STEP "Uploading to AWS S3..."
        for file in "${backup_files[@]}"; do
            if [ -f "$file" ]; then
                upload_to_s3 "$file" || true
            fi
        done
    fi
    
    if [ "$UPLOAD_R2" = true ]; then
        log STEP "Uploading to Cloudflare R2..."
        for file in "${backup_files[@]}"; do
            if [ -f "$file" ]; then
                upload_to_r2 "$file" || true
            fi
        done
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Calculate duration
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Summary
    echo ""
    echo "=============================================="
    echo "  Backup Complete"
    echo "=============================================="
    echo ""
    echo "  Duration: ${duration}s"
    echo "  Files created:"
    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            local size=$(ls -lh "$file" | awk '{print $5}')
            echo "    - $(basename $file) ($size)"
        fi
    done
    echo ""
    echo "  Location: $BACKUP_DIR"
    echo "  Log: $LOG_FILE"
    echo ""
    echo "=============================================="
    
    log OK "Backup completed successfully in ${duration}s"
}

# Run main
main
