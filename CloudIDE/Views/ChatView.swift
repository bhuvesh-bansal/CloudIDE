import SwiftUI
import WebKit

struct ChatView: View {
    @Binding var currentWebsite: Website?
    let onWebsiteGenerated: (Website) -> Void
    
    @StateObject private var viewModel = ChatViewModel()
    @FocusState private var isTextFieldFocused: Bool
    @State private var showQuickActions = false
    @State private var showPreview = false
    
    var body: some View {
        ZStack {
            // Dynamic gradient background
            AnimatedGradientBackground()
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Enhanced Header with status and preview button
                headerView
                
                // Messages area with advanced scrolling
                messagesScrollView
                
                // Quick action suggestions
                if showQuickActions && viewModel.messages.isEmpty {
                    quickActionsView
                }
                
                // Enhanced input area
                inputView
            }
        }
        .onTapGesture {
            // Clear focus and hide keyboard
            isTextFieldFocused = false
            
            // Hide quick actions
            withAnimation(.easeInOut(duration: 0.3)) {
                showQuickActions = false
            }
            
            // Clear any weird text field states
            if viewModel.messageText.isEmpty {
                viewModel.messageText = ""
            }
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5).delay(0.5)) {
                showQuickActions = true
            }
        }
        .onChange(of: viewModel.currentWebsite) { website in
            if let website = website {
                currentWebsite = website
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
        .sheet(isPresented: $showPreview) {
            OptimizedPreviewView(website: currentWebsite)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
    }
    
    // MARK: - Header View
    private var headerView: some View {
            HStack {
            // CloudIDE branding with animation
            HStack(spacing: 8) {
                Image(systemName: "cloud.fill")
                    .foregroundColor(.white)
                    .font(.title2)
                    .scaleEffect(viewModel.isLoading ? 1.1 : 1.0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: viewModel.isLoading)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("CloudIDE")
                    .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(viewModel.isLoading ? viewModel.generationProgress.displayText : "AI Website Generator")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .animation(.easeInOut(duration: 0.3), value: viewModel.generationProgress)
                }
            }
            
            Spacer()
            
            // Status indicator only
            AnimatedStatusIndicator(status: viewModel.connectionStatus)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(
            Rectangle()
                .fill(.ultraThinMaterial)
                .background(.white.opacity(0.1))
        )
    }
    
    // MARK: - Messages Scroll View
    private var messagesScrollView: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 16) {
                    // Welcome state
                    if viewModel.messages.isEmpty {
                        welcomeView
                            .transition(.asymmetric(
                                insertion: .scale.combined(with: .opacity),
                                removal: .scale.combined(with: .opacity)
                            ))
                    }
                    
                    // Messages
                    ForEach(viewModel.messages) { message in
                        AdvancedMessageBubble(message: message)
                            .transition(.asymmetric(
                                insertion: AnyTransition.move(edge: .trailing).combined(with: .opacity),
                                removal: AnyTransition.move(edge: .leading).combined(with: .opacity)
                            ))
                    }
                    
                    // Loading indicator
                    if viewModel.isLoading {
                        SteppedProgressIndicator(progress: viewModel.generationProgress)
                            .transition(.scale.combined(with: .opacity))
                    }
                    
                    // Website generated success message
                    if let website = currentWebsite, !viewModel.isLoading {
                        websiteGeneratedCard(website: website)
                            .transition(.asymmetric(
                                insertion: .scale.combined(with: .opacity),
                                removal: .scale.combined(with: .opacity)
                            ))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 20)
            }
            .onChange(of: viewModel.messages.count) { _ in
                // Auto-scroll to bottom with animation
                if let lastMessage = viewModel.messages.last {
                    withAnimation(.easeInOut(duration: 0.5)) {
                        proxy.scrollTo(lastMessage.id, anchor: .bottom)
                    }
                }
            }
            .onChange(of: viewModel.isLoading) { isLoading in
                if !isLoading {
                    // Scroll to show the result
                    withAnimation(.easeInOut(duration: 0.5).delay(0.3)) {
                        proxy.scrollTo("website-generated", anchor: .bottom)
                    }
                }
            }
        }
    }
    
    // MARK: - Welcome View
    private var welcomeView: some View {
        VStack(spacing: 24) {
            // Animated icon
            ZStack {
                Circle()
                    .fill(.white.opacity(0.1))
                    .frame(width: 120, height: 120)
                    .scaleEffect(showQuickActions ? 1.1 : 1.0)
                
                Image(systemName: "sparkles")
                    .font(.system(size: 50, weight: .light))
                    .foregroundColor(.white.opacity(0.9))
                    .rotationEffect(.degrees(showQuickActions ? 5 : -5))
            }
            
            VStack(spacing: 12) {
                Text("Welcome to CloudIDE")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .opacity(showQuickActions ? 1 : 0)
                
                Text("Create stunning websites with AI")
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .opacity(showQuickActions ? 1 : 0)
            }
            
            // Feature highlights
            VStack(alignment: .leading, spacing: 12) {
                FeatureRow(icon: "wand.and.stars", text: "AI-powered website generation")
                FeatureRow(icon: "paintbrush.fill", text: "Beautiful, responsive designs")
                FeatureRow(icon: "square.and.arrow.down", text: "Download ready-to-use HTML")
                FeatureRow(icon: "iphone", text: "Optimized for all devices")
            }
            .opacity(showQuickActions ? 1 : 0)
        }
        .animation(.easeInOut(duration: 1.2).delay(0.3), value: showQuickActions)
    }
    
    // MARK: - Website Generated Card
    private func websiteGeneratedCard(website: Website) -> some View {
        EnhancedCard {
            VStack(spacing: 16) {
                // Success Header
                        HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.successGreen)
                        .font(.title2)
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Website Generated!")
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        Text("Your \(website.displayTitle) is ready")
                            .font(.subheadline)
                                .foregroundColor(.secondary)
                    }
                    
                            Spacer()
                    
                    TagView(
                        text: website.isAIGenerated ? "AI" : "Template",
                        color: website.isAIGenerated ? .cloudIDEPurple : .successGreen,
                        size: .small
                    )
                }
                
                // Preview Message
                Text("🎉 Tap the preview button below to explore your new website!")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                
                // Action Buttons
                VStack(spacing: 12) {
                    AnimatedButton(style: .primary, action: {
                        HapticFeedback.impact(.medium)
                        
                        // Immediate UI feedback
                        withAnimation(.easeInOut(duration: 0.2)) {
                            showPreview = true
                        }
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "eye.fill")
                                .font(.system(size: 16, weight: .semibold))
                            Text("Preview Website")
                                .fontWeight(.semibold)
                        }
                    }
                    
                    HStack(spacing: 12) {
                        AnimatedButton(style: .ghost, action: {
                            shareWebsite(website)
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "square.and.arrow.up")
                                Text("Share")
                            }
                        }
                        
                        AnimatedButton(style: .ghost, action: {
                            // Create new website
                            currentWebsite = nil
                            viewModel.clearMessages()
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "plus")
                                Text("Create New")
                            }
                        }
                    }
                }
            }
        }
        .id("website-generated")
    }
    
    // MARK: - Quick Actions View
    private var quickActionsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("✨ Quick Start")
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
                .padding(.horizontal, 20)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(QuickAction.defaultActions) { action in
                        QuickActionCard(
                            action: action,
                            onTap: {
                                viewModel.useQuickPrompt(action.prompt)
                                withAnimation(.cloudIDEEase) {
                                    showQuickActions = false
                                }
                            }
                        )
                    }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.bottom, 16)
        .transition(.asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity),
            removal: .move(edge: .bottom).combined(with: .opacity)
        ))
    }
    
    // MARK: - Input View
    private var inputView: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                // Quick actions button - Fixed to always work
                Button(action: {
                    withAnimation(.cloudIDESpring) {
                        showQuickActions.toggle()
                    }
                    HapticFeedback.selection()
                }) {
                    Image(systemName: showQuickActions ? "xmark.circle.fill" : "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(.white.opacity(0.8))
                        .scaleEffect(isTextFieldFocused ? 0.8 : 1.0)
                        .animation(.spring(response: 0.3), value: isTextFieldFocused)
                        .animation(.spring(response: 0.3), value: showQuickActions)
                }
                .disabled(viewModel.isLoading)
                
                // Enhanced text field
                HStack {
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 22)
                            .fill(.white.opacity(0.9))
                            .overlay(
                                RoundedRectangle(cornerRadius: 22)
                                    .stroke(.white.opacity(0.3), lineWidth: 1)
                            )
                            .frame(height: 44)
                        
            HStack {
                            TextField("Describe your dream website...", text: $viewModel.messageText, axis: .vertical)
                                .focused($isTextFieldFocused)
                                .textFieldStyle(.plain)
                                .font(.body)
                                .lineLimit(1...5)
                                .autocorrectionDisabled(true)
                                .textInputAutocapitalization(.sentences)
                                .keyboardType(.default)
                                .submitLabel(.send)
                                .onSubmit {
                                    if !viewModel.messageText.isEmpty {
                                        sendMessage()
                                    }
                                }
                            
                            // Clear button (when text exists)
                            if !viewModel.messageText.isEmpty {
                                Button(action: {
                                    viewModel.messageText = ""
                                    isTextFieldFocused = false
                                }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.gray.opacity(0.6))
                                        .font(.system(size: 16))
                                }
                                .transition(.scale.combined(with: .opacity))
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                    }
                }
                
                // Enhanced send button
                Button(action: sendMessage) {
                    Image(systemName: viewModel.isLoading ? "stop.circle.fill" : "paperplane.fill")
                        .font(.title2)
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(
                            Circle()
                                .fill(viewModel.messageText.isEmpty ? .gray.opacity(0.6) : .white.opacity(0.2))
                                .overlay(
                                    Circle()
                                        .stroke(.white.opacity(0.4), lineWidth: 1)
                                )
                        )
                        .scaleEffect(viewModel.messageText.isEmpty ? 0.9 : 1.0)
                        .rotationEffect(.degrees(viewModel.isLoading ? 180 : 0))
                }
                .disabled(viewModel.messageText.isEmpty && !viewModel.isLoading)
                .animation(.spring(response: 0.4, dampingFraction: 0.8), value: viewModel.messageText.isEmpty)
                .animation(.easeInOut(duration: 0.3), value: viewModel.isLoading)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
            .background(.white.opacity(0.1))
        }
    }
    
    // MARK: - Helper Methods
    private func sendMessage() {
        // Reset quick actions after sending
        withAnimation(.cloudIDEEase) {
            showQuickActions = false
        }
        
        // Clear current website to show new generation
        currentWebsite = nil
        
        // Send message through view model
        viewModel.sendMessage()
    }
    
    private func shareWebsite(_ website: Website) {
        // Create temporary HTML file and share
        let fileName = "\(website.displayTitle.replacingOccurrences(of: " ", with: "_")).html"
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
        
        do {
            try website.html.write(to: tempURL, atomically: true, encoding: .utf8)
            
            let activityViewController = UIActivityViewController(
                activityItems: [
                    "🚀 Check out this amazing website I created with CloudIDE: \(website.displayTitle)",
                    tempURL
                ],
                applicationActivities: nil
            )
            
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController?.present(activityViewController, animated: true)
            }
        } catch {
            print("Error sharing website: \(error)")
        }
    }
}

