//
//  ContentView.swift
//  CloudIDE
//
//  Created by Bhuvesh Bansal on 30/08/25.
//

import SwiftUI

struct ContentView: View {
    @State private var currentWebsite: Website?
    @State private var isPreviewCollapsed = false
    
    var body: some View {
        NavigationView {
            HStack(spacing: 0) {
                // Left Panel - Chat Interface
                ChatView(
                    onWebsiteGenerated: { website in
                        currentWebsite = website
                    },
                    isPreviewCollapsed: isPreviewCollapsed
                )
                .frame(maxWidth: .infinity)
                
                // Collapsible Preview Panel
                if !isPreviewCollapsed {
                    // Divider
                    Rectangle()
                        .fill(Color(.systemGray4))
                        .frame(width: 1)
                        .transition(.opacity)
                    
                    // Right Panel - Web Preview
                    WebPreviewView(website: currentWebsite)
                        .frame(maxWidth: .infinity)
                        .transition(.asymmetric(
                            insertion: .move(edge: .trailing).combined(with: .opacity),
                            removal: .move(edge: .trailing).combined(with: .opacity)
                        ))
                }
            }
            .navigationTitle("Cloud IDE")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                // Preview toggle button (top left)
                ToolbarItem(placement: .navigationBarLeading) {
                    if currentWebsite != nil {
                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.3)) {
                                isPreviewCollapsed.toggle()
                            }
                        }) {
                            Image(systemName: isPreviewCollapsed ? "eye" : "eye.slash")
                                .foregroundColor(.blue)
                                .font(.title3)
                        }
                    }
                }
                
                // Sidebar toggle button (top right) - horizontal icon for landscape
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            isPreviewCollapsed.toggle()
                        }
                    }) {
                        Image(systemName: isPreviewCollapsed ? "sidebar.right" : "rectangle.split.2x1")
                            .foregroundColor(.blue)
                    }
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

#Preview {
    ContentView()
}
