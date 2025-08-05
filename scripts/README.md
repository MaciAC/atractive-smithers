# Media Sync Scripts

This directory contains scripts to download the `public/media` folder from a remote server to your local development environment.

## Available Scripts

### 1. `sync-media.sh` (Recommended)
Full-featured bash script using rsync with comprehensive options and error handling.

**Features:**
- Uses rsync for efficient incremental transfers
- Dry-run mode to preview changes
- Delete mode to mirror remote directory exactly
- Verbose output option
- SSH connection testing
- Comprehensive error handling and logging

### 2. `sync-media.js`
Cross-platform Node.js version with the same features as the bash script.

**Features:**
- Works on Windows, macOS, and Linux
- Supports both rsync and scp methods
- Same options as bash script
- Colored console output

### 3. `sync-media-scp.sh`
Simple bash script using scp for basic file copying.

**Features:**
- Simple and lightweight
- Uses scp for straightforward file copying
- Good for one-time transfers

## Configuration

All scripts use environment variables for configuration. Add these to your `.env` file:

```bash
# Required
SYNC_HOST_IP="192.168.1.100"          # IP address or hostname of remote server

# Optional (with defaults)
SYNC_REMOTE_PATH="/app/public/media/"   # Remote path to media folder
SYNC_USER="root"                        # SSH username
SYNC_PORT="22"                          # SSH port
SYNC_KEY_PATH=""                        # Path to SSH private key (optional)
```

## Usage Examples

### Basic Usage

```bash
# Set the host IP and run
SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh
```

### Using Environment File

```bash
# Create .env file with your settings
echo "SYNC_HOST_IP=192.168.1.100" >> .env
echo "SYNC_USER=deploy" >> .env
echo "SYNC_REMOTE_PATH=/var/www/app/public/media/" >> .env

# Load environment and run
source .env && ./scripts/sync-media.sh
```

### Advanced Options

```bash
# Dry run to see what would be transferred
SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh --dry-run

# Verbose output with delete mode (mirror remote exactly)
SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media.sh --verbose --delete

# Using custom SSH key
SYNC_HOST_IP=192.168.1.100 SYNC_KEY_PATH=~/.ssh/my_key ./scripts/sync-media.sh
```

### Node.js Version

```bash
# Basic usage
SYNC_HOST_IP=192.168.1.100 node scripts/sync-media.js

# Use scp instead of rsync
SYNC_HOST_IP=192.168.1.100 node scripts/sync-media.js --method=scp

# Dry run with verbose output
SYNC_HOST_IP=192.168.1.100 node scripts/sync-media.js --dry-run --verbose
```

### Simple SCP Version

```bash
# Basic file copy
SYNC_HOST_IP=192.168.1.100 ./scripts/sync-media-scp.sh
```

## Prerequisites

### For Bash Scripts (`sync-media.sh`, `sync-media-scp.sh`)
- `rsync` (for sync-media.sh)
- `scp` and `ssh` (standard on most systems)
- Bash shell

**Install rsync:**
```bash
# macOS
brew install rsync

# Ubuntu/Debian
sudo apt-get install rsync

# CentOS/RHEL
sudo yum install rsync
```

### For Node.js Script (`sync-media.js`)
- Node.js (any recent version)
- `rsync` or `scp` (depending on method chosen)

## SSH Setup

### Password Authentication
If your server uses password authentication, you'll be prompted for the password during sync.

### Key-based Authentication (Recommended)
1. Generate SSH key pair (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Copy public key to server:
   ```bash
   ssh-copy-id user@server_ip
   ```

3. Test connection:
   ```bash
   ssh user@server_ip
   ```

4. Use custom key path if needed:
   ```bash
   SYNC_KEY_PATH=~/.ssh/my_custom_key ./scripts/sync-media.sh
   ```

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify host IP, username, and port
   - Check if SSH service is running on remote server
   - Verify SSH key permissions (should be 600)

2. **Remote Directory Not Found**
   - Check the `SYNC_REMOTE_PATH` environment variable
   - Verify the path exists on the remote server

3. **Permission Denied**
   - Ensure the SSH user has read access to the remote media directory
   - Check if the local media directory is writable

4. **rsync Not Found**
   - Install rsync using your system's package manager
   - Use the scp version as an alternative

### Debug Mode

For detailed debugging, you can:

```bash
# Enable SSH debug mode
ssh -vvv user@host

# Use verbose mode in scripts
./scripts/sync-media.sh --verbose

# Check what would be transferred without actually doing it
./scripts/sync-media.sh --dry-run
```

## Security Considerations

1. **Use SSH Keys**: Prefer key-based authentication over passwords
2. **Restrict SSH Access**: Configure SSH to only allow specific users/keys
3. **Firewall**: Ensure only necessary ports are open
4. **Regular Updates**: Keep your server and SSH software updated

## Integration with Development Workflow

### NPM Scripts
Add to your `package.json`:

```json
{
  "scripts": {
    "sync-media": "node scripts/sync-media.js",
    "sync-media-dry": "node scripts/sync-media.js --dry-run"
  }
}
```

Then run:
```bash
SYNC_HOST_IP=192.168.1.100 npm run sync-media
```

### Git Hooks
You can integrate media sync into git hooks for automatic updates:

```bash
# .git/hooks/post-merge
#!/bin/bash
if [ -f .env ]; then
    source .env
    if [ -n "$SYNC_HOST_IP" ]; then
        ./scripts/sync-media.sh --dry-run
        echo "Run 'npm run sync-media' to update media files"
    fi
fi
```

## File Structure

After running the sync, your local structure will be:

```
public/
└── media/
    ├── folder1/
    │   ├── image1.jpg
    │   └── video1.mp4
    ├── folder2/
    │   └── image2.png
    └── ...
```

The structure will match exactly what's on your remote server, maintaining all subdirectories and file organization.