// AI-Driven Design System
// Generates modern, interactive websites with dynamic theming

class AIDesignSystem {
    constructor() {
        this.colorPalettes = {
            modern: {
                primary: ['#6366f1', '#4f46e5', '#4338ca'],
                secondary: ['#f59e0b', '#d97706', '#b45309'],
                accent: ['#10b981', '#059669', '#047857'],
                neutral: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
                dark: ['#1e293b', '#334155', '#475569', '#64748b']
            },
            elegant: {
                primary: ['#8b5cf6', '#7c3aed', '#6d28d9'],
                secondary: ['#ec4899', '#db2777', '#be185d'],
                accent: ['#06b6d4', '#0891b2', '#0e7490'],
                neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4'],
                dark: ['#171717', '#262626', '#404040', '#525252']
            },
            vibrant: {
                primary: ['#ef4444', '#dc2626', '#b91c1c'],
                secondary: ['#f97316', '#ea580c', '#c2410c'],
                accent: ['#22c55e', '#16a34a', '#15803d'],
                neutral: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1'],
                dark: ['#0f172a', '#1e293b', '#334155', '#475569']
            },
            minimal: {
                primary: ['#000000', '#1a1a1a', '#333333'],
                secondary: ['#666666', '#999999', '#cccccc'],
                accent: ['#ffffff', '#f5f5f5', '#e5e5e5'],
                neutral: ['#ffffff', '#fafafa', '#f0f0f0', '#e0e0e0'],
                dark: ['#000000', '#111111', '#222222', '#333333']
            }
        };
        
        this.layoutTemplates = {
            hero: 'hero-centered',
            grid: 'masonry-grid',
            cards: 'feature-cards',
            showcase: 'portfolio-showcase',
            business: 'corporate-layout',
            creative: 'artistic-layout'
        };
        
        this.animations = {
            fadeIn: 'fade-in-up',
            slideIn: 'slide-in-left',
            scaleIn: 'scale-in',
            bounceIn: 'bounce-in',
            flipIn: 'flip-in-x'
        };
    }
    
    // Extract color preferences from prompt
    extractColorPreferences(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        const colors = {
            red: ['red', 'crimson', 'scarlet', 'ruby'],
            blue: ['blue', 'navy', 'azure', 'cobalt', 'indigo'],
            green: ['green', 'emerald', 'forest', 'sage', 'mint'],
            purple: ['purple', 'violet', 'lavender', 'plum', 'amethyst'],
            orange: ['orange', 'amber', 'coral', 'peach'],
            pink: ['pink', 'rose', 'magenta', 'fuchsia'],
            yellow: ['yellow', 'gold', 'amber', 'lemon'],
            black: ['black', 'dark', 'charcoal', 'onyx'],
            white: ['white', 'light', 'ivory', 'cream'],
            gray: ['gray', 'grey', 'silver', 'slate']
        };
        
        let detectedColors = [];
        let theme = 'modern';
        
        // Detect specific colors
        for (const [colorName, colorWords] of Object.entries(colors)) {
            if (colorWords.some(word => lowerPrompt.includes(word))) {
                detectedColors.push(colorName);
            }
        }
        
        // Detect theme preferences
        if (lowerPrompt.includes('elegant') || lowerPrompt.includes('sophisticated')) {
            theme = 'elegant';
        } else if (lowerPrompt.includes('vibrant') || lowerPrompt.includes('bold') || lowerPrompt.includes('energetic')) {
            theme = 'vibrant';
        } else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
            theme = 'minimal';
        }
        
