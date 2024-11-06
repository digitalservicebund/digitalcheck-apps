#!/bin/sh
set -euf

read_secret() {
    local secret_name=$1
    local default_path=$2
    local env_value

    # Check if environment variable is already set (development case)
    eval env_value=\$$secret_name
    if [ -n "${env_value:-}" ]; then
        return
    fi

    # Check mounted secrets first (production case)
    if [ -f "/run/secrets/$secret_name" ]; then
        # Only relevant when using docker-compose secrets
        export $secret_name=$(cat "/run/secrets/$secret_name")
    elif [ -f "$default_path" ]; then
        export $secret_name=$(cat "$default_path")
    else
        echo "Error: Secret $secret_name not found"
        exit 1
    fi
}

# Read secrets
read_secret "ENCRYPTION_KEY" "/etc/secrets-sealed/encryption-key"
read_secret "UNLEASH_KEY" "/etc/secrets-sealed/unleash-key"

# Execute the main command
exec "$@"
