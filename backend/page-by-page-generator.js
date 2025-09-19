// Page-by-Page Website Generator System
// Avoids truncation by generating one page at a time and stitching together

const OpenAI = require('openai');

// Master prompt for initializing the project
function createKickoffPrompt(projectDescription) {
    return `You are an expert full-stack web developer. We are building a full website step-by-step.  
The project description is:  
${projectDescription}

I will ask you to generate the code page by page.  
For each page, follow these rules:  
1. Produce a **single complete file** for that page (HTML/CSS/JS in one file).  
2. Make it **responsive** and visually modern.  
3. Include **dummy text, placeholder images, and example data**.  
4. Clearly label sections with comments.  
5. Keep each response concise (max 400–600 lines).  
6. Use **consistent style and design system** across pages (colors, fonts, spacing).  
7. Do not skip nav/footer—keep them consistent.  

When finished, I will merge pages into one site.  
Acknowledge this setup, then wait for me to request the first page.`;
}

// Generate individual pages
async function generatePage(openai, projectDescription, pageType, designSystem = null) {
    const pagePrompts = {
        home: `Generate the Home page for: ${projectDescription}
        
Include:
- Hero section with compelling headline
- Key features/services overview
- Call-to-action buttons
- Navigation menu
- Footer
- Modern responsive design
- Embedded CSS and JavaScript`,

        about: `Generate the About page for: ${projectDescription}
        
Include:
- Company/personal story
- Mission and values
- Team section with photos
- Timeline or history
- Professional styling
- Same design system as previous pages`,

        services: `Generate the Services page for: ${projectDescription}
        
Include:
- Service grid with descriptions
- Pricing information (if applicable)
- Service details and benefits
- Contact forms or CTAs
- Interactive elements`,

        products: `Generate the Products page for: ${projectDescription}
        
Include:
- Product grid/catalog
- Product cards with images
- Filtering and search functionality
- Add to cart buttons
- Product details and pricing`,

        contact: `Generate the Contact page for: ${projectDescription}
        
Include:
- Contact form with validation
- Location information
- Business hours
- Map integration (embed or placeholder)
- Social media links
- Professional styling`,

        gallery: `Generate the Gallery page for: ${projectDescription}
        
Include:
- Image gallery with lightbox
- Category filtering
- Masonry or grid layout
- Image optimization
- Interactive viewing experience`,

        blog: `Generate the Blog page for: ${projectDescription}
        
Include:
- Blog post grid
- Article previews
- Categories and tags
- Search functionality
- Reading time estimates
- Professional blog styling`
    };

    const prompt = pagePrompts[pageType] || pagePrompts.home;
    
    const systemMessage = designSystem ? 
        `You are a web developer. Generate ONLY complete HTML code with embedded CSS and JavaScript. Use this design system: ${JSON.stringify(designSystem)}. Maintain consistent styling across all pages.` :
        `You are a web developer. Generate ONLY complete HTML code with embedded CSS and JavaScript. Create a modern, professional design.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
        ],
        max_tokens: 3500, // Optimized for single page
        temperature: 0.7
    });

    return completion.choices[0].message.content;
}

// Determine what pages to generate based on project type
function getPageStructure(projectDescription) {
    const lowerDesc = projectDescription.toLowerCase();
    
    if (lowerDesc.includes('restaurant') || lowerDesc.includes('cafe') || lowerDesc.includes('food')) {
        return ['home', 'about', 'services', 'gallery', 'contact'];
    } else if (lowerDesc.includes('portfolio') || lowerDesc.includes('photography')) {
        return ['home', 'about', 'gallery', 'contact'];
    } else if (lowerDesc.includes('shop') || lowerDesc.includes('store') || lowerDesc.includes('ecommerce')) {
        return ['home', 'products', 'about', 'contact'];
    } else if (lowerDesc.includes('blog') || lowerDesc.includes('news')) {
        return ['home', 'about', 'blog', 'contact'];
    } else if (lowerDesc.includes('healthcare') || lowerDesc.includes('medical') || lowerDesc.includes('dental')) {
        return ['home', 'services', 'about', 'contact'];
    } else {
        // Default business structure
        return ['home', 'about', 'services', 'contact'];
    }
}

// Extract design system from first page for consistency
function extractDesignSystem(htmlContent) {
    const designSystem = {
        colors: {},
        fonts: {},
        spacing: {}
    };
    
    // Extract primary colors from CSS
    const colorMatches = htmlContent.match(/#[0-9a-fA-F]{6}/g);
    if (colorMatches && colorMatches.length > 0) {
        designSystem.colors.primary = colorMatches[0];
        designSystem.colors.secondary = colorMatches[1] || colorMatches[0];
        designSystem.colors.accent = colorMatches[2] || colorMatches[0];
    }
    
    // Extract font family
    const fontMatch = htmlContent.match(/font-family:\s*['"]([^'"]+)['"]/);
    if (fontMatch) {
        designSystem.fonts.primary = fontMatch[1];
    }
    
    return designSystem;
}

// Stitch pages together into a multi-page website
function stitchPagesIntoWebsite(pages, projectDescription) {
    const navigation = generateNavigation(Object.keys(pages));
    const footer = generateFooter();
    
    const website = {};
    
    // Process each page
    Object.entries(pages).forEach(([pageName, pageContent]) => {
        // Extract body content (remove html, head tags)
        const bodyMatch = pageContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const headMatch = pageContent.match(/<head[^>]*>([\s\S]*)<\/head>/i);
        
        if (bodyMatch && headMatch) {
            const bodyContent = bodyMatch[1];
            const headContent = headMatch[1];
            
            // Create complete page with consistent navigation
            website[pageName] = `<!DOCTYPE html>
<html lang="en">
<head>
    ${headContent}
</head>
<body>
    ${navigation}
    ${bodyContent}
    ${footer}
    
    <script>
        // Consistent navigation functionality across all pages
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
        }
    });
    
    return website;
}

