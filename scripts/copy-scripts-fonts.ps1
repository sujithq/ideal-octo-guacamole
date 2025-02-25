# Define source and destination paths
$sourceDir = "node_modules"
$destDir = "static/scss/fonts"

# Ensure the destination directory exists
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# List of fonts files to copy
$filesToCopy = @(
    "bootstrap-icons/font/fonts/bootstrap-icons.woff",
    "bootstrap-icons/font/fonts/bootstrap-icons.woff2"
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
