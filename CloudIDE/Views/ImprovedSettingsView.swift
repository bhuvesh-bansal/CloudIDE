import SwiftUI

struct ImprovedSettingsView: View {
    @EnvironmentObject var appState: AppStateManager
    @State private var showAbout = false
    @State private var showClearDataAlert = false
    
    var body: some View {
        NavigationView {
            ResponsiveContainer { geometry in
                ScrollView {
                    LazyVStack(spacing: 24) {
                        // Header Section
                        headerSection
                        
                        // Preferences Section
                        preferencesSection
                        
                        // Statistics Section
                        statisticsSection
                        
                        // App Information Section
                        appInfoSection
                        
                        // Danger Zone
                        dangerZoneSection
                    }
                    .padding(.horizontal, ResponsiveLayout.padding(for: geometry))
                    .padding(.vertical, 24)
                }
            }
            .background(Color.dynamicBackground)
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showAbout) {
            ImprovedAboutView()
        }
        .alert("Clear All Data", isPresented: $showClearDataAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Clear All", role: .destructive) {
                clearAllData()
            }
        } message: {
            Text("This will permanently delete all your websites and preferences. This action cannot be undone.")
        }
    }
    
    // MARK: - Header Section
    private var headerSection: some View {
        EnhancedCard {
            VStack(spacing: 16) {
                // App Icon and Title
                HStack(spacing: 16) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(LinearGradient(
                                gradient: Gradient(colors: [Color.cloudIDEBlue, Color.cloudIDEPurple]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 64, height: 64)
                        
                        Image(systemName: "cloud.fill")
                            .font(.system(size: 32, weight: .medium))
                            .foregroundColor(.white)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("CloudIDE")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("AI Website Generator")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        TagView(text: "v\(AppConfig.appVersion)", color: .cloudIDEAccent, size: .small)
                    }
                    
                    Spacer()
                }
                
                // Quick Stats
                HStack(spacing: 20) {
                    StatItem(
                        title: "Websites",
                        value: "\(appState.websiteHistory.count)",
                        icon: "globe"
                    )
                    
                    StatItem(
                        title: "AI Generated",
                        value: "\(appState.websiteHistory.filter { $0.isAIGenerated }.count)",
                        icon: "brain.head.profile"
                    )
                    
                    StatItem(
                        title: "Favorites",
                        value: "\(appState.favoriteWebsites.count)",
                        icon: "heart.fill"
                    )
                }
            }
        }
    }
    
    // MARK: - Preferences Section
    private var preferencesSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Generation Preferences", icon: "slider.horizontal.3")
                
                VStack(spacing: 16) {
                    ToggleRow(
                        title: "Prefer AI Generation",
                        subtitle: "Use AI when available, fallback to templates",
                        icon: "brain.head.profile",
                        isOn: $appState.userPreferences.preferAI
                    )
                    
                    ToggleRow(
                        title: "Auto-save Websites",
                        subtitle: "Automatically save generated websites to history",
                        icon: "square.and.arrow.down",
                        isOn: $appState.userPreferences.autoSaveWebsites
                    )
                    
                    ToggleRow(
                        title: "Haptic Feedback",
                        subtitle: "Feel vibrations for button presses and actions",
                        icon: "hand.tap",
                        isOn: $appState.userPreferences.enableHapticFeedback
                    )
                    
                    ToggleRow(
                        title: "Analytics",
                        subtitle: "Help improve the app with anonymous usage data",
                        icon: "chart.bar",
                        isOn: $appState.userPreferences.analyticsEnabled
                    )
                }
            }
        }
    }
    
    // MARK: - Statistics Section
    private var statisticsSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Usage Statistics", icon: "chart.pie")
                
                if appState.websiteHistory.isEmpty {
                    EmptyStateView(
                        icon: "chart.bar",
                        title: "No Data Yet",
                        message: "Create your first website to see statistics here"
                    )
                    .frame(height: 200)
                } else {
                    VStack(spacing: 16) {
                        StatRow(
                            title: "Total Websites Created",
                            value: "\(appState.websiteHistory.count)",
                            icon: "globe",
                            color: .cloudIDEBlue
                        )
                        
                        StatRow(
                            title: "AI Generated",
                            value: "\(appState.websiteHistory.filter { $0.isAIGenerated }.count)",
                            percentage: aiPercentage,
                            icon: "brain.head.profile",
                            color: .cloudIDEPurple
                        )
                        
                        StatRow(
                            title: "Template Based",
                            value: "\(appState.websiteHistory.filter { !$0.isAIGenerated }.count)",
                            percentage: templatePercentage,
                            icon: "doc.text",
                            color: .successGreen
                        )
                        
                        StatRow(
                            title: "Favorites",
                            value: "\(appState.favoriteWebsites.count)",
                            icon: "heart.fill",
                            color: .errorRed
                        )
                        
                        if let mostUsedIndustry = mostUsedIndustry {
                            StatRow(
                                title: "Most Used Category",
                                value: mostUsedIndustry.capitalized,
                                icon: "tag",
                                color: .warningOrange
                            )
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - App Information Section
    private var appInfoSection: some View {
        EnhancedCard {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "App Information", icon: "info.circle")
                
                VStack(spacing: 16) {
                    InfoRow(
                        title: "About CloudIDE",
                        subtitle: "Learn more about this app",
                        icon: "info.circle",
                        action: { showAbout = true }
                    )
                    
                    InfoRow(
                        title: "Version",
                        value: AppConfig.appVersion,
                        icon: "number.circle"
                    )
                    
                    InfoRow(
                        title: "Build",
                        value: "2024.1",
                        icon: "hammer"
                    )
                    
                    InfoRow(
                        title: "Developer",
                        value: "Bhuvesh Bansal",
                        icon: "person.circle"
                    )
                }
            }
        }
    }
    
    // MARK: - Danger Zone Section
    private var dangerZoneSection: some View {
        EnhancedCard(borderColor: .errorRed.opacity(0.3)) {
            VStack(alignment: .leading, spacing: 20) {
                SectionHeader(title: "Danger Zone", icon: "exclamationmark.triangle", color: .errorRed)
                
                VStack(spacing: 16) {
                    DangerRow(
                        title: "Clear All Data",
                        subtitle: "Permanently delete all websites and preferences",
                        icon: "trash",
                        action: { showClearDataAlert = true }
                    )
                }
            }
        }
    }
    
    // MARK: - Computed Properties
    private var aiPercentage: Double {
        guard !appState.websiteHistory.isEmpty else { return 0 }
        let aiCount = appState.websiteHistory.filter { $0.isAIGenerated }.count
        return (Double(aiCount) / Double(appState.websiteHistory.count)) * 100
    }
    
    private var templatePercentage: Double {
        guard !appState.websiteHistory.isEmpty else { return 0 }
        let templateCount = appState.websiteHistory.filter { !$0.isAIGenerated }.count
        return (Double(templateCount) / Double(appState.websiteHistory.count)) * 100
    }
    
    private var mostUsedIndustry: String? {
        let industries = appState.websiteHistory.compactMap { $0.industry }
        let counts = Dictionary(grouping: industries, by: { $0 })
        return counts.max(by: { $0.value.count < $1.value.count })?.key
    }
    
    // MARK: - Actions
    private func clearAllData() {
        withAnimation(.cloudIDEEase) {
            appState.clearHistory()
            appState.favoriteWebsites.removeAll()
        }
        HapticFeedback.notification(.success)
    }
}

