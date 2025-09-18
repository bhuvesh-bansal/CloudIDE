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

// Performance optimized WebView
struct OptimizedWebView: UIViewRepresentable {
    let htmlContent: String
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.preferences.javaScriptEnabled = true
        configuration.allowsInlineMediaPlayback = true
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.isScrollEnabled = true
        webView.scrollView.bounces = true
        
        // Performance optimizations
        webView.scrollView.decelerationRate = UIScrollView.DecelerationRate.normal
        webView.allowsBackForwardNavigationGestures = false
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // Only reload if content actually changed
        if webView.url?.absoluteString != "about:blank" {
            webView.loadHTMLString(htmlContent, baseURL: nil)
        } else {
            webView.loadHTMLString(htmlContent, baseURL: nil)
        }
    }
    
    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator()
    }
    
    class WebViewCoordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Optimize performance after loading
            webView.evaluateJavaScript("document.body.style.webkitTouchCallout='none';")
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("WebView error: \(error.localizedDescription)")
        }
    }
}

#Preview {
    WebPreviewView(website: nil)
}
