import SwiftUI
import WebKit

struct AdvancedWebPreviewView: View {
    let website: Website?
    @State private var isFullScreen = false
    @State private var loadingProgress: Double = 0.0
    @State private var isLoading = true
    @State private var showWebsiteInfo = false
    @StateObject private var webViewStore = WebViewStore()
    
    var body: some View {
        VStack(spacing: 0) {
            // Enhanced Header with progress
            HeaderSection(
                website: website,
                loadingProgress: loadingProgress,
                isLoading: isLoading,
                showWebsiteInfo: $showWebsiteInfo,
                onFullScreen: { isFullScreen = true }
            )
            
            // Website info panel (collapsible)
            if showWebsiteInfo, let website = website {
                WebsiteInfoPanel(website: website)
                    .transition(.asymmetric(
                        insertion: .move(edge: .top).combined(with: .opacity),
                        removal: .move(edge: .top).combined(with: .opacity)
                    ))
            }
            
            // Main content area
            ZStack {
                if let website = website {
                    // Enhanced WebView with progress tracking
                    AdvancedWebView(
                        htmlContent: website.html,
                        loadingProgress: $loadingProgress,
                        isLoading: $isLoading,
                        webViewStore: webViewStore
                    )
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                    .onTapGesture(count: 2) {
                        let impactFeedback = UIImpactFeedbackGenerator(style: .medium)
                        impactFeedback.impactOccurred()
                        isFullScreen = true
                    }
                    .overlay(
                        // Interactive overlay
                        VStack {
                            Spacer()
                            HStack {
                                Spacer()
                                
                                // Floating action buttons
                                VStack(spacing: 8) {
                                    // Refresh button
                                    FloatingActionButton(
                                        icon: "arrow.clockwise",
                                        action: {
                                            webViewStore.reload()
                                        }
                                    )
                                    
                                    // Full screen hint
                                    FloatingActionButton(
                                        icon: "arrow.up.left.and.arrow.down.right",
                                        action: {
                                            isFullScreen = true
                                        }
                                    )
                                }
                                .padding(.trailing, 16)
                                .padding(.bottom, 16)
                            }
                        }
                    )
                } else {
                    // Enhanced placeholder
                    PlaceholderView()
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(.systemGray6),
                    Color(.systemGray5)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .fullScreenCover(isPresented: $isFullScreen) {
            AdvancedFullScreenWebView(
                website: website,
                isPresented: $isFullScreen,
                webViewStore: webViewStore
            )
        }
    }
}

// MARK: - Header Section
struct HeaderSection: View {
    let website: Website?
    let loadingProgress: Double
    let isLoading: Bool
    @Binding var showWebsiteInfo: Bool
    let onFullScreen: () -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                // Enhanced icon with animation
                Image(systemName: "globe")
                    .foregroundColor(.green)
                    .font(.title2)
                    .scaleEffect(isLoading ? 1.1 : 1.0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isLoading)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("Live Preview")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    if let website = website {
                        Text(website.displayTitle)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                // Action buttons
                HStack(spacing: 12) {
                    // Info toggle
                    if website != nil {
                        Button(action: {
                            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                showWebsiteInfo.toggle()
                            }
                        }) {
                            Image(systemName: showWebsiteInfo ? "info.circle.fill" : "info.circle")
                                .foregroundColor(.blue)
                                .font(.title3)
                        }
                    }
                    
                    // Full screen button
                    if website != nil {
                        Button(action: onFullScreen) {
                            Image(systemName: "arrow.up.left.and.arrow.down.right")
                                .foregroundColor(.blue)
                                .font(.title3)
                        }
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            
            // Loading progress bar
            if isLoading && loadingProgress > 0 {
                ProgressView(value: loadingProgress)
                    .progressViewStyle(LinearProgressViewStyle(tint: .green))
                    .padding(.horizontal, 20)
                    .transition(.opacity)
            }
        }
        .background(Color(.systemGray6))
    }
}

// MARK: - Website Info Panel
struct WebsiteInfoPanel: View {
    let website: Website
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Generated from:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("\"\(website.prompt)\"")
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                }
                
                Spacer()
                
                // Generation badge
                HStack(spacing: 4) {
                    Image(systemName: website.isAIGenerated ? "brain.head.profile" : "doc.text")
                        .font(.caption)
                    
                    Text(website.isAIGenerated ? "AI Generated" : "Template")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
                .foregroundColor(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(
                    Capsule()
                        .fill(website.isAIGenerated ? .blue : .green)
                )
            }
            
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Created:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text(website.formattedDate)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if let industry = website.industry {
                    Text(industry.capitalized)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.blue)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            Capsule()
                                .fill(.blue.opacity(0.1))
                        )
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color(.systemGray5))
    }
}

