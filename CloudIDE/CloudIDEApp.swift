//
//  CloudIDEApp.swift
//  CloudIDE
//
//  Created by Bhuvesh Bansal on 30/08/25.
//

import SwiftUI

@main
struct CloudIDEApp: App {
    var body: some Scene {
        WindowGroup {
            AdvancedContentView()
                .preferredColorScheme(.light) // Optimize for CloudIDE branding
        }
    }
}
