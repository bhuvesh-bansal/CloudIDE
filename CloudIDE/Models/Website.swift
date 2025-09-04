import Foundation

struct Website: Codable, Identifiable {
    let id: String
    let prompt: String
    let html: String
    let createdAt: String
    
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        if let date = formatter.date(from: createdAt) {
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            return formatter.string(from: date)
        }
        return createdAt
    }
}

struct GenerateRequest: Codable {
    let prompt: String
}

struct GenerateResponse: Codable {
    let id: String
    let html: String
    let message: String
}
