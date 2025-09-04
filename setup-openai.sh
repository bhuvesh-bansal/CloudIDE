#!/bin/bash

echo "🤖 OpenAI API Setup for AI Website Generator"
echo "============================================"
echo ""

# Check if API key is already set
if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "✅ OPENAI_API_KEY is already set!"
    echo "🔑 Key: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -4}"
    echo ""
    echo "🧪 Testing the API key..."
    node test-openai.js
    exit 0
fi

echo "❌ OPENAI_API_KEY is not set"
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "📁 Found .env file, checking for API key..."
    source .env
    if [ ! -z "$OPENAI_API_KEY" ]; then
        echo "✅ Found API key in .env file!"
        echo "🔑 Key: ${OPENAI_API_KEY:0:10}...${OPENAI_API_KEY: -4}"
        echo ""
        echo "🧪 Testing the API key..."
        node test-openai.js
        exit 0
    fi
fi

echo "🔧 Setup Instructions:"
echo ""
echo "1. Get your OpenAI API key:"
echo "   🌐 Visit: https://platform.openai.com/api-keys"
echo "   🔑 Create a new API key"
echo ""
echo "2. Choose one of these setup methods:"
echo ""
echo "   Method A - Environment Variable:"
echo "   export OPENAI_API_KEY=\"your_api_key_here\""
echo ""
echo "   Method B - .env File:"
echo "   echo \"OPENAI_API_KEY=your_api_key_here\" > .env"
echo ""
echo "3. Test the setup:"
echo "   node test-openai.js"
echo ""
echo "4. Start the AI website generator:"
echo "   node server-simple.js"
echo ""

# Ask user if they want to set up now
read -p "Do you have your OpenAI API key ready? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter your OpenAI API key: " api_key
    if [ ! -z "$api_key" ]; then
        echo ""
        echo "Setting up API key..."
        echo "OPENAI_API_KEY=$api_key" > .env
        export OPENAI_API_KEY="$api_key"
        echo "✅ API key saved to .env file and set as environment variable"
        echo ""
        echo "🧪 Testing the API key..."
        node test-openai.js
    else
        echo "❌ No API key provided"
    fi
else
    echo ""
    echo "💡 Come back when you have your API key ready!"
    echo "   You can run this script again anytime."
fi

