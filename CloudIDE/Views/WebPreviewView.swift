import SwiftUI
import WebKit

struct WebPreviewView: View {
    let website: Website?
    @State private var isFullScreen = false
    
    var body: some View {
        VStack {
            // Header
            HStack {
                Image(systemName: "globe")
                    .foregroundColor(.green)
                    .font(.title2)
                Text("Live Preview")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
                
                // Full screen button
                if website != nil {
                    Button(action: {
                        isFullScreen = true
                    }) {
                        Image(systemName: "arrow.up.left.and.arrow.down.right")
                            .foregroundColor(.blue)
                            .font(.title3)
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            
            if let website = website {
                // Website info
                VStack(alignment: .leading, spacing: 8) {
                    Text("Generated from: \"\(website.prompt)\"")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal)
                    
                    Text("Created: \(website.formattedDate)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal)
                }
                .padding(.vertical, 4)
                
                // Optimized web preview
                OptimizedWebView(htmlContent: website.html)
                    .background(Color.white)
                    .onTapGesture(count: 2) {
                        isFullScreen = true
                    }
                    .overlay(
                        // Double tap indicator
                        VStack {
                            Spacer()
                            HStack {
                                Spacer()
                                Text("Double tap for full screen")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color(.systemGray6))
                                    .cornerRadius(12)
                                    .padding(.trailing, 16)
                                    .padding(.bottom, 16)
                            }
                        }
                    )
            } else {
                // Placeholder
                VStack(spacing: 20) {
                    Image(systemName: "globe")
                        .font(.system(size: 60))
                        .foregroundColor(.gray)
                    
                    Text("No Website Generated")
                        .font(.title2)
                        .fontWeight(.medium)
                        .foregroundColor(.gray)
                    
                    Text("Use the chat interface to describe what you want to build, and your generated website will appear here.")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.systemGray6))
            }
        }
        .background(Color(.systemBackground))
        .fullScreenCover(isPresented: $isFullScreen) {
            FullScreenWebView(website: website, isPresented: $isFullScreen)
        }
    }
}

struct WebView: UIViewRepresentable {
    let htmlContent: String
    @State private var isLoading = true
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.loadHTMLString(htmlContent, baseURL: nil)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        let parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Website loaded successfully
            DispatchQueue.main.async {
                // You could add a loading state here if needed
            }
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            // Handle loading errors
            print("WebView loading error: \(error)")
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            // Navigation started
        }
    }
}

struct FullScreenWebView: View {
    let website: Website?
    @Binding var isPresented: Bool
    @State private var showToolbar = true
    @State private var showShareSheet = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Navigation bar
                if showToolbar {
                    HStack {
                        Button("Done") {
                            isPresented = false
                        }
                        .foregroundColor(.blue)
                        .font(.headline)
                        
                        Spacer()
                        
                        Text("Full Screen Preview")
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        Spacer()
                        
                        // Share button
                        if website != nil {
                            Button(action: {
                                showShareSheet = true
                            }) {
                                Image(systemName: "square.and.arrow.up")
                                    .foregroundColor(.blue)
                                    .font(.title3)
                            }
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
                
                // Full screen web view
                if let website = website {
                    OptimizedWebView(htmlContent: website.html)
                        .background(Color.white)
                        .onTapGesture {
                            withAnimation(.easeInOut(duration: 0.3)) {
                                showToolbar.toggle()
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
                        
                        Text("Generate a website first to see it in full screen")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
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
                ShareSheet(website: website)
            }
        }
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let website: Website
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        // Create shareable content
        let shareText = "Check out this website I created with CloudIDE: \(website.displayTitle)"
        
        // Create a temporary HTML file
        let htmlString = website.html
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("\(website.displayTitle.replacingOccurrences(of: " ", with: "_")).html")
        
        var activityItems: [Any] = [shareText]
        
        // Try to create the HTML file
        do {
            try htmlString.write(to: tempURL, atomically: true, encoding: .utf8)
            activityItems.append(tempURL)
        } catch {
            print("Could not create HTML file: \(error)")
            // Fallback to just sharing the HTML content as text
            activityItems.append("Website HTML:\n\n\(htmlString)")
        }
        
        let activityViewController = UIActivityViewController(
            activityItems: activityItems,
            applicationActivities: nil
        )
        
        // Configure for iPad
        if let popover = activityViewController.popoverPresentationController {
            popover.sourceView = UIView()
            popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
            popover.permittedArrowDirections = []
        }
        
        return activityViewController
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {
        // No updates needed
    }
}

// Enhanced WebView with proper interaction handling
struct OptimizedWebView: UIViewRepresentable {
    let htmlContent: String
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // Enhanced JavaScript configuration
        configuration.preferences.javaScriptEnabled = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = false
        configuration.allowsInlineMediaPlayback = true
        configuration.allowsAirPlayForMediaPlayback = true
        
        // Disable problematic features that cause input issues
        configuration.preferences.setValue(false, forKey: "allowFileAccessFromFileURLs")
        configuration.preferences.setValue(false, forKey: "allowUniversalAccessFromFileURLs")
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        
        // Optimize scrolling and interaction
        webView.scrollView.isScrollEnabled = true
        webView.scrollView.bounces = true
        webView.scrollView.showsVerticalScrollIndicator = true
        webView.scrollView.decelerationRate = UIScrollView.DecelerationRate.normal
        
        // Disable problematic gestures
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        
        // Prevent input field focus issues
        webView.scrollView.keyboardDismissMode = .onDrag
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // Only reload if content actually changed
        let currentHTML = webView.url?.absoluteString
        if currentHTML == nil || currentHTML == "about:blank" {
            webView.loadHTMLString(htmlContent, baseURL: nil)
        }
    }
    
    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator()
    }
    
    class WebViewCoordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Enhanced post-load optimizations
            let jsCode = """
                // Disable text selection and callouts that can trigger input issues
                document.body.style.webkitTouchCallout = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.userSelect = 'none';
                
                // Fix button behaviors - prevent alerts, enable smooth scrolling
                document.querySelectorAll('button, a[href^="#"]').forEach(element => {
                    element.addEventListener('click', function(e) {
                        const href = this.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            e.preventDefault();
                            const target = document.querySelector(href);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    });
                });
                
                // Remove any existing alerts and replace with smooth actions
                window.alert = function(message) {
                    console.log('Alert prevented:', message);
                    // Create a subtle notification instead of alert
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed; top: 20px; right: 20px; 
                        background: #007bff; color: white; 
                        padding: 1rem; border-radius: 8px; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        z-index: 10000; animation: slideIn 0.3s ease;
                    `;
                    notification.textContent = message;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.animation = 'slideOut 0.3s ease forwards';
                        setTimeout(() => notification.remove(), 300);
                    }, 3000);
                };
                
                // Add CSS for notifications
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                    @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
                `;
                document.head.appendChild(style);
            """
            
            webView.evaluateJavaScript(jsCode) { result, error in
                if let error = error {
                    print("JavaScript enhancement error: \(error)")
                }
            }
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("WebView navigation error: \(error.localizedDescription)")
        }
        
        // Handle JavaScript alerts and prompts
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            // Convert alerts to native iOS notifications
            print("WebView alert intercepted: \(message)")
            completionHandler()
        }
        
        // Prevent prompt dialogs that could interfere
        func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
            print("WebView prompt intercepted: \(prompt)")
            completionHandler(nil)
        }
        
        // Handle window.open calls properly
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            // Prevent new windows that could cause issues
            if let url = navigationAction.request.url {
                webView.load(navigationAction.request)
            }
            return nil
        }
    }
}

#Preview {
    WebPreviewView(website: nil)
}
