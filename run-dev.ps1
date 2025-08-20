# This script starts the development servers for both the Psyduck frontend and backend.

# --- Trap for Ctrl+C to ensure the background job is cleaned up ---
trap {
    Write-Host "`nStopping background backend server..." -ForegroundColor Yellow
    # Stop and remove the job gracefully
    Get-Job -Name "BackendServer" | Stop-Job -ErrorAction SilentlyContinue
    Get-Job -Name "BackendServer" | Remove-Job -ErrorAction SilentlyContinue
    # Exit the script
    exit 0
}

Write-Host "--- Psyduck Development Environment Startup ---" -ForegroundColor Green

# --- Backend Setup ---
Write-Host "`n[Backend] Checking dependencies..." -ForegroundColor Cyan
if (-not (Test-Path -Path "backend/node_modules")) {
    Write-Host "[Backend] node_modules not found. Running npm install..."
    npm --prefix backend install
} else {
    Write-Host "[Backend] Dependencies look good."
}

Write-Host "[Backend] Starting server in a background job..." -ForegroundColor Cyan
# Start the backend server as a background job
Start-Job -ScriptBlock { npm --prefix backend start } -Name "BackendServer"
Write-Host "[Backend] Server is running in the background. Use 'Get-Job' and 'Receive-Job' to see details."

# --- Frontend Setup ---
Write-Host "`n[Frontend] Checking dependencies..." -ForegroundColor Cyan
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "[Frontend] node_modules not found. Running npm install..."
    npm install
} else {
    Write-Host "[Frontend] Dependencies look good."
}

Write-Host "`n[Frontend] Starting development server (in foreground)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor Yellow

# Start the frontend server in the current console. The script will pause here.
npm run dev -- --host

# --- Cleanup ---
# This part runs if the frontend process exits without Ctrl+C
Write-Host "`nFrontend server stopped. Cleaning up background backend server." -ForegroundColor Yellow
Get-Job -Name "BackendServer" | Stop-Job -ErrorAction SilentlyContinue
Get-Job -Name "BackendServer" | Remove-Job -ErrorAction SilentlyContinue

Write-Host "All servers stopped. Goodbye!" -ForegroundColor Green
