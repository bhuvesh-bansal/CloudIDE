@echo off
chcp 65001 >nul
echo 🤖 AI Website Generator - One Click Startup
echo ===========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 🔧 Please install Node.js first:
    echo    Visit: https://nodejs.org/
    echo    Download and install the LTS version
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed!
) else (
    echo ✅ Dependencies already installed
)

echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found!
    echo    Make sure you're in the correct project directory
    pause
    exit /b 1
)

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
    echo ✅ Backend dependencies installed!
) else (
    echo ✅ Backend dependencies already installed
)

echo.

REM Start the server
echo 🚀 Starting AI Website Generator...
echo.

REM Use the server with built-in API key
cd backend
node server.js

echo.
echo 🎉 AI Website Generator is running!
echo 🌐 Open your browser and go to: http://localhost:3000
echo.
echo 💡 Try these example prompts:
echo    • 'create a photography portfolio'
echo    • 'build a restaurant website'
echo    • 'design a tech startup website'
echo    • 'make a creative agency website'
echo.
echo 🛑 Press Ctrl+C to stop the server
pause

