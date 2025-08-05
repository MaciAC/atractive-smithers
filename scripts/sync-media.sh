#!/bin/bash

# Media Sync Script
# Downloads the public/media folder from a remote server
# 
# Usage: ./scripts/sync-media.sh [options]
# 
# Environment variables required:
#   SYNC_HOST_IP     - IP address or hostname of the remote server
#   SYNC_REMOTE_PATH - Remote path to the media folder (default: /app/public/media/)
#   SYNC_USER        - SSH username (default: root)
#   SYNC_PORT        - SSH port (default: 22)
#   SYNC_KEY_PATH    - Path to SSH private key (optional)
#
# Options:
#   --dry-run        Show what would be transferred without actually doing it
#   --delete         Delete files in destination that don't exist in source
#   --verbose        Show detailed output
#   --help           Show this help message

set -e  # Exit on any error

# Default values
DEFAULT_REMOTE_PATH="/app/public/media/"
DEFAULT_USER="root"
DEFAULT_PORT="22"
LOCAL_MEDIA_DIR="$(pwd)/public/media"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
Media Sync Script

Downloads the public/media folder from a remote server using rsync over SSH.

USAGE:
    ./scripts/sync-media.sh [options]

ENVIRONMENT VARIABLES:
    SYNC_HOST_IP      IP address or hostname of the remote server (required)
    SYNC_REMOTE_PATH  Remote path to the media folder (default: $DEFAULT_REMOTE_PATH)
    SYNC_USER         SSH username (default: $DEFAULT_USER)
    SYNC_PORT         SSH port (default: $DEFAULT_PORT)
    SYNC_KEY_PATH     Path to SSH private key (optional, uses default SSH key if not set)

OPTIONS:
    --dry-run         Show what would be transferred without actually doing it
    --delete          Delete files in destination that don't exist in source
    --verbose         Show detailed output during transfer
    --help            Show this help message

EXAMPLES:
    # Basic sync
    SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh

    # Dry run to see what would be transferred
    SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh --dry-run

    # Sync with custom user and path
    SYNC_HOST_IP=myserver.com SYNC_USER=deploy SYNC_REMOTE_PATH=/var/www/app/public/media/ ./scripts/sync-media.sh

    # Sync with custom SSH key
    SYNC_HOST_IP=192.168.1.100 SYNC_KEY_PATH=~/.ssh/my_key ./scripts/sync-media.sh --verbose

NOTES:
    - The script uses rsync over SSH for efficient file transfer
    - Only new and modified files are transferred by default
    - The local media directory will be created if it doesn't exist
    - Make sure you have SSH access to the remote server
EOF
}

# Parse command line arguments
DRY_RUN=""
DELETE_OPTION=""
VERBOSE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN="--dry-run"
            shift
            ;;
        --delete)
            DELETE_OPTION="--delete"
            shift
            ;;
        --verbose)
            VERBOSE="--verbose"
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Load environment variables with defaults
SYNC_HOST_IP="${SYNC_HOST_IP:-}"
SYNC_REMOTE_PATH="${SYNC_REMOTE_PATH:-$DEFAULT_REMOTE_PATH}"
SYNC_USER="${SYNC_USER:-$DEFAULT_USER}"
SYNC_PORT="${SYNC_PORT:-$DEFAULT_PORT}"
SYNC_KEY_PATH="${SYNC_KEY_PATH:-}"

# Ensure SYNC_REMOTE_PATH ends with a slash
if [[ "${SYNC_REMOTE_PATH: -1}" != "/" ]]; then
    SYNC_REMOTE_PATH="${SYNC_REMOTE_PATH}/"
fi

# Validate required environment variables
if [[ -z "$SYNC_HOST_IP" ]]; then
    print_error "SYNC_HOST_IP environment variable is required"
    echo "Example: SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh"
    echo "Use --help for more information"
    exit 1
fi

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    print_error "rsync is not installed. Please install rsync first."
    echo "On macOS: brew install rsync"
    echo "On Ubuntu/Debian: sudo apt-get install rsync"
    echo "On CentOS/RHEL: sudo yum install rsync"
    exit 1
fi

# Build SSH options
SSH_OPTIONS="-p $SYNC_PORT"
if [[ -n "$SYNC_KEY_PATH" ]]; then
    if [[ ! -f "$SYNC_KEY_PATH" ]]; then
        print_error "SSH key file not found: $SYNC_KEY_PATH"
        exit 1
    fi
    SSH_OPTIONS="$SSH_OPTIONS -i $SYNC_KEY_PATH"
