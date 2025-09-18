const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
const axios = require('axios');
const { getWebsiteImageSet, generateImageHTML, getRandomImage, getRandomImages, imageCategories } = require('./image-manager');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI (if API key is available)
let openai = null;
const hasOpenAI = !!process.env.OPENAI_API_KEY;

if (hasOpenAI) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 30000, // 30 second timeout
            maxRetries: 3    // Retry failed requests
        });
        console.log('✅ OpenAI API initialized with extended timeout');
    } catch (error) {
        console.log('⚠️ OpenAI initialization failed:', error.message);
    }
} else {
    console.log('ℹ️ No OpenAI API key found - using fallback system only');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Website templates for fallback generation
const templates = {
    technology: {
        title: 'TechVision Pro',
        description: 'Revolutionary technology solutions that transform ideas into reality',
        tagline: 'Building the Future',
        features: ['AI-Powered Solutions', 'Cloud Infrastructure', 'Mobile Development', 'Data Analytics', 'Cybersecurity', 'IoT Integration'],
        colors: { primary: '#667eea', secondary: '#764ba2', accent: '#ff6b6b' }
    },
    business: {
        title: 'EliteEnterprise',
        description: 'Professional business solutions for modern enterprises',
        tagline: 'Excellence in Business',
        features: ['Strategic Planning', 'Process Optimization', 'Team Management', 'Growth Analytics', 'Market Research', 'Business Intelligence'],
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' }
    },
    restaurant: {
        title: 'Gourmet Garden',
        description: 'Exceptional dining experience with fresh, locally sourced ingredients',
        tagline: 'Taste the Difference',
        features: ['Farm-to-Table', 'Chef Specials', 'Private Events', 'Online Ordering', 'Catering Services', 'Wine Selection'],
        colors: { primary: '#e67e22', secondary: '#d35400', accent: '#27ae60' }
    },
    healthcare: {
        title: 'HealthCare Plus',
        description: 'Comprehensive healthcare solutions for better living',
        tagline: 'Your Health, Our Priority',
        features: ['Expert Consultations', 'Advanced Diagnostics', 'Preventive Care', 'Emergency Services', 'Health Monitoring', 'Wellness Programs'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#e74c3c' }
    },
    education: {
        title: 'EduExcellence',
        description: 'Innovative education solutions for lifelong learning',
        tagline: 'Learn. Grow. Excel.',
        features: ['Online Courses', 'Expert Instructors', 'Interactive Learning', 'Certification Programs', 'Career Guidance', 'Student Support'],
        colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' }
    },
    portfolio: {
        title: 'Creative Portfolio',
        description: 'Showcasing creativity and professional excellence',
        tagline: 'Where Art Meets Innovation',
        features: ['Project Gallery', 'About Me', 'Skills Showcase', 'Client Testimonials', 'Contact Form', 'Blog Section'],
        colors: { primary: '#1abc9c', secondary: '#16a085', accent: '#e74c3c' }
    }
};

function detectIndustry(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // More comprehensive industry detection
    if (lowerPrompt.includes('tech') || lowerPrompt.includes('startup') || lowerPrompt.includes('software') || lowerPrompt.includes('ai') || lowerPrompt.includes('digital') || lowerPrompt.includes('app') || lowerPrompt.includes('saas')) {
        return 'technology';
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food') || lowerPrompt.includes('cafe') || lowerPrompt.includes('dining') || lowerPrompt.includes('pizza') || lowerPrompt.includes('bakery') || lowerPrompt.includes('bar')) {
        return 'restaurant';
    } else if (lowerPrompt.includes('health') || lowerPrompt.includes('medical') || lowerPrompt.includes('doctor') || lowerPrompt.includes('clinic') || lowerPrompt.includes('hospital') || lowerPrompt.includes('dental')) {
        return 'healthcare';
    } else if (lowerPrompt.includes('education') || lowerPrompt.includes('school') || lowerPrompt.includes('learning') || lowerPrompt.includes('course') || lowerPrompt.includes('university') || lowerPrompt.includes('training')) {
        return 'education';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal') || lowerPrompt.includes('creative') || lowerPrompt.includes('artist') || lowerPrompt.includes('photography') || lowerPrompt.includes('design')) {
        return 'portfolio';
    } else if (lowerPrompt.includes('gym') || lowerPrompt.includes('fitness') || lowerPrompt.includes('workout') || lowerPrompt.includes('sports')) {
        return 'fitness';
    } else if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('retail') || lowerPrompt.includes('buy') || lowerPrompt.includes('sell')) {
        return 'ecommerce';
    } else {
        return 'business';
    }
}

// Enhanced template generation with prompt-specific customization
function generateCustomizedTemplate(prompt, template) {
    const lowerPrompt = prompt.toLowerCase();
    let customTitle = template.title;
    let customDescription = template.description;
    
    // Extract specific business names or themes from prompt
    const words = prompt.split(' ').filter(word => word.length > 2);
    const businessWords = words.filter(word => 
        !['website', 'create', 'build', 'make', 'for', 'the', 'and', 'with'].includes(word.toLowerCase())
    );
    
    // Generate more specific title if we can extract business type
    if (businessWords.length > 0) {
        const mainWord = businessWords[0];
        const capitalizedWord = mainWord.charAt(0).toUpperCase() + mainWord.slice(1);
        
        if (lowerPrompt.includes('pizza')) customTitle = 'Artisan Pizza Co';
        else if (lowerPrompt.includes('coffee')) customTitle = 'Coffee House Oasis';
        else if (lowerPrompt.includes('bakery')) customTitle = 'Golden Crust Bakery';
        else if (lowerPrompt.includes('gym')) customTitle = 'FitLife Fitness Studio';
        else if (lowerPrompt.includes('dental')) customTitle = 'Bright Smile Dental';
        else if (lowerPrompt.includes('photography')) customTitle = 'Lens & Light Photography';
        else if (lowerPrompt.includes('law')) customTitle = 'Premier Legal Services';
        else if (lowerPrompt.includes('salon')) customTitle = 'Luxe Beauty Salon';
        else if (businessWords.length > 0) {
            customTitle = capitalizedWord + ' ' + template.title.split(' ').slice(-1)[0];
        }
    }
    
    return {
        ...template,
        title: customTitle,
        description: customDescription
    };
}

// Online search for current, accurate information
async function searchOnlineInfo(query) {
    try {
        // Use DuckDuckGo Instant Answer API (free, no API key needed)
        const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
        const response = await axios.get(searchUrl, { timeout: 5000 });
        
        let searchInfo = '';
        
        if (response.data.Abstract) {
            searchInfo += `About: ${response.data.Abstract}\n`;
        }
        
        if (response.data.RelatedTopics && response.data.RelatedTopics.length > 0) {
            searchInfo += 'Related info: ';
            response.data.RelatedTopics.slice(0, 3).forEach(topic => {
                if (topic.Text) {
                    searchInfo += topic.Text.substring(0, 100) + '... ';
                }
            });
        }
        
        return searchInfo || `Current trends and information about ${query}`;
    } catch (error) {
        console.log('🔍 Online search failed, using prompt only:', error.message);
        return `Modern ${query} with current industry standards and best practices`;
    }
}

// Enhanced AI website generation with online research
async function generateWithAI(prompt) {
    if (!openai) {
        throw new Error('OpenAI not available');
    }

    // Get online information and image set for more accurate content
    console.log('🔍 Searching online for:', prompt);
    const onlineInfo = await searchOnlineInfo(prompt);
    console.log('📊 Online info found:', onlineInfo.substring(0, 200) + '...');
    
    // Get curated image set for this website
    const industry = detectIndustry(prompt);
    const imageSet = getWebsiteImageSet(industry);
    console.log('🖼️ Image set prepared for industry:', industry);

    const systemPrompt = `Create a complete, professional website. NEVER use placeholders or incomplete code.

Build a full website for: ${prompt}
Use this research: ${onlineInfo}
Use these curated images: ${JSON.stringify(imageSet)}

MANDATORY: Generate a complete HTML file with:
- Complete CSS styling (minimum 100 lines)
- Working JavaScript interactions (minimum 50 lines)  
- Real business content (no placeholders like [add content])
- Multiple sections: nav, hero, about, services, gallery, contact, footer
- Responsive design with @media queries
- Beautiful curated images (use the provided imageSet URLs)
- Font Awesome icons
- Interactive features that work in mobile WebViews

IMAGE USAGE INSTRUCTIONS:
- Hero section: Use imageSet.hero for main background
- Services section: Use imageSet.services[0], imageSet.services[1], etc.
- Gallery section: Use imageSet.gallery[0] through imageSet.gallery[5]
- Team section: Use imageSet.team[0], imageSet.team[1], imageSet.team[2]
- About section: Use imageSet.about
- Contact section: Use imageSet.contact

IMPORTANT JAVASCRIPT RULES:
- Use smooth scrolling for navigation (scrollIntoView with behavior: 'smooth')
- Replace alert() with console.log() or custom notifications
- Use addEventListener instead of inline onclick handlers
- Avoid prompt() and confirm() dialogs
- Use CSS transitions instead of complex animations
- Make all interactions touch-friendly for mobile
- All images load reliably (no external API dependencies)

Example output should be a complete website like this:

<!DOCTYPE html>
<html>
<head>
    <title>Actual Business Name</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Complete CSS code here - minimum 100 lines */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        /* All styling for nav, hero, services, gallery, contact, responsive */
    </style>
</head>
<body>
    <!-- Complete HTML with all sections and real content -->
    <nav><!-- Working navigation --></nav>
    <section class="hero"><!-- Hero with real headline and description --></section>
    <section class="services"><!-- Service cards with actual descriptions --></section>
    <section class="gallery"><!-- Image gallery with real photos --></section>
    <section class="contact"><!-- Working contact form --></section>
    <footer><!-- Complete footer --></footer>
    
    <script>
        /* Complete JavaScript - minimum 50 lines */
        /* Working navigation, gallery, forms, animations */
    </script>
</body>
</html>

Generate the complete website now with ALL code and content filled in.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Reliable and cost-effective
        messages: [
            { role: "user", content: systemPrompt }
        ],
        max_tokens: 4096, // Maximum for GPT-3.5-turbo
        temperature: 0.8   // Higher creativity for better designs
    });

    return completion.choices[0].message.content;
}

function generateWebsiteHTML(template, prompt) {
    const { title, description, tagline, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,0 1000,0 1000,100"/></svg>');
        }
        
        .hero {
            position: relative;
            z-index: 1;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            background: ${colors.accent};
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        .features {
            padding: 5rem 0;
            background: #f8f9fa;
        }
        
        .features h2 {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: ${colors.primary};
            font-weight: 700;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            background: white;
            padding: 2.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border-top: 4px solid ${colors.primary};
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .feature-card i {
            font-size: 2.5rem;
            color: ${colors.primary};
            margin-bottom: 1rem;
        }
        
        .feature-card h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            color: ${colors.secondary};
            font-weight: 600;
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.6;
        }
        
        .about {
            padding: 5rem 0;
            background: white;
        }
        
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        
        .about-text h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: ${colors.primary};
            font-weight: 700;
        }
        
        .about-text p {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }
        
        .stats {
            display: flex;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: ${colors.primary};
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .about-image {
            background: linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20);
            height: 400px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: ${colors.primary};
        }
        
        footer {
            background: ${colors.secondary};
            color: white;
            text-align: center;
            padding: 3rem 0;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-section h3 {
            margin-bottom: 1rem;
            color: white;
        }
        
        .footer-section p, .footer-section a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            line-height: 1.8;
        }
        
        .footer-section a:hover {
            color: white;
        }
        
        .social-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .social-links a {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            transition: background 0.3s ease;
        }
        
        .social-links a:hover {
            background: ${colors.accent};
        }
        
        .generated-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors.accent};
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.8rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
            
            .about-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .stats {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="hero">
                <h1>${title}</h1>
                <p>${description}</p>
                <a href="#features" class="cta-button">
                    <i class="fas fa-rocket"></i> Get Started
                </a>
            </div>
        </div>
    </header>
    
    <section id="features" class="features">
        <div class="container">
            <h2>Our Services</h2>
            <div class="feature-grid">
                ${features.map((feature, index) => `
                    <div class="feature-card">
                        <i class="fas fa-${['star', 'cog', 'users', 'chart-line', 'shield-alt', 'lightbulb'][index] || 'check'}"></i>
                        <h3>${feature}</h3>
                        <p>Professional ${feature.toLowerCase()} services designed to exceed your expectations and drive your success forward.</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    
    <section class="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>About ${title}</h2>
                    <p>${description} Our team of experts is dedicated to delivering exceptional results that transform your vision into reality.</p>
                    <p>With years of experience and a passion for excellence, we've helped countless clients achieve their goals and build lasting success.</p>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-number">500+</div>
                            <div class="stat-label">Projects Completed</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">98%</div>
                            <div class="stat-label">Client Satisfaction</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">24/7</div>
                            <div class="stat-label">Support Available</div>
                        </div>
                    </div>
                </div>
                <div class="about-image">
                    <i class="fas fa-building"></i>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <p><i class="fas fa-envelope"></i> hello@${title.toLowerCase().replace(/\s+/g, '')}.com</p>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                    <p><i class="fas fa-map-marker-alt"></i> 123 Business St, City, ST 12345</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <p><a href="#features">Services</a></p>
                    <p><a href="#about">About Us</a></p>
                    <p><a href="#contact">Contact</a></p>
                    <p><a href="#blog">Blog</a></p>
                </div>
                <div class="footer-section">
                    <h3>Follow Us</h3>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <p>&copy; 2024 ${title}. ${tagline} | All rights reserved.</p>
        </div>
    </footer>
    
    <div class="generated-badge">
        <i class="fas fa-magic"></i> Generated by CloudIDE
    </div>
</body>
</html>`;
}

// API Routes
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, useAI = true } = req.body;
        
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Prompt is required',
                message: 'Please provide a description of the website you want to create.'
            });
        }

        console.log(`Generating website for prompt: "${prompt}"`);
        
        let result;
        let generationSource = 'fallback';
        
        // Try AI generation first (if available and requested)
        if (useAI && hasOpenAI && openai) {
            try {
                console.log('🤖 ATTEMPTING AI GENERATION...');
                console.log('🔑 API Key available:', !!process.env.OPENAI_API_KEY);
                console.log('🔑 API Key preview:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 15) + '...' : 'NONE');
                console.log('🔑 OpenAI client initialized:', !!openai);
                console.log('🔑 HasOpenAI flag:', hasOpenAI);
                console.log(`📝 User prompt: "${prompt}"`);
                console.log('🎯 About to call generateWithAI...');
                
                const aiHtml = await generateWithAI(prompt);
                
                console.log('✅ AI generation completed, HTML length:', aiHtml ? aiHtml.length : 0);
                
                // Extract title from AI-generated HTML (simple regex)
                const titleMatch = aiHtml.match(/<title>(.*?)<\/title>/i);
                const aiTitle = titleMatch ? titleMatch[1] : 'AI Generated Website';
                
                result = {
                    id: Date.now().toString(),
                    title: aiTitle,
                    description: `Complete AI-generated website: ${prompt}`,
                    industry: detectIndustry(prompt),
                    html: aiHtml,
                    timestamp: new Date().toISOString(),
                    source: 'openai-gpt3.5-complete',
                    prompt: prompt,
                    aiGenerated: true,
                    hasOnlineResearch: true
                };
                
                generationSource = 'AI-Complete';
                console.log(`🎉 SUCCESS: AI generated complete website: ${aiTitle}`);
                
            } catch (aiError) {
                console.log('❌ AI GENERATION FAILED - Details:');
                console.log('   Error message:', aiError.message);
                console.log('   Error type:', aiError.constructor.name);
                console.log('   Error code:', aiError.code || 'N/A');
                console.log('   Full error:', aiError);
                console.log('⚠️ Falling back to enhanced templates...');
                // Fall through to template generation
            }
        } else {
            console.log('❌ AI GENERATION SKIPPED:');
            console.log('   useAI:', useAI);
            console.log('   hasOpenAI:', hasOpenAI);
            console.log('   openai client:', !!openai);
        }
        
        // Fallback to template generation if AI failed or not requested
        if (!result) {
            console.log('📋 Using enhanced template generation...');
            const industry = detectIndustry(prompt);
            const baseTemplate = templates[industry];
            const customizedTemplate = generateCustomizedTemplate(prompt, baseTemplate);
            const html = generateWebsiteHTML(customizedTemplate, prompt);
            
            result = {
                id: Date.now().toString(),
                title: customizedTemplate.title,
                description: customizedTemplate.description,
                industry: industry,
                html: html,
                timestamp: new Date().toISOString(),
                source: 'cloudide-enhanced-fallback',
                prompt: prompt,
                aiGenerated: false,
                customized: true
            };
            
            console.log(`✅ Enhanced template generated ${industry} website: ${customizedTemplate.title}`);
        }
        
        // Add generation method info
        result.generationMethod = generationSource;
        result.hasOpenAI = hasOpenAI;
        
        res.json(result);
        
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
            error: 'Generation failed',
            message: 'An error occurred while generating the website. Please try again.',
            hasOpenAI: hasOpenAI
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CloudIDE is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        openai: {
            available: hasOpenAI,
            status: hasOpenAI ? 'connected' : 'not configured'
        }
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        status: 'active',
        supportedIndustries: Object.keys(templates),
        generationMethods: {
            ai: {
                available: hasOpenAI,
                model: hasOpenAI ? 'gpt-3.5-turbo' : null,
                features: hasOpenAI ? ['Custom content', 'Unique designs', 'Prompt-specific styling'] : []
            },
            fallback: {
                available: true,
                templates: Object.keys(templates).length,
                features: ['Instant generation', 'Professional templates', 'No API costs']
            }
        },
        features: [
            hasOpenAI ? 'AI-powered generation' : 'Template-based generation',
            'Instant fallback system',
            'Professional designs',
            'Mobile responsive',
            'Multiple industries',
            'No setup required'
        ]
    });
});

// Simple test endpoint for iOS debugging
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'CloudIDE API is working!',
        timestamp: new Date().toISOString(),
        server: 'Render.com',
        features: ['AI Generation', 'Template Fallback', 'Curated Images']
    });
});

// Random image endpoint
app.get('/api/images/:category', (req, res) => {
    const { category } = req.params;
    const { count = 1 } = req.query;
    
    try {
        if (count == 1) {
            const image = getRandomImage(category);
            res.json({ image });
        } else {
            const images = getRandomImages(category, parseInt(count));
            res.json({ images });
        }
    } catch (error) {
        res.status(400).json({ 
            error: 'Invalid category',
            availableCategories: Object.keys(imageCategories)
        });
    }
});

// Test OpenAI API directly
app.get('/api/test-openai', async (req, res) => {
    try {
        console.log('🧪 Testing OpenAI API directly...');
        console.log('🔑 Has API Key:', !!process.env.OPENAI_API_KEY);
        console.log('🔑 Key preview:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 15) + '...' : 'NONE');
        
        if (!openai) {
            return res.json({
                success: false,
                error: 'OpenAI client not initialized',
                hasApiKey: !!process.env.OPENAI_API_KEY
            });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Say "CloudIDE API test successful!"' }],
            max_tokens: 20
        });

        res.json({
            success: true,
            response: response.choices[0].message.content,
            hasApiKey: !!process.env.OPENAI_API_KEY,
            model: 'gpt-3.5-turbo'
        });

    } catch (error) {
        console.log('❌ OpenAI test failed:', error.message);
        res.json({
            success: false,
            error: error.message,
            hasApiKey: !!process.env.OPENAI_API_KEY
        });
    }
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 CloudIDE is running on http://localhost:${PORT}`);
    console.log(`✅ No API key required - using built-in templates`);
    console.log(`🎨 Supported industries: ${Object.keys(templates).join(', ')}`);
    console.log(`📱 Web interface available at http://localhost:${PORT}`);
});

module.exports = app;
