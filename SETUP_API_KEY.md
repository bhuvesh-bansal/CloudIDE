# 🔑 OpenAI API Key Setup Guide

## Your CloudIDE Now Supports Both AI and Templates! 

✅ **Template Mode**: Works immediately, no setup required  
🤖 **AI Mode**: Requires OpenAI API key (free $5 credits available)

## 🆓 Get Free OpenAI Credits

### Step 1: Sign Up for OpenAI
1. Visit: https://platform.openai.com/signup
2. Create account with your email
3. **Get $5 in FREE credits** (≈ 1,000-3,000 website generations)
4. Credits are valid for 3 months

### Step 2: Create API Key
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy your API key (starts with `sk-...`)

### Step 3: Add to Your Project

#### For Local Development:
```bash
# Navigate to backend folder
cd /Users/bhuveshbansal/CloudIDE/backend

# Edit the .env file
nano .env

# Replace the placeholder with your actual key:
OPENAI_API_KEY=sk-your-actual-key-here
```

#### For Vercel Deployment:
1. Deploy to Vercel: `cd backend && npx vercel --prod`
2. Go to your Vercel dashboard
3. Select your project → Settings → Environment Variables
4. Add: 
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-key-here`
5. Redeploy: `npx vercel --prod`

## 🎯 What You Get with AI Mode

### Template Mode (Free Forever)
- ✅ 6 professional industry templates
- ✅ Instant generation (0.1 seconds)
- ✅ Unlimited usage
- ✅ No API costs
- ✅ Perfect for testing and demos

### AI Mode (With API Key)
- 🤖 **Custom content** based on your exact prompt
- 🎨 **Unique designs** for each generation
- 🎯 **Industry-specific** styling and features
- 📝 **Tailored copy** that matches your business
- 🌈 **Custom color schemes** and layouts
- 💫 **Advanced features** based on prompts

## 💰 Cost Comparison

| Feature | Template Mode | AI Mode |
|---------|---------------|---------|
| **Setup Time** | 0 minutes | 5 minutes |
| **Cost** | $0 forever | $5 free, then ~$0.002/generation |
| **Generations** | Unlimited | ~1,000-3,000 with free credits |
| **Customization** | Template-based | Fully customized |
| **Quality** | Professional | AI-tailored |

## 🧪 Test Your Setup

### Check API Key Status:
```bash
cd /Users/bhuveshbansal/CloudIDE
node test-openai.js
```

### Start CloudIDE:
```bash
./start-cloudide.sh
```

Open http://localhost:3000 and look for:
- 🟢 **"AI Available"** badge = API key working
- 🟡 **"Templates Only"** badge = No API key (still works great!)

## 🚀 Deployment Options

### Option 1: Deploy with Templates Only (Recommended for Start)
- Deploy immediately to Vercel
- Add API key later when you want AI features
- Users get instant website generation

### Option 2: Deploy with AI from Day 1
- Set up OpenAI API key first
- Deploy with full AI capabilities
- Premium experience from launch

## 🎉 You're All Set!

Your CloudIDE now has:
- ✨ Beautiful Lovable-style interface
- 🔄 Dual-mode generation (AI + Templates)
- 📱 Mobile-responsive design
- 💾 Download functionality
- 🌐 Production-ready deployment

**No matter which mode you choose, your users get professional websites instantly!**

---

*Need help? The template mode works perfectly without any API key setup!* 🚀
