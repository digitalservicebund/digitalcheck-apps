#!/bin/bash
# source '.env'
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export BASE_URL="${BASE_URL:=$(cat /etc/opaque/base-url)}"
export UNLEASH_API_URL="${UNLEASH_API_URL:=$(cat /etc/opaque/unleash-api-url)}"
export UNLEASH_APP="${UNLEASH_APP:=$(cat /etc/opaque/unleash-app)}"
export UNLEASH_KEY="${UNLEASH_KEY:=$(cat /etc/sealed/unleash-key)}"

npm run start --workspace packages/dito

# source packages/dito/.env && docker build -t digitalcheck-dito:latest . -f packages/dito/Dockerfile --build-arg BASE_URL=$BASE_URL --build-arg UNLEASH_API_URL=$UNLEASH_API_URL --build-arg UNLEASH_APP=$UNLEASH_APP --build-arg UNLEASH_KEY=$UNLEASH_KEY