function generateNavigation(pageNames) {
    return `
    <!-- Consistent Navigation -->
    <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 15px 0; position: sticky; top: 0; z-index: 100;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="color: #2c3e50;">CloudIDE</h2>
            <div>
                ${pageNames.map(page => `<a href="${page}.html" style="margin: 0 15px; text-decoration: none; color: #2c3e50; font-weight: 500;">${page.charAt(0).toUpperCase() + page.slice(1)}</a>`).join('')}
            </div>
        </div>
    </nav>`;
}

function generateFooter() {
    return `
    <!-- Consistent Footer -->
    <footer style="background: #2c3e50; color: white; padding: 40px 20px; text-align: center;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <p>&copy; 2024 Generated with CloudIDE. All rights reserved.</p>
            <p style="margin-top: 10px; opacity: 0.8;">Built with AI-powered website generation</p>
        </div>
    </footer>`;
}

// Main function to generate complete multi-page website
async function generateMultiPageWebsite(openai, projectDescription, imageSet) {
    console.log('🚀 Starting page-by-page generation for:', projectDescription);
    
    const pageStructure = getPageStructure(projectDescription);
    console.log('📄 Pages to generate:', pageStructure);
    
    const pages = {};
    let designSystem = null;
    
    // Generate each page
    for (let i = 0; i < pageStructure.length; i++) {
        const pageType = pageStructure[i];
        console.log(`📝 Generating ${pageType} page (${i + 1}/${pageStructure.length})...`);
        
        try {
            const pageContent = await generatePage(openai, projectDescription, pageType, designSystem);
            pages[pageType] = pageContent;
            
            // Extract design system from first page for consistency
            if (i === 0) {
                designSystem = extractDesignSystem(pageContent);
                console.log('🎨 Design system extracted:', designSystem);
            }
            
            console.log(`✅ ${pageType} page generated (${pageContent.length} characters)`);
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`❌ Failed to generate ${pageType} page:`, error.message);
            // Continue with other pages
        }
    }
    
    console.log('🔗 Stitching pages together...');
    const website = stitchPagesIntoWebsite(pages, projectDescription);
    
    // Return the main page (home) as the primary content
    return {
        mainPage: website.home || Object.values(website)[0],
        allPages: website,
        pageCount: Object.keys(website).length,
        generatedPages: Object.keys(website)
    };
}

module.exports = {
    generateMultiPageWebsite,
    generatePage,
    getPageStructure,
    extractDesignSystem,
    stitchPagesIntoWebsite
};
