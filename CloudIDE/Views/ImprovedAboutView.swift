import SwiftUI

struct ImprovedAboutView: View {
    @Environment(\.dismiss) var dismiss
    @State private var showFeatureDetails = false
    @State private var selectedFeature: AppFeature?
    
    var body: some View {
        NavigationView {
            ResponsiveContainer { geometry in
                ScrollView {
                    LazyVStack(spacing: 32) {
                        // Hero Section
                        heroSection
                        
                        // Features Overview
                        featuresSection
                        
                        // iOS Development Showcase
                        iOSDevelopmentSection
                        
                        // Technology Stack
                        technologyStackSection
                        
                        // Developer Information
                        developerSection
                        
                        // Credits and Acknowledgments
                        creditsSection
                    }
                    .padding(.horizontal, ResponsiveLayout.padding(for: geometry))
                    .padding(.vertical, 24)
                }
            }
            .background(Color.dynamicBackground)
            .navigationTitle("About CloudIDE")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .sheet(item: $selectedFeature) { feature in
            FeatureDetailSheet(feature: feature)
        }
    }
    
    // MARK: - Hero Section
    private var heroSection: some View {
        EnhancedCard {
            VStack(spacing: 24) {
                // App Icon and Branding
                VStack(spacing: 16) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 24)
                            .fill(LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.cloudIDEBlue,
                                    Color.cloudIDEPurple,
                                    Color.cloudIDEAccent
                                ]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 100, height: 100)
                            .shadow(color: Color.cloudIDEBlue.opacity(0.3), radius: 20, x: 0, y: 10)
                        
                        Image(systemName: "cloud.fill")
                            .font(.system(size: 50, weight: .medium))
                            .foregroundColor(.white)
                    }
                    
                    VStack(spacing: 8) {
                        Text("CloudIDE")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                        
                        Text("AI-Powered Website Generator")
                            .font(.title3)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                        
                        TagView(text: "Version \(AppConfig.appVersion)", color: .cloudIDEAccent)
                    }
                }
                
                // Mission Statement
                VStack(spacing: 12) {
                    Text("Empowering Creativity")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.cloudIDEBlue)
                    
                    Text("CloudIDE demonstrates advanced iOS development skills through a sophisticated SwiftUI application that generates professional websites using AI. This project showcases modern development patterns, advanced UI/UX design, and seamless integration with cloud services.")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(2)
                }
            }
        }
    }
    
    // MARK: - Features Section
    private var featuresSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Key Features", icon: "star.fill", color: .cloudIDEBlue)
                
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    ForEach(AppFeature.allFeatures) { feature in
                        FeatureCard(feature: feature) {
                            selectedFeature = feature
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - iOS Development Section
    private var iOSDevelopmentSection: some View {
        EnhancedCard(borderColor: .cloudIDEPurple.opacity(0.3)) {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "iOS Development Showcase", icon: "swift", color: .cloudIDEPurple)
                
                VStack(spacing: 16) {
                    DevelopmentSkill(
                        title: "MVVM + Combine Architecture",
                        description: "Reactive programming with proper separation of concerns",
                        icon: "arrow.triangle.branch",
                        color: .cloudIDEPurple
                    )
                    
                    DevelopmentSkill(
                        title: "Advanced SwiftUI",
                        description: "Custom animations, adaptive layouts, and performance optimization",
                        icon: "paintbrush.pointed",
                        color: .cloudIDEBlue
                    )
                    
                    DevelopmentSkill(
                        title: "WebKit Integration",
                        description: "Advanced WKWebView with JavaScript communication",
                        icon: "globe",
                        color: .cloudIDEAccent
                    )
                    
                    DevelopmentSkill(
                        title: "iOS-Specific Features",
                        description: "Haptic feedback, adaptive design, and native UI patterns",
                        icon: "iphone",
                        color: .successGreen
                    )
                }
            }
        }
    }
    
    // MARK: - Technology Stack Section
    private var technologyStackSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Technology Stack", icon: "gearshape.2", color: .warningOrange)
                
                VStack(spacing: 16) {
                    TechnologyCategory(
                        title: "iOS Development",
                        technologies: ["SwiftUI", "Combine", "WebKit", "Foundation"],
                        color: .cloudIDEBlue
                    )
                    
                    TechnologyCategory(
                        title: "Backend Services",
                        technologies: ["Node.js", "Express", "OpenAI API", "Render.com"],
                        color: .successGreen
                    )
                    
                    TechnologyCategory(
                        title: "AI & Data",
                        technologies: ["GPT-4", "DuckDuckGo API", "JSON", "REST APIs"],
                        color: .cloudIDEPurple
                    )
                    
                    TechnologyCategory(
                        title: "Development Tools",
                        technologies: ["Xcode", "Git", "npm", "JavaScript"],
                        color: .warningOrange
                    )
                }
            }
        }
    }
    
    // MARK: - Developer Section
    private var developerSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Developer", icon: "person.circle", color: .cloudIDEAccent)
                
                HStack(spacing: 16) {
                    // Developer Avatar
                    ZStack {
                        Circle()
                            .fill(LinearGradient(
                                gradient: Gradient(colors: [Color.cloudIDEBlue, Color.cloudIDEPurple]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 80, height: 80)
                        
                        Text("BB")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Bhuvesh Bansal")
                            .font(.title3)
                            .fontWeight(.bold)
                        
                        Text("iOS Developer")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        Text("Passionate about creating beautiful, performant iOS applications with modern development practices.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(3)
                    }
                    
                    Spacer()
                }
            }
        }
    }
    
    // MARK: - Credits Section
    private var creditsSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Credits & Acknowledgments", icon: "heart.fill", color: .errorRed)
                
                VStack(alignment: .leading, spacing: 12) {
                    CreditItem(
                        title: "OpenAI",
                        description: "GPT-4 API for intelligent website generation"
                    )
                    
                    CreditItem(
                        title: "Unsplash",
                        description: "High-quality images for website templates"
                    )
                    
                    CreditItem(
                        title: "SF Symbols",
                        description: "Beautiful iconography throughout the app"
                    )
                    
                    CreditItem(
                        title: "SwiftUI Community",
                        description: "Inspiration and best practices for modern iOS development"
                    )
                }
                
                Divider()
                    .padding(.vertical, 8)
                
                VStack(spacing: 8) {
                    Text("Made with ❤️ in SwiftUI")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.cloudIDEBlue)
                    
                    Text("© 2024 CloudIDE. All rights reserved.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
            }
        }
    }
}

