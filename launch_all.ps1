<#
  Estimator AI V5 - Dual Launcher
  -------------------------------
  Starts both the Mock Supplier API and the Discord Bot in separate
  PowerShell windows. Run from project root:
      .\launch_all.ps1
#>

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "`n🚀 Launching Estimator AI V5 environment..." -ForegroundColor Cyan

# --- Verify Node.js installed ---
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# --- Start Mock API ---
Write-Host "🧩 Starting Mock Supplier API on port 5055..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PSScriptRoot`"; npm run mock-api"

# --- Delay to ensure API starts ---
Start-Sleep -Seconds 2

# --- Start Bot ---
Write-Host "🤖 Starting Estimator AI V5 Discord Bot..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PSScriptRoot`"; npm run dev"

Write-Host "`n✅  Both Mock API and Discord Bot launched successfully!" -ForegroundColor Green