// MARK: - Advanced WebView
struct AdvancedWebView: UIViewRepresentable {
    let htmlContent: String
    @Binding var loadingProgress: Double
    @Binding var isLoading: Bool
    @ObservedObject var webViewStore: WebViewStore
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // Enhanced configuration for iOS showcase
        configuration.preferences.javaScriptEnabled = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = false
        configuration.allowsInlineMediaPlayback = true
        configuration.allowsAirPlayForMediaPlayback = true
        configuration.allowsPictureInPictureMediaPlayback = true
        
        // Advanced user content controller for JavaScript communication
        let contentController = WKUserContentController()
        configuration.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        
        // Enhanced scroll view configuration
        webView.scrollView.isScrollEnabled = true
        webView.scrollView.bounces = true
        webView.scrollView.showsVerticalScrollIndicator = true
        webView.scrollView.showsHorizontalScrollIndicator = false
        webView.scrollView.decelerationRate = UIScrollView.DecelerationRate.normal
        webView.scrollView.keyboardDismissMode = .onDrag
        
        // Disable problematic features
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        
        // Store reference for external control
        webViewStore.webView = webView
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let currentURL = webView.url?.absoluteString
        if currentURL == nil || currentURL == "about:blank" {
            webView.loadHTMLString(htmlContent, baseURL: nil)
        }
    }
    
    func makeCoordinator() -> AdvancedWebViewCoordinator {
        AdvancedWebViewCoordinator(loadingProgress: $loadingProgress, isLoading: $isLoading)
    }
}

// MARK: - WebView Store for external control
class WebViewStore: ObservableObject {
    weak var webView: WKWebView?
    
    func reload() {
        webView?.reload()
    }
    
    func goBack() {
        webView?.goBack()
    }
    
    func goForward() {
        webView?.goForward()
    }
}

// MARK: - Advanced WebView Coordinator
class AdvancedWebViewCoordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
    @Binding var loadingProgress: Double
    @Binding var isLoading: Bool
    
    init(loadingProgress: Binding<Double>, isLoading: Binding<Bool>) {
        self._loadingProgress = loadingProgress
        self._isLoading = isLoading
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        DispatchQueue.main.async {
            self.isLoading = true
            self.loadingProgress = 0.1
        }
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        DispatchQueue.main.async {
            self.loadingProgress = 0.5
        }
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.async {
            self.loadingProgress = 1.0
            self.isLoading = false
        }
        
        // Enhanced JavaScript injection for better mobile experience
        let enhancedJS = """
            // Comprehensive mobile optimization
            document.body.style.webkitTouchCallout = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.userSelect = 'none';
            document.body.style.webkitTapHighlightColor = 'transparent';
            
            // Enhanced button and link handling
            document.querySelectorAll('button, a[href^="#"], .cta-button, .btn').forEach(element => {
                element.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start',
                                inline: 'nearest'
                            });
                        }
                    }
                });
                
                // Add touch feedback
                element.style.transition = 'transform 0.1s ease';
                element.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                element.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Replace alerts with elegant notifications
            window.alert = function(message) {
                console.log('Alert:', message);
                
                // Create elegant notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white; padding: 16px 24px; border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,123,255,0.3);
                    z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 14px; font-weight: 500; max-width: 90%;
                    animation: slideInFromTop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                `;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'slideOutToTop 0.3s ease-in forwards';
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            };
            
            // Add notification animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInFromTop {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes slideOutToTop {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // Enhanced form handling
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    window.alert('Thank you! Your message has been received.');
                    this.reset();
                });
            });
            
            // Add smooth scroll behavior to all internal links
            document.documentElement.style.scrollBehavior = 'smooth';
        """
        
        webView.evaluateJavaScript(enhancedJS) { result, error in
            if let error = error {
                print("JavaScript enhancement error: \(error)")
            }
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        DispatchQueue.main.async {
            self.isLoading = false
            self.loadingProgress = 0.0
        }
        print("WebView navigation error: \(error.localizedDescription)")
    }
    
    // Enhanced alert handling
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        print("Alert intercepted: \(message)")
        completionHandler()
    }
    
    // Enhanced prompt handling
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        print("Prompt intercepted: \(prompt)")
        completionHandler(defaultText)
    }
    
    // Enhanced window handling
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

// MARK: - Floating Action Button
struct FloatingActionButton: View {
    let icon: String
    let action: () -> Void
    @State private var isPressed = false
    
    var body: some View {
        Button(action: {
            let impactFeedback = UIImpactFeedbackGenerator(style: .light)
            impactFeedback.impactOccurred()
            action()
        }) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)
                .frame(width: 36, height: 36)
                .background(
                    Circle()
                        .fill(.black.opacity(0.6))
                        .overlay(
                            Circle()
                                .stroke(.white.opacity(0.2), lineWidth: 1)
                        )
                )
                .scaleEffect(isPressed ? 0.9 : 1.0)
        }
        .buttonStyle(PlainButtonStyle())
        .onLongPressGesture(minimumDuration: 0, maximumDistance: .infinity, pressing: { pressing in
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = pressing
            }
        }, perform: {})
    }
}

