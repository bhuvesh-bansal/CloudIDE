import SwiftUI

struct SimpleContentView: View {
    @State private var currentWebsite: Website?
    @State private var selectedTab: Tab = .chat
    @StateObject private var appState = AppStateManager()
    
    enum Tab: String, CaseIterable {
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
    }
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Chat Tab
            SimpleChatView(
                currentWebsite: $currentWebsite,
                onWebsiteGenerated: { website in
                    withAnimation {
                        currentWebsite = website
                        appState.addWebsite(website)
                    }
                }
            )
            .tabItem {
                Label(Tab.chat.rawValue, systemImage: Tab.chat.icon)
            }
            .tag(Tab.chat)
            
            // History Tab
            SimpleHistoryView()
                .tabItem {
                    Label(Tab.history.rawValue, systemImage: Tab.history.icon)
                }
                .tag(Tab.history)
                .environmentObject(appState)
            
            // Settings Tab
            SimpleSettingsView()
                .tabItem {
                    Label(Tab.settings.rawValue, systemImage: Tab.settings.icon)
                }
                .tag(Tab.settings)
                .environmentObject(appState)
        }
        .accentColor(.blue)
    }
}

struct SimpleChatView: View {
    @Binding var currentWebsite: Website?
    let onWebsiteGenerated: (Website) -> Void
    
    @StateObject private var viewModel = ChatViewModel()
    @FocusState private var isTextFieldFocused: Bool
    @State private var showPreview = false
    
    var body: some View {
        NavigationView {
            VStack {
                // Header
                HStack {
                    VStack(alignment: .leading) {
                        Text("CloudIDE")
                            .font(.title2)
                            .fontWeight(.bold)
                        Text("AI Website Generator")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    Text("AI Ready")
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.green.opacity(0.2))
                        .foregroundColor(.green)
                        .cornerRadius(12)
                }
                .padding()
                .background(Color(.systemGray6))
                
                // Messages
                ScrollView {
                    LazyVStack(spacing: 16) {
                        if viewModel.messages.isEmpty {
                            VStack(spacing: 20) {
                                Image(systemName: "sparkles")
                                    .font(.system(size: 60))
                                    .foregroundColor(.blue)
                                
                                Text("Welcome to CloudIDE")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                
                                Text("Describe your dream website and I'll create it for you!")
                                    .font(.body)
                                    .foregroundColor(.secondary)
                                    .multilineTextAlignment(.center)
                            }
                            .padding(.top, 100)
                        }
                        
                        ForEach(viewModel.messages) { message in
                            MessageBubbleView(message: message)
                        }
                        
                        if viewModel.isLoading {
                            HStack {
                                ProgressView()
                                    .scaleEffect(0.8)
                                Text("Creating your website...")
                                    .font(.body)
                                    .foregroundColor(.secondary)
                                Spacer()
                            }
                            .padding()
                        }
                        
                        if let website = currentWebsite, !viewModel.isLoading {
                            WebsiteGeneratedCard(website: website) {
                                showPreview = true
                            }
                        }
                    }
                    .padding()
                }
                
                // Input
                HStack(spacing: 12) {
                    TextField("Describe your website...", text: $viewModel.messageText)
                        .focused($isTextFieldFocused)
                        .textFieldStyle(.roundedBorder)
                        .autocorrectionDisabled(true)
                        .onSubmit {
                            sendMessage()
                        }
                    
                    Button(action: sendMessage) {
                        Image(systemName: "paperplane.fill")
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(viewModel.messageText.isEmpty ? Color.gray : Color.blue)
                            .cornerRadius(22)
                    }
                    .disabled(viewModel.messageText.isEmpty)
                }
                .padding()
            }
            .navigationTitle("Chat")
        }
        .onChange(of: viewModel.currentWebsite) { website in
            if let website = website {
                currentWebsite = website
                onWebsiteGenerated(website)
            }
        }
        .sheet(isPresented: $showPreview) {
            if let website = currentWebsite {
                NavigationView {
                    WebPreviewView(website: website)
                        .navigationTitle("Preview")
                        .navigationBarTitleDisplayMode(.inline)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Done") {
                                    showPreview = false
                                }
                            }
                        }
                }
            }
        }
    }
    
    private func sendMessage() {
        guard !viewModel.messageText.isEmpty else { return }
        
        currentWebsite = nil
        viewModel.sendMessage()
        isTextFieldFocused = false
    }
}

struct MessageBubbleView: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.isUser {
                Spacer()
            }
            
            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(message.isUser ? Color.blue : Color(.systemGray5))
                    .foregroundColor(message.isUser ? .white : .primary)
                    .cornerRadius(20)
                
                Text(message.timeString)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
            }
            
            if !message.isUser {
                Spacer()
            }
        }
    }
}

struct WebsiteGeneratedCard: View {
    let website: Website
    let onPreview: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.green)
                    .font(.title2)
                
                VStack(alignment: .leading) {
                    Text("Website Generated!")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Text(website.displayTitle)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Button(action: onPreview) {
                HStack {
                    Image(systemName: "eye.fill")
                    Text("Preview Website")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

struct SimpleHistoryView: View {
    @EnvironmentObject var appState: AppStateManager
    
    var body: some View {
        NavigationView {
            List {
                if appState.websiteHistory.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "clock")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        
                        Text("No Websites Yet")
                            .font(.title2)
                            .fontWeight(.medium)
                        
                        Text("Create your first website in the Chat tab!")
                            .font(.body)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .listRowBackground(Color.clear)
                } else {
                    ForEach(appState.websiteHistory) { website in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(website.displayTitle)
                                .font(.headline)
                            
                            Text(website.prompt)
                                .font(.body)
                                .foregroundColor(.secondary)
                                .lineLimit(2)
                            
                            Text(website.formattedDate)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("History")
        }
    }
}

struct SimpleSettingsView: View {
    @EnvironmentObject var appState: AppStateManager
    
    var body: some View {
        NavigationView {
            Form {
                Section("Statistics") {
                    HStack {
                        Text("Websites Created")
                        Spacer()
                        Text("\(appState.websiteHistory.count)")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section("App Information") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text(AppConfig.appVersion)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("App Name")
                        Spacer()
                        Text("CloudIDE")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    SimpleContentView()
}
