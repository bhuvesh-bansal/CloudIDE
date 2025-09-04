@echo off
echo 🤖 AI Website Generator - One-Click Startup
echo ===========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting AI Website Generator App...
echo 🌐 The app will open automatically in your browser
echo 📝 Press Ctrl+C to stop the app
echo.

REM Start the app
npm start

pause
