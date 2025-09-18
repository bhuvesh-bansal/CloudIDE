import SwiftUI
import Combine

struct AdvancedChatView: View {
    @StateObject private var viewModel = ChatViewModel()
    @FocusState private var isTextFieldFocused: Bool
    // Removed scrollProxy as it's handled directly in ScrollViewReader
    @State private var showQuickActions = false
    
    var onWebsiteGenerated: (Website) -> Void
    var isPreviewCollapsed: Bool = false
    
    var body: some View {
        ZStack {
            // Dynamic gradient background
            AnimatedGradientBackground()
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Enhanced Header with status
                HeaderView(
                    connectionStatus: viewModel.connectionStatus,
                    generationProgress: viewModel.generationProgress,
                    isLoading: viewModel.isLoading
                )
                
                // Messages area with advanced scrolling
                MessagesScrollView(
                    messages: viewModel.messages,
                    isLoading: viewModel.isLoading,
                    generationProgress: viewModel.generationProgress,
                    isPreviewCollapsed: isPreviewCollapsed,
                    currentWebsite: viewModel.currentWebsite
                )
                
                // Quick action suggestions
                if showQuickActions && viewModel.messages.isEmpty {
                    QuickActionsView(onQuickPrompt: viewModel.useQuickPrompt)
                        .transition(.asymmetric(
                            insertion: .move(edge: .bottom).combined(with: .opacity),
                            removal: .move(edge: .bottom).combined(with: .opacity)
                        ))
                }
                
                // Enhanced input area
                EnhancedInputView(
                    messageText: $viewModel.messageText,
                    isTextFieldFocused: $isTextFieldFocused,
                    isLoading: viewModel.isLoading,
                    onSend: viewModel.sendMessage,
                    onQuickActionsToggle: { showQuickActions.toggle() }
                )
            }
        }
        .onTapGesture {
            isTextFieldFocused = false
            withAnimation(.easeInOut(duration: 0.3)) {
                showQuickActions = false
            }
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5).delay(0.5)) {
                showQuickActions = true
            }
        }
        .onChange(of: viewModel.currentWebsite) { website in
            if let website = website {
                onWebsiteGenerated(website)
            }
        }
        .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
            Button("OK") {
                viewModel.errorMessage = nil
            }
            Button("Retry") {
                viewModel.retryLastMessage()
            }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }
}

// MARK: - Animated Gradient Background
struct AnimatedGradientBackground: View {
    @State private var animateGradient = false
    
    var body: some View {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.4, green: 0.48, blue: 0.92),
                Color(red: 0.46, green: 0.29, blue: 0.64),
                Color(red: 0.3, green: 0.6, blue: 0.9)
            ]),
            startPoint: animateGradient ? .topLeading : .bottomTrailing,
            endPoint: animateGradient ? .bottomTrailing : .topLeading
        )
        .onAppear {
            withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                animateGradient.toggle()
            }
        }
    }
}

// MARK: - Enhanced Header
struct HeaderView: View {
    let connectionStatus: ChatViewModel.ConnectionStatus
    let generationProgress: ChatViewModel.GenerationProgress
    let isLoading: Bool
    
    var body: some View {
        HStack {
            // CloudIDE branding with animation
            HStack(spacing: 8) {
                Image(systemName: "cloud.fill")
                    .foregroundColor(.white)
                    .font(.title2)
                    .scaleEffect(isLoading ? 1.1 : 1.0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isLoading)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("CloudIDE")
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(isLoading ? generationProgress.displayText : "AI Website Generator")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .animation(.easeInOut(duration: 0.3), value: generationProgress)
                }
            }
            
            Spacer()
            
            // Enhanced status indicator
            StatusIndicator(status: connectionStatus)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(
            Rectangle()
                .fill(.ultraThinMaterial)
                .background(.white.opacity(0.1))
        )
    }
}

// MARK: - Status Indicator
struct StatusIndicator: View {
    let status: ChatViewModel.ConnectionStatus
    @State private var pulseScale: CGFloat = 1.0
    
    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(status.color)
                .frame(width: 8, height: 8)
                .scaleEffect(pulseScale)
                .animation(.easeInOut(duration: 1).repeatForever(autoreverses: true), value: pulseScale)
                .onAppear {
                    pulseScale = 1.2
                }
            
