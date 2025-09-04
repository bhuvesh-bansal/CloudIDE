// Creative Fallback Content Generator
// Generates creative, industry-specific content when AI services are unavailable

const creativeFallbacks = {
    'technology': {
        titles: [
            'TechVision Pro', 'InnovateFlow', 'DigitalDynamics', 'FutureTech Hub', 'SmartSolutions',
            'CodeCraft Studio', 'TechPulse', 'InnovationLab', 'DigitalForge', 'TechMatrix'
        ],
        descriptions: [
            'Revolutionary technology solutions that transform ideas into reality',
            'Cutting-edge digital innovation for the modern world',
            'Building the future with advanced technology solutions',
            'Empowering businesses through innovative tech solutions',
            'Where technology meets creativity and innovation'
        ],
        taglines: [
            'Building the Future', 'Innovation at its Core', 'Technology Redefined',
            'Empowering Tomorrow', 'Digital Excellence'
        ],
        features: [
            'AI-Powered Solutions', 'Cloud Infrastructure', 'Mobile Development',
            'Data Analytics', 'Cybersecurity', 'IoT Integration'
        ]
    },
    'business': {
        titles: [
            'EliteEnterprise', 'ProBusiness Solutions', 'CorporateExcellence', 'BusinessBoost Pro',
            'SuccessStrategies', 'ExecutiveEdge', 'BusinessMatrix', 'CorporateCraft',
            'EnterpriseFlow', 'BusinessVision'
        ],
        descriptions: [
            'Professional business solutions that drive success and growth',
            'Excellence in every transaction and business interaction',
            'Your trusted partner in business transformation and success',
            'Strategic business solutions for modern enterprises',
            'Empowering businesses to achieve their full potential'
        ],
        taglines: [
            'Excellence in Business', 'Success Through Innovation', 'Professional Excellence',
            'Business Transformation', 'Strategic Excellence'
        ],
        features: [
            'Strategic Consulting', 'Business Analytics', 'Process Optimization',
            'Market Research', 'Financial Planning', 'Growth Strategies'
        ]
    },
    'creative': {
        titles: [
            'CreativeCanvas', 'ArtisticVision Studio', 'DesignDreams', 'CreativeFlow Agency',
            'ArtistryUnleashed', 'DesignMatrix', 'CreativeCraft', 'ArtisticEdge',
            'DesignForge', 'CreativePulse'
        ],
        descriptions: [
            'Unleashing creativity through innovative design and artistic vision',
            'Where imagination meets reality in stunning visual creations',
            'Creative solutions that inspire and captivate audiences',
            'Transforming ideas into beautiful, impactful designs',
            'Artistic excellence that tells your unique story'
        ],
        taglines: [
            'Creativity Unleashed', 'Artistic Excellence', 'Design with Purpose',
            'Visual Innovation', 'Creative Mastery'
        ],
        features: [
            'Brand Design', 'UI/UX Design', 'Graphic Design', 'Web Design',
            'Illustration', 'Creative Strategy'
        ]
    },
    'photography': {
        titles: [
            'CaptureMoment Studio', 'LensCraft Pro', 'PhotoArtistry', 'VisualStory',
            'FramePerfect', 'PhotoMatrix', 'LensVision', 'CaptureCraft',
            'PhotoForge', 'VisualPulse'
        ],
        descriptions: [
            'Capturing life\'s beautiful moments with professional artistry',
            'Professional photography that tells compelling visual stories',
            'Visual artistry at its finest, preserving precious memories',
            'Where every frame tells a unique and beautiful story',
            'Professional photography services that capture your vision'
        ],
        taglines: [
            'Capturing Life\'s Moments', 'Visual Storytelling', 'Artistry in Every Frame',
            'Professional Photography', 'Visual Excellence'
        ],
        features: [
            'Portrait Photography', 'Event Photography', 'Commercial Photography',
            'Photo Editing', 'Print Services', 'Digital Delivery'
        ]
    },
    'startup': {
        titles: [
            'StartupVision', 'InnovateStart', 'LaunchPad Pro', 'StartupMatrix',
            'VentureCraft', 'StartupFlow', 'InnovationHub', 'StartupForge',
            'LaunchCraft', 'VenturePulse'
        ],
        descriptions: [
            'Revolutionary startup solutions that accelerate growth and success',
            'Empowering startups with innovative technology and strategies',
            'Building the next generation of successful businesses',
            'Startup solutions that transform ideas into thriving companies',
            'Your partner in startup success and innovation'
        ],
        taglines: [
            'Startup Success', 'Innovation First', 'Building Tomorrow',
            'Startup Excellence', 'Venture Innovation'
        ],
        features: [
            'MVP Development', 'Growth Hacking', 'Investor Relations',
            'Market Strategy', 'Team Building', 'Scaling Solutions'
        ]
    }
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateCreativeContent(prompt, analysis) {
    const industry = analysis.industry || 'business';
    const intent = analysis.intent || 'business';
    
    // Get fallback content for the detected industry
    const fallback = creativeFallbacks[industry] || creativeFallbacks['business'];
    
    // Generate creative content
    const title = getRandomItem(fallback.titles);
    const description = getRandomItem(fallback.descriptions);
    const tagline = getRandomItem(fallback.taglines);
    const features = fallback.features.slice(0, 6); // Take first 6 features
    
    // Add some randomization based on prompt keywords
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('modern') || promptLower.includes('tech')) {
        // Add tech-specific elements
        title = title.replace('Pro', 'Tech').replace('Solutions', 'Innovation');
    }
    
    if (promptLower.includes('creative') || promptLower.includes('art')) {
        // Add creative elements
        title = title.replace('Solutions', 'Studio').replace('Pro', 'Creative');
    }
    
    return {
        title,
        description,
        tagline,
        features,
        source: 'creative-fallback',
        confidence: 0.8
    };
}

module.exports = { generateCreativeContent };

