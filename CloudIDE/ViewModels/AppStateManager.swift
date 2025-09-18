import Foundation
import SwiftUI

class AppStateManager: ObservableObject {
    @Published var websiteHistory: [Website] = []
    @Published var favoriteWebsites: [Website] = []
    @Published var userPreferences = UserPreferences()
    
    func addWebsite(_ website: Website) {
        withAnimation(.easeInOut(duration: 0.3)) {
            websiteHistory.insert(website, at: 0)
            
            // Keep only last 50 websites for performance
            if websiteHistory.count > 50 {
                websiteHistory = Array(websiteHistory.prefix(50))
            }
        }
    }
    
    func toggleFavorite(_ website: Website) {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
            if favoriteWebsites.contains(where: { $0.id == website.id }) {
                favoriteWebsites.removeAll { $0.id == website.id }
            } else {
                var favoriteWebsite = website
                favoriteWebsite.isFavorite = true
                favoriteWebsites.append(favoriteWebsite)
            }
        }
    }
    
    func isFavorite(_ website: Website) -> Bool {
        favoriteWebsites.contains { $0.id == website.id }
    }
    
    func clearHistory() {
        withAnimation(.easeInOut(duration: 0.5)) {
            websiteHistory.removeAll()
        }
    }
}