            Text(status.displayText)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.white.opacity(0.9))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(.white.opacity(0.2))
                .overlay(
                    Capsule()
                        .stroke(.white.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

// MARK: - Messages Scroll View
struct MessagesScrollView: View {
    let messages: [ChatMessage]
    let isLoading: Bool
    let generationProgress: ChatViewModel.GenerationProgress
    let isPreviewCollapsed: Bool
    let currentWebsite: Website?
    
    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 16) {
                    // Welcome state
                    if messages.isEmpty {
                        WelcomeView()
                            .transition(.asymmetric(
                                insertion: .scale.combined(with: .opacity),
                                removal: .scale.combined(with: .opacity)
                            ))
                    }
                    
                    // Messages
                    ForEach(messages) { message in
                        AdvancedMessageBubble(message: message)
                            .transition(.asymmetric(
                                insertion: .move(edge: .trailing).combined(with: .opacity),
                                removal: .move(edge: .leading).combined(with: .opacity)
                            ))
                    }
                    
                    // Loading indicator
                    if isLoading {
                        LoadingIndicator(progress: generationProgress)
                            .transition(.scale.combined(with: .opacity))
                    }
                    
                    // Preview collapsed indicator
                    if isPreviewCollapsed && currentWebsite != nil {
                        PreviewCollapsedIndicator()
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 20)
            }
            .onChange(of: messages.count) { _ in
                // Auto-scroll to bottom with animation
                if let lastMessage = messages.last {
                    withAnimation(.easeInOut(duration: 0.5)) {
                        proxy.scrollTo(lastMessage.id, anchor: .bottom)
                    }
                }
            }
        }
    }
}

// MARK: - Welcome View
struct WelcomeView: View {
    @State private var animateElements = false
    
    var body: some View {
        VStack(spacing: 24) {
            // Animated icon
            ZStack {
                Circle()
                    .fill(.white.opacity(0.1))
                    .frame(width: 120, height: 120)
                    .scaleEffect(animateElements ? 1.1 : 1.0)
                
                Image(systemName: "sparkles")
                    .font(.system(size: 50, weight: .light))
                    .foregroundColor(.white.opacity(0.9))
                    .rotationEffect(.degrees(animateElements ? 5 : -5))
            }
            
            VStack(spacing: 12) {
                Text("Welcome to CloudIDE")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .opacity(animateElements ? 1 : 0)
                
                Text("Create stunning websites with AI")
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .opacity(animateElements ? 1 : 0)
            }
            
            // Feature highlights
            VStack(alignment: .leading, spacing: 12) {
                FeatureRow(icon: "wand.and.stars", text: "AI-powered website generation")
                FeatureRow(icon: "paintbrush.fill", text: "Beautiful, responsive designs")
                FeatureRow(icon: "square.and.arrow.down", text: "Download ready-to-use HTML")
                FeatureRow(icon: "iphone", text: "Optimized for all devices")
            }
            .opacity(animateElements ? 1 : 0)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.2).delay(0.3)) {
                animateElements = true
            }
        }
    }
}

// MARK: - Feature Row
struct FeatureRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
                .frame(width: 20)
            
            Text(text)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
            
            Spacer()
        }
    }
}

// MARK: - Advanced Message Bubble
struct AdvancedMessageBubble: View {
    let message: ChatMessage
    @State private var animateAppearance = false
    
    var body: some View {
        HStack {
            if message.isUser {
                Spacer()
            }
            
            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 6) {
                Text(message.text)
                    .font(.body)
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
                                // AI response - animated glass effect
                                Rectangle()
                                    .fill(.ultraThinMaterial)
                                    .background(.white.opacity(animateAppearance ? 0.9 : 0.7))
                            }
                        }
                    )
                    .foregroundColor(message.isUser ? .white : .primary)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .shadow(
                        color: .black.opacity(0.1),
                        radius: animateAppearance ? 8 : 4,
                        x: 0,
                        y: animateAppearance ? 4 : 2
                    )
                
                Text(message.timeString)
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))
                    .padding(.horizontal, 8)
            }
            .scaleEffect(animateAppearance ? 1 : 0.8)
            .opacity(animateAppearance ? 1 : 0)
            
            if !message.isUser {
                Spacer()
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.1)) {
                animateAppearance = true
            }
        }
    }
}

// MARK: - Loading Indicator
struct LoadingIndicator: View {
    let progress: ChatViewModel.GenerationProgress
    @State private var animateProgress = false
    
    var body: some View {
        HStack(spacing: 12) {
            // Animated progress indicator
            ZStack {
                Circle()
                    .stroke(.white.opacity(0.3), lineWidth: 3)
                    .frame(width: 24, height: 24)
                
                Circle()
                    .trim(from: 0, to: animateProgress ? 1 : 0)
                    .stroke(.white, lineWidth: 3)
                    .frame(width: 24, height: 24)
                    .rotationEffect(.degrees(animateProgress ? 360 : 0))
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(progress.displayText)
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                Text("This may take a few moments...")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
            }
            
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(.white.opacity(0.15))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(.white.opacity(0.2), lineWidth: 1)
                )
        )
        .onAppear {
            withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                animateProgress = true
            }
        }
    }
}

// MARK: - Quick Actions
struct QuickActionsView: View {
    let onQuickPrompt: (String) -> Void
    
