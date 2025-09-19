const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
const axios = require('axios');
const { getWebsiteImageSet, generateImageHTML, getRandomImage, getRandomImages, imageCategories } = require('./image-manager');
const { 
    generateRestaurantWebsite,
    generatePortfolioWebsite, 
    generateHealthcareWebsite,
    generateTechWebsite,
    generateEcommerceWebsite,
    generatePersonalWebsite,
    generateBusinessWebsite 
} = require('./specialized-templates');
const { generateMultiPageWebsite } = require('./page-by-page-generator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
let openai = null;
let hasOpenAI = false;

if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        hasOpenAI = true;
        console.log('✅ OpenAI initialized successfully');
    } catch (error) {
        console.log('❌ OpenAI initialization failed:', error.message);
        hasOpenAI = false;
    }
} else {
    console.log('⚠️ No OpenAI API key found, using template fallback only');
    hasOpenAI = false;
}

// Template definitions (20+ diverse templates)
const templates = {
    // Technology Templates
    technology: {
        title: 'TechVision Pro',
        description: 'Innovative technology solutions for modern businesses',
        tagline: 'Innovation Meets Excellence',
        features: ['Cloud Solutions', 'AI Integration', 'Data Analytics', 'Cybersecurity', 'Mobile Development', 'IoT Solutions'],
        colors: { primary: '#667eea', secondary: '#764ba2', accent: '#ff6b6b' }
    },
    startup: {
        title: 'InnovateHub',
        description: 'Disruptive startup accelerating digital transformation',
        tagline: 'Disrupting Tomorrow',
        features: ['MVP Development', 'Scalable Architecture', 'Growth Hacking', 'Investor Relations', 'Market Analysis', 'Product Strategy'],
        colors: { primary: '#ff6b6b', secondary: '#ee5a24', accent: '#667eea' }
    },
    saas: {
        title: 'CloudFlow SaaS',
        description: 'Streamlined software solutions for enterprise efficiency',
        tagline: 'Efficiency Redefined',
        features: ['API Management', 'Real-time Analytics', 'Team Collaboration', 'Automated Workflows', 'Security Compliance', 'Custom Integrations'],
        colors: { primary: '#00d2d3', secondary: '#01a3a4', accent: '#ff9ff3' }
    },

    // Business Templates
    business: {
        title: 'EliteEnterprise',
        description: 'Strategic business solutions driving sustainable growth',
        tagline: 'Excellence in Every Detail',
        features: ['Strategic Planning', 'Operations Management', 'Financial Advisory', 'Market Expansion', 'Digital Transformation', 'Leadership Development'],
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' }
    },
    consulting: {
        title: 'Strategic Advisors',
        description: 'Expert consulting services for business transformation',
        tagline: 'Strategy That Delivers',
        features: ['Business Strategy', 'Process Optimization', 'Change Management', 'Performance Analytics', 'Risk Assessment', 'Growth Planning'],
        colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#f39c12' }
    },
    marketing: {
        title: 'BrandBoost Agency',
        description: 'Creative marketing solutions that drive results',
        tagline: 'Amplify Your Brand',
        features: ['Brand Strategy', 'Digital Marketing', 'Content Creation', 'Social Media', 'SEO Optimization', 'Analytics & Reporting'],
        colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#3498db' }
    },

    // Food & Hospitality Templates
    restaurant: {
        title: 'Gourmet Garden',
        description: 'Farm-to-table dining experience with seasonal specialties',
        tagline: 'Fresh. Local. Exceptional.',
        features: ['Seasonal Menu', 'Wine Pairing', 'Private Events', 'Catering Services', 'Chef\'s Table', 'Cooking Classes'],
        colors: { primary: '#e67e22', secondary: '#d35400', accent: '#27ae60' }
    },
    cafe: {
        title: 'Artisan Coffee House',
        description: 'Handcrafted coffee and artisanal pastries in a cozy atmosphere',
        tagline: 'Crafted with Passion',
        features: ['Specialty Coffee', 'Fresh Pastries', 'WiFi Workspace', 'Live Music', 'Coffee Beans', 'Barista Training'],
        colors: { primary: '#8b4513', secondary: '#654321', accent: '#daa520' }
    },
    bakery: {
        title: 'Golden Crust Bakery',
        description: 'Traditional baking methods creating exceptional breads and pastries',
        tagline: 'Baked Fresh Daily',
        features: ['Artisan Breads', 'Custom Cakes', 'Wedding Cakes', 'Pastries', 'Gluten-Free Options', 'Catering'],
        colors: { primary: '#daa520', secondary: '#b8860b', accent: '#ff6347' }
    },

    // Healthcare Templates
    healthcare: {
        title: 'HealthCare Plus',
        description: 'Comprehensive medical services with patient-centered care',
        tagline: 'Your Health, Our Priority',
        features: ['Primary Care', 'Specialist Consultations', 'Diagnostic Services', 'Preventive Care', 'Emergency Services', 'Telemedicine'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#e74c3c' }
    },
    dental: {
        title: 'Bright Smile Dental',
        description: 'Advanced dental care with gentle, personalized treatment',
        tagline: 'Smile with Confidence',
        features: ['General Dentistry', 'Cosmetic Procedures', 'Orthodontics', 'Oral Surgery', 'Preventive Care', 'Emergency Dental'],
        colors: { primary: '#00bcd4', secondary: '#0097a7', accent: '#4caf50' }
    },
    fitness: {
        title: 'FitLife Fitness',
        description: 'Complete fitness solutions for a healthier lifestyle',
        tagline: 'Transform Your Life',
        features: ['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Fitness Assessments', 'Recovery Services', 'Online Programs'],
        colors: { primary: '#ff5722', secondary: '#e64a19', accent: '#4caf50' }
    },

    // Creative Templates
    portfolio: {
        title: 'Creative Portfolio',
        description: 'Showcasing innovative design and creative excellence',
        tagline: 'Creativity Unleashed',
        features: ['Web Design', 'Brand Identity', 'Photography', 'Digital Art', 'UI/UX Design', 'Creative Direction'],
        colors: { primary: '#1abc9c', secondary: '#16a085', accent: '#e74c3c' }
    },
    photography: {
        title: 'Lens & Light Photography',
        description: 'Capturing life\'s precious moments with artistic vision',
        tagline: 'Moments That Matter',
        features: ['Wedding Photography', 'Portrait Sessions', 'Event Coverage', 'Commercial Photography', 'Photo Editing', 'Digital Albums'],
        colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#f39c12' }
    },
    design: {
        title: 'PixelCraft Design',
        description: 'Digital design solutions that captivate and convert',
        tagline: 'Design That Delivers',
        features: ['Logo Design', 'Website Design', 'Mobile Apps', 'Print Design', 'Brand Guidelines', 'Design Systems'],
        colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#e67e22' }
    },

    // Education Templates
    education: {
        title: 'EduExcellence',
        description: 'Innovative educational programs fostering lifelong learning',
        tagline: 'Learn. Grow. Excel.',
        features: ['Online Courses', 'Certification Programs', 'Skill Development', 'Career Coaching', 'Learning Analytics', 'Student Support'],
        colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' }
    },
    school: {
        title: 'Bright Future Academy',
        description: 'Nurturing young minds through innovative education',
        tagline: 'Building Tomorrow\'s Leaders',
        features: ['Academic Excellence', 'STEM Programs', 'Arts & Culture', 'Sports Programs', 'Student Counseling', 'Parent Engagement'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#f1c40f' }
    },

    // Professional Services Templates
    legal: {
        title: 'Premier Legal Services',
        description: 'Experienced legal representation with personalized attention',
        tagline: 'Justice. Integrity. Results.',
        features: ['Corporate Law', 'Personal Injury', 'Family Law', 'Real Estate', 'Criminal Defense', 'Estate Planning'],
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#c0392b' }
    },
    finance: {
        title: 'WealthWise Financial',
        description: 'Comprehensive financial planning for your future security',
        tagline: 'Your Financial Future Secured',
        features: ['Investment Planning', 'Retirement Planning', 'Tax Services', 'Insurance', 'Estate Planning', 'Business Finance'],
        colors: { primary: '#27ae60', secondary: '#229954', accent: '#f39c12' }
    },

    // Special Templates
    helloworld: {
        title: 'Hello World Digital',
        description: 'Welcome to the world of endless possibilities in web development',
        tagline: 'Code. Create. Innovate.',
        features: ['Web Development', 'App Development', 'API Design', 'Database Design', 'Cloud Services', 'DevOps'],
        colors: { primary: '#00ff87', secondary: '#00d4ff', accent: '#ff0080' }
    },
    personal: {
        title: 'Personal Brand Hub',
        description: 'Building your personal brand in the digital landscape',
        tagline: 'Your Story, Your Brand',
        features: ['Personal Branding', 'Content Strategy', 'Social Media', 'Professional Networking', 'Thought Leadership', 'Career Development'],
        colors: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' }
    },

    // E-commerce Templates
    ecommerce: {
        title: 'ShopSmart Marketplace',
        description: 'Premium online shopping experience with curated products',
        tagline: 'Shop Smart, Live Better',
        features: ['Product Catalog', 'Secure Checkout', 'Customer Reviews', 'Fast Shipping', 'Return Policy', 'Customer Support'],
        colors: { primary: '#ff6b6b', secondary: '#ee5a24', accent: '#5f27cd' }
    },
    fashion: {
        title: 'StyleVogue Boutique',
        description: 'Trendy fashion and accessories for the modern lifestyle',
        tagline: 'Style Redefined',
        features: ['Latest Trends', 'Size Guide', 'Style Consultation', 'Seasonal Collections', 'Fashion Blog', 'VIP Membership'],
        colors: { primary: '#ff3838', secondary: '#ff2d92', accent: '#1e3799' }
    }
};

function detectIndustry(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Special keyword detection first
    if (lowerPrompt.includes('hello world') || lowerPrompt === 'hello world') {
        return 'helloworld';
    }
    
    // Specific template matching
    if (lowerPrompt.includes('startup') || lowerPrompt.includes('mvp') || lowerPrompt.includes('funding')) {
        return 'startup';
    } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software as a service') || lowerPrompt.includes('api')) {
        return 'saas';
    } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('software') || lowerPrompt.includes('ai') || lowerPrompt.includes('digital')) {
        return 'technology';
    } else if (lowerPrompt.includes('consulting') || lowerPrompt.includes('advisor') || lowerPrompt.includes('strategy')) {
        return 'consulting';
    } else if (lowerPrompt.includes('marketing') || lowerPrompt.includes('agency') || lowerPrompt.includes('brand') || lowerPrompt.includes('advertising')) {
        return 'marketing';
    } else if (lowerPrompt.includes('coffee') || lowerPrompt.includes('cafe') || lowerPrompt.includes('espresso')) {
        return 'cafe';
    } else if (lowerPrompt.includes('bakery') || lowerPrompt.includes('bread') || lowerPrompt.includes('cake') || lowerPrompt.includes('pastry')) {
        return 'bakery';
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food') || lowerPrompt.includes('dining') || lowerPrompt.includes('pizza') || lowerPrompt.includes('bar')) {
        return 'restaurant';
    } else if (lowerPrompt.includes('dental') || lowerPrompt.includes('dentist') || lowerPrompt.includes('teeth') || lowerPrompt.includes('orthodontic')) {
        return 'dental';
    } else if (lowerPrompt.includes('gym') || lowerPrompt.includes('fitness') || lowerPrompt.includes('workout') || lowerPrompt.includes('training')) {
        return 'fitness';
    } else if (lowerPrompt.includes('health') || lowerPrompt.includes('medical') || lowerPrompt.includes('doctor') || lowerPrompt.includes('clinic') || lowerPrompt.includes('hospital')) {
        return 'healthcare';
    } else if (lowerPrompt.includes('school') || lowerPrompt.includes('academy') || lowerPrompt.includes('university')) {
        return 'school';
    } else if (lowerPrompt.includes('education') || lowerPrompt.includes('learning') || lowerPrompt.includes('course') || lowerPrompt.includes('training')) {
        return 'education';
    } else if (lowerPrompt.includes('legal') || lowerPrompt.includes('law') || lowerPrompt.includes('attorney') || lowerPrompt.includes('lawyer')) {
        return 'legal';
    } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('financial') || lowerPrompt.includes('investment') || lowerPrompt.includes('wealth')) {
        return 'finance';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('showcase') || lowerPrompt.includes('artist') || lowerPrompt.includes('designer')) {
        return 'portfolio';
    } else if (lowerPrompt.includes('photography') || lowerPrompt.includes('photographer') || lowerPrompt.includes('photo') || lowerPrompt.includes('wedding')) {
        return 'photography';
    } else if (lowerPrompt.includes('design') || lowerPrompt.includes('creative') || lowerPrompt.includes('graphic') || lowerPrompt.includes('branding')) {
        return 'design';
    } else if (lowerPrompt.includes('personal') || lowerPrompt.includes('individual') || lowerPrompt.includes('freelance')) {
        return 'personal';
    } else if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('marketplace')) {
        return 'ecommerce';
    } else if (lowerPrompt.includes('fashion') || lowerPrompt.includes('clothing') || lowerPrompt.includes('boutique') || lowerPrompt.includes('style')) {
        return 'fashion';
    }
    
    // Default fallback
    return 'business';
}

