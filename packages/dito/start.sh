#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export BASE_URL="${BASE_URL:=https://digitalcheck.bund.de}"
export UNLEASH_KEY="${UNLEASH_KEY:=$(cat /etc/secrets-sealed/unleash-key)}"

# Run the application
npm run start --workspace packages/dito