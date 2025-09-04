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
                
                // Web preview
                WebView(htmlContent: website.html)
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
                                shareWebsite()
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
                    WebView(htmlContent: website.html)
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
    }
    
    private func shareWebsite() {
        guard let website = website else { return }
        
        // Create a temporary HTML file and share it
        let htmlString = website.html
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("website.html")
        
        do {
            try htmlString.write(to: tempURL, atomically: true, encoding: .utf8)
            
            let activityVC = UIActivityViewController(
                activityItems: [tempURL],
                applicationActivities: nil
            )
            
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController?.present(activityVC, animated: true)
            }
        } catch {
            print("Error sharing website: \(error)")
        }
    }
}

#Preview {
    WebPreviewView(website: nil)
}