// MARK: - Supporting Views
struct SectionHeader: View {
    let title: String
    let icon: String
    let color: Color
    
    init(title: String, icon: String, color: Color = .primary) {
        self.title = title
        self.icon = icon
        self.color = color
    }
    
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.system(size: 16, weight: .semibold))
            
            Text(title)
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(color)
            
            Spacer()
        }
    }
}

struct ToggleRow: View {
    let title: String
    let subtitle: String
    let icon: String
    @Binding var isOn: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.cloudIDEBlue)
                .font(.system(size: 20))
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body)
                    .fontWeight(.medium)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .toggleStyle(SwitchToggleStyle(tint: .cloudIDEBlue))
        }
        .contentShape(Rectangle())
        .onTapGesture {
            withAnimation(.cloudIDEEase) {
                isOn.toggle()
            }
            HapticFeedback.selection()
        }
    }
}

struct StatRow: View {
    let title: String
    let value: String
    let percentage: Double?
    let icon: String
    let color: Color
    
    init(title: String, value: String, percentage: Double? = nil, icon: String, color: Color) {
        self.title = title
        self.value = value
        self.percentage = percentage
        self.icon = icon
        self.color = color
    }
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.system(size: 16, weight: .semibold))
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body)
                    .fontWeight(.medium)
                
                if let percentage = percentage {
                    Text("\(Int(percentage))% of total")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            Text(value)
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(color)
        }
    }
}

struct InfoRow: View {
    let title: String
    let subtitle: String?
    let value: String?
    let icon: String
    let action: (() -> Void)?
    
    init(title: String, subtitle: String? = nil, value: String? = nil, icon: String, action: (() -> Void)? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.value = value
        self.icon = icon
        self.action = action
    }
    
    var body: some View {
        Button(action: {
            if let action = action {
                HapticFeedback.selection()
                action()
            }
        }) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .foregroundColor(.cloudIDEBlue)
                    .font(.system(size: 16, weight: .semibold))
                    .frame(width: 20)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                    
                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                if let value = value {
                    Text(value)
                        .font(.body)
                        .foregroundColor(.secondary)
                } else if action != nil {
                    Image(systemName: "chevron.right")
                        .foregroundColor(.secondary)
                        .font(.system(size: 12, weight: .semibold))
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(action == nil)
    }
}

struct DangerRow: View {
    let title: String
    let subtitle: String
    let icon: String
    let action: () -> Void
    
    var body: some View {
        Button(action: {
            HapticFeedback.notification(.warning)
            action()
        }) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .foregroundColor(.errorRed)
                    .font(.system(size: 16, weight: .semibold))
                    .frame(width: 20)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(.errorRed)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .foregroundColor(.errorRed)
                    .font(.system(size: 12, weight: .semibold))
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct StatItem: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.cloudIDEBlue)
                .font(.system(size: 20, weight: .medium))
            
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    ImprovedSettingsView()
        .environmentObject(AppStateManager())
}