// MARK: - Supporting Views
struct QuickActionCard: View {
    let action: QuickAction
    let onTap: () -> Void
    @State private var isPressed = false
    
    var body: some View {
        Button(action: {
            HapticFeedback.impact(.light)
            onTap()
        }) {
            VStack(spacing: 8) {
                Text(action.emoji)
                    .font(.title2)
                
                Text(action.title)
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

// MARK: - Optimized Preview View
struct OptimizedPreviewView: View {
    let website: Website?
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            Group {
                if let website = website {
                    ZStack {
                        // Background
                        Color(.systemGray6)
                            .ignoresSafeArea()
                        
                        VStack(spacing: 0) {
                            // Quick Info Header
                            VStack(spacing: 12) {
                                Text(website.displayTitle)
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.primary)
                                
                                HStack {
                                    TagView(
                                        text: website.isAIGenerated ? "AI Generated" : "Template",
                                        color: website.isAIGenerated ? .cloudIDEPurple : .successGreen,
                                        size: .small
                                    )
                                    
                                    Text("•")
                                        .foregroundColor(.secondary)
                                    
                                    Text(website.formattedDate)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 16)
                            .background(.ultraThinMaterial)
                            
                            // Optimized WebView with lazy loading
                            LazyWebPreview(website: website)
                        }
                    }
                } else {
                    EmptyStateView(
                        icon: "globe",
                        title: "No Website",
                        message: "No website available to preview"
                    )
                }
            }
            .navigationTitle("Preview")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
                
                if let website = website {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Menu {
                            Button(action: {
                                shareWebsite(website)
                            }) {
                                Label("Share Website", systemImage: "square.and.arrow.up")
                            }
                            
                            Button(action: {
                                copyToClipboard(website.html)
                            }) {
                                Label("Copy HTML", systemImage: "doc.on.doc")
                            }
                        } label: {
                            Image(systemName: "ellipsis.circle")
                        }
                    }
                }
            }
        }
    }
    
