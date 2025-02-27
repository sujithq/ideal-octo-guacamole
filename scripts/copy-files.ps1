# List of vendors and files to copy
$filesToCopy = @(
    @{ Vendor = "aos"; FileName = "dist/aos.js"; Destination = "assets/vendor/aos/js" ; Source = "node_modules" }
    @{ Vendor = "aos"; FileName = "dist/aos.css"; Destination = "assets/vendor/aos/css" ; Source = "node_modules" }
    @{ Vendor = "bootstrap"; FileName = "dist/js/bootstrap.bundle.min.js"; Destination = "assets/vendor/bootstrap/js" ; Source = "node_modules" }
    @{ Vendor = "swiper"; FileName = "swiper-bundle.min.js"; Destination = "assets/vendor/swiper/js" ; Source = "node_modules" }
    @{ Vendor = "swiper"; FileName = "swiper-bundle.min.css"; Destination = "assets/vendor/swiper/css" ; Source = "node_modules" }
    @{ Vendor = "bootstrap-icons"; FileName = "font/fonts/bootstrap-icons.woff"; Destination = "static/scss/fonts" ; Source = "node_modules" }
    @{ Vendor = "bootstrap-icons"; FileName = "font/fonts/bootstrap-icons.woff2"; Destination = "static/scss/fonts" ; Source = "node_modules" }
)

# Import the function
function Copy-NodeModuleFile {
    param (
        [string]$Source,
        [string]$Vendor,
        [string]$FileName,
        [string]$Destination
    )


    # Ensure vendor and filename are provided
    if (-not $Vendor -or -not $FileName -or -not $Source -or -not $Destination) {
        Write-Host "Source, Vendor FileName and Destination parameters are required." -ForegroundColor Red
        return
    }
    else {
        Write-Host "Copying $Source/$Vendor/$FileName to $Destination ..." -ForegroundColor Yellow
    }

    # Ensure the source exists
    $VendorPath = Join-Path -Path $Source -ChildPath $Vendor
    if (-not (Test-Path -Path $VendorPath)) {
        Write-Host "Vendor path '$VendorPath' does not exist." -ForegroundColor Red
        return
    }
    else {
        Write-Host "Vendor path '$VendorPath' exists." -ForegroundColor Yellow
    }

    $sourcefile = Join-Path -Path $Source -ChildPath $Vendor
    $sourcefile = Join-Path -Path $sourcefile -ChildPath $FileName

    if (-not (Test-Path -Path $sourcefile)) {
        Write-Host "Source file '$sourcefile' does not exist." -ForegroundColor Red
        return        
    }
    else {
        Write-Host "Source file '$sourcefile' exists." -ForegroundColor Yellow
    }

    # Ensure the destination exists
    if (-not (Test-Path -Path $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }
    # Copy the file
    Copy-Item -Path $sourcefile -Destination $Destination -Force

    Write-Host "Copied '$sourcefile' to '$Destination'." -ForegroundColor Green

}


# Loop through each entry and call Copy-NodeModuleFile
foreach ($entry in $filesToCopy) {
    Write-Host "Processing: $($entry.Vendor)/$($entry.FileName)..."
    Copy-NodeModuleFile -Vendor $entry.Vendor -FileName $entry.FileName -Destination $entry.Destination -Source $entry.Source
}

Write-Host "All files copied successfully!" -ForegroundColor Green
