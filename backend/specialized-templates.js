// Specialized website generators with completely different designs

// Restaurant/Cafe Website - Menu-focused design with food imagery
function generateRestaurantWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Georgia', serif;
            background: #faf8f3;
            color: #2c1810;
        }
        
        .header {
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 100px 20px;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .menu-item {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .menu-item:hover {
            transform: translateY(-10px);
        }
        
        .menu-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .menu-content {
            padding: 20px;
        }
        
        .price {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${colors.primary};
            float: right;
        }
        
        .location {
            background: ${colors.primary};
            color: white;
            padding: 60px 20px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .menu-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>${title}</h1>
        <p>${description}</p>
        <button onclick="document.getElementById('menu').scrollIntoView({behavior: 'smooth'})" 
                style="background: ${colors.accent}; color: white; border: none; padding: 15px 30px; border-radius: 25px; margin-top: 20px; cursor: pointer;">
            View Menu
        </button>
    </header>

    <section id="menu" class="menu-grid">
        ${features.map((feature, i) => `
        <div class="menu-item">
            <img src="https://images.unsplash.com/photo-151${7+i}248135467-4c7edcad34c4?w=400&h=200&fit=crop" alt="${feature}">
            <div class="menu-content">
                <h3>${feature}</h3>
                <p>Delicious ${feature.toLowerCase()} made with fresh, local ingredients.</p>
                <span class="price">$${(Math.random() * 20 + 5).toFixed(2)}</span>
            </div>
        </div>
        `).join('')}
    </section>

    <section class="location">
        <h2>Visit Us Today</h2>
        <p>📍 123 Main Street, Downtown | 📞 (555) 123-4567</p>
        <p>Open Daily: 7AM - 10PM</p>
    </section>

    <script>
        // Menu filtering
        function filterMenu(category) {
            const items = document.querySelectorAll('.menu-item');
            items.forEach(item => {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            });
        }
        
        // Smooth animations
        document.addEventListener('DOMContentLoaded', function() {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach((item, index) => {
                item.style.animationDelay = index * 0.1 + 's';
                item.style.animation = 'slideUp 0.6s ease forwards';
            });
        });
    </script>
</body>
</html>`;
}

// Portfolio Website - Gallery-focused design
function generatePortfolioWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #000;
            color: #fff;
        }
        
        .hero {
            height: 100vh;
            background: linear-gradient(45deg, ${colors.primary}, ${colors.secondary});
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 0;
        }
        
        .portfolio-item {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1;
        }
        
        .portfolio-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .portfolio-item:hover img {
            transform: scale(1.1);
        }
        
        .portfolio-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, ${colors.primary}cc, ${colors.secondary}cc);
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
        }
        
        .portfolio-item:hover .portfolio-overlay {
            opacity: 1;
        }
        
        .about {
            padding: 100px 20px;
            text-align: center;
            background: #111;
        }
        
        @media (max-width: 768px) {
            .portfolio-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>${title}</h1>
            <p>${description}</p>
            <button onclick="document.querySelector('.portfolio-grid').scrollIntoView({behavior: 'smooth'})"
                    style="background: transparent; border: 2px solid white; color: white; padding: 15px 30px; margin-top: 30px; cursor: pointer;">
                View Portfolio
            </button>
        </div>
    </section>

    <section class="portfolio-grid">
        ${features.map((feature, i) => `
        <div class="portfolio-item">
            <img src="https://images.unsplash.com/photo-150${i+1}248135467-4c7edcad34c4?w=600&h=600&fit=crop" alt="${feature}">
            <div class="portfolio-overlay">
                <h3>${feature}</h3>
            </div>
        </div>
        `).join('')}
    </section>

    <section class="about">
        <h2>About My Work</h2>
        <p>Creating visual stories through ${prompt.toLowerCase()}. Each project is crafted with passion and attention to detail.</p>
    </section>

    <script>
        // Lightbox functionality
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const lightbox = document.createElement('div');
                lightbox.style.cssText = \`
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.9); display: flex; align-items: center; 
                    justify-content: center; z-index: 1000; cursor: pointer;
                \`;
                lightbox.innerHTML = \`<img src="\${img.src}" style="max-width: 90%; max-height: 90%; object-fit: contain;">\`;
                lightbox.onclick = () => lightbox.remove();
                document.body.appendChild(lightbox);
            });
        });
    </script>
</body>
</html>`;
}

// Healthcare Website - Trust-focused design
function generateHealthcareWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fffe;
            color: #2c3e50;
        }
        
        .header {
            background: white;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            padding: 20px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .hero {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 150px 20px 100px;
            text-align: center;
        }
        
        .services {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .service-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        
        .service-card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.08);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .service-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, ${colors.primary}, ${colors.accent});
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        }
        
        .contact {
            background: ${colors.primary};
            color: white;
            padding: 80px 20px;
            text-align: center;
        }
        
        .contact-form {
            max-width: 600px;
            margin: 30px auto 0;
            display: grid;
            gap: 20px;
        }
        
        .contact-form input, .contact-form textarea {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
        }
        
        .contact-form button {
            background: ${colors.accent};
            color: white;
            border: none;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: background 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .service-cards { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <h2>${title}</h2>
            <div>
                <a href="#services" style="margin-right: 30px; text-decoration: none; color: ${colors.primary};">Services</a>
                <a href="#contact" style="text-decoration: none; color: ${colors.primary};">Contact</a>
            </div>
        </nav>
    </header>

    <section class="hero">
        <h1>Your Health, Our Priority</h1>
        <p>${description}</p>
        <button onclick="document.getElementById('services').scrollIntoView({behavior: 'smooth'})"
                style="background: ${colors.accent}; color: white; border: none; padding: 15px 30px; border-radius: 25px; margin-top: 30px; cursor: pointer;">
            Our Services
        </button>
    </section>

    <section id="services" class="services">
        <h2 style="text-align: center; margin-bottom: 20px; color: ${colors.primary};">Our Services</h2>
        <div class="service-cards">
            ${features.map((feature, i) => `
            <div class="service-card">
                <div class="service-icon">🏥</div>
                <h3>${feature}</h3>
                <p>Professional ${feature.toLowerCase()} services with state-of-the-art equipment and experienced staff.</p>
            </div>
            `).join('')}
        </div>
    </section>

    <section id="contact" class="contact">
        <h2>Schedule an Appointment</h2>
        <p>Contact us today to book your appointment</p>
        <form class="contact-form" onsubmit="event.preventDefault(); alert('Thank you! We will contact you soon to schedule your appointment.');">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Email Address" required>
            <input type="tel" placeholder="Phone Number" required>
            <textarea placeholder="Message or preferred appointment time" rows="4"></textarea>
            <button type="submit">Schedule Appointment</button>
        </form>
    </section>

    <script>
        // Smooth scrolling for all links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Animate service cards on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease forwards';
                }
            });
        });
        
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
    </script>
