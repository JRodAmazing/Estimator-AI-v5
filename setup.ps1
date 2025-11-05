<#
  Estimator AI V5 - Quick Open + Environment Check + Auto Launch Script
  ---------------------------------------------------------------------
  Opens all key project files and folders in VS Code and Explorer,
  verifies environment setup, and auto-launches your Discord bot.
  Run this from the project root:
      .\setup.ps1
#>

# Stop on error
$ErrorActionPreference = "Stop"

# Change to the directory containing this script
Set-Location -Path $PSScriptRoot

# --- Environment Verification ---
Write-Host "`n🧩 Checking environment..." -ForegroundColor Cyan

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = (node -v)
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = (npm -v)
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found. Install Node.js which includes npm." -ForegroundColor Red
    exit 1
}

# Check for nodemon (optional)
if (Get-Command nodemon -ErrorAction SilentlyContinue) {
    Write-Host "✅ nodemon detected (auto-restart available)" -ForegroundColor Green
} else {
    Write-Host "⚠️ nodemon not installed. To enable auto-restart, run: npm install -g nodemon" -ForegroundColor Yellow
}

# --- Launch Workspace ---
Write-Host "`n🚀 Launching Estimator AI V5 Workspace..." -ForegroundColor Cyan

# === Open core folders in VS Code ===
code .                           # open full project
code .\commands\                 # command modules
code .\modules\                  # logic modules
code .\data\                     # data storage

# === Open key files ===
code .\index.js
code .\modules\supplierSync.js
code .\modules\learning.js
code .\modules\scheduler.js
code .\commands\sync.js
code .env

# === Optionally open File Explorer windows ===
if (Test-Path .\data) { ii .\data }
if (Test-Path .\templates) { ii .\templates }

# --- Auto-Launch Bot ---
Write-Host "`n🤖 Starting Estimator AI V5 Discord Bot..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PSScriptRoot`"; node index.js"

Write-Host "`n✅  Project files opened and bot launched successfully!" -ForegroundColor Green
