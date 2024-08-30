#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export ENCRYPTION_KEY="${ENCRYPTION_KEY:=$(cat /etc/secrets-sealed/encryption-key)}"
export UNLEASH_KEY="${UNLEASH_KEY:=$(cat /etc/secrets-sealed/unleash-key)}"

# Run the application
npm run start --workspace packages/dito