// Enhanced AI website generation with page-by-page option
async function generateWithAI(prompt, usePageByPage = false) {
    if (!openai) {
        throw new Error('OpenAI not available');
    }

    // Get curated image set for this website
    const industry = detectIndustry(prompt);
    const imageSet = getWebsiteImageSet(industry);
    console.log('🖼️ Image set prepared for industry:', industry);
    
    // Choose generation method
    if (usePageByPage) {
        console.log('🚀 Using page-by-page generation for:', prompt);
        const result = await generateMultiPageWebsite(openai, prompt, imageSet);
        console.log(`✅ Generated ${result.pageCount} pages:`, result.generatedPages);
        return result.mainPage;
    } else {
        console.log('🚀 Using single-prompt generation for:', prompt);
    }

    const systemPrompt = `You are an expert full-stack web developer.  
Generate a complete, production-ready multi-page website project in a single response.  

### Requirements:
1. The project description is: ${prompt}.  
2. Output the full project in a structured format with multiple files. Organize it like this:
   - index.html (homepage)  
   - about.html (about page)  
   - [other pages based on project, e.g., products.html, contact.html]  
   - assets/ (CSS + JS + images placeholders)  
     - style.css  
     - script.js  
3. All pages must share the same header, footer, and design system.  
4. The site must be **responsive** (desktop, tablet, mobile).  
5. Use modern, clean **HTML5 + CSS3 + JavaScript** only (no build tools required).  
6. Use semantic HTML and accessibility best practices.  
7. Use these curated images: ${JSON.stringify(imageSet)} and placeholder images where needed.  
8. Keep each file under ~400 lines so nothing is truncated.  
9. At the very end of your response, output a short "Usage" note:
   - how to save files into a folder  
   - how to open \`index.html\` locally in a browser  

### Important:
- Do not skip any files.  
- Wrap each file's contents in a clear code block labeled with its filename.  
- Make sure all internal links work (e.g., \`<a href="about.html">About</a>\`).  

Now, generate the full website project for: ${prompt}.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Reliable and cost-effective
        messages: [
            { role: "system", content: "You are an expert web developer. Generate a complete multi-file website project. Output multiple files (index.html, about.html, style.css, script.js) with proper code blocks and filenames. NO placeholders or incomplete code. Generate REAL working websites with actual CSS and JavaScript." },
            { role: "user", content: systemPrompt }
        ],
        max_tokens: 4000, // Optimized for complete websites
        temperature: 0.7   // Balanced creativity
    });

    const response = completion.choices[0].message.content;
    console.log('🤖 AI Response preview:', response.substring(0, 200) + '...');
    
    // Enhanced debugging - check what AI actually generated
    const hasHTML = response.includes('<!DOCTYPE html>') || response.includes('<html');
    const hasCSS = response.includes('<style>') || response.includes('body {') || response.includes('.hero {');
    const hasJS = response.includes('<script>') || response.includes('addEventListener') || response.includes('function');
    
    console.log('📊 AI Generation Analysis:');
    console.log('   ✅ HTML:', hasHTML);
    console.log('   🎨 CSS:', hasCSS);
    console.log('   ⚡ JavaScript:', hasJS);
    console.log('   📏 Response length:', response.length);
    
    // Check if AI refused to generate HTML
    if (!hasHTML) {
        console.log('⚠️ AI refused to generate HTML, response:', response.substring(0, 500));
        console.log('🔄 Switching to enhanced template fallback...');
        throw new Error('AI generation failed - using template fallback');
    }
    
    // Warn if missing CSS or JS but still return the response
    if (!hasCSS) {
        console.log('⚠️ Warning: AI response missing CSS styling');
    }
    if (!hasJS) {
        console.log('⚠️ Warning: AI response missing JavaScript functionality');
    }
    
    return response;
}

// API Routes
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, useAI = true } = req.body;
        
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Prompt is required',
                message: 'Please provide a description for your website'
            });
        }

        console.log(`Generating website for prompt: "${prompt}"`);
        
        let result;
        let generationSource = 'fallback';
        
        // Try AI generation first (if available and requested)
        if (useAI && hasOpenAI && openai) {
            try {
                console.log('🤖 Attempting AI generation...');
                
                // Try page-by-page generation for complex prompts
                const usePageByPage = prompt.length > 50 || prompt.includes('complex') || prompt.includes('multi-page');
                const aiHtml = await generateWithAI(prompt, usePageByPage);
                
                console.log('✅ AI generation completed, HTML length:', aiHtml ? aiHtml.length : 0);
                
                // Extract title from AI-generated HTML
                const titleMatch = aiHtml.match(/<title>(.*?)<\/title>/i);
                const extractedTitle = titleMatch ? titleMatch[1] : 'AI Generated Website';
                
                result = {
                    id: generateId(),
                    title: extractedTitle,
                    html: aiHtml,
                    prompt: prompt,
                    timestamp: new Date().toISOString(),
                    description: `AI-generated website based on: ${prompt}`,
                    industry: detectIndustry(prompt),
                    source: 'openai_gpt',
                    aiGenerated: true,
                    optimizedPrompt: prompt,
                    generationMethod: usePageByPage ? 'page_by_page' : 'single_prompt',
                    hasOpenAI: true
                };
                
                generationSource = 'ai';
                console.log('🎉 AI generation successful!');
                
            } catch (aiError) {
                console.log('❌ AI generation failed:', aiError.message);
                console.log('🔄 Falling back to enhanced templates...');
                
                // Fall back to template generation
                const industry = detectIndustry(prompt);
                const template = templates[industry] || templates.business;
                const customizedTemplate = generateCustomizedTemplate(prompt, template);
                const html = generateWebsiteHTML(customizedTemplate, prompt);
                
                result = {
                    id: generateId(),
                    title: customizedTemplate.title,
                    html: html,
                    prompt: prompt,
                    timestamp: new Date().toISOString(),
                    description: customizedTemplate.description,
                    industry: industry,
                    source: 'enhanced_template',
                    aiGenerated: false,
                    optimizedPrompt: prompt,
                    generationMethod: 'template_fallback',
                    hasOpenAI: true,
                    aiError: aiError.message
                };
                
                generationSource = 'template_fallback';
            }
        } else {
            // Template generation (no AI available or not requested)
            console.log('📋 Using template generation...');
            
            const industry = detectIndustry(prompt);
            const template = templates[industry] || templates.business;
            const customizedTemplate = generateCustomizedTemplate(prompt, template);
            const html = generateWebsiteHTML(customizedTemplate, prompt);
            
            result = {
                id: generateId(),
                title: customizedTemplate.title,
                html: html,
                prompt: prompt,
                timestamp: new Date().toISOString(),
                description: customizedTemplate.description,
                industry: industry,
                source: 'template',
                aiGenerated: false,
                optimizedPrompt: prompt,
                generationMethod: 'template',
                hasOpenAI: hasOpenAI
            };
            
            generationSource = 'template';
        }
        
        console.log(`✅ Website generated successfully using ${generationSource}`);
        console.log(`📊 Result: ${result.title} (${result.html.length} characters)`);
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ Website generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate website',
            message: error.message,
            hasOpenAI: hasOpenAI
        });
    }
});

function generateCustomizedTemplate(prompt, template) {
    // Simple customization based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    let customizedTemplate = { ...template };
    
    // Customize title based on prompt
    if (lowerPrompt.includes('coffee')) {
        customizedTemplate.title = 'Artisan Coffee House';
    } else if (lowerPrompt.includes('bakery')) {
        customizedTemplate.title = 'Golden Crust Bakery';
    } else if (lowerPrompt.includes('dental')) {
        customizedTemplate.title = 'Bright Smile Dental';
    }
    // Add more customizations as needed
    
    return customizedTemplate;
}

// Helper function to generate website HTML using specialized templates
function generateWebsiteHTML(template, prompt) {
    const industry = detectIndustry(prompt);
    
    // Dispatch to specialized generators
    switch(industry) {
        case 'cafe':
        case 'restaurant':
        case 'bakery':
            return generateRestaurantWebsite(template, prompt);
        case 'portfolio':
        case 'photography':
        case 'design':
            return generatePortfolioWebsite(template, prompt);
        case 'healthcare':
        case 'dental':
        case 'fitness':
            return generateHealthcareWebsite(template, prompt);
        case 'technology':
        case 'startup':
        case 'saas':
            return generateTechWebsite(template, prompt);
        case 'ecommerce':
        case 'fashion':
            return generateEcommerceWebsite(template, prompt);
        case 'helloworld':
        case 'personal':
            return generatePersonalWebsite(template, prompt);
        default:
            return generateBusinessWebsite(template, prompt);
    }
}

// Test endpoints
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'CloudIDE API is working!',
        timestamp: new Date().toISOString(),
        server: 'Render.com',
        features: ['AI Generation', 'Template Fallback', 'Curated Images', 'Page-by-Page Generation']
    });
});

// Page-by-page generation endpoint
app.post('/api/generate-multipage', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        console.log('🚀 Multi-page generation request:', prompt);
        
        if (!openai) {
            console.log('⚠️ OpenAI not available, using template fallback');
            const industry = detectIndustry(prompt);
            const template = templates[industry] || templates.business;
            const html = generateWebsiteHTML(template, prompt);
            
            return res.json({
                success: true,
                id: generateId(),
                title: template.title,
                html: html,
                prompt: prompt,
                timestamp: new Date().toISOString(),
                description: template.description,
                industry: industry,
                source: 'template',
                aiGenerated: false,
                generationMethod: 'template_fallback',
                hasOpenAI: false,
                pageCount: 1,
                generatedPages: ['home']
            });
        }
        
        // Generate multi-page website
        const imageSet = getWebsiteImageSet(detectIndustry(prompt));
        const result = await generateMultiPageWebsite(openai, prompt, imageSet);
        
        res.json({
            success: true,
            id: generateId(),
            title: extractTitleFromHTML(result.mainPage),
            html: result.mainPage,
            prompt: prompt,
            timestamp: new Date().toISOString(),
            description: `Multi-page website with ${result.pageCount} pages`,
            industry: detectIndustry(prompt),
            source: 'ai_multipage',
            aiGenerated: true,
            generationMethod: 'page_by_page',
            hasOpenAI: true,
            pageCount: result.pageCount,
            generatedPages: result.generatedPages,
            allPages: result.allPages
        });
        
    } catch (error) {
        console.error('❌ Multi-page generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate multi-page website',
            details: error.message 
        });
    }
});

// Random image endpoint
app.get('/api/images/:category', (req, res) => {
    const { category } = req.params;
    const { count = 1 } = req.query;
    
    try {
        const images = getRandomImages(category, parseInt(count));
        res.json({
            success: true,
            category: category,
            images: images,
            count: images.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            availableCategories: Object.keys(imageCategories)
        });
    }
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function extractTitleFromHTML(html) {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : 'Generated Website';
}

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
    console.log(`🚀 CloudIDE is running on http://localhost:${PORT}`);
    console.log(`🤖 OpenAI API: ${openai ? '✅ Connected' : '❌ Not available'}`);
    console.log(`📊 Template system: ✅ ${Object.keys(templates).length} templates available`);
    console.log(`🖼️ Image system: ✅ ${Object.keys(imageCategories).length} categories`);
    console.log(`📄 Page-by-page generation: ✅ Available for complex websites`);
});

module.exports = app;
