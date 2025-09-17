import Foundation

struct Website: Codable, Identifiable {
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
    
    // Map timestamp to createdAt for backward compatibility
    var createdAt: String { timestamp }
    
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        if let date = formatter.date(from: timestamp) {
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            return formatter.string(from: date)
        }
        return timestamp
    }
    
    var displayTitle: String {
        return title ?? "Generated Website"
    }
    
    var isAIGenerated: Bool {
        return aiGenerated ?? false
    }
}

struct GenerateRequest: Codable {
    let prompt: String
    let useAI: Bool
    
    init(prompt: String, useAI: Bool = true) {
        self.prompt = prompt
        self.useAI = useAI
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
    
    var displayTitle: String {
        return title ?? "Generated Website"
    }
    
    var isAIGenerated: Bool {
        return aiGenerated ?? false
    }
}
