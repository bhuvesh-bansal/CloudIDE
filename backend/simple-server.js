const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
    
    if (lowerPrompt.includes('tech') || lowerPrompt.includes('startup') || lowerPrompt.includes('software') || lowerPrompt.includes('ai') || lowerPrompt.includes('digital')) {
        return 'technology';
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food') || lowerPrompt.includes('cafe') || lowerPrompt.includes('dining')) {
        return 'restaurant';
    } else if (lowerPrompt.includes('health') || lowerPrompt.includes('medical') || lowerPrompt.includes('doctor') || lowerPrompt.includes('clinic')) {
        return 'healthcare';
    } else if (lowerPrompt.includes('education') || lowerPrompt.includes('school') || lowerPrompt.includes('learning') || lowerPrompt.includes('course')) {
        return 'education';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal') || lowerPrompt.includes('creative') || lowerPrompt.includes('artist')) {
        return 'portfolio';
    } else {
        return 'business';
    }
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
app.post('/api/generate', (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Prompt is required',
                message: 'Please provide a description of the website you want to create.'
            });
        }

        console.log(`Generating website for prompt: "${prompt}"`);
        
        // Detect industry and get template
        const industry = detectIndustry(prompt);
        const template = templates[industry];
        
        // Generate HTML
        const html = generateWebsiteHTML(template, prompt);
        
        const result = {
            id: Date.now().toString(),
            title: template.title,
            description: template.description,
            industry: industry,
            html: html,
            timestamp: new Date().toISOString(),
            source: 'cloudide-fallback',
            prompt: prompt
        };
        
        console.log(`✅ Generated ${industry} website: ${template.title}`);
        res.json(result);
        
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
            error: 'Generation failed',
            message: 'An error occurred while generating the website. Please try again.'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CloudIDE is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        status: 'active',
        supportedIndustries: Object.keys(templates),
        features: [
            'No API key required',
            'Instant generation',
            'Professional designs',
            'Mobile responsive',
            'Multiple industries'
        ]
    });
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
