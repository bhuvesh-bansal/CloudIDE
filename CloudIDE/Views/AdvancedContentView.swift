import SwiftUI

struct AdvancedContentView: View {
    @State private var currentWebsite: Website?
    @State private var isPreviewCollapsed = false
    @State private var selectedTab: MainTab = .chat
    @State private var showSettings = false
    @StateObject private var appState = AppStateManager()
    
    enum MainTab: String, CaseIterable {
        case chat = "Chat"
        case history = "History"
        case settings = "Settings"
        
        var icon: String {
            switch self {
            case .chat: return "message.circle.fill"
            case .history: return "clock.fill"
            case .settings: return "gearshape.fill"
            }
        }
        
        var activeColor: Color {
            switch self {
            case .chat: return .blue
            case .history: return .green
            case .settings: return .orange
            }
        }
    }
    
    var body: some View {
        NavigationView {
            GeometryReader { geometry in
                if geometry.size.width > 768 {
                    // iPad/Landscape layout - side by side
                    iPadLayout
                } else {
                    // iPhone/Portrait layout - tabbed interface
                    iPhoneLayout
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .environmentObject(appState)
        .onAppear {
            setupAppearance()
        }
    }
    
    // MARK: - iPad Layout
    private var iPadLayout: some View {
        HStack(spacing: 0) {
            // Left Panel - Chat Interface
            AdvancedChatView(
                onWebsiteGenerated: { website in
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                        currentWebsite = website
                        appState.addWebsite(website)
                    }
                },
                isPreviewCollapsed: isPreviewCollapsed
            )
            .frame(maxWidth: .infinity)
            
            // Collapsible Preview Panel
            if !isPreviewCollapsed {
                // Elegant divider
                Rectangle()
                    .fill(LinearGradient(
                        gradient: Gradient(colors: [.clear, .gray.opacity(0.3), .clear]),
                        startPoint: .top,
                        endPoint: .bottom
                    ))
                    .frame(width: 1)
                    .transition(.opacity)
                
                // Right Panel - Web Preview
                AdvancedWebPreviewView(website: currentWebsite)
                    .frame(maxWidth: .infinity)
                    .transition(.asymmetric(
                        insertion: .move(edge: .trailing).combined(with: .opacity),
                        removal: .move(edge: .trailing).combined(with: .opacity)
                    ))
            }
        }
        .navigationTitle("CloudIDE Pro")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                // Enhanced preview toggle
                if currentWebsite != nil {
                    Button(action: {
                        let impactFeedback = UIImpactFeedbackGenerator(style: .medium)
                        impactFeedback.impactOccurred()
                        
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                            isPreviewCollapsed.toggle()
                        }
                    }) {
                        Label(
                            isPreviewCollapsed ? "Show Preview" : "Hide Preview",
                            systemImage: isPreviewCollapsed ? "eye" : "eye.slash"
                        )
                        .foregroundColor(.blue)
                        .font(.title3)
                    }
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                // Advanced sidebar controls
                Menu {
                    Button(action: {
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                            isPreviewCollapsed.toggle()
                        }
                    }) {
                        Label(
                            isPreviewCollapsed ? "Show Preview" : "Hide Preview",
                            systemImage: isPreviewCollapsed ? "sidebar.right" : "rectangle.split.2x1"
                        )
                    }
                    
                    Button(action: { showSettings = true }) {
                        Label("Settings", systemImage: "gearshape")
                    }
                    
                    if currentWebsite != nil {
                        Button(action: {
                            // Clear current website
                            withAnimation(.easeInOut(duration: 0.5)) {
                                currentWebsite = nil
                            }
                        }) {
                            Label("Clear Preview", systemImage: "trash")
                        }
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(.blue)
                        .font(.title3)
                }
            }
        }
    }
    
    // MARK: - iPhone Layout
    private var iPhoneLayout: some View {
        TabView(selection: $selectedTab) {
            // Chat Tab
            AdvancedChatView(
                onWebsiteGenerated: { website in
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                        currentWebsite = website
                        appState.addWebsite(website)
                    }
                }
            )
            .tabItem {
                Label(MainTab.chat.rawValue, systemImage: MainTab.chat.icon)
            }
            .tag(MainTab.chat)
            
            // History Tab
            WebsiteHistoryView()
                .tabItem {
                    Label(MainTab.history.rawValue, systemImage: MainTab.history.icon)
                }
                .tag(MainTab.history)
            
            // Settings Tab
            SettingsView()
                .tabItem {
                    Label(MainTab.settings.rawValue, systemImage: MainTab.settings.icon)
                }
                .tag(MainTab.settings)
        }
        .accentColor(.blue)
        .navigationTitle(selectedTab.rawValue)
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func setupAppearance() {
        // Customize tab bar appearance
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.systemBackground
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

// MARK: - App State Manager
class AppStateManager: ObservableObject {
    @Published var websiteHistory: [Website] = []
    @Published var favoriteWebsites: [Website] = []
    @Published var userPreferences = UserPreferences()
    
    struct UserPreferences {
        var preferAI: Bool = true
        var autoSaveWebsites: Bool = true
        var enableHapticFeedback: Bool = true
        var defaultIndustry: String = "business"
    }
    
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
                favoriteWebsites.append(website)
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

// MARK: - Website History View
struct WebsiteHistoryView: View {
    @EnvironmentObject var appState: AppStateManager
    @State private var searchText = ""
    @State private var selectedWebsite: Website?
    
    var filteredWebsites: [Website] {
        if searchText.isEmpty {
            return appState.websiteHistory
        } else {
            return appState.websiteHistory.filter {
                $0.displayTitle.localizedCaseInsensitiveContains(searchText) ||
                $0.prompt.localizedCaseInsensitiveContains(searchText)
            }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search bar
                SearchBar(text: $searchText)
                    .padding(.horizontal)
                
                if filteredWebsites.isEmpty {
                    EmptyHistoryView()
                } else {
                    List {
                        ForEach(filteredWebsites) { website in
                            WebsiteHistoryRow(
                                website: website,
                                isFavorite: appState.isFavorite(website),
                                onFavoriteToggle: { appState.toggleFavorite(website) },
                                onTap: { selectedWebsite = website }
                            )
                        }
                        .onDelete(perform: deleteWebsites)
                    }
                    .listStyle(InsetGroupedListStyle())
                }
            }
            .navigationTitle("Website History")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    if !appState.websiteHistory.isEmpty {
                        Button("Clear All") {
                            appState.clearHistory()
                        }
                        .foregroundColor(.red)
                    }
                }
            }
        }
        .sheet(item: $selectedWebsite) { website in
            AdvancedFullScreenWebView(
                website: website,
                isPresented: .constant(true),
                webViewStore: WebViewStore()
            )
        }
    }
    