    private func shareWebsite(_ website: Website) {
        let fileName = "\(website.displayTitle.replacingOccurrences(of: " ", with: "_")).html"
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
        
        do {
            try website.html.write(to: tempURL, atomically: true, encoding: .utf8)
            
            let activityViewController = UIActivityViewController(
                activityItems: [
                    "🚀 Check out this amazing website I created with CloudIDE: \(website.displayTitle)",
                    tempURL
                ],
                applicationActivities: nil
            )
            
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController?.present(activityViewController, animated: true)
            }
        } catch {
            print("Error sharing website: \(error)")
        }
    }
    
    private func copyToClipboard(_ html: String) {
        UIPasteboard.general.string = html
        // Could add a toast notification here
    }
}

// MARK: - Lazy Web Preview (Performance Optimized)
struct LazyWebPreview: View {
    let website: Website
    @State private var isWebViewLoaded = false
    @State private var showLoadingIndicator = true
    
    var body: some View {
        ZStack {
            // Background placeholder while loading
            if showLoadingIndicator {
                VStack(spacing: 16) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .cloudIDEBlue))
                        .scaleEffect(1.2)
                    
                    Text("Loading Preview...")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.systemGray6))
                .transition(.opacity)
            }
            
            // WebView (loaded lazily)
            if isWebViewLoaded {
                LazyLoadWebView(website: website) {
                    // Completion callback
                    withAnimation(.easeOut(duration: 0.3)) {
                        showLoadingIndicator = false
                    }
                }
                .transition(.opacity)
            }
        }
        .onAppear {
            // Delay WebView creation to prevent initial lag
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                withAnimation(.easeIn(duration: 0.2)) {
                    isWebViewLoaded = true
                }
            }
        }
    }
}

