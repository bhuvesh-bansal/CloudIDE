import SwiftUI

struct ChatView: View {
    @StateObject private var apiService = APIService()
    @State private var messageText = ""
    @State private var messages: [ChatMessage] = []
    @State private var isLoading = false
    @State private var currentWebsite: Website?
    @FocusState private var isTextFieldFocused: Bool
    
    var onWebsiteGenerated: (Website) -> Void
    var isPreviewCollapsed: Bool = false
    
    var body: some View {
        ZStack {
            // Beautiful CloudIDE Background
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.4, green: 0.48, blue: 0.92), // #667eea
                    Color(red: 0.46, green: 0.29, blue: 0.64)  // #764ba2
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            // Optimized subtle pattern overlay
            Image(systemName: "cloud.fill")
                .font(.system(size: 200))
                .foregroundColor(.white.opacity(0.05))
                .scaleEffect(1.5)
                .allowsHitTesting(false) // Performance optimization
            
            VStack(spacing: 0) {
                // Enhanced Header
                HStack {
                    Image(systemName: "cloud.fill")
                        .foregroundColor(.white)
                        .font(.title2)
                    Text("CloudIDE Chat")
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    Spacer()
                    
                    // Status indicator
                    HStack(spacing: 4) {
                        Circle()
                            .fill(.green)
                            .frame(width: 8, height: 8)
                        Text("AI Ready")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.9))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
                .background(
                    Rectangle()
                        .fill(.ultraThinMaterial)
                        .background(.white.opacity(0.1))
                )
            
            // Messages
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(messages) { message in
                        MessageBubble(message: message)
                    }
                    
                    if isLoading {
                        HStack {
                            ProgressView()
                                .scaleEffect(0.8)
                            Text("Generating website...")
                                .foregroundColor(.secondary)
                            Spacer()
                        }
                        .padding(.horizontal)
                    }
                    
                    // Show preview collapsed indicator
                    if isPreviewCollapsed && currentWebsite != nil {
                        HStack {
                            Image(systemName: "eye.slash")
                                .foregroundColor(.orange)
                            Text("Preview collapsed - Tap the expand button to view your website")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Spacer()
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            
                // Enhanced Input Area
                VStack(spacing: 0) {
                    // Input container
                    HStack(spacing: 12) {
                        TextField("Describe the website you want to create...", text: $messageText, axis: .vertical)
                            .focused($isTextFieldFocused)
                            .textFieldStyle(.plain)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(.white.opacity(0.9))
                            .cornerRadius(20)
                            .lineLimit(1...4)
                            .font(.body)
                            .onSubmit {
                                if !messageText.isEmpty {
                                    sendMessage()
                                }
                            }
                            .toolbar {
                                ToolbarItemGroup(placement: .keyboard) {
                                    Spacer()
                                    Button("Done") {
                                        isTextFieldFocused = false
                                    }
                                    .foregroundColor(Color(red: 0.4, green: 0.48, blue: 0.92))
                                    .fontWeight(.semibold)
                                }
                            }
                        
                        Button(action: {
                            sendMessage()
                            isTextFieldFocused = false // Dismiss keyboard
                        }) {
                            Image(systemName: isLoading ? "stop.circle.fill" : "paperplane.fill")
                                .font(.title2)
                                .foregroundColor(.white)
                                .padding(12)
                                .background(
                                    Circle()
                                        .fill(messageText.isEmpty ? .gray.opacity(0.6) : .white.opacity(0.2))
                                        .overlay(
                                            Circle()
                                                .stroke(.white.opacity(0.3), lineWidth: 1)
                                        )
                                )
                        }
                        .disabled(messageText.isEmpty || isLoading)
                        .scaleEffect(messageText.isEmpty ? 0.9 : 1.0)
                        .animation(.spring(response: 0.3), value: messageText.isEmpty)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(.ultraThinMaterial)
                    .background(.white.opacity(0.1))
                }
            }
        }
        .onTapGesture {
            // Dismiss keyboard when tapping outside
            isTextFieldFocused = false
        }
    }
    
    private func sendMessage() {
        guard !messageText.isEmpty else { return }
        
        let userMessage = ChatMessage(
            id: UUID().uuidString,
            text: messageText,
            isUser: true,
            timestamp: Date()
        )
        
        messages.append(userMessage)
        let prompt = messageText
        messageText = ""
        isLoading = true
        
        Task {
            do {
                let response = try await apiService.generateWebsite(prompt: prompt)
                
                let website = Website(
                    id: response.id,
                    title: response.title,
                    prompt: response.prompt,
                    html: response.html,
                    timestamp: response.timestamp,
                    description: response.description,
                    industry: response.industry,
                    source: response.source,
                    aiGenerated: response.aiGenerated,
                    optimizedPrompt: response.optimizedPrompt
                )
                
                let assistantMessage = ChatMessage(
                    id: UUID().uuidString,
                    text: "I've generated \(response.displayTitle) based on your request. \(response.isAIGenerated ? "✨ AI-optimized" : "📋 Template-based") generation completed!",
                    isUser: false,
                    timestamp: Date()
                )
                
                await MainActor.run {
                    messages.append(assistantMessage)
                    isLoading = false
                    currentWebsite = website
                    onWebsiteGenerated(website)
                }
            } catch {
                await MainActor.run {
                    let errorMessage = ChatMessage(
                        id: UUID().uuidString,
                        text: "Connection error: \(error.localizedDescription). Check your internet connection or try again.",
                        isUser: false,
                        timestamp: Date()
                    )
                    messages.append(errorMessage)
                    isLoading = false
                }
                print("🔍 iOS App Error Details: \(error)")
            }
        }
    }
}

struct ChatMessage: Identifiable {
    let id: String
    let text: String
    let isUser: Bool
    let timestamp: Date
}

struct MessageBubble: View {
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
                    .background(
                        Group {
                            if message.isUser {
                                // User message - CloudIDE gradient
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        Color(red: 0.4, green: 0.48, blue: 0.92),
                                        Color(red: 0.46, green: 0.29, blue: 0.64)
                                    ]),
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            } else {
                                // AI response - glass effect
                                Rectangle()
                                    .fill(.ultraThinMaterial)
                                    .background(.white.opacity(0.8))
                            }
                        }
                    )
                    .foregroundColor(message.isUser ? .white : .primary)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                    .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
                
                Text(message.timestamp, style: .time)
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.7))
                    .padding(.horizontal, 4)
            }
            
            if !message.isUser {
                Spacer()
            }
        }
        .padding(.horizontal)
    }
}

#Preview {
    ChatView { _ in }
}
