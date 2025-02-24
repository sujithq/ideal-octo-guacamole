# Define source and destination paths
$sourceDir = "node_modules"
$destDir = "assets/js"

# Ensure the destination directory exists
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# List of JavaScript files to copy
$filesToCopy = @(
    "bootstrap/dist/js/bootstrap.bundle.min.js"
    # "jquery/dist/jquery.min.js"
)

# Copy each file
foreach ($file in $filesToCopy) {
    $sourceFile = Join-Path $sourceDir $file
    $destinationFile = Join-Path $destDir (Split-Path -Leaf $file)

    if (Test-Path $sourceFile) {
        Copy-Item -Path $sourceFile -Destination $destinationFile -Force
        Write-Host "Copied: $sourceFile -> $destinationFile"
    } else {
        Write-Host "Warning: File not found - $sourceFile"
    }
}

Write-Host "✅ All scripts copied successfully!"
