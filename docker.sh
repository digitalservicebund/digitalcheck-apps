#!/bin/sh
set -euf

# Ensure this script runs in its own directory
cd "$(dirname "$0")"

# Determine which app to run (if not provided in CLI parameters)
if [ -z ${1+x} ]; then
   echo 'Select which app to run via Docker:'
   select app in "dito" "tool-finder" "exit"; do 
      case $app in
         exit) echo "❌ Exiting"
               exit;
               break ;;
            *) echo "🏗️ Building & 🏃‍➡️ running app: $app"
               break ;;
      esac
   done
else
   app=$1
   echo "🏗️ Building & 🏃‍➡️ running app: $1 (from script parameters)"
fi

if [ "$app" == "dito" ]; then
   # Import environment variables from the Dito package
   export $(grep -v '^#' packages/dito/.env | xargs)

   # Build the application 
   docker build -t digitalcheck-dito:latest . -f packages/dito/Dockerfile --build-arg ENCRYPTION_KEY=$ENCRYPTION_KEY --build-arg UNLEASH_KEY=$UNLEASH_KEY

   # Stop & remove any existing containers
   docker stop digitalcheck-dito || true
   docker rm digitalcheck-dito || true

   # Run the newly built container
   docker run --name digitalcheck-dito -p 3000:3000 -d digitalcheck-dito:latest
fi

if [ "$app" == "tool-finder" ]; then
   # TODO: Get this working for tool finder
   echo "Tool finder Docker is not set-up yet...";
   echo "❌ Exiting";
fi