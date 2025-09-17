#!/bin/bash

echo "🚄 CloudIDE Railway Deployment Script"
echo "===================================="
echo ""

echo "📋 Prerequisites:"
echo "1. Railway account (https://railway.app)"
echo "2. GitHub repository connected"
echo "3. OpenAI API key ready"
echo ""

echo "🚀 Deployment Steps:"
echo ""
echo "1. Go to https://railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose your CloudIDE repository"
echo "5. Set root directory to 'backend'"
echo ""

echo "⚙️ Configuration:"
echo "Build Command: npm install"
echo "Start Command: node simple-server.js"
echo ""

echo "🔐 Environment Variables to add:"
echo "OPENAI_API_KEY = $1"
echo "NODE_ENV = production"
echo ""

if [ -z "$1" ]; then
    echo "❌ Usage: ./deploy-railway.sh YOUR_OPENAI_API_KEY"
    echo ""
    echo "Example:"
    echo "./deploy-railway.sh sk-proj-your-key-here"
    exit 1
fi

echo "✅ Your API key is ready to use: ${1:0:15}..."
echo ""
echo "🎯 After deployment, test with:"
echo "curl https://your-app.up.railway.app/health"
echo ""
echo "📱 Update iOS app with new Railway URL in AppConfig.swift"
echo ""
echo "🎉 Railway typically has much better OpenAI connectivity than Vercel!"
