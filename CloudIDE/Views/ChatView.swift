import SwiftUI

struct ChatView: View {
    @StateObject private var apiService = APIService()
    @State private var messageText = ""
    @State private var messages: [ChatMessage] = []
    @State private var isLoading = false
    @State private var currentWebsite: Website?
    
    var onWebsiteGenerated: (Website) -> Void
    var isPreviewCollapsed: Bool = false
    
    var body: some View {
        VStack {
            // Header
            HStack {
                Image(systemName: "message.circle.fill")
                    .foregroundColor(.blue)
                    .font(.title2)
                Text("Chat Interface")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }
            .padding()
            .background(Color(.systemGray6))
            
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
            
            // Input area
            HStack {
                TextField("Describe what you want to build...", text: $messageText, axis: .vertical)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .lineLimit(1...3)
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .padding(8)
                        .background(messageText.isEmpty ? Color.gray : Color.blue)
                        .clipShape(Circle())
                }
                .disabled(messageText.isEmpty || isLoading)
            }
            .padding()
        }
        .background(Color(.systemBackground))
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
                    .padding(.vertical, 10)
                    .background(message.isUser ? Color.blue : Color(.systemGray5))
                    .foregroundColor(message.isUser ? .white : .primary)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                
                Text(message.timestamp, style: .time)
                    .font(.caption2)
                    .foregroundColor(.secondary)
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
