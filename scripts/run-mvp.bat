@echo off
setlocal

cd /d "%~dp0\.."

if "%PORT%"=="" set PORT=3000

echo Starting Lunatics Kitchen MVP on http://localhost:%PORT%
call npm run dev
