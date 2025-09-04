#!/bin/bash

echo "🤖 AI Website Generator - One Click Startup"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "🔧 Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    echo "   Download and install the LTS version"
    echo ""
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi

echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    echo "   Make sure you're in the correct project directory"
    exit 1
fi

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed!"
else
    echo "✅ Backend dependencies already installed"
fi

echo ""

# Start the server
echo "🚀 Starting AI Website Generator..."
echo ""

# Use the server with built-in API key
cd backend
node server.js

echo ""
echo "🎉 AI Website Generator is running!"
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "💡 Try these example prompts:"
echo "   • 'create a photography portfolio'"
echo "   • 'build a restaurant website'"
echo "   • 'design a tech startup website'"
echo "   • 'make a creative agency website'"
echo ""
echo "🛑 Press Ctrl+C to stop the server"

