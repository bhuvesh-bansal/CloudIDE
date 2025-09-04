#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🤖 OpenAI API Key Test');
console.log('======================');

// Load .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    }
    console.log('📁 Loaded .env file');
}

// Check if API key is set
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY environment variable is not set!');
    console.log('');
    console.log('🔧 To fix this:');
    console.log('1. Get your API key from: https://platform.openai.com/api-keys');
    console.log('2. Set the environment variable:');
    console.log('   export OPENAI_API_KEY="your_api_key_here"');
    console.log('3. Or create a .env file in the backend directory:');
    console.log('   echo "OPENAI_API_KEY=your_api_key_here" > .env');
    console.log('');
    process.exit(1);
}

console.log('✅ OPENAI_API_KEY found!');
console.log(`🔑 Key: ${OPENAI_API_KEY.substring(0, 10)}...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}`);

// Test the API
async function testOpenAI() {
    try {
        console.log('\n🧪 Testing OpenAI API...');
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Say 'Hello from OpenAI!' in a creative way"
                }
            ],
            max_tokens: 50,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const result = response.data.choices[0].message.content;
        console.log('✅ OpenAI API test successful!');
        console.log(`🤖 Response: "${result}"`);
        console.log('');
        console.log('🎉 Your OpenAI API key is working correctly!');
        console.log('🚀 You can now start the AI website generator with:');
        console.log('   node server-simple.js');
        
    } catch (error) {
        console.log('❌ OpenAI API test failed!');
        console.log('Error:', error.response?.data?.error?.message || error.message);
        console.log('');
        console.log('🔧 Possible issues:');
        console.log('1. Invalid API key');
        console.log('2. No credits in your OpenAI account');
        console.log('3. Network connectivity issues');
        console.log('');
        console.log('💡 Check your API key at: https://platform.openai.com/api-keys');
    }
}

testOpenAI();
