import SwiftUI

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

// MARK: - Core ViewBuilder Components
struct ResponsiveContainer<Content: View>: View {
    let content: (GeometryProxy) -> Content
    
    init(@ViewBuilder content: @escaping (GeometryProxy) -> Content) {
        self.content = content
    }
    
    var body: some View {
        GeometryReader { geometry in
            content(geometry)
        }
    }
}

struct EnhancedCard<Content: View>: View {
    let content: Content
    let cornerRadius: CGFloat
    let shadowRadius: CGFloat
    let borderColor: Color?
    let backgroundColor: Color
    
    init(
        cornerRadius: CGFloat = 16,
        shadowRadius: CGFloat = 8,
        borderColor: Color? = nil,
        backgroundColor: Color = .dynamicBackground,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.cornerRadius = cornerRadius
        self.shadowRadius = shadowRadius
        self.borderColor = borderColor
        self.backgroundColor = backgroundColor
    }
    
    var body: some View {
        content
            .padding(20)
            .background(backgroundColor)
            .cornerRadius(cornerRadius)
            .if(borderColor != nil) { view in
                view.overlay(
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .stroke(borderColor!, lineWidth: 1)
                )
            }
            .shadow(color: .black.opacity(0.08), radius: shadowRadius, x: 0, y: 4)
    }
}

struct AnimatedButton<Label: View>: View {
    let action: () -> Void
    let label: Label
    let style: ButtonStyle
    
    @State private var isPressed = false
    
    enum ButtonStyle {
        case primary, secondary, destructive, ghost
        
        var backgroundColor: Color {
            switch self {
            case .primary: return .cloudIDEBlue
            case .secondary: return .cloudIDEAccent
            case .destructive: return .errorRed
            case .ghost: return .clear
            }
        }
        
        var foregroundColor: Color {
            switch self {
            case .primary, .secondary, .destructive: return .white
            case .ghost: return .cloudIDEBlue
            }
        }
        
        var borderColor: Color? {
            switch self {
            case .ghost: return .cloudIDEBlue
            default: return nil
            }
        }
    }
    
    init(
        style: ButtonStyle = .primary,
        action: @escaping () -> Void,
        @ViewBuilder label: () -> Label
    ) {
        self.style = style
        self.action = action
        self.label = label()
    }
    
