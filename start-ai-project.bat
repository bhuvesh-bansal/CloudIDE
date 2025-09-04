@echo off
echo 🤖 AI Website Generator - Auto Startup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: npm is not installed!
    echo Please install npm or use a Node.js installer that includes npm
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

REM Navigate to backend directory and install dependencies
echo 📁 Setting up backend...
cd backend

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found in backend directory!
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
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

REM Go back to root directory
cd ..

echo.
echo 🚀 Launching AI Website Generator...
echo.

REM Start the app launcher
node launch-ai-app.js

pause
