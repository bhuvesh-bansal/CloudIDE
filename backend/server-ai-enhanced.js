const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hugging Face API Configuration
const HF_API_URL = "https://api-inference.huggingface.co/models/";
const HF_API_KEY = "hf_demo"; // Free demo key - you can get your own at huggingface.co

// AI Models for different tasks
const AI_MODELS = {
    textGeneration: "gpt2", // Free text generation
    summarization: "facebook/bart-large-cnn", // Free summarization
    sentiment: "cardiffnlp/twitter-roberta-base-sentiment-latest", // Free sentiment analysis
    classification: "facebook/bart-large-mnli" // Free classification
};

// Enhanced AI-powered content generation
async function generateAIContent(prompt, industry, intent) {
    try {
        console.log(`[AI] Generating content for: ${industry} - ${intent}`);
        
        // Generate dynamic title using AI
        const titlePrompt = `Generate a creative, professional title for a ${industry} ${intent} website. Make it catchy and modern.`;
        const title = await generateWithAI(titlePrompt, AI_MODELS.textGeneration);
        
        // Generate dynamic description using AI
        const descPrompt = `Write a compelling description for a ${industry} ${intent} website. Make it professional and engaging.`;
        const description = await generateWithAI(descPrompt, AI_MODELS.textGeneration);
        
        // Generate about section using AI
        const aboutPrompt = `Write a professional about section for a ${industry} ${intent} company. Include their expertise and value proposition.`;
        const about = await generateWithAI(aboutPrompt, AI_MODELS.textGeneration);
        
        // Generate features using AI
        const featuresPrompt = `Generate 4 professional features for a ${industry} ${intent} website. Format as JSON with icon, title, and description.`;
        const features = await generateWithAI(featuresPrompt, AI_MODELS.textGeneration);
        
        return {
            title: title || `${industry.charAt(0).toUpperCase() + industry.slice(1)} - ${intent.charAt(0).toUpperCase() + intent.slice(1)}`,
            description: description || `Professional ${industry} ${intent} services and solutions.`,
            about: about || `We are a leading ${industry} ${intent} company specializing in innovative solutions.`,
            features: parseFeatures(features) || generateDefaultFeatures(industry, intent)
        };
    } catch (error) {
        console.log(`[AI] Error generating content: ${error.message}`);
        return generateFallbackContent(industry, intent);
    }
}

