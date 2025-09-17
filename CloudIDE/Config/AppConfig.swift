import Foundation

struct AppConfig {
    // MARK: - API Configuration
    static let localBaseURL = "http://localhost:3000/api"
    static let productionBaseURL = "https://cloudide-m5m8.onrender.com/api" // Live Render deployment
    
    // MARK: - Environment
    static let isDevelopment = false // Using live Render deployment
    
    // MARK: - Computed Properties
    static var baseURL: String {
        return isDevelopment ? localBaseURL : productionBaseURL
    }
    
    // MARK: - App Settings
    static let appName = "Cloud IDE"
    static let appVersion = "1.0.0"
    
    // MARK: - UI Configuration
    static let maxMessageLength = 500
    static let animationDuration: Double = 0.3
}
