import Foundation

struct AppConfig {
    // MARK: - API Configuration
    static let localBaseURL = "http://localhost:3000/api"
    static let productionBaseURL = "https://backend-jbgfshexv-bhuveshbansals-projects.vercel.app/api" // Your latest Vercel deployment
    
    // MARK: - Environment
    static let isDevelopment = true // Set to false for production
    
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
