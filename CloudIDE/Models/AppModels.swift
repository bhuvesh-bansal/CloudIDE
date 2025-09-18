import Foundation
import SwiftUI

// MARK: - Core Protocols
protocol Timestampable {
    var timestampDate: Date { get }
    var formattedDate: String { get }
}

protocol Searchable {
    func matches(searchText: String) -> Bool
}

protocol Favoritable {
    var isFavorite: Bool { get set }
}

// MARK: - Enhanced Website Model
struct Website: Codable, Identifiable, Equatable, Timestampable, Searchable, Favoritable {
    let id: String
    let title: String?
    let prompt: String
    let html: String
    let timestamp: String
    let description: String?
    let industry: String?
    let source: String?
    let aiGenerated: Bool?
    let optimizedPrompt: String?
    var isFavorite: Bool
    
    // MARK: - Initializers
    init(id: String, title: String?, prompt: String, html: String, timestamp: String, 
         description: String?, industry: String?, source: String?, aiGenerated: Bool?, 
         optimizedPrompt: String?, isFavorite: Bool = false) {
        self.id = id
        self.title = title
        self.prompt = prompt
        self.html = html
        self.timestamp = timestamp
        self.description = description
        self.industry = industry
        self.source = source
        self.aiGenerated = aiGenerated
        self.optimizedPrompt = optimizedPrompt
        self.isFavorite = isFavorite
    }
    
    // MARK: - Codable Implementation
    enum CodingKeys: String, CodingKey {
        case id, title, prompt, html, timestamp, description, industry, source, aiGenerated, optimizedPrompt, isFavorite
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        title = try container.decodeIfPresent(String.self, forKey: .title)
        prompt = try container.decode(String.self, forKey: .prompt)
        html = try container.decode(String.self, forKey: .html)
        timestamp = try container.decode(String.self, forKey: .timestamp)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        industry = try container.decodeIfPresent(String.self, forKey: .industry)
        source = try container.decodeIfPresent(String.self, forKey: .source)
        aiGenerated = try container.decodeIfPresent(Bool.self, forKey: .aiGenerated)
        optimizedPrompt = try container.decodeIfPresent(String.self, forKey: .optimizedPrompt)
        isFavorite = try container.decodeIfPresent(Bool.self, forKey: .isFavorite) ?? false
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encodeIfPresent(title, forKey: .title)
        try container.encode(prompt, forKey: .prompt)
        try container.encode(html, forKey: .html)
        try container.encode(timestamp, forKey: .timestamp)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(industry, forKey: .industry)
        try container.encodeIfPresent(source, forKey: .source)
        try container.encodeIfPresent(aiGenerated, forKey: .aiGenerated)
        try container.encodeIfPresent(optimizedPrompt, forKey: .optimizedPrompt)
        try container.encode(isFavorite, forKey: .isFavorite)
    }
    
    // Computed Properties
    var displayTitle: String {
        return title ?? "Generated Website"
    }
    
    var isAIGenerated: Bool {
        return aiGenerated ?? false
    }
    
    var timestampDate: Date {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return formatter.date(from: timestamp) ?? Date()
    }
    
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: timestampDate)
    }
    
    var generationBadge: GenerationBadge {
        return GenerationBadge(
            text: isAIGenerated ? "AI" : "Template",
            color: isAIGenerated ? .blue : .green,
            icon: isAIGenerated ? "brain.head.profile" : "doc.text"
        )
    }
    
    // Searchable Protocol
    func matches(searchText: String) -> Bool {
        let lowercaseSearch = searchText.lowercased()
        return displayTitle.lowercased().contains(lowercaseSearch) ||
               prompt.lowercased().contains(lowercaseSearch) ||
               (description?.lowercased().contains(lowercaseSearch) ?? false) ||
               (industry?.lowercased().contains(lowercaseSearch) ?? false)
    }
    
    // Custom CodingKeys to handle timestamp mapping
    enum CodingKeys: String, CodingKey {
        case id, title, prompt, html, description, industry, source, aiGenerated, optimizedPrompt, isFavorite
        case timestampString = "timestamp"
    }
}

// MARK: - Generation Badge Model
struct GenerationBadge {
    let text: String
    let color: Color
    let icon: String
    
    static let aiGenerated = GenerationBadge(
        text: "AI Generated",
        color: .blue,
        icon: "brain.head.profile"
    )
    
    static let template = GenerationBadge(
        text: "Template",
        color: .green,
        icon: "doc.text"
    )
}

// MARK: - App Statistics Model
struct AppStatistics: Codable {
    let totalWebsites: Int
    let aiGeneratedCount: Int
    let templateCount: Int
    let favoriteCount: Int
    let averageGenerationTime: Double
    let mostUsedIndustry: String?
    
    var aiPercentage: Double {
        guard totalWebsites > 0 else { return 0 }
        return (Double(aiGeneratedCount) / Double(totalWebsites)) * 100
    }
    
    var templatePercentage: Double {
        guard totalWebsites > 0 else { return 0 }
        return (Double(templateCount) / Double(totalWebsites)) * 100
    }
}

// MARK: - User Preferences Model
struct UserPreferences: Codable {
    var preferAI: Bool = true
    var autoSaveWebsites: Bool = true
    var enableHapticFeedback: Bool = true
    var defaultIndustry: String = "business"
    var theme: AppTheme = .system
    var notificationsEnabled: Bool = true
    var analyticsEnabled: Bool = false
    
    enum AppTheme: String, CaseIterable, Codable {
        case light = "light"
        case dark = "dark"
        case system = "system"
        
        var displayName: String {
            switch self {
            case .light: return "Light"
            case .dark: return "Dark"
            case .system: return "System"
            }
        }
        
