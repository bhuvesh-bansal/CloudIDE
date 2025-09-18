// CloudIDE Image Management System
// Provides random, high-quality images for generated websites

const imageCategories = {
    hero: [
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop'
    ],
    
    business: [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop'
    ],
    
    tech: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop'
    ],
    
    restaurant: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop'
    ],
    
    healthcare: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=600&fit=crop'
    ],
    
    portfolio: [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop'
    ],
    
    gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
    ],
    
    team: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    ]
};

// Get random image from category
function getRandomImage(category, index = null) {
    const images = imageCategories[category] || imageCategories.business;
    
    if (index !== null && index < images.length) {
        return images[index];
    }
    
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Get multiple random images from category
function getRandomImages(category, count = 4) {
    const images = imageCategories[category] || imageCategories.gallery;
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, images.length));
}

// Get image set for complete website
function getWebsiteImageSet(industry) {
    const heroImage = getRandomImage('hero');
    const businessImages = getRandomImages('business', 3);
    const galleryImages = getRandomImages('gallery', 6);
    const teamImages = getRandomImages('team', 3);
    
    // Industry-specific hero
    let industryHero = heroImage;
    if (imageCategories[industry]) {
        industryHero = getRandomImage(industry);
    }
    
    return {
        hero: industryHero,
        services: businessImages,
        gallery: galleryImages,
        team: teamImages,
        about: getRandomImage('business'),
        contact: getRandomImage('business', 1)
    };
}

// Generate image HTML with proper attributes
function generateImageHTML(src, alt, className = '', width = null, height = null) {
    const sizeAttrs = width && height ? `width="${width}" height="${height}"` : '';
    return `<img src="${src}" alt="${alt}" class="${className}" ${sizeAttrs} loading="lazy">`;
}

module.exports = {
    getRandomImage,
    getRandomImages,
    getWebsiteImageSet,
    generateImageHTML,
    imageCategories
};
