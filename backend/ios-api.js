// iOS-Compatible API for AI Website Generator
// Enables sharing from iOS apps and mobile integration

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

class IOSAPI {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        // iOS-specific endpoints
        this.router.post('/ios/generate', this.generateWebsite.bind(this));
        this.router.get('/ios/status', this.getStatus.bind(this));
        this.router.post('/ios/share', this.shareWebsite.bind(this));
        this.router.get('/ios/examples', this.getExamples.bind(this));
        this.router.post('/ios/feedback', this.submitFeedback.bind(this));
    }
    
    // Generate website from iOS app
    async generateWebsite(req, res) {
        try {
            const { 
                prompt, 
                colors, 
                theme, 
                layout, 
                includeData = true,
                deviceInfo = {}
            } = req.body;
            
            // Validate input
            if (!prompt || prompt.length < 3) {
                return res.status(400).json({
                    success: false,
                    error: 'Prompt must be at least 3 characters long'
                });
            }
            
            // Extract color preferences
            const colorPrefs = this.extractColorPreferences(prompt, colors);
            
            // Generate content using AI
            const content = await this.generateAIContent(prompt, theme);
            
            // Generate modern website with dynamic theming
            const html = this.generateModernWebsite(content, colorPrefs, layout);
            
            // Create shareable URL
            const shareId = this.generateShareId();
            const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;
            
            // Store for sharing
            this.storeWebsite(shareId, {
                html,
                prompt,
                content,
                colorPrefs,
                deviceInfo,
                timestamp: Date.now()
            });
            
            res.json({
                success: true,
                data: {
                    html,
                    shareUrl,
                    shareId,
                    content,
                    colorPrefs
                }
            });
            
        } catch (error) {
            console.error('iOS API Error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate website'
            });
        }
    }
    
    // Get generation status
    getStatus(req, res) {
        res.json({
            success: true,
            data: {
                status: 'ready',
                version: '1.0.0',
                features: [
                    'AI-powered content generation',
                    'Dynamic color theming',
                    'Modern responsive design',
                    'iOS sharing integration',
                    'Real-time data integration'
                ]
            }
        });
    }
    
    // Share website from iOS
    shareWebsite(req, res) {
        const { shareId, platform, deviceInfo } = req.body;
        
        const website = this.getStoredWebsite(shareId);
        if (!website) {
            return res.status(404).json({
                success: false,
                error: 'Website not found'
            });
        }
        
        // Generate sharing data
        const shareData = {
            title: website.content.title,
            description: website.content.description,
            url: `${req.protocol}://${req.get('host')}/share/${shareId}`,
            image: this.generateSocialImage(website.content),
            platform,
            deviceInfo
        };
        
        res.json({
            success: true,
            data: shareData
        });
    }
    
    // Get example prompts for iOS
    getExamples(req, res) {
        const examples = [
            {
                category: 'Business',
                prompts: [
                    'create a modern tech startup website with blue theme',
                    'build a restaurant website with warm colors',
                    'design a consulting firm website with professional dark theme'
                ]
            },
            {
                category: 'Creative',
                prompts: [
                    'create a photography portfolio with elegant purple theme',
                    'build a creative agency website with vibrant colors',
                    'design an artist portfolio with minimal black and white theme'
                ]
            },
            {
                category: 'E-commerce',
                prompts: [
                    'create an online store with modern green theme',
                    'build a fashion boutique with pink and gold colors',
                    'design a tech gadget shop with sleek dark theme'
                ]
            },
            {
                category: 'Personal',
                prompts: [
                    'create a personal blog with cozy orange theme',
                    'build a wedding planner website with romantic pink theme',
                    'design a fitness trainer website with energetic red theme'
                ]
            }
        ];
        
        res.json({
            success: true,
            data: examples
        });
    }
    
    // Submit feedback from iOS
    submitFeedback(req, res) {
        const { shareId, rating, feedback, deviceInfo } = req.body;
        
        // Store feedback
        this.storeFeedback(shareId, { rating, feedback, deviceInfo });
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    }
    
    // Helper methods
    extractColorPreferences(prompt, explicitColors = []) {
        const lowerPrompt = prompt.toLowerCase();
        let colors = [...explicitColors];
        
        // Extract colors from prompt
        const colorKeywords = {
            red: ['red', 'crimson', 'scarlet', 'ruby', 'burgundy'],
            blue: ['blue', 'navy', 'azure', 'cobalt', 'indigo', 'sapphire'],
            green: ['green', 'emerald', 'forest', 'sage', 'mint', 'olive'],
            purple: ['purple', 'violet', 'lavender', 'plum', 'amethyst'],
            orange: ['orange', 'amber', 'coral', 'peach', 'tangerine'],
            pink: ['pink', 'rose', 'magenta', 'fuchsia', 'blush'],
            yellow: ['yellow', 'gold', 'amber', 'lemon', 'sunshine'],
            black: ['black', 'dark', 'charcoal', 'onyx', 'ebony'],
            white: ['white', 'light', 'ivory', 'cream', 'pearl'],
            gray: ['gray', 'grey', 'silver', 'slate', 'smoke']
        };
        
        for (const [color, keywords] of Object.entries(colorKeywords)) {
            if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
                colors.push(color);
            }
        }
        
        // Determine theme
        let theme = 'modern';
        if (lowerPrompt.includes('elegant') || lowerPrompt.includes('sophisticated')) {
            theme = 'elegant';
        } else if (lowerPrompt.includes('vibrant') || lowerPrompt.includes('bold')) {
            theme = 'vibrant';
        } else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean')) {
            theme = 'minimal';
        }
        
        return { colors: [...new Set(colors)], theme };
    }
    
    async generateAIContent(prompt, theme) {
        // This would integrate with your existing AI system
        // For now, return enhanced content
        const industry = this.detectIndustry(prompt);
        const intent = this.detectIntent(prompt);
        
        return {
            title: this.generateTitle(prompt, industry),
            description: this.generateDescription(prompt, industry),
            features: this.generateFeatures(industry, intent),
            industry,
            intent
        };
    }
    
    generateModernWebsite(content, colorPrefs, layout = 'modern') {
        const { colors, theme } = colorPrefs;
        const { title, description, features } = content;
        
        // Generate dynamic CSS based on colors
        const css = this.generateDynamicCSS(colors, theme);
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta name="description" content="${description}">
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            <meta property="og:type" content="website">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>${css}</style>
        </head>
        <body>
            <section class="hero">
                <div class="hero-content">
                    <h1>${title}</h1>
                    <p>${description}</p>
                    <button class="btn" onclick="scrollToSection('features')">Explore Features</button>
                </div>
            </section>
            
            <section id="features" class="features-grid">
                ${features.map((feature, index) => `
                <div class="feature-card" style="animation-delay: ${index * 0.1}s">
                    <div class="feature-icon">${this.getFeatureIcon(feature)}</div>
                    <h3>${feature.title || feature}</h3>
                    <p>${feature.description || this.getFeatureDescription(feature)}</p>
                </div>
                `).join('')}
            </section>
            
            <script>
                // Modern interactive features
                document.addEventListener('DOMContentLoaded', function() {
                    // Smooth scrolling
                    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                        anchor.addEventListener('click', function (e) {
                            e.preventDefault();
                            const target = document.querySelector(this.getAttribute('href'));
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        });
                    });
                    
                    // Intersection Observer for animations
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }
                        });
                    });
                    
                    document.querySelectorAll('.feature-card').forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        observer.observe(card);
                    });
                });
                
                function scrollToSection(sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            </script>
        </body>
        </html>
        `;
    }
    
    generateDynamicCSS(colors, theme) {
        // Generate CSS based on color preferences
        const primaryColor = this.getColorValue(colors[0] || 'blue');
        const secondaryColor = this.getColorValue(colors[1] || 'gray');
        
        return `
        :root {
            --primary: ${primaryColor};
            --secondary: ${secondaryColor};
            --accent: ${this.getAccentColor(primaryColor)};
            --background: #f8fafc;
            --text: #1e293b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--background);
            color: var(--text);
            line-height: 1.6;
        }
        
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .hero-content {
            max-width: 800px;
            padding: 2rem;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .hero p {
            font-size: clamp(1.1rem, 2vw, 1.5rem);
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .btn {
            background: var(--accent);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .feature-card h3 {
            color: var(--primary);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        @media (max-width: 768px) {
            .features-grid {
                grid-template-columns: 1fr;
                padding: 2rem 1rem;
            }
        }
        `;
    }
    
    // Utility methods
    getColorValue(color) {
        const colorMap = {
            red: '#ef4444',
            blue: '#3b82f6',
            green: '#10b981',
            purple: '#8b5cf6',
            orange: '#f97316',
            pink: '#ec4899',
            yellow: '#eab308',
            black: '#000000',
            white: '#ffffff',
            gray: '#6b7280'
        };
        return colorMap[color] || '#3b82f6';
    }
    
    getAccentColor(primaryColor) {
        // Generate complementary accent color
        return '#f59e0b';
    }
    
    detectIndustry(prompt) {
        const lower = prompt.toLowerCase();
        if (lower.includes('photography') || lower.includes('photo')) return 'photography';
        if (lower.includes('tech') || lower.includes('technology')) return 'technology';
        if (lower.includes('restaurant') || lower.includes('food')) return 'food';
        if (lower.includes('fashion') || lower.includes('style')) return 'fashion';
        if (lower.includes('creative') || lower.includes('design')) return 'creative';
        return 'business';
    }
    
    detectIntent(prompt) {
        const lower = prompt.toLowerCase();
        if (lower.includes('portfolio')) return 'portfolio';
        if (lower.includes('shop') || lower.includes('store')) return 'ecommerce';
        if (lower.includes('blog')) return 'blog';
        return 'business';
    }
    
    generateTitle(prompt, industry) {
        const titles = {
            photography: ['Captured Moments', 'Visual Storytelling', 'Lens & Life'],
            technology: ['TechVision', 'InnovateFlow', 'Digital Dynamics'],
            food: ['Culinary Excellence', 'Taste & Tradition', 'Flavor Fusion'],
            fashion: ['Style & Elegance', 'Fashion Forward', 'Trendsetting'],
            creative: ['Creative Canvas', 'Artistic Vision', 'Design Dreams'],
            business: ['Professional Excellence', 'Business Solutions', 'Success Strategies']
        };
        
        const industryTitles = titles[industry] || titles.business;
        return industryTitles[Math.floor(Math.random() * industryTitles.length)];
    }
    
    generateDescription(prompt, industry) {
        const descriptions = {
            photography: 'Professional photography services that capture life\'s beautiful moments',
            technology: 'Cutting-edge technology solutions for the modern world',
            food: 'Exceptional culinary experiences with fresh ingredients and expert preparation',
            fashion: 'Trendsetting fashion for modern life with elegant style',
            creative: 'Creative solutions that inspire and bring ideas to life',
            business: 'Professional business solutions that drive success and growth'
        };
        
        return descriptions[industry] || descriptions.business;
    }
    
    generateFeatures(industry, intent) {
        const features = {
            photography: ['Portrait Photography', 'Event Photography', 'Photo Editing', 'Print Services'],
            technology: ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'AI Integration'],
            food: ['Fresh Ingredients', 'Expert Chefs', 'Catering Services', 'Online Ordering'],
            fashion: ['Trendy Designs', 'Quality Materials', 'Personal Styling', 'Online Shopping'],
            creative: ['Brand Design', 'UI/UX Design', 'Creative Strategy', 'Visual Content'],
            business: ['Strategic Consulting', 'Business Analytics', 'Process Optimization', 'Growth Planning']
        };
        
        return features[industry] || features.business;
    }
    
    getFeatureIcon(feature) {
        const icons = {
            'photography': '📸',
            'design': '🎨',
            'development': '💻',
            'technology': '🚀',
            'business': '💼',
            'creative': '✨',
            'food': '🍽️',
            'fashion': '👗'
        };
        
        const featureLower = feature.toLowerCase();
        for (const [key, icon] of Object.entries(icons)) {
            if (featureLower.includes(key)) {
                return icon;
            }
        }
        return '✨';
    }
    
    getFeatureDescription(feature) {
        return 'Professional service tailored to your needs';
    }
    
    generateShareId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    storeWebsite(shareId, data) {
        // In a real implementation, this would store in a database
        // For now, we'll use a simple in-memory store
        if (!this.websites) this.websites = new Map();
        this.websites.set(shareId, data);
    }
    
    getStoredWebsite(shareId) {
        if (!this.websites) return null;
        return this.websites.get(shareId);
    }
    
    storeFeedback(shareId, feedback) {
        // Store user feedback
        if (!this.feedback) this.feedback = new Map();
        this.feedback.set(shareId, feedback);
    }
    
    generateSocialImage(content) {
        // Generate social media preview image
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
            <rect width="1200" height="630" fill="linear-gradient(135deg, #667eea, #764ba2)"/>
            <text x="600" y="250" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">${content.title}</text>
            <text x="600" y="350" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${content.description}</text>
        </svg>`;
    }
}

module.exports = { IOSAPI };

