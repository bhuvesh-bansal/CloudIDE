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
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            isPreviewCollapsed.toggle()
                        }
                    }) {
                        Image(systemName: isPreviewCollapsed ? "rectangle.expand.horizontal" : "rectangle.compress.horizontal")
                            .foregroundColor(.blue)
                    }
                }
            }
            .overlay(
                // Floating action button when preview is collapsed and website exists
                Group {
                    if isPreviewCollapsed && currentWebsite != nil {
                        VStack {
                            Spacer()
                            HStack {
                                Spacer()
                                Button(action: {
                                    withAnimation(.easeInOut(duration: 0.3)) {
                                        isPreviewCollapsed = false
                                    }
                                }) {
                                    HStack {
                                        Image(systemName: "eye")
                                        Text("Show Preview")
                                    }
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 12)
                                    .background(Color.blue)
                                    .cornerRadius(25)
                                    .shadow(radius: 4)
                                }
                                .padding(.trailing, 20)
                                .padding(.bottom, 20)
                            }
                        }
                    }
                }
            )
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

#Preview {
    ContentView()
}
