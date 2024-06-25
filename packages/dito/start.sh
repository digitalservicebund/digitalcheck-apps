#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export BASE_URL="${BASE_URL:=$(cat /etc/secrets-opaque/base-url)}"
export UNLEASH_API_URL="${UNLEASH_API_URL:=$(cat /etc/secrets-opaque/unleash-api-url)}"
export UNLEASH_APP="${UNLEASH_APP:=$(cat /etc/secrets-opaque/unleash-app)}"
export UNLEASH_KEY="${UNLEASH_KEY:=$(cat /etc/secrets-sealed/unleash-key)}"

# Run the application
npm run start --workspace packages/dito