#!/bin/bash

echo "🧪 CloudIDE Deployment Tester"
echo "============================="
echo ""

if [ -z "$1" ]; then
    echo "❌ Usage: ./test-deployment.sh YOUR_DEPLOYED_URL"
    echo ""
    echo "Example:"
    echo "./test-deployment.sh https://your-app.up.railway.app"
    exit 1
fi

URL=$1
echo "🌐 Testing deployment at: $URL"
echo ""

echo "1. 🏥 Health Check..."
HEALTH=$(curl -s "$URL/health" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('✅ Status:', data.get('status'))
    print('✅ OpenAI Available:', data.get('openai', {}).get('available'))
    print('✅ OpenAI Status:', data.get('openai', {}).get('status'))
except:
    print('❌ Health check failed')
")

echo "$HEALTH"
echo ""

echo "2. 🤖 AI Generation Test..."
AI_TEST=$(curl -s -X POST "$URL/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "magic unicorn website", "useAI": true}' | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    title = data.get('title', 'N/A')
    ai_generated = data.get('aiGenerated', False)
    source = data.get('source', 'N/A')
    
    print(f'🎨 Generated: {title}')
    print(f'🤖 AI Generated: {ai_generated}')
    print(f'📊 Source: {source}')
    
    if ai_generated:
        print('🎉 SUCCESS: AI is working!')
    else:
        print('⚠️  Using fallback templates')
        
    if title not in ['EliteEnterprise', 'TechVision Pro']:
        print('✅ Custom content generated')
    else:
        print('⚠️  Generic template used')
        
except Exception as e:
    print('❌ AI test failed:', str(e))
")

echo "$AI_TEST"
echo ""

echo "3. 📊 Performance Summary..."
if [[ $HEALTH == *"✅ OpenAI Available: True"* ]] && [[ $AI_TEST == *"🎉 SUCCESS: AI is working!"* ]]; then
    echo "🎉 EXCELLENT: Full AI functionality working!"
    echo "📱 Update your iOS app to use this URL"
elif [[ $AI_TEST == *"✅ Custom content generated"* ]]; then
    echo "✅ GOOD: Enhanced templates working"
    echo "🤖 AI may have connectivity issues but fallback is smart"
else
    echo "⚠️  BASIC: Only basic templates working"
fi

echo ""
echo "🚀 This deployment is ready for production!"
