#!/bin/bash

# Get directory of the script itself, regardless of where it's called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Configuration file
CONFIG_FILE="$PROJECT_ROOT/ag-grid-versions.json"

VERSIONS=$(jq -r '.[]' "$CONFIG_FILE")
PASSED_VERSIONS=()
FAILED_VERSIONS=()

echo ""
echo "══════════════════════════════════════════════════════════"
echo "  TEST MATRIX"
echo "══════════════════════════════════════════════════════════"

for VERSION in $VERSIONS; do
  # Build
  echo ""
  echo "v$VERSION: building... "
  AG_GRID_VERSION=$VERSION npm run build:test > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "❌ build failed"
    FAILED_VERSIONS+=("$VERSION")
    continue
  fi

  echo "Testing against ag-grid-community@$VERSION"

  # Test with dot reporter (compact output)
  AG_GRID_VERSION=$VERSION npx cypress run --quiet --reporter dot

  # Result
  if [ $? -eq 0 ]; then
    PASSED_VERSIONS+=("$VERSION")
    echo "✅ Tests PASSED for version $VERSION"
  else
    FAILED_VERSIONS+=("$VERSION")
    echo "❌ Tests FAILED for version $VERSION"
  fi
done

echo ""
echo "══════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "  ✅ Passed: ${PASSED_VERSIONS[*]}"
echo "  ❌ Failed: ${FAILED_VERSIONS[*]}"
echo ""

# Exit with error if any tests failed
if [ ${#FAILED_VERSIONS[@]} -gt 0 ]; then
  exit 1
fi