// AI-powered text generation
async function generateWithAI(prompt, model) {
    try {
        const response = await axios.post(
            `${HF_API_URL}${model}`,
            {
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    temperature: 0.7,
                    do_sample: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        if (response.data && response.data[0] && response.data[0].generated_text) {
            return response.data[0].generated_text.replace(prompt, '').trim();
        }
        return null;
    } catch (error) {
        console.log(`[AI] API Error for ${model}: ${error.message}`);
        return null;
    }
}

// Parse AI-generated features
function parseFeatures(featuresText) {
    try {
        // Try to extract JSON-like structure
        const jsonMatch = featuresText.match(/\[.*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        // Fallback: parse text-based features
        const lines = featuresText.split('\n').filter(line => line.trim());
        const features = [];
        
        for (let i = 0; i < Math.min(4, lines.length); i++) {
            const line = lines[i];
            const icon = getRandomIcon();
            const title = line.split(':')[0] || line.split('-')[0] || `Feature ${i + 1}`;
            const description = line.split(':')[1] || line.split('-')[1] || line;
            
            features.push({
                icon: icon,
                title: title.trim(),
                description: description.trim()
            });
        }
        
        return features;
    } catch (error) {
        console.log(`[AI] Error parsing features: ${error.message}`);
        return null;
    }
}

// Get random emoji icon
function getRandomIcon() {
    const icons = ['🚀', '💡', '⚡', '🎯', '🌟', '💎', '🔥', '✨', '🎨', '📱', '💻', '🌐', '🔒', '📊', '🤝', '🎪'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// Generate default features if AI fails
function generateDefaultFeatures(industry, intent) {
    const featureTemplates = {
        technology: [
            { icon: '🚀', title: 'Innovation', description: 'Cutting-edge technology solutions' },
            { icon: '💻', title: 'Development', description: 'Custom software development' },
            { icon: '📱', title: 'Mobile', description: 'Mobile-first approach' },
            { icon: '⚡', title: 'Performance', description: 'High-performance systems' }
        ],
        photography: [
            { icon: '📸', title: 'Professional Photography', description: 'Expert photography services' },
            { icon: '🎨', title: 'Creative Editing', description: 'Professional photo editing' },
            { icon: '🌟', title: 'Portrait Sessions', description: 'Beautiful portrait photography' },
            { icon: '💫', title: 'Event Coverage', description: 'Comprehensive event photography' }
        ],
        fashion: [
            { icon: '👗', title: 'Trendy Fashion', description: 'Latest fashion trends' },
            { icon: '🛍️', title: 'Online Shopping', description: 'Convenient online store' },
            { icon: '💳', title: 'Secure Payments', description: 'Safe payment options' },
            { icon: '📱', title: 'Mobile App', description: 'Mobile shopping experience' }
        ]
    };
    
    return featureTemplates[industry] || featureTemplates.technology;
}

// Generate fallback content
function generateFallbackContent(industry, intent) {
    return {
        title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} - ${intent.charAt(0).toUpperCase() + intent.slice(1)}`,
        description: `Professional ${industry} ${intent} services and solutions.`,
        about: `We are a leading ${industry} ${intent} company specializing in innovative solutions.`,
        features: generateDefaultFeatures(industry, intent)
    };
}

// Enhanced prompt analysis with AI
async function analyzePromptWithAI(prompt) {
    try {
        console.log(`[AI] Analyzing prompt: ${prompt}`);
        
        // Use AI to classify the prompt
        const classificationPrompt = `Classify this website request: "${prompt}". 
        Industry options: technology, photography, fashion, food, travel, business, healthcare, education, finance
        Intent options: portfolio, ecommerce, business, blog, startup
        
        Respond with only: industry:intent`;
        
        const aiAnalysis = await generateWithAI(classificationPrompt, AI_MODELS.classification);
        
        if (aiAnalysis) {
            const [industry, intent] = aiAnalysis.split(':');
            if (industry && intent) {
                return { industry: industry.trim(), intent: intent.trim() };
            }
        }
    } catch (error) {
        console.log(`[AI] Error in prompt analysis: ${error.message}`);
    }
    
    // Fallback to rule-based analysis
    return analyzePrompt(prompt);
}

// Rule-based prompt analysis (fallback)
function analyzePrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Industry detection
    let industry = 'business';
    if (lowerPrompt.includes('technology') || lowerPrompt.includes('tech') || lowerPrompt.includes('software')) industry = 'technology';
    if (lowerPrompt.includes('photography') || lowerPrompt.includes('photo') || lowerPrompt.includes('camera')) industry = 'photography';
    if (lowerPrompt.includes('fashion') || lowerPrompt.includes('clothing') || lowerPrompt.includes('style')) industry = 'fashion';
    if (lowerPrompt.includes('food') || lowerPrompt.includes('restaurant') || lowerPrompt.includes('cafe')) industry = 'food';
    if (lowerPrompt.includes('travel') || lowerPrompt.includes('tourism') || lowerPrompt.includes('vacation')) industry = 'travel';
    if (lowerPrompt.includes('health') || lowerPrompt.includes('medical') || lowerPrompt.includes('healthcare')) industry = 'healthcare';
    if (lowerPrompt.includes('education') || lowerPrompt.includes('learning') || lowerPrompt.includes('course')) industry = 'education';
    if (lowerPrompt.includes('finance') || lowerPrompt.includes('bank') || lowerPrompt.includes('investment')) industry = 'finance';
    
    // Intent detection
    let intent = 'business';
    if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('showcase') || lowerPrompt.includes('resume')) intent = 'portfolio';
    if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce')) intent = 'ecommerce';
    if (lowerPrompt.includes('blog') || lowerPrompt.includes('news') || lowerPrompt.includes('article')) intent = 'blog';
    if (lowerPrompt.includes('startup') || lowerPrompt.includes('company')) intent = 'startup';
    
    return { industry, intent };
}

// Enhanced website generation with AI
async function generateEnhancedWebsite(prompt) {
    try {
        console.log(`[INFO] Generating enhanced website with AI for: ${prompt}`);
        
        // Analyze prompt with AI
        const analysis = await analyzePromptWithAI(prompt);
        console.log(`[AI] Analysis result:`, analysis);
        
        // Generate AI-powered content
        const aiContent = await generateAIContent(prompt, analysis.industry, analysis.intent);
        console.log(`[AI] Generated content:`, aiContent);
        
        // Choose layout based on analysis
        const layoutType = chooseLayoutType(analysis.industry, analysis.intent);
        console.log(`[AI] Selected layout: ${layoutType}`);
        
        // Generate the website
        const html = generateDynamicWebsite(prompt, analysis, aiContent, layoutType);
        
        return {
            id: Date.now().toString(),
            html: html,
            prompt: prompt,
            createdAt: new Date().toISOString(),
            message: "AI-Enhanced website generated successfully! 🚀",
            aiAnalysis: analysis,
            aiContent: aiContent
        };
    } catch (error) {
        console.log(`[ERROR] Website generation failed: ${error.message}`);
        throw error;
    }
}

// Layout selection
function chooseLayoutType(industry, intent) {
    if (intent === 'portfolio') return 'portfolio';
    if (intent === 'ecommerce') return 'ecommerce';
    if (intent === 'blog') return 'creative';
    if (industry === 'fashion' || industry === 'food') return 'creative';
    if (industry === 'technology' && intent === 'startup') return 'creative';
    return 'business';
}

// Dynamic website generation
function generateDynamicWebsite(prompt, analysis, content, layoutType) {
    switch (layoutType) {
        case 'portfolio': return generatePortfolioLayout(prompt, analysis, content);
        case 'ecommerce': return generateEcommerceLayout(prompt, analysis, content);
        case 'creative': return generateCreativeLayout(prompt, analysis, content);
        case 'business': return generateBusinessLayout(prompt, analysis, content);
        default: return generateBusinessLayout(prompt, analysis, content);
    }
}

// Portfolio Layout
function generatePortfolioLayout(prompt, analysis, content) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #1e293b; 
            line-height: 1.6; 
        }
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }
        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            padding: 2rem;
        }
        .hero h1 { 
            font-size: 4rem; 
            margin-bottom: 1rem;
            font-weight: 700;
            animation: fadeInUp 1s ease;
        }
        .hero p {
            font-size: 1.5rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease 0.2s both;
            margin-bottom: 2rem;
        }
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .portfolio-item {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .portfolio-item:hover {
            transform: translateY(-10px);
        }
        .portfolio-image {
            height: 250px;
            background: linear-gradient(45deg, #6366f1, #4f46e5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
        }
        .portfolio-content {
            padding: 2rem;
        }
        .portfolio-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #6366f1;
        }
        .btn {
            display: inline-block;
            background: #6366f1;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 30px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    </style>
</head>
<body>
    <div class="hero">
        <div class="hero-content">
            <h1>${content.title}</h1>
            <p>${content.description}</p>
            <button class="btn" onclick="scrollToPortfolio()">View My Work</button>
        </div>
    </div>
    
    <div class="portfolio-grid">
        ${content.features.map(feature => `
        <div class="portfolio-item">
            <div class="portfolio-image">${feature.icon}</div>
            <div class="portfolio-content">
                <div class="portfolio-title">${feature.title}</div>
                <p>${feature.description}</p>
            </div>
        </div>
        `).join('')}
    </div>
    
    <script>
        function scrollToPortfolio() {
            document.querySelector('.portfolio-grid').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>`;
}

// Ecommerce Layout
function generateEcommerceLayout(prompt, analysis, content) {
    const colors = {
        fashion: { primary: '#ec4899', secondary: '#fdf2f8', text: '#831843' },
        food: { primary: '#f59e0b', secondary: '#fffbeb', text: '#92400e' },
        default: { primary: '#6366f1', secondary: '#f8fafc', text: '#1e293b' }
    };
    
    const theme = colors[analysis.industry] || colors.default;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: ${theme.secondary};
            color: ${theme.text}; 
        }
        .navbar {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${theme.primary};
        }
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        .nav-links a {
            text-decoration: none;
            color: ${theme.text};
            font-weight: 500;
        }
        .hero {
            background: linear-gradient(135deg, ${theme.primary}, ${theme.primary}dd);
            color: white;
            padding: 6rem 2rem;
            text-align: center;
        }
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
        }
        .product-image {
            height: 200px;
            background: ${theme.secondary};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        .product-info {
            padding: 1.5rem;
        }
        .product-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .btn {
            background: ${theme.primary};
            color: white;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo">${content.title.split(' - ')[0]}</div>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#products">Products</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </div>
    </nav>
    
    <div class="hero">
        <h1>${content.title}</h1>
        <p>${content.description}</p>
    </div>
    
    <div class="products-grid">
        ${content.features.map(feature => `
        <div class="product-card">
            <div class="product-image">${feature.icon}</div>
            <div class="product-info">
                <div class="product-title">${feature.title}</div>
                <p>${feature.description}</p>
                <button class="btn">Learn More</button>
            </div>
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}

// Business Layout
function generateBusinessLayout(prompt, analysis, content) {
    const colors = {
        technology: { primary: '#3b82f6', secondary: '#dbeafe' },
        healthcare: { primary: '#10b981', secondary: '#d1fae5' },
        finance: { primary: '#f59e0b', secondary: '#fef3c7' },
        default: { primary: '#6366f1', secondary: '#e0e7ff' }
    };
    
    const theme = colors[analysis.industry] || colors.default;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #1e293b; 
            line-height: 1.6; 
        }
        .header {
            background: ${theme.primary};
            color: white;
            text-align: center;
            padding: 4rem 2rem;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${theme.primary}88, ${theme.primary}44);
            animation: pulse 2s ease-in-out infinite alternate;
        }
        .header-content {
            position: relative;
            z-index: 1;
        }
        .header h1 { 
            font-size: 3.5rem; 
            margin-bottom: 1rem;
            font-weight: 700;
            animation: fadeInUp 1s ease;
        }
        .header p {
            font-size: 1.3rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease 0.2s both;
            max-width: 600px;
            margin: 0 auto;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem; 
        }
        .section {
            background: white;
            margin: 2rem 0;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            animation: fadeInUp 1s ease;
        }
        .section:hover { transform: translateY(-5px); }
        .section h2 {
            color: ${theme.primary};
            margin-bottom: 2rem;
            font-size: 2.5rem;
            font-weight: 600;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .feature-card {
            background: #f1f5f9;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
            border-left: 4px solid ${theme.primary};
        }
        .feature-card:hover { transform: scale(1.05); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: ${theme.primary};
        }
        .btn {
            display: inline-block;
            background: ${theme.primary};
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 30px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #1e293b;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: ${theme.primary};
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .section { padding: 2rem; }
            .features-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>${content.title}</h1>
            <p>${content.description}</p>
        </div>
    </div>
    
    <div class="container">
        <div class="section">
            <h2>About ${content.title.split(' - ')[0]}</h2>
            <p>${content.about}</p>
            
            <div class="features-grid">
                ${content.features.map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">${feature.icon}</div>
                    <div class="feature-title">${feature.title}</div>
                    <p>${feature.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>Get In Touch</h2>
            <div class="contact-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your.email@example.com">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea rows="4" placeholder="Tell us about your project or inquiry"></textarea>
                </div>
                <button class="btn" onclick="submitForm()">Send Message</button>
            </div>
        </div>
    </div>
    
    <script>
        function submitForm() {
            alert('Thank you for your message! We will get back to you soon.');
        }
        
        // Add interactive animations
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.section');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });
            
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            });
        });
    </script>
</body>
</html>`;
}

// Creative Layout
function generateCreativeLayout(prompt, analysis, content) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f172a;
            color: #e2e8f0; 
            line-height: 1.6; 
        }
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.3"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.3"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
            animation: twinkle 3s ease-in-out infinite;
        }
        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            padding: 2rem;
        }
        .hero h1 { 
            font-size: 4rem; 
            margin-bottom: 1rem;
            font-weight: 700;
            animation: fadeInUp 1s ease;
            background: linear-gradient(45deg, #fff, #e2e8f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.5rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease 0.2s both;
            margin-bottom: 2rem;
        }
        .creative-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .creative-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .creative-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .creative-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
        }
        .creative-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-align: center;
            color: #667eea;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 30px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
    </style>
</head>
<body>
    <div class="hero">
        <div class="hero-content">
            <h1>${content.title}</h1>
            <p>${content.description}</p>
            <button class="btn" onclick="scrollToContent()">Explore</button>
        </div>
    </div>
    
    <div class="creative-grid">
        ${content.features.map(feature => `
        <div class="creative-item">
            <div class="creative-icon">${feature.icon}</div>
            <div class="creative-title">${feature.title}</div>
            <p>${feature.description}</p>
        </div>
        `).join('')}
    </div>
    
    <script>
        function scrollToContent() {
            document.querySelector('.creative-grid').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>`;
}

// API Routes
app.post('/api/generate', async (req, res) => {
    try {
        console.log('[INFO] 🎯 Generate API called');
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        console.log('[INFO] Generating website for prompt:', { prompt });
        
        const result = await generateEnhancedWebsite(prompt);
        
        console.log('[INFO] ✅ Website generated successfully', {
            id: result.id,
            prompt: result.prompt
        });
        
        res.json(result);
    } catch (error) {
        console.log('[ERROR] Website generation failed:', error.message);
        res.status(500).json({ error: 'Failed to generate website', details: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI-Enhanced Website Generator is running! 🚀' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI-Enhanced Website Generator running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🎯 Generate API: http://localhost:${PORT}/api/generate`);
    console.log(`🤖 Using Hugging Face AI models for enhanced content generation`);
});

// Error handling
process.on('uncaughtException', (error) => {
    console.log('[ERROR] Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
});