        return { colors: detectedColors, theme };
    }
    
    // Generate dynamic color palette
    generateColorPalette(colorPrefs) {
        const { colors, theme } = colorPrefs;
        const basePalette = this.colorPalettes[theme];
        
        if (colors.length === 0) {
            return basePalette;
        }
        
        // Custom color mapping
        const colorMap = {
            red: ['#ef4444', '#dc2626', '#b91c1c'],
            blue: ['#3b82f6', '#2563eb', '#1d4ed8'],
            green: ['#10b981', '#059669', '#047857'],
            purple: ['#8b5cf6', '#7c3aed', '#6d28d9'],
            orange: ['#f97316', '#ea580c', '#c2410c'],
            pink: ['#ec4899', '#db2777', '#be185d'],
            yellow: ['#eab308', '#ca8a04', '#a16207'],
            black: ['#000000', '#1a1a1a', '#333333'],
            white: ['#ffffff', '#f8fafc', '#f1f5f9'],
            gray: ['#6b7280', '#4b5563', '#374151']
        };
        
        const primaryColor = colorMap[colors[0]] || basePalette.primary;
        
        return {
            primary: primaryColor,
            secondary: basePalette.secondary,
            accent: basePalette.accent,
            neutral: basePalette.neutral,
            dark: basePalette.dark
        };
    }
    
    // Generate modern CSS with dynamic theming
    generateModernCSS(colorPalette, layoutType, animations) {
        const { primary, secondary, accent, neutral, dark } = colorPalette;
        
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-50: ${primary[0]};
            --primary-600: ${primary[1]};
            --primary-700: ${primary[2]};
            --secondary-500: ${secondary[0]};
            --accent-500: ${accent[0]};
            --neutral-50: ${neutral[0]};
            --neutral-100: ${neutral[1]};
            --neutral-200: ${neutral[2]};
            --neutral-300: ${neutral[3]};
            --dark-800: ${dark[0]};
            --dark-700: ${dark[1]};
            --dark-600: ${dark[2]};
            --dark-500: ${dark[3]};
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--neutral-50);
            color: var(--dark-800);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Modern Hero Section */
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-50), var(--primary-600));
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
            animation: fadeInUp 1s ease;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            margin-bottom: 1rem;
            font-weight: 700;
            background: linear-gradient(45deg, white, var(--neutral-100));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: clamp(1.1rem, 2vw, 1.5rem);
            opacity: 0.9;
            margin-bottom: 2rem;
            animation: fadeInUp 1s ease 0.2s both;
        }
        
        /* Modern Grid Layout */
        .modern-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .grid-item {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .grid-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        
        .grid-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-50), var(--accent-500));
        }
        
        .grid-image {
            height: 200px;
            background: linear-gradient(45deg, var(--primary-50), var(--primary-600));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .grid-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1));
        }
        
        .grid-content {
            padding: 2rem;
        }
        
        .grid-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--primary-600);
        }
        
        /* Modern Buttons */
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, var(--primary-50), var(--primary-600));
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .modern-grid {
                grid-template-columns: 1fr;
                padding: 2rem 1rem;
            }
            
            .hero-content {
                padding: 1rem;
            }
        }
        
        /* Interactive Elements */
        .interactive-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .interactive-card:hover {
            transform: scale(1.05);
        }
        
        /* Loading Animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        `;
    }
    
    // Generate interactive JavaScript
    generateInteractiveJS() {
        return `
        // Modern Interactive Features
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Observe all grid items
            document.querySelectorAll('.grid-item').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(item);
            });
            
            // Parallax effect for hero
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
                }
            });
            
            // Interactive hover effects
            document.querySelectorAll('.grid-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
            
            // Form interactions
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.textContent = 'Message Sent!';
                        submitBtn.style.background = 'var(--accent-500)';
                        
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                        }, 2000);
                    }, 1500);
                });
            }
        });
        
        // Utility functions
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = 'notification ' + type;
            notification.textContent = message;
            notification.style.cssText = '
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 1000;
                animation: slideInRight 0.3s ease;
            ';
            
            if (type === 'success') {
                notification.style.background = 'var(--accent-500)';
            } else {
                notification.style.background = 'var(--secondary-500)';
            }
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        `;
    }
    
    // Generate complete modern website
    generateModernWebsite(content, colorPrefs, layoutType = 'modern-grid') {
        const colorPalette = this.generateColorPalette(colorPrefs);
        const css = this.generateModernCSS(colorPalette, layoutType);
        const js = this.generateInteractiveJS();
        
        const { title, description, features = [] } = content;
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta name="description" content="${description}">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>${css}</style>
        </head>
        <body>
            <!-- Hero Section -->
            <section class="hero">
                <div class="hero-content">
                    <h1>${title}</h1>
                    <p>${description}</p>
                    <button class="btn" onclick="scrollToSection('features')">Explore Features</button>
                </div>
            </section>
            
            <!-- Features Section -->
            <section id="features" class="modern-grid">
                ${features.map((feature, index) => `
                <div class="grid-item interactive-card" style="animation-delay: ${index * 0.1}s">
                    <div class="grid-image">${this.getFeatureIcon(feature)}</div>
                    <div class="grid-content">
                        <h3 class="grid-title">${feature.title || feature}</h3>
                        <p>${feature.description || this.getFeatureDescription(feature)}</p>
                    </div>
                </div>
                `).join('')}
            </section>
            
            <!-- Contact Section -->
            <section style="background: var(--neutral-100); padding: 4rem 2rem; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto;">
                    <h2 style="color: var(--primary-600); margin-bottom: 2rem; font-size: 2.5rem;">Get In Touch</h2>
                    <form style="display: grid; gap: 1rem;">
                        <input type="text" placeholder="Your Name" style="padding: 1rem; border: 2px solid var(--neutral-200); border-radius: 10px; font-size: 1rem;">
                        <input type="email" placeholder="Your Email" style="padding: 1rem; border: 2px solid var(--neutral-200); border-radius: 10px; font-size: 1rem;">
                        <textarea placeholder="Your Message" rows="4" style="padding: 1rem; border: 2px solid var(--neutral-200); border-radius: 10px; font-size: 1rem; resize: vertical;"></textarea>
                        <button type="submit" class="btn">Send Message</button>
                    </form>
                </div>
            </section>
            
            <script>${js}</script>
        </body>
        </html>
        `;
    }
    
    // Helper functions
    getFeatureIcon(feature) {
        const icons = {
            'photography': '📸',
            'design': '🎨',
            'development': '💻',
            'marketing': '📈',
            'consulting': '💼',
            'creative': '✨',
            'technology': '🚀',
            'business': '🏢',
            'portfolio': '🖼️',
            'ecommerce': '🛍️',
            'blog': '📝',
            'agency': '🎯'
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
        const descriptions = {
            'photography': 'Professional photography services that capture your vision',
            'design': 'Creative design solutions that bring ideas to life',
            'development': 'Custom development services for modern web applications',
            'marketing': 'Strategic marketing solutions to grow your business',
            'consulting': 'Expert consulting services for business growth',
            'creative': 'Innovative creative solutions for your brand',
            'technology': 'Cutting-edge technology solutions for the future',
            'business': 'Professional business services and solutions',
            'portfolio': 'Showcase your work with stunning portfolio design',
            'ecommerce': 'Complete e-commerce solutions for online success',
            'blog': 'Engaging content creation and blog management',
            'agency': 'Full-service agency solutions for your brand'
        };
        
        const featureLower = feature.toLowerCase();
        for (const [key, description] of Object.entries(descriptions)) {
            if (featureLower.includes(key)) {
                return description;
            }
        }
        
        return 'Professional service tailored to your needs';
    }
}

module.exports = { AIDesignSystem };

