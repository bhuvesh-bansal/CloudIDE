import SwiftUI

// Programmatic App Icon for development/preview purposes
struct AppIconView: View {
    let size: CGFloat
    
    init(size: CGFloat = 120) {
        self.size = size
    }
    
    var body: some View {
        ZStack {
            // Gradient background matching CloudIDE branding
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.4, green: 0.48, blue: 0.92), // #667eea
                    Color(red: 0.46, green: 0.29, blue: 0.64)  // #764ba2
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(width: size, height: size)
            
            // Cloud symbol with code elements
            VStack(spacing: size * 0.08) {
                // Cloud icon
                Image(systemName: "cloud.fill")
                    .font(.system(size: size * 0.35, weight: .medium))
                    .foregroundColor(.white)
                    .shadow(color: .black.opacity(0.2), radius: 2, x: 0, y: 1)
                
                // Code brackets
                HStack(spacing: size * 0.05) {
                    Text("{")
                        .font(.system(size: size * 0.2, weight: .bold, design: .monospaced))
                        .foregroundColor(.white.opacity(0.9))
                    
                    Text("}")
                        .font(.system(size: size * 0.2, weight: .bold, design: .monospaced))
                        .foregroundColor(.white.opacity(0.9))
                }
            }
            
            // Subtle overlay for depth
            RoundedRectangle(cornerRadius: size * 0.15)
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            .white.opacity(0.1),
                            .clear,
                            .black.opacity(0.1)
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: size, height: size)
        }
        .clipShape(RoundedRectangle(cornerRadius: size * 0.15))
        .shadow(color: .black.opacity(0.3), radius: size * 0.05, x: 0, y: size * 0.02)
    }
}

// Alternative minimalist design
struct AppIconViewMinimal: View {
    let size: CGFloat
    
    init(size: CGFloat = 120) {
        self.size = size
    }
    
    var body: some View {
        ZStack {
            // Clean gradient background
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.cloudIDEBlue,
                    Color.cloudIDEPurple
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .frame(width: size, height: size)
            
            // Single cloud with subtle glow
            Image(systemName: "cloud.fill")
                .font(.system(size: size * 0.45, weight: .medium))
                .foregroundColor(.white)
                .shadow(color: .white.opacity(0.3), radius: size * 0.02, x: 0, y: 0)
                .shadow(color: .black.opacity(0.2), radius: size * 0.01, x: 0, y: size * 0.01)
        }
        .clipShape(RoundedRectangle(cornerRadius: size * 0.15))
        .overlay(
            RoundedRectangle(cornerRadius: size * 0.15)
                .stroke(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            .white.opacity(0.3),
                            .clear
                        ]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1
                )
        )
        .shadow(color: .black.opacity(0.25), radius: size * 0.08, x: 0, y: size * 0.04)
    }
}

// Preview for different sizes
struct AppIconPreview: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("CloudIDE App Icon Options")
                .font(.title2)
                .fontWeight(.bold)
            
            HStack(spacing: 30) {
                VStack(spacing: 8) {
                    AppIconView(size: 120)
                    Text("Code + Cloud")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                VStack(spacing: 8) {
                    AppIconViewMinimal(size: 120)
                    Text("Minimal Cloud")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Text("Different Sizes:")
                .font(.headline)
                .padding(.top)
            
            HStack(spacing: 15) {
                AppIconView(size: 60)
                AppIconView(size: 44)
                AppIconView(size: 29)
                
                AppIconViewMinimal(size: 60)
                AppIconViewMinimal(size: 44)
                AppIconViewMinimal(size: 29)
            }
        }
        .padding(40)
        .background(Color(.systemGray6))
    }
}

#Preview {
    AppIconPreview()
}
