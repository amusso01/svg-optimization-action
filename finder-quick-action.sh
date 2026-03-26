#!/bin/bash

# SVG Optimize - Finder Quick Action launcher
#
# This script is meant to be pasted into an Automator "Run Shell Script" action.
# It uses NVM so the Quick Action does not depend on a hardcoded Node binary path.
#
# IMPORTANT FOR FUTURE-YOU:
# The Node version is pinned below with:
#   nvm use 22
#
# If you move to a newer Node version in the future, change that line.
# Example:
#   nvm use 24
#
# Then test manually before trusting Finder automation again.

export NVM_DIR="$HOME/.nvm"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  osascript -e 'display alert "SVG Optimize" message "nvm.sh was not found in ~/.nvm" as warning'
  exit 1
fi

source "$NVM_DIR/nvm.sh"

# Pin the Node major version used by this automation.
# Change this in the future if needed, then test:
#   nvm install <version>
#   nvm use <version>
# 🔴 CHANGE THIS IN THE FUTURE IF NEEDED
nvm use 22 >/dev/null 2>&1

if [ $? -ne 0 ]; then
  osascript -e 'display alert "SVG Optimize" message "Pinned Node version is not installed in NVM. Install it first, or update the version in finder-quick-action.sh." as warning'
  exit 1
fi

SCRIPT_PATH="$HOME/Code/svg-optimization-action/optimize-svg.js"

if [ ! -f "$SCRIPT_PATH" ]; then
  osascript -e 'display alert "SVG Optimize" message "optimize-svg.js was not found in ~/Code/svg-optimization-action" as warning'
  exit 1
fi

node "$SCRIPT_PATH" "$@"