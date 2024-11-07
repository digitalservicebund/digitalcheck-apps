#!/bin/sh
set -euf

# Exporting (production) only if not already set (development, through docker compose)
# See https://stackoverflow.com/a/11686912 for syntax
export ENCRYPTION_KEY="${ENCRYPTION_KEY:=$(cat /etc/secrets-sealed/encryption-key)}"
export UNLEASH_KEY="${UNLEASH_KEY:=$(cat /etc/secrets-sealed/unleash-key)}"

# Execute CMD from Dockerfile
exec "$@"
