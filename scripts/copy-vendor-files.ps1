param (
    [string]$Source = "node_modules",
    [string]$Vendor,
    [string]$FileName,
    [string]$Destination = "assets"
)

# Ensure vendor and filename are provided
if (-not $Vendor -or -not $FileName) {
    Write-Host "Vendor and FileName parameters are required." -ForegroundColor Red
    exit 1
}

# Ensure the source exists
$VendorPath = Join-Path -Path $Source -ChildPath $Vendor
if (-not (Test-Path -Path $VendorPath)) {
    Write-Host "Vendor path '$VendorPath' does not exist." -ForegroundColor Red
    exit 1
}

# Find the file in the vendor directory
$FilePath = Get-ChildItem -Path $VendorPath -Recurse -Filter $FileName -File | Select-Object -ExpandProperty FullName

if (-not $FilePath) {
    Write-Host "File '$FileName' not found in '$VendorPath'." -ForegroundColor Red
    exit 1
}

$ext = [System.IO.Path]::GetExtension($FilePath)

$Destination = Join-Path -Path $Destination -ChildPath $vendor
$Destination = Join-Path -Path $Destination -ChildPath $ext.TrimStart('.')

# Ensure the destination exists
if (-not (Test-Path -Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Copy the file
Copy-Item -Path $FilePath -Destination $Destination -Force

Write-Host "Copied '$FilePath' to '$Destination'." -ForegroundColor Green
