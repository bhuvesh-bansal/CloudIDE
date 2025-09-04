# 🤖 OpenAI API Setup Guide

## 🚀 How to Enable OpenAI-Powered AI Generation

Your AI website generator is now enhanced with OpenAI integration! Here's how to set it up:

### 📋 Prerequisites
1. **OpenAI Account**: Sign up at [https://platform.openai.com/](https://platform.openai.com/)
2. **API Key**: Get your API key from the OpenAI dashboard

### 🔑 Setting Up Your OpenAI API Key

#### Option 1: Environment Variable (Recommended)
```bash
# Set the environment variable before starting the server
export OPENAI_API_KEY="your_openai_api_key_here"

# Then start the server
cd backend
node server-simple.js
```

#### Option 2: Create .env File
```bash
# Create a .env file in the backend directory
cd backend
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Then start the server
node server-simple.js
```

#### Option 3: Direct Command
```bash
# Start server with API key directly
cd backend
OPENAI_API_KEY="your_openai_api_key_here" node server-simple.js
```

### ✅ Verification
When the server starts, you should see:
```
✅ OpenAI API key found - AI-powered content generation enabled!
```

### 🎯 What OpenAI Enables

With OpenAI integration, your AI system will:

✅ **Generate Creative Titles** - Unique, industry-specific website titles
✅ **Create Compelling Descriptions** - Professional, engaging descriptions
✅ **Generate Custom Features** - AI-powered feature suggestions
✅ **Provide Smart Taglines** - Memorable brand taglines
✅ **Enhanced Content Quality** - More professional and creative content

### 🔄 Fallback System
If OpenAI is not available, the system automatically falls back to:
- Hugging Face AI models
- Enhanced template-based generation
- Industry-specific content templates

### 💰 Cost Information
- OpenAI charges per API call (very affordable for website generation)
- Typical cost: ~$0.01-0.05 per website generation
- You can set usage limits in your OpenAI dashboard

### 🛠️ Troubleshooting

**"OpenAI API key not found"**
- Check that the environment variable is set correctly
- Verify the API key is valid in your OpenAI dashboard
- Restart the server after setting the key

**"OpenAI API Error"**
- Check your API key is correct
- Verify you have credits in your OpenAI account
- Check your internet connection

### 🎉 Ready to Use!
Once you've set up your OpenAI API key, your AI website generator will create much more creative and professional content!

**Example prompts to try:**
- "create a tech startup website for AI solutions"
- "create a photography portfolio website"
- "create a fashion ecommerce website"
- "create a restaurant website with online ordering"

