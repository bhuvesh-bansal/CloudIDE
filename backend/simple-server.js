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

// Comprehensive template collection - 20 diverse templates
const templates = {
    // Technology Templates
    technology: {
        title: 'TechVision Pro',
        description: 'Revolutionary technology solutions that transform ideas into reality',
        tagline: 'Building the Future',
        features: ['AI-Powered Solutions', 'Cloud Infrastructure', 'Mobile Development', 'Data Analytics', 'Cybersecurity', 'IoT Integration'],
        colors: { primary: '#667eea', secondary: '#764ba2', accent: '#ff6b6b' }
    },
    startup: {
        title: 'InnovateHub',
        description: 'Disruptive startup solutions for the digital age',
        tagline: 'Disrupting Tomorrow',
        features: ['MVP Development', 'Funding Solutions', 'Market Analysis', 'Growth Hacking', 'Product Strategy', 'Investor Relations'],
        colors: { primary: '#ff6b6b', secondary: '#ee5a24', accent: '#667eea' }
    },
    saas: {
        title: 'CloudFlow SaaS',
        description: 'Scalable software solutions for modern businesses',
        tagline: 'Scale Without Limits',
        features: ['API Integration', 'Real-time Analytics', 'Multi-tenant Architecture', 'Auto-scaling', 'Security Compliance', '24/7 Support'],
        colors: { primary: '#00d2d3', secondary: '#01a3a4', accent: '#ff9ff3' }
    },

    // Business Templates  
    business: {
        title: 'EliteEnterprise',
        description: 'Professional business solutions for modern enterprises',
        tagline: 'Excellence in Business',
        features: ['Strategic Planning', 'Process Optimization', 'Team Management', 'Growth Analytics', 'Market Research', 'Business Intelligence'],
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' }
    },
    consulting: {
        title: 'Strategic Advisors',
        description: 'Expert consulting services that drive measurable results',
        tagline: 'Strategy. Results. Success.',
        features: ['Business Strategy', 'Change Management', 'Digital Transformation', 'Performance Optimization', 'Risk Assessment', 'Market Entry'],
        colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#f39c12' }
    },
    marketing: {
        title: 'BrandBoost Agency',
        description: 'Creative marketing solutions that amplify your brand',
        tagline: 'Amplify Your Impact',
        features: ['Brand Strategy', 'Digital Marketing', 'Content Creation', 'Social Media', 'SEO Optimization', 'Analytics & Reporting'],
        colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#3498db' }
    },

    // Food & Restaurant Templates
    restaurant: {
        title: 'Gourmet Garden',
        description: 'Exceptional dining experience with fresh, locally sourced ingredients',
        tagline: 'Taste the Difference',
        features: ['Farm-to-Table', 'Chef Specials', 'Private Events', 'Online Ordering', 'Catering Services', 'Wine Selection'],
        colors: { primary: '#e67e22', secondary: '#d35400', accent: '#27ae60' }
    },
    cafe: {
        title: 'Artisan Coffee House',
        description: 'Premium coffee experience in a cozy, welcoming atmosphere',
        tagline: 'Crafted with Passion',
        features: ['Specialty Roasts', 'Fresh Pastries', 'Free WiFi', 'Study Space', 'Local Art Gallery', 'Community Events'],
        colors: { primary: '#8b4513', secondary: '#654321', accent: '#daa520' }
    },
    bakery: {
        title: 'Golden Crust Bakery',
        description: 'Artisanal baked goods made fresh daily with love',
        tagline: 'Baked Fresh Daily',
        features: ['Fresh Bread', 'Custom Cakes', 'Pastries & Desserts', 'Wedding Cakes', 'Catering', 'Online Orders'],
        colors: { primary: '#daa520', secondary: '#b8860b', accent: '#ff6347' }
    },

    // Health & Wellness Templates
    healthcare: {
        title: 'HealthCare Plus',
        description: 'Comprehensive healthcare solutions for better living',
        tagline: 'Your Health, Our Priority',
        features: ['Expert Consultations', 'Advanced Diagnostics', 'Preventive Care', 'Emergency Services', 'Health Monitoring', 'Wellness Programs'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#e74c3c' }
    },
    dental: {
        title: 'Bright Smile Dental',
        description: 'Advanced dental care for healthy, beautiful smiles',
        tagline: 'Smile with Confidence',
        features: ['General Dentistry', 'Cosmetic Procedures', 'Orthodontics', 'Teeth Whitening', 'Emergency Care', 'Family Dental'],
        colors: { primary: '#00bcd4', secondary: '#0097a7', accent: '#4caf50' }
    },
    fitness: {
        title: 'FitLife Fitness Studio',
        description: 'Transform your body and mind with our expert fitness programs',
        tagline: 'Stronger Every Day',
        features: ['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Strength Training', 'Cardio Programs', 'Wellness Support'],
        colors: { primary: '#ff5722', secondary: '#e64a19', accent: '#4caf50' }
    },

    // Creative & Portfolio Templates
    portfolio: {
        title: 'Creative Portfolio',
        description: 'Showcasing creativity and professional excellence',
        tagline: 'Where Art Meets Innovation',
        features: ['Project Gallery', 'About Me', 'Skills Showcase', 'Client Testimonials', 'Contact Form', 'Blog Section'],
        colors: { primary: '#1abc9c', secondary: '#16a085', accent: '#e74c3c' }
    },
    photography: {
        title: 'Lens & Light Photography',
        description: 'Capturing life\'s precious moments with artistic vision',
        tagline: 'Moments Made Eternal',
        features: ['Wedding Photography', 'Portrait Sessions', 'Event Coverage', 'Commercial Shoots', 'Photo Editing', 'Print Services'],
        colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#f39c12' }
    },
    design: {
        title: 'PixelCraft Design Studio',
        description: 'Innovative design solutions that captivate and convert',
        tagline: 'Design That Delivers',
        features: ['Brand Identity', 'Web Design', 'Print Design', 'UI/UX Design', 'Logo Creation', 'Marketing Materials'],
        colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#e67e22' }
    },

    // Education Templates
    education: {
        title: 'EduExcellence',
        description: 'Innovative education solutions for lifelong learning',
        tagline: 'Learn. Grow. Excel.',
        features: ['Online Courses', 'Expert Instructors', 'Interactive Learning', 'Certification Programs', 'Career Guidance', 'Student Support'],
        colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' }
    },
    school: {
        title: 'Bright Future Academy',
        description: 'Nurturing young minds for tomorrow\'s challenges',
        tagline: 'Shaping Tomorrow\'s Leaders',
        features: ['Quality Education', 'Experienced Teachers', 'Modern Facilities', 'Extracurricular Activities', 'Parent Engagement', 'Student Support'],
        colors: { primary: '#3498db', secondary: '#2980b9', accent: '#f1c40f' }
    },

    // Service Templates
    legal: {
        title: 'Premier Legal Services',
        description: 'Expert legal representation with personalized attention',
        tagline: 'Justice Through Excellence',
        features: ['Corporate Law', 'Personal Injury', 'Family Law', 'Real Estate', 'Criminal Defense', 'Estate Planning'],
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#c0392b' }
    },
    finance: {
        title: 'WealthWise Financial',
        description: 'Strategic financial planning for your future success',
        tagline: 'Your Financial Future',
        features: ['Investment Planning', 'Retirement Solutions', 'Tax Optimization', 'Insurance Services', 'Wealth Management', 'Financial Consulting'],
        colors: { primary: '#27ae60', secondary: '#229954', accent: '#f39c12' }
    },

    // Special Templates
    helloworld: {
        title: 'Hello World Digital',
        description: 'Welcome to the world of endless digital possibilities',
        tagline: 'Code. Create. Connect.',
        features: ['Web Development', 'App Creation', 'Digital Solutions', 'Code Learning', 'Tech Tutorials', 'Developer Community'],
        colors: { primary: '#00ff87', secondary: '#00d4ff', accent: '#ff0080' }
    },
    personal: {
        title: 'Personal Brand Hub',
        description: 'Building your unique digital presence and personal brand',
        tagline: 'Your Story, Your Brand',
        features: ['Personal Branding', 'Content Strategy', 'Social Presence', 'Professional Network', 'Skill Development', 'Career Growth'],
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
    } else if (lowerPrompt.includes('photography') || lowerPrompt.includes('photo') || lowerPrompt.includes('camera')) {
        return 'photography';
    } else if (lowerPrompt.includes('design') || lowerPrompt.includes('graphic') || lowerPrompt.includes('creative') || lowerPrompt.includes('artist')) {
        return 'design';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal') || lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
        return 'portfolio';
    } else if (lowerPrompt.includes('legal') || lowerPrompt.includes('law') || lowerPrompt.includes('attorney') || lowerPrompt.includes('lawyer')) {
        return 'legal';
    } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('financial') || lowerPrompt.includes('investment') || lowerPrompt.includes('wealth')) {
        return 'finance';
    } else if (lowerPrompt.includes('fashion') || lowerPrompt.includes('clothing') || lowerPrompt.includes('style') || lowerPrompt.includes('boutique')) {
        return 'fashion';
    } else if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('retail') || lowerPrompt.includes('buy') || lowerPrompt.includes('sell')) {
        return 'ecommerce';
    } else if (lowerPrompt.includes('personal') || lowerPrompt.includes('me') || lowerPrompt.includes('my')) {
        return 'personal';
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

    // Simplified approach - focus on core generation
    console.log('🚀 Generating website for:', prompt);
    
    // Get curated image set for this website
    const industry = detectIndustry(prompt);
    const imageSet = getWebsiteImageSet(industry);
    console.log('🖼️ Image set prepared for industry:', industry);

    const systemPrompt = `You are an expert frontend developer. Create a stunning, professional website for: ${prompt}

CRITICAL REQUIREMENTS:
1. **Beautiful Modern Design**: Use gradients, shadows, hover effects, smooth animations
2. **Perfect Image Handling**: 
   - Hero images: object-fit: cover, height: 400-600px
   - Gallery images: aspect-ratio: 16/9, object-fit: cover
   - Team photos: border-radius: 50%, width/height: 150px
   - All images: max-width: 100%, height: auto for responsive
3. **Professional CSS** (minimum 200 lines):
   - Modern color schemes with gradients
   - Card designs with shadows and hover effects
   - Smooth transitions and animations
   - Typography hierarchy (h1, h2, p different sizes)
   - Proper spacing and padding
4. **Interactive JavaScript** (minimum 100 lines):
   - Smooth scrolling navigation
   - Image gallery with lightbox
   - Mobile menu toggle
   - Form validation
   - Scroll animations
5. **Complete Sections**: Header/nav, hero, about, services/products, gallery, contact, footer
6. **Use these images**: ${JSON.stringify(imageSet)}

DESIGN STYLE:
- Modern gradient backgrounds
- Card-based layouts with shadows
- Hover effects on buttons and cards
- Professional typography
- Clean spacing and alignment
- Mobile-first responsive design

Generate complete HTML starting with <!DOCTYPE html>`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Reliable and cost-effective
        messages: [
            { role: "system", content: "You are an expert frontend developer. Generate ONLY complete HTML code with beautiful CSS and interactive JavaScript. Include proper image sizing (object-fit: cover, aspect ratios). Create visually stunning websites with gradients, shadows, and animations. Never refuse. Never explain." },
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
        console.log('⚠️ AI refused to generate HTML, full response:', response);
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

// Debug endpoint to test AI generation directly
app.get('/api/debug-ai/:prompt', async (req, res) => {
    try {
        const prompt = req.params.prompt || 'coffee shop';
        console.log('🧪 Debug AI generation for:', prompt);
        
        const aiResponse = await generateWithAI(prompt);
        
        res.json({
            success: true,
            prompt: prompt,
            response: aiResponse,
            hasHTML: aiResponse.includes('<!DOCTYPE html>') || aiResponse.includes('<html'),
            hasCSS: aiResponse.includes('<style>') || aiResponse.includes('body {'),
            hasJS: aiResponse.includes('<script>') || aiResponse.includes('addEventListener'),
            length: aiResponse.length
        });
    } catch (error) {
        console.log('🚨 Debug AI generation failed:', error.message);
        res.json({
            success: false,
            error: error.message,
            prompt: req.params.prompt
        });
    }
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