    private func deleteWebsites(offsets: IndexSet) {
        withAnimation(.easeInOut(duration: 0.3)) {
            appState.websiteHistory.remove(atOffsets: offsets)
        }
    }
}

// MARK: - Search Bar
struct SearchBar: View {
    @Binding var text: String
    @FocusState private var isFocused: Bool
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            
            TextField("Search websites...", text: $text)
                .focused($isFocused)
                .textFieldStyle(.plain)
            
            if !text.isEmpty {
                Button("Clear") {
                    text = ""
                }
                .foregroundColor(.blue)
                .font(.caption)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }
}

// MARK: - Empty History View
struct EmptyHistoryView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "clock")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("No Websites Yet")
                .font(.title2)
                .fontWeight(.medium)
                .foregroundColor(.gray)
            
            Text("Create your first website using the Chat tab, and it will appear here in your history.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Website History Row
struct WebsiteHistoryRow: View {
    let website: Website
    let isFavorite: Bool
    let onFavoriteToggle: () -> Void
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(website.displayTitle)
                        .font(.headline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                        .lineLimit(1)
                    
                    Text(website.prompt)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                    
                    HStack {
                        // Generation type badge
                        Text(website.isAIGenerated ? "AI" : "Template")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(
                                Capsule()
                                    .fill(website.isAIGenerated ? .blue : .green)
                            )
                        
                        Text(website.formattedDate)
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Spacer()
                    }
                }
                
                Spacer()
                
                // Favorite button
                Button(action: {
                    let impactFeedback = UIImpactFeedbackGenerator(style: .light)
                    impactFeedback.impactOccurred()
                    onFavoriteToggle()
                }) {
                    Image(systemName: isFavorite ? "heart.fill" : "heart")
                        .foregroundColor(isFavorite ? .red : .gray)
                        .font(.title3)
                        .scaleEffect(isFavorite ? 1.1 : 1.0)
                        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isFavorite)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @EnvironmentObject var appState: AppStateManager
    @State private var showAbout = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Generation Preferences") {
                    Toggle("Prefer AI Generation", isOn: $appState.userPreferences.preferAI)
                    Toggle("Auto-save Websites", isOn: $appState.userPreferences.autoSaveWebsites)
                    Toggle("Haptic Feedback", isOn: $appState.userPreferences.enableHapticFeedback)
                }
                
                Section("Statistics") {
                    HStack {
                        Text("Websites Created")
                        Spacer()
                        Text("\(appState.websiteHistory.count)")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("Favorites")
                        Spacer()
                        Text("\(appState.favoriteWebsites.count)")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("AI Generated")
                        Spacer()
                        Text("\(appState.websiteHistory.filter { $0.isAIGenerated }.count)")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section("App Information") {
                    Button("About CloudIDE") {
                        showAbout = true
                    }
                    
                    HStack {
                        Text("Version")
                        Spacer()
                        Text(AppConfig.appVersion)
                            .foregroundColor(.secondary)
                    }
                    
                    Button("Clear All Data") {
                        appState.clearHistory()
                        appState.favoriteWebsites.removeAll()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showAbout) {
            AboutView()
        }
    }
}

// MARK: - About View
struct AboutView: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // App icon and branding
                    VStack(spacing: 16) {
                        Image(systemName: "cloud.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        Text("CloudIDE")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                        
                        Text("AI-Powered Website Generator")
                            .font(.title3)
                            .foregroundColor(.secondary)
                    }
                    
                    // Features
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Features")
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        FeatureRow(icon: "brain.head.profile", text: "Advanced AI Generation")
                        FeatureRow(icon: "paintbrush.fill", text: "Professional Templates")
                        FeatureRow(icon: "iphone", text: "Mobile-Optimized Designs")
                        FeatureRow(icon: "square.and.arrow.down", text: "Export Ready HTML")
                        FeatureRow(icon: "clock.fill", text: "Generation History")
                        FeatureRow(icon: "heart.fill", text: "Favorite Websites")
                    }
                    
                    // Developer showcase
                    VStack(alignment: .leading, spacing: 16) {
                        Text("iOS Development Showcase")
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        Text("This app demonstrates advanced iOS development skills including:")
                            .font(.body)
                            .foregroundColor(.secondary)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("• MVVM Architecture with Combine")
                            Text("• Advanced SwiftUI Animations")
                            Text("• Custom UI Components")
                            Text("• WebKit Integration")
                            Text("• Haptic Feedback")
                            Text("• Responsive Layouts")
                            Text("• State Management")
                            Text("• Advanced Networking")
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 24)
            }
            .navigationTitle("About")
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
    AdvancedContentView()
}
