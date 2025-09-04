#!/bin/bash

echo "🚀 Deploying Cloud IDE Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
fi

# Start the server
echo "🌟 Starting server..."
npm start
