import SwiftUI
import Foundation

// MARK: - View Extensions
extension View {
    /// Applies a conditional modifier
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
    
    /// Applies a conditional modifier with else clause
    @ViewBuilder
    func `if`<TrueContent: View, FalseContent: View>(
        _ condition: Bool,
        if ifTransform: (Self) -> TrueContent,
        else elseTransform: (Self) -> FalseContent
    ) -> some View {
        if condition {
            ifTransform(self)
        } else {
            elseTransform(self)
        }
    }
    
    /// Applies a modifier when the optional value is not nil
    @ViewBuilder
    func ifLet<Value, Content: View>(_ value: Value?, transform: (Self, Value) -> Content) -> some View {
        if let value = value {
            transform(self, value)
        } else {
            self
        }
    }
    
    /// Adds a card-like appearance
    func cardStyle(cornerRadius: CGFloat = 12, shadowRadius: CGFloat = 4) -> some View {
        self
            .background(Color(.systemBackground))
            .cornerRadius(cornerRadius)
            .shadow(color: .black.opacity(0.1), radius: shadowRadius, x: 0, y: 2)
    }
    
    /// Adds a glass morphism effect
    func glassMorphism() -> some View {
        self
            .background(.ultraThinMaterial)
            .background(.white.opacity(0.1))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(.white.opacity(0.2), lineWidth: 1)
            )
    }
    
    /// Adds haptic feedback on tap
    func hapticFeedback(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) -> some View {
        self.onTapGesture {
            let impactFeedback = UIImpactFeedbackGenerator(style: style)
            impactFeedback.impactOccurred()
        }
    }
    
    /// Adds a shimmer loading effect
    func shimmer(isActive: Bool = true) -> some View {
        self.modifier(ShimmerModifier(isActive: isActive))
    }
    
    /// Responsive padding based on device type
    func responsivePadding() -> some View {
        self.padding(.horizontal, UIDevice.current.userInterfaceIdiom == .pad ? 24 : 16)
    }
    
    /// Adaptive corner radius based on device
    func adaptiveCornerRadius() -> some View {
        let radius: CGFloat = UIDevice.current.userInterfaceIdiom == .pad ? 16 : 12
        return self.cornerRadius(radius)
    }
}

// MARK: - Color Extensions
extension Color {
    /// CloudIDE brand colors
    static let cloudIDEBlue = Color(red: 0.4, green: 0.48, blue: 0.92)
    static let cloudIDEPurple = Color(red: 0.46, green: 0.29, blue: 0.64)
    static let cloudIDEAccent = Color(red: 0.3, green: 0.6, blue: 0.9)
    
    /// Dynamic colors that adapt to light/dark mode
    static let dynamicBackground = Color(.systemBackground)
    static let dynamicSecondaryBackground = Color(.secondarySystemBackground)
    static let dynamicTertiaryBackground = Color(.tertiarySystemBackground)
    
    /// Semantic colors for different states
    static let successGreen = Color(.systemGreen)
    static let warningOrange = Color(.systemOrange)
    static let errorRed = Color(.systemRed)
    static let infoBlue = Color(.systemBlue)
    
    /// Creates a random color for testing/placeholder purposes
    static func random() -> Color {
        Color(
            red: Double.random(in: 0...1),
            green: Double.random(in: 0...1),
            blue: Double.random(in: 0...1)
        )
    }
    
    /// Hex color initializer
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - String Extensions
extension String {
    /// Truncates string to specified length
    func truncated(to length: Int, trailing: String = "...") -> String {
        if self.count > length {
            return String(self.prefix(length)) + trailing
        }
        return self
    }
    
    /// Capitalizes first letter only
    func capitalizedFirst() -> String {
        guard let first = first else { return self }
        return String(first).capitalized + String(dropFirst())
    }
    
    /// Removes HTML tags
    func strippingHTML() -> String {
        return self.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression, range: nil)
    }
    
    /// Validates email format
    var isValidEmail: Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: self)
    }
    
    /// Converts to URL-friendly slug
    var slug: String {
        return self
            .lowercased()
            .replacingOccurrences(of: " ", with: "-")
            .replacingOccurrences(of: "[^a-z0-9-]", with: "", options: .regularExpression)
    }
}

// MARK: - Array Extensions
extension Array where Element: Identifiable {
    /// Removes element by ID
    mutating func remove(withId id: Element.ID) {
        self.removeAll { $0.id == id }
    }
    
