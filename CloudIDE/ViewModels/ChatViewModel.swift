import Foundation
import Combine
import SwiftUI

@MainActor
class ChatViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var messages: [ChatMessage] = []
    @Published var messageText: String = ""
    @Published var isLoading: Bool = false
    @Published var currentWebsite: Website?
    @Published var errorMessage: String?
    @Published var connectionStatus: ConnectionStatus = .unknown
    @Published var generationProgress: GenerationProgress = .idle
    
    // MARK: - Private Properties
    private let apiService: APIService
    private var cancellables = Set<AnyCancellable>()
    private let hapticFeedback = UIImpactFeedbackGenerator(style: .medium)
    
    // Using ConnectionStatus and GenerationProgress from AppModels
    
    // MARK: - Initialization
    init(apiService: APIService = APIService()) {
        self.apiService = apiService
        setupBindings()
        checkConnectionStatus()
    }
    
    // MARK: - Private Methods
    private func setupBindings() {
        // Debounce message text changes for better performance
        $messageText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .sink { [weak self] text in
                self?.validateInput(text)
            }
            .store(in: &cancellables)
    }
    
    private func validateInput(_ text: String) {
        // Clear error when user starts typing
        if !text.isEmpty && errorMessage != nil {
            errorMessage = nil
        }
    }
    
    private func checkConnectionStatus() {
        connectionStatus = .testing
        
        Task {
            do {
                let isConnected = try await apiService.testConnection()
                await MainActor.run {
                    connectionStatus = isConnected ? .connected : .disconnected
                }
            } catch {
                await MainActor.run {
                    connectionStatus = .disconnected
                    errorMessage = "Connection failed: \(error.localizedDescription)"
                }
            }
        }
    }
    
    // MARK: - Public Methods
    func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            showError("Please enter a description for your website")
            return
        }
        
        let userMessage = ChatMessage(
            id: UUID().uuidString,
            text: messageText,
            isUser: true,
            timestamp: Date()
        )
        
        // Add user message with animation
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            messages.append(userMessage)
        }
        
        let prompt = messageText
        messageText = ""
        
        // Provide haptic feedback
        hapticFeedback.impactOccurred()
        
        generateWebsite(prompt: prompt)
    }
    
    private func generateWebsite(prompt: String) {
        isLoading = true
        generationProgress = .researching
        
        Task {
            do {
                // Simulate research phase
                try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
                await MainActor.run {
                    generationProgress = .generating
                }
                
                let response = try await apiService.generateWebsite(prompt: prompt, useAI: true)
                
                await MainActor.run {
                    generationProgress = .completing
                }
                
                // Brief completion phase
                try await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
                
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
                    text: generateSuccessMessage(for: response),
                    isUser: false,
                    timestamp: Date()
                )
                
                await MainActor.run {
                    // Animate the completion
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                        messages.append(assistantMessage)
                        currentWebsite = website
                        isLoading = false
                        generationProgress = .idle
                    }
                    
                    // Success haptic feedback
                    let successFeedback = UINotificationFeedbackGenerator()
                    successFeedback.notificationOccurred(.success)
                }
                
            } catch {
                await MainActor.run {
                    handleGenerationError(error)
                }
            }
        }
    }
    
    private func generateSuccessMessage(for response: GenerateResponse) -> String {
        let websiteType = response.isAIGenerated ? "AI-powered" : "professionally designed"
        let emoji = response.isAIGenerated ? "🤖✨" : "📋✨"
        
        return "\(emoji) I've created \(response.displayTitle) - a \(websiteType) website based on your request! Tap the preview to explore your new website."
    }
    
    private func handleGenerationError(_ error: Error) {
        let errorMessage = ChatMessage(
            id: UUID().uuidString,
            text: "I encountered an issue creating your website: \(error.localizedDescription). Please check your connection and try again.",
            isUser: false,
            timestamp: Date()
        )
        
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            messages.append(errorMessage)
            isLoading = false
            generationProgress = .idle
        }
        
        // Error haptic feedback
        let errorFeedback = UINotificationFeedbackGenerator()
        errorFeedback.notificationOccurred(.error)
        
        self.errorMessage = error.localizedDescription
    }
    
    private func showError(_ message: String) {
        errorMessage = message
        
        // Error haptic feedback
        let errorFeedback = UINotificationFeedbackGenerator()
        errorFeedback.notificationOccurred(.error)
        
        // Auto-clear error after 3 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            if self.errorMessage == message {
                self.errorMessage = nil
            }
        }
    }
    
    func clearMessages() {
        withAnimation(.easeInOut(duration: 0.5)) {
            messages.removeAll()
            currentWebsite = nil
            errorMessage = nil
        }
    }
    
    func retryLastMessage() {
        guard let lastUserMessage = messages.last(where: { $0.isUser }) else { return }
        generateWebsite(prompt: lastUserMessage.text)
    }
    
    // MARK: - Quick Actions
    func useQuickPrompt(_ prompt: String) {
        messageText = prompt
        
        // Animate text appearance
        withAnimation(.easeInOut(duration: 0.3)) {
            // Text is already set, just provide feedback
        }
        
        // Provide haptic feedback
        let selectionFeedback = UISelectionFeedbackGenerator()
        selectionFeedback.selectionChanged()
    }
}
