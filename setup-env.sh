#!/bin/bash

echo "🚀 CloudIDE Environment Setup"
echo "============================="
echo ""

# Check if .env already exists
if [ -f "./backend/.env" ]; then
    echo "✅ .env file already exists in backend directory"
    echo "Current API key status:"
    if grep -q "OPENAI_API_KEY=" ./backend/.env; then
        echo "✅ OPENAI_API_KEY is set in .env file"
    else
        echo "❌ OPENAI_API_KEY is not set in .env file"
    fi
else
    echo "📝 Creating .env file in backend directory..."
    cat > ./backend/.env << EOF
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration  
PORT=3000
NODE_ENV=development
EOF
    echo "✅ Created ./backend/.env file"
fi

echo ""
echo "🔑 To set up your OpenAI API key:"
echo "1. Visit https://platform.openai.com/api-keys"
echo "2. Create a new API key"
echo "3. Edit ./backend/.env and replace 'your_openai_api_key_here' with your actual key"
echo ""
echo "🧪 To test your setup:"
echo "   node test-openai.js"
echo ""
echo "🚀 To start the server:"
echo "   cd backend && npm start"
echo ""
echo "☁️ To deploy to Vercel:"
echo "   cd backend && npx vercel login && npx vercel --prod"
echo ""
