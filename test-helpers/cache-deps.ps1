# cache-deps.ps1 - Simple version cache setup

# Get directory of the script itself, regardless of where it's called from
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Configuration file
$CONFIG_FILE = Join-Path $SCRIPT_DIR "..\ag-grid-versions.json"

$PACKAGE_NAME = "ag-grid-community"
$VERSIONS = Get-Content $CONFIG_FILE | ConvertFrom-Json
$CACHE_DIR = Join-Path $SCRIPT_DIR "..\deps-cache"

# Create cache directory
New-Item -ItemType Directory -Force -Path $CACHE_DIR | Out-Null

# Install each version
foreach ($VERSION in $VERSIONS) {
  $VERSION_DIR = "$CACHE_DIR\node_modules\$PACKAGE_NAME-$VERSION"
  
  # Check if already installed
  if (-not (Test-Path "$VERSION_DIR")) {
    Write-Host "Installing $PACKAGE_NAME@$VERSION..."
    
    # Install the package using --prefix flag
    npm install "$PACKAGE_NAME-$VERSION@npm:$PACKAGE_NAME@$VERSION" --save-dev --no-package-lock --prefix "$CACHE_DIR" --no-audit
    
    if ($LASTEXITCODE -eq 0) {
      Write-Host "✅ Cached $PACKAGE_NAME@$VERSION"
    }
    else {
      Write-Host "❌ Failed to cache $PACKAGE_NAME@$VERSION"
    }
  } else {
    Write-Host "Already cached $PACKAGE_NAME@$VERSION"
  }
  Write-Host ""
}

Write-Host "All versions cached successfully in $CACHE_DIR"