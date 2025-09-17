#!/bin/bash

echo "🚀 Starting CloudIDE..."
echo "======================"
echo ""

# Kill any existing processes
pkill -f "node simple-server.js" 2>/dev/null || true

# Navigate to backend
cd backend

echo "📦 Installing dependencies (if needed)..."
npm install --silent

echo ""
echo "🌐 Starting CloudIDE server..."
echo "✅ No API key required"
echo "🎨 Beautiful web interface ready"
echo "⚡ Instant website generation"
echo ""

# Start the server
node simple-server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

echo "🎉 CloudIDE is running!"
echo ""
echo "📱 Open in browser: http://localhost:3000"
echo "🔗 API Health Check: http://localhost:3000/health"
echo "📊 API Stats: http://localhost:3000/api/stats"
echo ""
echo "💡 Features:"
echo "   • Side-by-side prompt and preview (like Lovable)"
echo "   • Professional responsive websites"
echo "   • 6 industry templates (Tech, Business, Restaurant, etc.)"
echo "   • Download generated HTML files"
echo "   • Mobile-friendly interface"
echo ""
echo "🛑 To stop: Press Ctrl+C or run: pkill -f 'node simple-server.js'"
echo ""

# Keep script running
wait $SERVER_PID
