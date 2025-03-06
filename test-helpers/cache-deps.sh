#!/bin/bash
# cache-deps.sh - Simple version cache setup

# Get directory of the script itself, regardless of where it's called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Configuration file
CONFIG_FILE="$SCRIPT_DIR/../ag-grid-versions.json"

PACKAGE_NAME="ag-grid-community"
VERSIONS=$(jq -r '.[]' "$CONFIG_FILE")
CACHE_DIR="$SCRIPT_DIR/../deps-cache"

# Create cache directory
mkdir -p "$CACHE_DIR"

# Install each version
echo "$VERSIONS" | while read -r VERSION; do
  VERSION_DIR="$CACHE_DIR/node_modules/$PACKAGE_NAME-$VERSION"
  
  # Check if already installed
  if [ ! -d "$VERSION_DIR" ]; then
    echo "Installing $PACKAGE_NAME@$VERSION..."
    
    # Install the package using --prefix flag
    npm install "$PACKAGE_NAME-$VERSION@npm:$PACKAGE_NAME@$VERSION" --save-dev --no-package-lock --prefix "$CACHE_DIR" --no-audit
    
    if [ $? -eq 0 ]; then
      echo "✅ Cached $PACKAGE_NAME@$VERSION"
    else
      echo "❌ Failed to cache $PACKAGE_NAME@$VERSION"
    fi
  else
    echo "Already cached $PACKAGE_NAME@$VERSION"
  fi
  echo ""
done

echo "All versions cached successfully in $CACHE_DIR"