// MARK: - Enhanced Placeholder
struct PlaceholderView: View {
    @State private var animateIcon = false
    
    var body: some View {
        VStack(spacing: 24) {
            // Animated placeholder icon
            ZStack {
                Circle()
                    .fill(.gray.opacity(0.1))
                    .frame(width: 120, height: 120)
                    .scaleEffect(animateIcon ? 1.05 : 1.0)
                
                Image(systemName: "globe")
                    .font(.system(size: 50, weight: .light))
                    .foregroundColor(.gray.opacity(0.6))
                    .rotationEffect(.degrees(animateIcon ? 5 : -5))
            }
            
            VStack(spacing: 12) {
                Text("No Website Generated Yet")
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundColor(.gray)
                
                Text("Use the chat interface to describe what you want to build, and your generated website will appear here with a beautiful preview.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }
            
            // Call to action
            VStack(spacing: 8) {
                Text("💡 Try saying:")
                    .font(.callout)
                    .fontWeight(.medium)
                    .foregroundColor(.blue)
                
                Text("\"Create a modern coffee shop website\"")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .italic()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGray6))
        .onAppear {
            withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                animateIcon = true
            }
        }
    }
}

// MARK: - Advanced Full Screen View
struct AdvancedFullScreenWebView: View {
    let website: Website?
    @Binding var isPresented: Bool
    @ObservedObject var webViewStore: WebViewStore
    @State private var showToolbar = true
    @State private var showShareSheet = false
    @State private var toolbarOpacity: Double = 1.0
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Enhanced navigation bar
                if showToolbar {
                    FullScreenToolbar(
                        website: website,
                        onDismiss: { isPresented = false },
                        onShare: { showShareSheet = true },
                        onReload: { webViewStore.reload() }
                    )
                    .opacity(toolbarOpacity)
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
                
                // Full screen web view
                if let website = website {
                    AdvancedWebView(
                        htmlContent: website.html,
                        loadingProgress: .constant(0),
                        isLoading: .constant(false),
                        webViewStore: webViewStore
                    )
                    .background(Color.white)
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            showToolbar.toggle()
                            toolbarOpacity = showToolbar ? 1.0 : 0.0
                        }
                    }
                } else {
                    VStack(spacing: 20) {
                        Image(systemName: "globe")
                            .font(.system(size: 80))
                            .foregroundColor(.gray)
                        
                        Text("No Website to Preview")
                            .font(.title2)
                            .fontWeight(.medium)
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.systemGray6))
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .navigationBarHidden(true)
        .statusBarHidden(!showToolbar)
        .sheet(isPresented: $showShareSheet) {
            if let website = website {
                EnhancedShareSheet(website: website)
            }
        }
    }
}

// MARK: - Full Screen Toolbar
struct FullScreenToolbar: View {
    let website: Website?
    let onDismiss: () -> Void
    let onShare: () -> Void
    let onReload: () -> Void
    
    var body: some View {
        HStack {
            Button("Done") {
                onDismiss()
            }
            .foregroundColor(.white)
            .font(.headline)
            .fontWeight(.medium)
            
            Spacer()
            
            if let website = website {
                Text(website.displayTitle)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .lineLimit(1)
            }
            
            Spacer()
            
            HStack(spacing: 16) {
                // Reload button
                Button(action: onReload) {
                    Image(systemName: "arrow.clockwise")
                        .foregroundColor(.white)
                        .font(.title3)
                }
                
                // Share button
                if website != nil {
                    Button(action: onShare) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundColor(.white)
                            .font(.title3)
                    }
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(
            Rectangle()
                .fill(.black.opacity(0.8))
                .background(.ultraThinMaterial)
        )
    }
}

// MARK: - Enhanced Share Sheet
struct EnhancedShareSheet: UIViewControllerRepresentable {
    let website: Website
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let shareText = "🚀 Check out this amazing website I created with CloudIDE: \(website.displayTitle)"
        let websiteURL = createTemporaryHTMLFile()
        
        var activityItems: [Any] = [shareText]
        if let url = websiteURL {
            activityItems.append(url)
        }
        
        let activityViewController = UIActivityViewController(
            activityItems: activityItems,
            applicationActivities: nil
        )
        
        // Enhanced iPad support
        if let popover = activityViewController.popoverPresentationController {
            popover.sourceView = UIView()
            popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
            popover.permittedArrowDirections = []
        }
        
        return activityViewController
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
    
    private func createTemporaryHTMLFile() -> URL? {
        let fileName = "\(website.displayTitle.replacingOccurrences(of: " ", with: "_")).html"
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
        
        do {
            try website.html.write(to: tempURL, atomically: true, encoding: .utf8)
            return tempURL
        } catch {
            print("Error creating HTML file: \(error)")
            return nil
        }
    }
}

#Preview {
    AdvancedWebPreviewView(website: nil)
}