// MARK: - Lazy Load WebView
struct LazyLoadWebView: UIViewRepresentable {
    let website: Website
    let onLoadComplete: () -> Void
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        
        // Performance optimizations
        config.suppressesIncrementalRendering = false
        config.allowsInlineMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = false
        config.allowsPictureInPictureMediaPlayback = false
        
        // Disable resource-intensive features
        config.preferences.javaScriptEnabled = true
        config.preferences.javaScriptCanOpenWindowsAutomatically = false
        
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        
        // Optimize for performance
        webView.isOpaque = true
        webView.backgroundColor = UIColor.systemBackground
        webView.scrollView.backgroundColor = UIColor.systemBackground
        webView.scrollView.bounces = true
        webView.scrollView.showsVerticalScrollIndicator = true
        webView.scrollView.keyboardDismissMode = .onDrag
        
        // Disable features that can cause lag
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // Only load if not already loaded
        if webView.url == nil {
            webView.loadHTMLString(website.html, baseURL: nil)
        }
    }
    
    func makeCoordinator() -> LazyLoadWebViewCoordinator {
        LazyLoadWebViewCoordinator(onLoadComplete: onLoadComplete)
    }
}

class LazyLoadWebViewCoordinator: NSObject, WKNavigationDelegate {
    let onLoadComplete: () -> Void
    
    init(onLoadComplete: @escaping () -> Void) {
        self.onLoadComplete = onLoadComplete
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        // Navigation started
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Inject minimal performance JavaScript
        let performanceJS = """
            // Optimize images for mobile
            document.querySelectorAll('img').forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.loading = 'lazy';
            });
            
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
            
            // Disable text selection for better mobile experience
            document.body.style.webkitUserSelect = 'none';
            document.body.style.webkitTouchCallout = 'none';
        """
        
        webView.evaluateJavaScript(performanceJS) { _, _ in
            // Call completion callback
            DispatchQueue.main.async {
                self.onLoadComplete()
            }
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("WebView failed to load: \(error.localizedDescription)")
        DispatchQueue.main.async {
            self.onLoadComplete()
        }
    }
}

#Preview {
    ChatView(
        currentWebsite: .constant(nil),
        onWebsiteGenerated: { _ in }
    )
}