</body>
</html>`;
}

// Technology/Startup Website - Modern tech design
function generateTechWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            overflow-x: hidden;
        }
        
        .hero {
            height: 100vh;
            background: radial-gradient(circle at 50% 50%, ${colors.primary}22 0%, transparent 50%),
                        linear-gradient(135deg, #000 0%, #111 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="${colors.primary.replace('#', '%23')}" opacity="0.1"/></svg>');
            animation: float 20s infinite linear;
        }
        
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            padding: 100px 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .tech-card {
            background: linear-gradient(145deg, #111 0%, #222 100%);
            border: 1px solid ${colors.primary}33;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
        }
        
        .tech-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, ${colors.primary}22, transparent);
            transition: left 0.5s ease;
        }
        
        .tech-card:hover::before {
            left: 100%;
        }
        
        .tech-card:hover {
            transform: translateY(-10px);
            border-color: ${colors.primary};
            box-shadow: 0 20px 40px ${colors.primary}33;
        }
        
        .cta-section {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            padding: 100px 20px;
            text-align: center;
        }
        
        @keyframes float {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .tech-grid { grid-template-columns: 1fr; }
            .hero h1 { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1 style="font-size: 4rem; margin-bottom: 20px; background: linear-gradient(45deg, ${colors.primary}, ${colors.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h1>
            <p style="font-size: 1.4rem; margin-bottom: 40px; opacity: 0.9;">${description}</p>
            <button onclick="document.querySelector('.tech-grid').scrollIntoView({behavior: 'smooth'})"
                    style="background: linear-gradient(45deg, ${colors.primary}, ${colors.accent}); color: white; border: none; padding: 20px 40px; border-radius: 30px; font-size: 1.1rem; cursor: pointer;">
                Explore Features
            </button>
        </div>
    </section>

    <section class="tech-grid">
        ${features.map((feature, i) => `
        <div class="tech-card">
            <h3 style="color: ${colors.accent}; margin-bottom: 15px; font-size: 1.5rem;">${feature}</h3>
            <p style="opacity: 0.8; line-height: 1.8;">Advanced ${feature.toLowerCase()} solutions powered by cutting-edge technology and innovative approaches.</p>
        </div>
        `).join('')}
    </section>

    <section class="cta-section">
        <h2>Ready to Transform Your Business?</h2>
        <p>Join thousands of companies already using our platform</p>
        <button onclick="alert('Thank you for your interest! Our team will contact you within 24 hours.')"
                style="background: white; color: ${colors.primary}; border: none; padding: 20px 40px; border-radius: 30px; margin-top: 30px; cursor: pointer; font-weight: bold;">
            Get Started Today
        </button>
    </section>

    <script>
        // Parallax effect for hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            hero.style.transform = \`translateY(\${scrolled * 0.5}px)\`;
        });
        
        // Animate tech cards on scroll
        const techObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = \`slideUp 0.8s ease \${index * 0.1}s forwards\`;
                }
            });
        });
        
        document.querySelectorAll('.tech-card').forEach(card => {
            techObserver.observe(card);
        });
    </script>
</body>
</html>`;
}