// MARK: - Supporting Models and Views

struct AppFeature: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
    let color: Color
    let details: String
    
    static let allFeatures = [
        AppFeature(
            title: "AI Generation",
            description: "GPT-4 powered website creation",
            icon: "brain.head.profile",
            color: .cloudIDEPurple,
            details: "Uses OpenAI's GPT-4 to generate complete, professional websites with intelligent content, responsive design, and interactive features. The AI understands context and creates industry-specific content."
        ),
        AppFeature(
            title: "Smart Templates",
            description: "20+ professional templates",
            icon: "doc.text",
            color: .successGreen,
            details: "Curated collection of professional website templates covering various industries. Each template is responsive, modern, and customizable with dynamic content insertion."
        ),
        AppFeature(
            title: "Real-time Preview",
            description: "Live website preview",
            icon: "eye",
            color: .cloudIDEBlue,
            details: "Instant preview of generated websites with full interactivity. Features advanced WebView integration with JavaScript communication and mobile-optimized viewing."
        ),
        AppFeature(
            title: "Export & Share",
            description: "Download complete websites",
            icon: "square.and.arrow.up",
            color: .warningOrange,
            details: "Export complete HTML, CSS, and JavaScript files ready for deployment. Native iOS sharing integration allows easy distribution of generated websites."
        ),
        AppFeature(
            title: "Adaptive Design",
            description: "iPhone & iPad optimized",
            icon: "iphone.and.ipad",
            color: .cloudIDEAccent,
            details: "Responsive design that adapts to different screen sizes. iPhone uses tabbed interface while iPad features side-by-side chat and preview for enhanced productivity."
        ),
        AppFeature(
            title: "History & Favorites",
            description: "Save and organize websites",
            icon: "clock.fill",
            color: .errorRed,
            details: "Comprehensive history system with search, filtering, and favorites. Track your website generation progress and easily access previously created sites."
        )
    ]
}

struct FeatureCard: View {
    let feature: AppFeature
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                Image(systemName: feature.icon)
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(feature.color)
                
                VStack(spacing: 4) {
                    Text(feature.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                        .multilineTextAlignment(.center)
                    
                    Text(feature.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .padding(.horizontal, 12)
            .background(feature.color.opacity(0.1))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(feature.color.opacity(0.3), lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct DevelopmentSkill: View {
    let title: String
    let description: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .medium))
                .foregroundColor(color)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

struct TechnologyCategory: View {
    let title: String
    let technologies: [String]
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(color)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 8) {
                ForEach(technologies, id: \.self) { tech in
                    TagView(text: tech, color: color, size: .small)
                        .frame(maxWidth: .infinity)
                }
            }
        }
    }
}

struct CreditItem: View {
    let title: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title)
                .font(.body)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct FeatureDetailSheet: View {
    let feature: AppFeature
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Feature Header
                    EnhancedCard {
                        VStack(spacing: 16) {
                            Image(systemName: feature.icon)
                                .font(.system(size: 60, weight: .medium))
                                .foregroundColor(feature.color)
                            
                            VStack(spacing: 8) {
                                Text(feature.title)
                                    .font(.title2)
                                    .fontWeight(.bold)
                                
                                Text(feature.description)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                        }
                        .frame(maxWidth: .infinity)
                    }
                    
                    // Feature Details
                    EnhancedCard {
                        VStack(alignment: .leading, spacing: 16) {
                            SectionHeader(title: "About This Feature", icon: "info.circle")
                            
                            Text(feature.details)
                                .font(.body)
                                .lineSpacing(2)
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 24)
            }
            .navigationTitle(feature.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    ImprovedAboutView()
}
