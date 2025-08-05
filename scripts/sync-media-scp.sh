#!/bin/bash

# Simple Media Sync Script using SCP
# Downloads the public/media folder from a remote server using scp
# 
# Usage: ./scripts/sync-media-scp.sh
# 
# Environment variables required:
#   SYNC_HOST_IP     - IP address or hostname of the remote server
#   SYNC_REMOTE_PATH - Remote path to the media folder (default: /app/public/media/)
#   SYNC_USER        - SSH username (default: root)
#   SYNC_PORT        - SSH port (default: 22)
#   SYNC_KEY_PATH    - Path to SSH private key (optional)

set -e

# Default values
DEFAULT_REMOTE_PATH="/app/public/media/"
DEFAULT_USER="root"
DEFAULT_PORT="22"
LOCAL_MEDIA_DIR="$(pwd)/public/media"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Load environment variables
SYNC_HOST_IP="${SYNC_HOST_IP:-}"
SYNC_REMOTE_PATH="${SYNC_REMOTE_PATH:-$DEFAULT_REMOTE_PATH}"
SYNC_USER="${SYNC_USER:-$DEFAULT_USER}"
SYNC_PORT="${SYNC_PORT:-$DEFAULT_PORT}"
SYNC_KEY_PATH="${SYNC_KEY_PATH:-}"

# Validate required variables
if [[ -z "$SYNC_HOST_IP" ]]; then
    print_error "SYNC_HOST_IP environment variable is required"
    echo "Example: SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media-scp.sh"
    exit 1
fi

# Build SSH options
SSH_OPTIONS="-P $SYNC_PORT -r"
if [[ -n "$SYNC_KEY_PATH" ]]; then
    SSH_OPTIONS="$SSH_OPTIONS -i $SYNC_KEY_PATH"
fi

# Create local directory
mkdir -p "$LOCAL_MEDIA_DIR"

# Build source path
REMOTE_SOURCE="${SYNC_USER}@${SYNC_HOST_IP}:${SYNC_REMOTE_PATH}*"

print_info "Downloading media files from $SYNC_HOST_IP..."
print_info "Remote: $REMOTE_SOURCE"
print_info "Local:  $LOCAL_MEDIA_DIR"

# Execute scp command
if scp $SSH_OPTIONS "$REMOTE_SOURCE" "$LOCAL_MEDIA_DIR/"; then
    print_success "Media sync completed successfully"
else
    print_error "Media sync failed"
    exit 1
fi