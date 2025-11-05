# Cleanup Script for Estimator AI v5
# Removes duplicate files that are already in /commands/ or /modules/

Write-Host "Cleaning up project..." -ForegroundColor Cyan

# Files to remove (duplicates that exist in proper directories)
$filesToRemove = @(
    "actual.js",
    "change.js", 
    "chat.js",
    "design.js",
    "estimate.js",
    "export.js",
    "export_alpine.js",
    "help.js",
    "learning.js",
    "pdfreport.js",
    "projects.js",
    "refresh_prices.js",
    "remember.js",
    "report.js",
    "revisionreport.js",
    "revisionReportGenerator.js",
    "scheduler.js",
    "supplierSync.js",
    "sync_prices.js",
    "takeoff.js",
    "trend.js"
)

$removedCount = 0

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed: $file" -ForegroundColor Green
        $removedCount++
    }
}

# Remove old portfolio exports
if (Test-Path "Portfolio_2025-10-13T04-57-11-011Z") {
    Remove-Item "Portfolio_2025-10-13T04-57-11-011Z" -Recurse -Force
    Write-Host "Removed: Portfolio_2025-10-13T04-57-11-011Z" -ForegroundColor Green
    $removedCount++
}

if (Test-Path "Portfolio_2025-10-13T04-59-04-805Z") {
    Remove-Item "Portfolio_2025-10-13T04-59-04-805Z" -Recurse -Force
    Write-Host "Removed: Portfolio_2025-10-13T04-59-04-805Z" -ForegroundColor Green
    $removedCount++
}

if (Test-Path "Portfolio_2025-10-13T04-59-04-805Z.zip") {
    Remove-Item "Portfolio_2025-10-13T04-59-04-805Z.zip" -Force
    Write-Host "Removed: Portfolio_2025-10-13T04-59-04-805Z.zip" -ForegroundColor Green
    $removedCount++
}

# Remove stray files
if (Test-Path "projects.json") {
    Remove-Item "projects.json" -Force
    Write-Host "Removed: projects.json (moved to data/)" -ForegroundColor Green
    $removedCount++
}

if (Test-Path "optimize.js") {
    Remove-Item "optimize.js" -Force
    Write-Host "Removed: optimize.js" -ForegroundColor Green
    $removedCount++
}

if (Test-Path "server_disabled.js") {
    Remove-Item "server_disabled.js" -Force
    Write-Host "Removed: server_disabled.js" -ForegroundColor Green
    $removedCount++
}

Write-Host ""
Write-Host "Cleanup complete! Removed $removedCount items." -ForegroundColor Cyan
Write-Host "All commands are now in /commands/" -ForegroundColor Yellow
Write-Host "All modules are now in /modules/" -ForegroundColor Yellow