        var colorScheme: ColorScheme? {
            switch self {
            case .light: return .light
            case .dark: return .dark
            case .system: return nil
            }
        }
    }
}

// MARK: - Connection Status Model
enum ConnectionStatus: Equatable {
    case unknown
    case connected
    case disconnected
    case testing
    case error(String)
    
    var displayText: String {
        switch self {
        case .unknown: return "Checking..."
        case .connected: return "AI Ready"
        case .disconnected: return "Offline"
        case .testing: return "Testing..."
        case .error: return "Error"
        }
    }
    
    var color: Color {
        switch self {
        case .unknown: return .orange
        case .connected: return .green
        case .disconnected: return .red
        case .testing: return .blue
        case .error: return .red
        }
    }
    
    var icon: String {
        switch self {
        case .unknown: return "questionmark.circle"
        case .connected: return "checkmark.circle.fill"
        case .disconnected: return "xmark.circle.fill"
        case .testing: return "clock.circle"
        case .error: return "exclamationmark.triangle.fill"
        }
    }
}

// MARK: - Generation Progress Model
enum GenerationProgress: Equatable {
    case idle
    case researching
    case generating
    case completing
    case error(String)
    
    var displayText: String {
        switch self {
        case .idle: return "Ready to create"
        case .researching: return "🔍 Researching online..."
        case .generating: return "🤖 Creating website..."
        case .completing: return "✨ Finalizing..."
        case .error(let message): return "❌ \(message)"
        }
    }
    
    var progress: Double {
        switch self {
        case .idle: return 0.0
        case .researching: return 0.25
        case .generating: return 0.75
        case .completing: return 0.95
        case .error: return 0.0
        }
    }
}

// MARK: - Quick Action Model
struct QuickAction: Identifiable, Equatable {
    let id = UUID().uuidString
    let emoji: String
    let title: String
    let prompt: String
    let category: Category
    
    enum Category: String, CaseIterable {
        case business = "Business"
        case creative = "Creative"
        case portfolio = "Portfolio"
        case ecommerce = "E-commerce"
        case personal = "Personal"
        
        var color: Color {
            switch self {
            case .business: return .blue
            case .creative: return .purple
            case .portfolio: return .green
            case .ecommerce: return .orange
            case .personal: return .pink
            }
        }
    }
    
    static let defaultActions: [QuickAction] = [
        QuickAction(emoji: "💼", title: "Business Site", prompt: "Create a professional business consulting website", category: .business),
        QuickAction(emoji: "☕", title: "Coffee Shop", prompt: "Build a modern coffee shop with menu and location", category: .business),
        QuickAction(emoji: "📸", title: "Portfolio", prompt: "Design a photography portfolio showcase", category: .portfolio),
        QuickAction(emoji: "🏥", title: "Healthcare", prompt: "Create a healthcare clinic website", category: .business),
        QuickAction(emoji: "🎨", title: "Creative Agency", prompt: "Build a creative design agency website", category: .creative),
        QuickAction(emoji: "🛍️", title: "Online Store", prompt: "Create an e-commerce store with products", category: .ecommerce),
        QuickAction(emoji: "🎓", title: "Education", prompt: "Design an online education platform", category: .business),
        QuickAction(emoji: "👋", title: "Hello World", prompt: "Create a simple Hello World developer website", category: .personal)
    ]
}

// MARK: - API Models
struct GenerateRequest: Codable {
    let prompt: String
    let useAI: Bool
    let includeImages: Bool
    let researchOnline: Bool
    
    init(prompt: String, useAI: Bool = true, includeImages: Bool = true, researchOnline: Bool = true) {
        self.prompt = prompt
        self.useAI = useAI
        self.includeImages = includeImages
        self.researchOnline = researchOnline
    }
    
    // Backward compatibility initializer
    init(prompt: String, useAI: Bool = true) {
        self.prompt = prompt
        self.useAI = useAI
        self.includeImages = true
        self.researchOnline = true
    }
}

struct GenerateResponse: Codable {
    let id: String
    let title: String?
    let html: String
    let prompt: String
    let timestamp: String
    let description: String?
    let industry: String?
    let source: String?
    let aiGenerated: Bool?
    let optimizedPrompt: String?
    let generationMethod: String?
    let hasOpenAI: Bool?
    let processingTime: Double?
    
    var displayTitle: String {
        return title ?? "Generated Website"
    }
    
    var isAIGenerated: Bool {
        return aiGenerated ?? false
    }
    
    func toWebsite() -> Website {
        return Website(
            id: id,
            title: title,
            prompt: prompt,
            html: html,
            timestamp: timestamp,
            description: description,
            industry: industry,
            source: source,
            aiGenerated: aiGenerated,
            optimizedPrompt: optimizedPrompt,
            isFavorite: false
        )
    }
}

// MARK: - Error Models
enum AppError: LocalizedError, Equatable {
    case networkError(String)
    case apiError(String)
    case validationError(String)
    case unknownError
    
    var errorDescription: String? {
        switch self {
        case .networkError(let message):
            return "Network Error: \(message)"
        case .apiError(let message):
            return "API Error: \(message)"
        case .validationError(let message):
            return "Validation Error: \(message)"
        case .unknownError:
            return "An unknown error occurred"
        }
    }
    
    var recoverySuggestion: String? {
        switch self {
        case .networkError:
            return "Please check your internet connection and try again."
        case .apiError:
            return "The service is temporarily unavailable. Please try again later."
        case .validationError:
            return "Please check your input and try again."
        case .unknownError:
            return "Please restart the app and try again."
        }
    }
}