    private let quickPrompts = [
        ("💼", "Business consulting website"),
        ("☕", "Modern coffee shop with menu"),
        ("📸", "Photography portfolio showcase"),
        ("🏥", "Healthcare clinic website"),
        ("🎨", "Creative design agency"),
        ("🛍️", "E-commerce store"),
        ("🎓", "Online education platform"),
        ("👋", "Hello World developer site")
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("✨ Quick Start")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
                .padding(.horizontal, 20)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                ForEach(Array(quickPrompts.enumerated()), id: \.offset) { index, prompt in
                    QuickActionCard(
                        emoji: prompt.0,
                        text: prompt.1,
                        onTap: { onQuickPrompt(prompt.1) }
                    )
                    .transition(.asymmetric(
                        insertion: .scale.combined(with: .opacity),
                        removal: .scale.combined(with: .opacity)
                    ))
                }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.bottom, 16)
    }
}

// MARK: - Quick Action Card
struct QuickActionCard: View {
    let emoji: String
    let text: String
    let onTap: () -> Void
    @State private var isPressed = false
    
    var body: some View {
        Button(action: {
            let impactFeedback = UIImpactFeedbackGenerator(style: .light)
            impactFeedback.impactOccurred()
            onTap()
        }) {
            VStack(spacing: 8) {
                Text(emoji)
                    .font(.title2)
                
                Text(text)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
            .frame(width: 120, height: 80)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(.white.opacity(isPressed ? 0.3 : 0.2))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(.white.opacity(0.3), lineWidth: 1)
                    )
            )
            .scaleEffect(isPressed ? 0.95 : 1.0)
        }
        .buttonStyle(PlainButtonStyle())
        .onLongPressGesture(minimumDuration: 0, maximumDistance: .infinity, pressing: { pressing in
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = pressing
            }
        }, perform: {})
    }
}

// MARK: - Enhanced Input View
struct EnhancedInputView: View {
    @Binding var messageText: String
    @FocusState.Binding var isTextFieldFocused: Bool
    let isLoading: Bool
    let onSend: () -> Void
    let onQuickActionsToggle: () -> Void
    
    @State private var textFieldHeight: CGFloat = 44
    
    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                // Quick actions button
                Button(action: onQuickActionsToggle) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(.white.opacity(0.8))
                        .scaleEffect(isTextFieldFocused ? 0.8 : 1.0)
                        .animation(.spring(response: 0.3), value: isTextFieldFocused)
                }
                .disabled(isLoading)
                
                // Enhanced text field
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 22)
                        .fill(.white.opacity(0.9))
                        .overlay(
                            RoundedRectangle(cornerRadius: 22)
                                .stroke(.white.opacity(0.3), lineWidth: 1)
                        )
                        .frame(height: max(44, textFieldHeight))
                    
                    TextField("Describe your dream website...", text: $messageText, axis: .vertical)
                        .focused($isTextFieldFocused)
                        .textFieldStyle(.plain)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .font(.body)
                        .lineLimit(1...5)
                        .onSubmit {
                            if !messageText.isEmpty {
                                onSend()
                            }
                        }
                        .background(
                            GeometryReader { geometry in
                                Color.clear
                                    .onAppear {
                                        textFieldHeight = geometry.size.height
                                    }
                                    .onChange(of: messageText) { _ in
                                        textFieldHeight = geometry.size.height
                                    }
                            }
                        )
                }
                
                // Enhanced send button
                Button(action: onSend) {
                    Image(systemName: isLoading ? "stop.circle.fill" : "paperplane.fill")
                        .font(.title2)
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(
                            Circle()
                                .fill(messageText.isEmpty ? .gray.opacity(0.6) : .white.opacity(0.2))
                                .overlay(
                                    Circle()
                                        .stroke(.white.opacity(0.4), lineWidth: 1)
                                )
                        )
                        .scaleEffect(messageText.isEmpty ? 0.9 : 1.0)
                        .rotationEffect(.degrees(isLoading ? 180 : 0))
                }
                .disabled(messageText.isEmpty || isLoading)
                .animation(.spring(response: 0.4, dampingFraction: 0.8), value: messageText.isEmpty)
                .animation(.easeInOut(duration: 0.3), value: isLoading)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
            .background(.white.opacity(0.1))
        }
    }
}

// MARK: - Preview Collapsed Indicator
struct PreviewCollapsedIndicator: View {
    @State private var animateBounce = false
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "eye.slash")
                .foregroundColor(.orange)
                .font(.title3)
                .scaleEffect(animateBounce ? 1.1 : 1.0)
            
            Text("Preview hidden - Tap the eye icon to view your website")
                .font(.callout)
                .foregroundColor(.white.opacity(0.9))
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(.orange.opacity(0.2))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(.orange.opacity(0.4), lineWidth: 1)
                )
        )
        .onAppear {
            withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                animateBounce = true
            }
        }
    }
}

#Preview {
    AdvancedChatView(onWebsiteGenerated: { _ in })
}
