import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var appState: AppStateManager
    @State private var searchText = ""
    @State private var selectedWebsite: Website?
    @State private var showFilters = false
    @State private var selectedFilter: FilterOption = .all
    @State private var sortOption: SortOption = .newest
    
    enum FilterOption: String, CaseIterable {
        case all = "All"
        case aiGenerated = "AI Generated"
        case templates = "Templates"
        case favorites = "Favorites"
        
        var icon: String {
            switch self {
            case .all: return "globe"
            case .aiGenerated: return "brain.head.profile"
            case .templates: return "doc.text"
            case .favorites: return "heart.fill"
            }
        }
        
        var color: Color {
            switch self {
            case .all: return .cloudIDEBlue
            case .aiGenerated: return .cloudIDEPurple
            case .templates: return .successGreen
            case .favorites: return .errorRed
            }
        }
    }
    
    enum SortOption: String, CaseIterable {
        case newest = "Newest First"
        case oldest = "Oldest First"
        case alphabetical = "A-Z"
        case industry = "By Category"
        
        var icon: String {
            switch self {
            case .newest: return "arrow.down"
            case .oldest: return "arrow.up"
            case .alphabetical: return "textformat.abc"
            case .industry: return "tag"
            }
        }
    }
    
    var filteredAndSortedWebsites: [Website] {
        var websites = appState.websiteHistory
        
        // Apply search filter
        if !searchText.isEmpty {
            websites = websites.filtered(by: searchText)
        }
        
        // Apply category filter
        switch selectedFilter {
        case .all:
            break
        case .aiGenerated:
            websites = websites.filter { $0.isAIGenerated }
        case .templates:
            websites = websites.filter { !$0.isAIGenerated }
        case .favorites:
            websites = websites.filter { appState.isFavorite($0) }
        }
        
        // Apply sorting
        switch sortOption {
        case .newest:
            websites = websites.sortedByDate()
        case .oldest:
            websites = websites.sorted { $0.timestampDate < $1.timestampDate }
        case .alphabetical:
            websites = websites.sorted { $0.displayTitle < $1.displayTitle }
        case .industry:
            websites = websites.sorted { ($0.industry ?? "") < ($1.industry ?? "") }
        }
        
        return websites
    }
    
    var body: some View {
        ResponsiveContainer { geometry in
                VStack(spacing: 0) {
                    // Search and Filter Bar
                    searchAndFilterSection
                        .padding(.horizontal, ResponsiveLayout.padding(for: geometry))
                        .padding(.top, 16)
                    
                    // Filter Pills
                    if showFilters {
                        filterPillsSection
                            .padding(.horizontal, ResponsiveLayout.padding(for: geometry))
                            .transition(.move(edge: .top).combined(with: .opacity))
                    }
                    
                    // Content
                    if filteredAndSortedWebsites.isEmpty {
                        emptyStateView
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        websitesList(geometry: geometry)
                    }
                }
        }
        .background(Color.dynamicBackground)
        .navigationTitle("Website History")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    sortMenuItems
                    
                    Divider()
                    
                    Button(action: {
                        withAnimation(.cloudIDEEase) {
                            showFilters.toggle()
                        }
                    }) {
                        Label(showFilters ? "Hide Filters" : "Show Filters", systemImage: "line.3.horizontal.decrease.circle")
                    }
                    
                    if !appState.websiteHistory.isEmpty {
                        Divider()
                        
                        Button("Clear All", role: .destructive) {
                            withAnimation(.cloudIDEEase) {
                                appState.clearHistory()
                            }
                        }
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(.cloudIDEBlue)
                }
            }
        }
        .sheet(item: $selectedWebsite) { website in
            WebsiteDetailSheet(website: website)
        }
    }
    
    // MARK: - Search and Filter Section
    private var searchAndFilterSection: some View {
        VStack(spacing: 16) {
            EnhancedSearchBar(
                text: $searchText,
                placeholder: "Search websites...",
                onSearchButtonClicked: {
                    // Handle search if needed
                }
            )
            
            // Stats Row
            if !appState.websiteHistory.isEmpty {
                statsRow
            }
        }
    }
    
    // MARK: - Stats Row
    private var statsRow: some View {
        HStack(spacing: 20) {
            StatBadge(
                title: "Total",
                value: appState.websiteHistory.count,
                color: .cloudIDEBlue
            )
            
            StatBadge(
                title: "AI",
                value: appState.websiteHistory.filter { $0.isAIGenerated }.count,
                color: .cloudIDEPurple
            )
            
            StatBadge(
                title: "Templates",
                value: appState.websiteHistory.filter { !$0.isAIGenerated }.count,
                color: .successGreen
            )
            
            StatBadge(
                title: "Favorites",
                value: appState.favoriteWebsites.count,
                color: .errorRed
            )
        }
    }
    
    // MARK: - Filter Pills Section
    private var filterPillsSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(FilterOption.allCases, id: \.self) { filter in
                    FilterPill(
                        filter: filter,
                        isSelected: selectedFilter == filter,
                        onTap: {
                            withAnimation(.cloudIDEEase) {
                                selectedFilter = filter
                            }
                            HapticFeedback.selection()
                        }
                    )
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 12)
    }
    
    // MARK: - Websites List
    private func websitesList(geometry: GeometryProxy) -> some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(filteredAndSortedWebsites) { website in
                    WebsiteCard(
                        website: website,
                        isFavorite: appState.isFavorite(website),
                        onFavoriteToggle: {
                            withAnimation(.cloudIDESpring) {
                                appState.toggleFavorite(website)
                            }
                            HapticFeedback.impact(.light)
                        },
                        onTap: {
                            selectedWebsite = website
                            HapticFeedback.selection()
                        }
                    )
                }
            }
            .padding(.horizontal, ResponsiveLayout.padding(for: geometry))
            .padding(.vertical, 20)
        }
    }
    
    // MARK: - Empty State
    private var emptyStateView: some View {
        Group {
            if searchText.isEmpty && selectedFilter == .all {
                EmptyStateView(
                    icon: "clock",
                    title: "No Websites Yet",
                    message: "Create your first website using the Chat tab, and it will appear here in your history.",
                    actionTitle: "Start Creating",
                    action: {
                        // Switch to chat tab - this would need to be handled by parent
                    }
                )
            } else {
                EmptyStateView(
                    icon: "magnifyingglass",
                    title: "No Results Found",
                    message: searchText.isEmpty ? 
                        "No websites match the selected filter." : 
                        "No websites match '\(searchText)'.",
                    actionTitle: "Clear Filters",
                    action: {
                        withAnimation(.cloudIDEEase) {
                            searchText = ""
                            selectedFilter = .all
                        }
                    }
                )
            }
        }
    }
    
    // MARK: - Sort Menu Items
    private var sortMenuItems: some View {
        ForEach(SortOption.allCases, id: \.self) { option in
            Button(action: {
                withAnimation(.cloudIDEEase) {
                    sortOption = option
                }
            }) {
                Label(option.rawValue, systemImage: option.icon)
                if sortOption == option {
                    Image(systemName: "checkmark")
                }
            }
        }
    }
}

