#!/bin/bash

# Get directory of the script itself, regardless of where it's called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Configuration file
CONFIG_FILE="$SCRIPT_DIR/../ag-grid-versions.json"

VERSIONS=$(jq -r '.[]' "$CONFIG_FILE")

echo "$VERSIONS" | while read -r VERSION; do
  AG_GRID_VERSION=$VERSION npm run build:test
  echo "Testing against ag-grid-community@$VERSION"
  AG_GRID_VERSION=$VERSION npx cypress run

  if [ $? -eq 0 ]; then
    echo "✅ Tests PASSED for version $VERSION"
  else
    echo "❌ Tests FAILED for version $VERSION"
  fi
done