fi

# Build rsync command
RSYNC_CMD="rsync -avz --progress"

# Add optional flags
if [[ -n "$DRY_RUN" ]]; then
    RSYNC_CMD="$RSYNC_CMD $DRY_RUN"
    print_info "Running in DRY RUN mode - no files will be transferred"
fi

if [[ -n "$DELETE_OPTION" ]]; then
    RSYNC_CMD="$RSYNC_CMD $DELETE_OPTION"
    print_warning "DELETE mode enabled - files not present on remote will be deleted locally"
fi

if [[ -n "$VERBOSE" ]]; then
    RSYNC_CMD="$RSYNC_CMD $VERBOSE"
fi

# Add SSH options to rsync
RSYNC_CMD="$RSYNC_CMD -e 'ssh $SSH_OPTIONS'"

# Build source and destination paths
REMOTE_SOURCE="${SYNC_USER}@${SYNC_HOST_IP}:${SYNC_REMOTE_PATH}"
LOCAL_DEST="$LOCAL_MEDIA_DIR/"

# Create local media directory if it doesn't exist
if [[ ! -d "$LOCAL_MEDIA_DIR" ]]; then
    print_info "Creating local media directory: $LOCAL_MEDIA_DIR"
    mkdir -p "$LOCAL_MEDIA_DIR"
fi

# Test SSH connection first
print_info "Testing SSH connection to $SYNC_HOST_IP..."
if ! ssh $SSH_OPTIONS -o ConnectTimeout=10 -o BatchMode=yes "${SYNC_USER}@${SYNC_HOST_IP}" "echo 'SSH connection successful'" 2>/dev/null; then
    print_error "Failed to establish SSH connection to ${SYNC_USER}@${SYNC_HOST_IP}"
    print_error "Please check:"
    print_error "  - Host IP address: $SYNC_HOST_IP"
    print_error "  - SSH port: $SYNC_PORT"
    print_error "  - Username: $SYNC_USER"
    if [[ -n "$SYNC_KEY_PATH" ]]; then
        print_error "  - SSH key path: $SYNC_KEY_PATH"
    fi
    exit 1
fi

print_success "SSH connection established"

# Check if remote directory exists
print_info "Checking if remote directory exists: $SYNC_REMOTE_PATH"
if ! ssh $SSH_OPTIONS "${SYNC_USER}@${SYNC_HOST_IP}" "test -d '$SYNC_REMOTE_PATH'" 2>/dev/null; then
    print_error "Remote directory does not exist: $SYNC_REMOTE_PATH"
    print_error "Please verify the SYNC_REMOTE_PATH environment variable"
    exit 1
fi

print_success "Remote directory found: $SYNC_REMOTE_PATH"

# Show sync information
echo
print_info "=== SYNC CONFIGURATION ==="
print_info "Remote host: $SYNC_HOST_IP"
print_info "Remote user: $SYNC_USER"
print_info "Remote path: $SYNC_REMOTE_PATH"
print_info "Local path:  $LOCAL_MEDIA_DIR"
print_info "SSH port:    $SYNC_PORT"
if [[ -n "$SYNC_KEY_PATH" ]]; then
    print_info "SSH key:     $SYNC_KEY_PATH"
fi
echo

# Execute rsync command
print_info "Starting media sync..."
echo "Command: $RSYNC_CMD '$REMOTE_SOURCE' '$LOCAL_DEST'"
echo

# Use eval to properly handle the SSH options in quotes
if eval "$RSYNC_CMD '$REMOTE_SOURCE' '$LOCAL_DEST'"; then
    echo
    if [[ -n "$DRY_RUN" ]]; then
        print_success "Dry run completed successfully"
        print_info "Run without --dry-run to actually transfer the files"
    else
        print_success "Media sync completed successfully"
        
        # Show some statistics
        if [[ -d "$LOCAL_MEDIA_DIR" ]]; then
            FILE_COUNT=$(find "$LOCAL_MEDIA_DIR" -type f | wc -l | tr -d ' ')
            DIR_SIZE=$(du -sh "$LOCAL_MEDIA_DIR" 2>/dev/null | cut -f1 || echo "unknown")
            print_info "Local media directory now contains $FILE_COUNT files ($DIR_SIZE)"
        fi
    fi
else
    print_error "Media sync failed"
    exit 1
fi