    var body: some View {
        Button(action: {
            HapticFeedback.impact(.light)
            action()
        }) {
            label
                .font(.body)
                .fontWeight(.semibold)
                .foregroundColor(style.foregroundColor)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(style.backgroundColor)
                .cornerRadius(12)
                .if(style.borderColor != nil) { view in
                    view.overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(style.borderColor!, lineWidth: 2)
                    )
                }
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

struct TagView: View {
    let text: String
    let color: Color
    let size: Size
    
    enum Size {
        case small, medium, large
        
        var font: Font {
            switch self {
            case .small: return .caption2
            case .medium: return .caption
            case .large: return .body
            }
        }
        
        var padding: EdgeInsets {
            switch self {
            case .small: return EdgeInsets(top: 4, leading: 8, bottom: 4, trailing: 8)
            case .medium: return EdgeInsets(top: 6, leading: 10, bottom: 6, trailing: 10)
            case .large: return EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12)
            }
        }
    }
    
    init(text: String, color: Color = .cloudIDEBlue, size: Size = .medium) {
        self.text = text
        self.color = color
        self.size = size
    }
    
    var body: some View {
        Text(text)
            .font(size.font)
            .fontWeight(.semibold)
            .foregroundColor(.white)
            .padding(size.padding)
            .background(
                Capsule()
                    .fill(color)
            )
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    let actionTitle: String?
    let action: (() -> Void)?
    
    init(
        icon: String,
        title: String,
        message: String,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.action = action
    }
    
    var body: some View {
        VStack(spacing: 24) {
            // Animated icon
            ZStack {
                Circle()
                    .fill(Color.cloudIDEBlue.opacity(0.1))
                    .frame(width: 120, height: 120)
                
                Image(systemName: icon)
                    .font(.system(size: 50, weight: .light))
                    .foregroundColor(.cloudIDEBlue)
            }
            
            VStack(spacing: 12) {
                Text(title)
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                
                Text(message)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            
            if let actionTitle = actionTitle, let action = action {
                AnimatedButton(style: .primary, action: action) {
                    Text(actionTitle)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.dynamicBackground)
    }
}

struct EnhancedSearchBar: View {
    @Binding var text: String
    @FocusState private var isFocused: Bool
    
    let placeholder: String
    let onSearchButtonClicked: (() -> Void)?
    let onCancel: (() -> Void)?
    
    init(
        text: Binding<String>,
        placeholder: String = "Search...",
        onSearchButtonClicked: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil
    ) {
        self._text = text
        self.placeholder = placeholder
        self.onSearchButtonClicked = onSearchButtonClicked
        self.onCancel = onCancel
    }
    
    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                    .font(.system(size: 16, weight: .medium))
                
                TextField(placeholder, text: $text)
                    .focused($isFocused)
                    .textFieldStyle(.plain)
                    .onSubmit {
                        onSearchButtonClicked?()
                    }
                
                if !text.isEmpty {
                    Button(action: {
                        withAnimation(.cloudIDEEase) {
                            text = ""
                        }
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                            .font(.system(size: 14))
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.dynamicSecondaryBackground)
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(isFocused ? Color.cloudIDEBlue : Color.clear, lineWidth: 2)
            )
            .animation(.cloudIDEEase, value: isFocused)
            
            if isFocused {
                Button("Cancel") {
                    withAnimation(.cloudIDEEase) {
                        text = ""
                        isFocused = false
                        onCancel?()
                    }
                }
                .foregroundColor(.cloudIDEBlue)
                .font(.body)
                .transition(.move(edge: .trailing).combined(with: .opacity))
            }
        }
        .animation(.cloudIDEEase, value: isFocused)
    }
}

struct AnimatedStatusIndicator: View {
    let status: ConnectionStatus
    @State private var pulseScale: CGFloat = 1.0
    @State private var rotationAngle: Double = 0
    
    var body: some View {
        HStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(status.color.opacity(0.2))
                    .frame(width: 24, height: 24)
                    .scaleEffect(pulseScale)
                
                Image(systemName: status.icon)
                    .foregroundColor(status.color)
                    .font(.system(size: 12, weight: .semibold))
                    .rotationEffect(.degrees(rotationAngle))
            }
            
            Text(status.displayText)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(status.color)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(status.color.opacity(0.1))
                .overlay(
                    Capsule()
                        .stroke(status.color.opacity(0.3), lineWidth: 1)
                )
        )
        .onAppear {
            startAnimation()
        }
        .onChange(of: status) { _ in
            startAnimation()
        }
    }
    
    private func startAnimation() {
        switch status {
        case .testing:
            withAnimation(.linear(duration: 1).repeatForever(autoreverses: false)) {
                rotationAngle = 360
            }
        case .connected, .disconnected, .error:
            withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) {
                pulseScale = 1.2
            }
        case .unknown:
            withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                pulseScale = 1.1
            }
        }
    }
}

struct SteppedProgressIndicator: View {
    let progress: GenerationProgress
    let steps: [String] = ["Research", "Generate", "Complete"]
    
    var body: some View {
        VStack(spacing: 16) {
            // Progress bar
            ProgressView(value: progress.progress)
                .progressViewStyle(LinearProgressViewStyle(tint: .cloudIDEBlue))
                .scaleEffect(y: 2)
                .animation(.cloudIDEEase, value: progress.progress)
            
            // Step indicators
            HStack {
                ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                    StepIndicator(
                        title: step,
                        isActive: progress.progress >= Double(index + 1) / Double(steps.count),
                        isCompleted: progress.progress > Double(index + 1) / Double(steps.count)
                    )
                    
                    if index < steps.count - 1 {
                        Rectangle()
                            .fill(Color.cloudIDEBlue.opacity(0.3))
                            .frame(height: 2)
                            .frame(maxWidth: .infinity)
                    }
                }
            }
            
            // Status text
            Text(progress.displayText)
                .font(.body)
                .fontWeight(.medium)
                .foregroundColor(.primary)
                .animation(.cloudIDEEase, value: progress)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .glassMorphism()
    }
}

struct StepIndicator: View {
    let title: String
    let isActive: Bool
    let isCompleted: Bool
    
    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(isCompleted ? Color.cloudIDEBlue : (isActive ? Color.cloudIDEBlue.opacity(0.3) : Color.gray.opacity(0.3)))
                    .frame(width: 24, height: 24)
                
                if isCompleted {
                    Image(systemName: "checkmark")
                        .foregroundColor(.white)
                        .font(.system(size: 12, weight: .bold))
                } else {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 8, height: 8)
                }
            }
            .scaleEffect(isActive ? 1.2 : 1.0)
            .animation(.cloudIDESpring, value: isActive)
            
            Text(title)
                .font(.caption)
                .fontWeight(isActive ? .semibold : .regular)
                .foregroundColor(isActive ? .cloudIDEBlue : .secondary)
        }
    }
}