    /// Finds element by ID
    func first(withId id: Element.ID) -> Element? {
        return self.first { $0.id == id }
    }
}

extension Array where Element == Website {
    /// Filters websites by search text
    func filtered(by searchText: String) -> [Website] {
        guard !searchText.isEmpty else { return self }
        return self.filter { $0.matches(searchText: searchText) }
    }
    
    /// Groups websites by date
    func groupedByDate() -> [String: [Website]] {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        
        return Dictionary(grouping: self) { website in
            formatter.string(from: website.timestampDate)
        }
    }
    
    /// Sorts by most recent first
    func sortedByDate() -> [Website] {
        return self.sorted { $0.timestampDate > $1.timestampDate }
    }
}

// MARK: - Date Extensions
extension Date {
    /// Relative time string (e.g., "2 hours ago")
    var relativeTime: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        return formatter.localizedString(for: self, relativeTo: Date())
    }
    
    /// Short time format
    var shortTime: String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: self)
    }
    
    /// Check if date is today
    var isToday: Bool {
        Calendar.current.isDateInToday(self)
    }
    
    /// Check if date is yesterday
    var isYesterday: Bool {
        Calendar.current.isDateInYesterday(self)
    }
}

// MARK: - UIDevice Extensions
extension UIDevice {
    /// Check if device is iPad
    var isIPad: Bool {
        return userInterfaceIdiom == .pad
    }
    
    /// Check if device is iPhone
    var isIPhone: Bool {
        return userInterfaceIdiom == .phone
    }
    
    /// Get device model name
    var modelName: String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8, value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value))!)
        }
        return identifier
    }
}

// MARK: - Binding Extensions
extension Binding {
    /// Creates a binding that logs changes
    func logged(name: String) -> Binding<Value> {
        return Binding(
            get: { self.wrappedValue },
            set: { newValue in
                print("🔄 Binding '\(name)' changed to: \(newValue)")
                self.wrappedValue = newValue
            }
        )
    }
}

// MARK: - Custom Modifiers
struct ShimmerModifier: ViewModifier {
    let isActive: Bool
    @State private var phase: CGFloat = 0
    
    func body(content: Content) -> some View {
        content
            .overlay(
                Rectangle()
                    .fill(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                .clear,
                                .white.opacity(isActive ? 0.6 : 0),
                                .clear
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .rotationEffect(.degrees(30))
                    .offset(x: phase)
                    .clipped()
            )
            .onAppear {
                if isActive {
                    withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                        phase = 300
                    }
                }
            }
    }
}

// MARK: - Responsive Layout Helper
struct ResponsiveLayout {
    static func columns(for geometry: GeometryProxy) -> Int {
        let width = geometry.size.width
        if width > 1200 { return 4 }
        else if width > 800 { return 3 }
        else if width > 600 { return 2 }
        else { return 1 }
    }
    
    static func spacing(for geometry: GeometryProxy) -> CGFloat {
        let width = geometry.size.width
        if width > 800 { return 24 }
        else if width > 600 { return 20 }
        else { return 16 }
    }
    
    static func padding(for geometry: GeometryProxy) -> CGFloat {
        let width = geometry.size.width
        if width > 800 { return 32 }
        else if width > 600 { return 24 }
        else { return 16 }
    }
}

// MARK: - Animation Extensions
extension Animation {
    /// CloudIDE signature spring animation
    static let cloudIDESpring = Animation.spring(response: 0.6, dampingFraction: 0.8, blendDuration: 0)
    
    /// Smooth ease animation
    static let cloudIDEEase = Animation.easeInOut(duration: 0.4)
    
    /// Quick bounce animation
    static let cloudIDEBounce = Animation.spring(response: 0.3, dampingFraction: 0.6, blendDuration: 0)
}

// MARK: - Haptic Feedback Helper
struct HapticFeedback {
    static func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) {
        let impactFeedback = UIImpactFeedbackGenerator(style: style)
        impactFeedback.impactOccurred()
    }
    
    static func selection() {
        let selectionFeedback = UISelectionFeedbackGenerator()
        selectionFeedback.selectionChanged()
    }
    
    static func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        let notificationFeedback = UINotificationFeedbackGenerator()
        notificationFeedback.notificationOccurred(type)
    }
}