// MARK: - Supporting Views

struct StatBadge: View {
    let title: String
    let value: Int
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Text("\(value)")
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct FilterPill: View {
    let filter: HistoryView.FilterOption
    let isSelected: Bool
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 6) {
                Image(systemName: filter.icon)
                    .font(.system(size: 12, weight: .semibold))
                
                Text(filter.rawValue)
                    .font(.caption)
                    .fontWeight(.semibold)
            }
            .foregroundColor(isSelected ? .white : filter.color)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(isSelected ? filter.color : filter.color.opacity(0.1))
            )
            .overlay(
                Capsule()
                    .stroke(filter.color.opacity(0.3), lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct WebsiteCard: View {
    let website: Website
    let isFavorite: Bool
    let onFavoriteToggle: () -> Void
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            EnhancedCard {
                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(website.displayTitle)
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                                .lineLimit(1)
                            
                            Text(website.formattedDate)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        // Generation Badge
                        TagView(
                            text: website.isAIGenerated ? "AI" : "Template",
                            color: website.isAIGenerated ? .cloudIDEPurple : .successGreen,
                            size: .small
                        )
                    }
                    
                    // Prompt
                    Text(website.prompt)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                    
                    // Footer
                    HStack {
                        // Industry Tag
                        if let industry = website.industry {
                            TagView(
                                text: industry.capitalized,
                                color: .cloudIDEAccent,
                                size: .small
                            )
                        }
                        
                        Spacer()
                        
                        // Actions
                        HStack(spacing: 16) {
                            // Favorite Button
                            Button(action: onFavoriteToggle) {
                                Image(systemName: isFavorite ? "heart.fill" : "heart")
                                    .foregroundColor(isFavorite ? .errorRed : .secondary)
                                    .font(.system(size: 16, weight: .medium))
                                    .scaleEffect(isFavorite ? 1.1 : 1.0)
                                    .animation(.cloudIDESpring, value: isFavorite)
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            // Preview Indicator
                            Image(systemName: "chevron.right")
                                .foregroundColor(.secondary)
                                .font(.system(size: 12, weight: .semibold))
                        }
                    }
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct WebsiteDetailSheet: View {
    let website: Website
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header Info
                    EnhancedCard {
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(website.displayTitle)
                                        .font(.title2)
                                        .fontWeight(.bold)
                                    
                                    Text("Created \(website.formattedDate)")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                TagView(
                                    text: website.isAIGenerated ? "AI Generated" : "Template",
                                    color: website.isAIGenerated ? .cloudIDEPurple : .successGreen
                                )
                            }
                            
                            if let description = website.description {
                                Text(description)
                                    .font(.body)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    
                    // Prompt
                    EnhancedCard {
                        VStack(alignment: .leading, spacing: 12) {
                            SectionHeader(title: "Original Prompt", icon: "text.quote")
                            
                            Text(website.prompt)
                                .font(.body)
                                .padding(.vertical, 8)
                                .padding(.horizontal, 12)
                                .background(Color.dynamicSecondaryBackground)
                                .cornerRadius(8)
                        }
                    }
                    
                    // Technical Details
                    EnhancedCard {
                        VStack(alignment: .leading, spacing: 16) {
                            SectionHeader(title: "Technical Details", icon: "info.circle")
                            
                            VStack(spacing: 12) {
                                DetailRow(title: "Website ID", value: website.id)
                                DetailRow(title: "Generation Method", value: website.isAIGenerated ? "AI Powered" : "Template Based")
                                
                                if let industry = website.industry {
                                    DetailRow(title: "Category", value: industry.capitalized)
                                }
                                
                                if let source = website.source {
                                    DetailRow(title: "Source", value: source)
                                }
                            }
                        }
                    }
                    
                    // Actions
                    VStack(spacing: 12) {
                        AnimatedButton(style: .primary, action: {
                            // Open in full screen
                            dismiss()
                        }) {
                            HStack {
                                Image(systemName: "eye")
                                Text("View Website")
                            }
                        }
                        
                        AnimatedButton(style: .secondary, action: {
                            // Share website
                        }) {
                            HStack {
                                Image(systemName: "square.and.arrow.up")
                                Text("Share Website")
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 24)
            }
            .navigationTitle("Website Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct DetailRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.body)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.body)
                .fontWeight(.medium)
                .foregroundColor(.primary)
        }
    }
}

#Preview {
    HistoryView()
        .environmentObject(AppStateManager())
}