// E-commerce Website - Product-focused design
function generateEcommerceWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #ffffff;
            color: #1a1a1a;
        }
        
        .header {
            background: white;
            border-bottom: 1px solid #eee;
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .hero {
            background: linear-gradient(135deg, ${colors.primary}11, ${colors.secondary}11);
            padding: 100px 20px;
            text-align: center;
        }
        
        .products {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            padding: 80px 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        
        .product-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-info {
            padding: 25px;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${colors.primary};
            margin-top: 10px;
        }
        
        .add-to-cart {
            background: ${colors.primary};
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            margin-top: 15px;
            transition: background 0.3s ease;
        }
        
        .add-to-cart:hover {
            background: ${colors.secondary};
        }
        
        @media (max-width: 768px) {
            .products { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <h2>${title}</h2>
            <div>
                <span style="background: ${colors.primary}; color: white; padding: 8px 15px; border-radius: 20px;">🛒 Cart (0)</span>
            </div>
        </nav>
    </header>

    <section class="hero">
        <h1 style="font-size: 3.5rem; margin-bottom: 20px; color: ${colors.primary};">${title}</h1>
        <p style="font-size: 1.3rem; margin-bottom: 40px; color: #666;">${description}</p>
        <button onclick="document.querySelector('.products').scrollIntoView({behavior: 'smooth'})"
                style="background: ${colors.primary}; color: white; border: none; padding: 18px 35px; border-radius: 25px; font-size: 1.1rem; cursor: pointer;">
            Shop Now
        </button>
    </section>

    <section class="products">
        ${features.map((feature, i) => `
        <div class="product-card" onclick="addToCart('${feature}')">
            <img class="product-image" src="https://images.unsplash.com/photo-150${i+5}248135467-4c7edcad34c4?w=400&h=250&fit=crop" alt="${feature}">
            <div class="product-info">
                <h3>${feature}</h3>
                <p>Premium ${feature.toLowerCase()} with exceptional quality and design.</p>
                <div class="product-price">$${(Math.random() * 200 + 50).toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
        `).join('')}
    </section>

    <script>
        let cartCount = 0;
        
        function addToCart(productName) {
            cartCount++;
            document.querySelector('.nav span').textContent = \`🛒 Cart (\${cartCount})\`;
            
            // Show add to cart animation
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed; top: 20px; right: 20px; background: ${colors.primary}; 
                color: white; padding: 15px 25px; border-radius: 10px; z-index: 1000;
                animation: slideIn 0.3s ease;
            \`;
            notification.textContent = \`\${productName} added to cart!\`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        }
        
        // Product hover effects
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderLeft = \`5px solid ${colors.primary}\`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderLeft = 'none';
            });
        });
    </script>
</body>
</html>`;
}

// Personal/Hello World Website - Creative developer design
function generatePersonalWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Monaco', 'Menlo', monospace;
            background: #1a1a1a;
            color: #00ff88;
            overflow-x: hidden;
        }
        
        .terminal {
            background: #000;
            border: 2px solid #00ff88;
            border-radius: 10px;
            margin: 50px auto;
            max-width: 900px;
            box-shadow: 0 0 30px #00ff8844;
        }
        
        .terminal-header {
            background: #333;
            padding: 10px 20px;
            border-bottom: 1px solid #00ff88;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .terminal-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .terminal-content {
            padding: 30px;
            min-height: 400px;
        }
        
        .command-line {
            margin: 10px 0;
            animation: typewriter 1s steps(20) forwards;
        }
        
        .command-line::before {
            content: '$ ';
            color: #ff6b6b;
        }
        
        .skills {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .skill-bar {
            background: #333;
            border-radius: 10px;
            padding: 15px;
            border-left: 4px solid ${colors.primary};
        }
        
        .projects {
            margin: 50px 0;
        }
        
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .project-card {
            background: #222;
            border: 1px solid #00ff88;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .project-card:hover {
            background: #333;
            transform: scale(1.02);
            box-shadow: 0 5px 20px #00ff8833;
        }
        
        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        @media (max-width: 768px) {
            .terminal { margin: 20px; }
            .skills { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="terminal">
        <div class="terminal-header">
            <div class="terminal-dot" style="background: #ff5f57;"></div>
            <div class="terminal-dot" style="background: #ffbd2e;"></div>
            <div class="terminal-dot" style="background: #28ca42;"></div>
            <span style="color: #ccc; margin-left: 10px;">developer@cloudide:~</span>
        </div>
        
        <div class="terminal-content">
            <div class="command-line">whoami</div>
            <div style="margin-left: 20px; color: #fff;">Hello! I'm a developer passionate about creating amazing digital experiences.</div>
            
            <div class="command-line" style="animation-delay: 1s;">ls skills/</div>
            <div class="skills">
                ${features.map(feature => `
                <div class="skill-bar">
                    <div style="color: ${colors.accent};">${feature}</div>
                    <div style="background: ${colors.primary}; height: 4px; border-radius: 2px; margin-top: 8px; width: ${Math.random() * 40 + 60}%;"></div>
                </div>
                `).join('')}
            </div>
            
            <div class="command-line" style="animation-delay: 2s;">cat projects.json</div>
            <div class="projects">
                <div class="project-grid">
                    ${features.slice(0, 3).map((feature, i) => `
                    <div class="project-card" onclick="openProject('${feature}')">
                        <h4 style="color: ${colors.accent}; margin-bottom: 10px;">${feature} Project</h4>
                        <p style="color: #ccc; font-size: 0.9rem;">Built with modern technologies and best practices.</p>
                        <div style="margin-top: 15px;">
                            <span style="background: ${colors.primary}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">React</span>
                            <span style="background: ${colors.secondary}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-left: 5px;">Node.js</span>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="command-line" style="animation-delay: 3s;">contact --info</div>
            <div style="margin: 20px 0; color: #fff;">
                <p>📧 Email: developer@cloudide.com</p>
                <p>🌐 GitHub: github.com/developer</p>
                <p>💼 LinkedIn: linkedin.com/in/developer</p>
            </div>
            
            <div class="command-line" style="animation-delay: 4s;">
                <span style="animation: blink 1s infinite;">_</span>
            </div>
        </div>
    </div>

    <script>
        function openProject(projectName) {
            alert(\`Opening \${projectName} project... This would normally open the project details or live demo.\`);
        }
        
        // Terminal typing effect
        setTimeout(() => {
            const commands = document.querySelectorAll('.command-line');
            commands.forEach((cmd, index) => {
                setTimeout(() => {
                    cmd.style.animation = 'typewriter 1s steps(20) forwards';
                }, index * 1000);
            });
        }, 500);
        
        // Matrix rain effect (subtle)
        function createMatrixRain() {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; opacity: 0.1;';
            document.body.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const letters = '01';
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ff88';
                ctx.font = fontSize + 'px monospace';
                
                drops.forEach((y, index) => {
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    const x = index * fontSize;
                    ctx.fillText(text, x, y * fontSize);
                    
                    if (y * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[index] = 0;
                    }
                    drops[index]++;
                });
            }
            
            setInterval(draw, 100);
        }
        
        createMatrixRain();
    </script>
</body>
</html>`;
}

// Business Website - Professional corporate design  
function generateBusinessWebsite(template, prompt) {
    const { title, description, features, colors } = template;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            color: #2c3e50;
            line-height: 1.6;
        }
        
        .hero {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 120px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
            );
            animation: slide 20s linear infinite;
        }
        
        .services {
            padding: 100px 20px;
            background: #f8f9fa;
        }
        
        .service-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 50px auto 0;
        }
        
        .service-item {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.08);
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
        }
        
        .service-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
            transition: left 0.4s ease;
        }
        
        .service-item:hover::before {
            left: 0;
        }
        
        .service-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .cta {
            background: linear-gradient(135deg, ${colors.secondary}, ${colors.primary});
            color: white;
            padding: 100px 20px;
            text-align: center;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            margin: 60px auto;
            max-width: 800px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            color: ${colors.accent};
            display: block;
        }
        
        @keyframes slide {
            0% { transform: translateX(-50px); }
            100% { transform: translateX(50px); }
        }
        
        @media (max-width: 768px) {
            .service-grid { grid-template-columns: 1fr; }
            .stats { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1 style="font-size: 3.5rem; margin-bottom: 20px; z-index: 1; position: relative;">${title}</h1>
        <p style="font-size: 1.3rem; margin-bottom: 40px; z-index: 1; position: relative;">${description}</p>
        <button onclick="document.querySelector('.services').scrollIntoView({behavior: 'smooth'})"
                style="background: ${colors.accent}; color: white; border: none; padding: 18px 35px; border-radius: 30px; font-size: 1.1rem; cursor: pointer; z-index: 1; position: relative;">
            Learn More
        </button>
    </section>

    <section class="services">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 20px; color: ${colors.primary};">What We Do</h2>
        <p style="text-align: center; color: #666; margin-bottom: 50px; max-width: 600px; margin-left: auto; margin-right: auto;">
            We provide comprehensive business solutions tailored to your needs.
        </p>
        
        <div class="service-grid">
            ${features.map((feature, i) => `
            <div class="service-item">
                <div style="font-size: 3rem; margin-bottom: 20px; color: ${colors.primary};">🎯</div>
                <h3 style="margin-bottom: 15px; color: ${colors.secondary};">${feature}</h3>
                <p style="color: #666;">Professional ${feature.toLowerCase()} services designed to help your business grow and succeed in today's competitive market.</p>
            </div>
            `).join('')}
        </div>
    </section>

    <section class="cta">
        <div class="stats">
            <div class="stat-item">
                <span class="stat-number" data-target="150">0</span>
                <span>Happy Clients</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" data-target="25">0</span>
                <span>Years Experience</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" data-target="500">0</span>
                <span>Projects Completed</span>
            </div>
        </div>
        
        <h2 style="margin: 40px 0 20px;">Ready to Get Started?</h2>
        <p style="margin-bottom: 30px;">Contact us today for a free consultation</p>
        <button onclick="window.location.href='mailto:contact@${title.toLowerCase().replace(/\s+/g, '')}.com'"
                style="background: white; color: ${colors.primary}; border: none; padding: 18px 35px; border-radius: 30px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
            Get In Touch
        </button>
    </section>

    <script>
        // Animated counters
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 100;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 20);
            });
        }
        
        // Trigger animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        document.querySelector('.stats').forEach(stats => statsObserver.observe(stats));
        
        // Service item animations
        document.querySelectorAll('.service-item').forEach((item, index) => {
            item.style.animationDelay = index * 0.2 + 's';
            item.style.animation = 'fadeInUp 0.8s ease forwards';
        });
    </script>
</body>
</html>`;
}

module.exports = {
    generateRestaurantWebsite,
    generatePortfolioWebsite,
    generateHealthcareWebsite,
    generateTechWebsite,
    generateEcommerceWebsite,
    generatePersonalWebsite,
    generateBusinessWebsite
};
