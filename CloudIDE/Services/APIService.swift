import Foundation

class APIService: ObservableObject {
    private let baseURL = AppConfig.baseURL
    
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func generateWebsite(prompt: String, useAI: Bool = true) async throws -> GenerateResponse {
        guard let url = URL(string: "\(baseURL)/generate") else {
            throw APIError.invalidURL
        }
        
        let request = GenerateRequest(prompt: prompt, useAI: useAI)
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            throw APIError.encodingError
        }
        
        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        do {
            return try JSONDecoder().decode(GenerateResponse.self, from: data)
        } catch {
            throw APIError.decodingError
        }
    }
    
    func testConnection() async throws -> Bool {
        guard let url = URL(string: "\(baseURL)/test") else {
            throw APIError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        // Simple check - if we get data and 200 status, connection is working
        return data.count > 0
    }
    
    func fetchWebsites() async throws -> [Website] {
        guard let url = URL(string: "\(baseURL)/websites") else {
            throw APIError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        do {
            return try JSONDecoder().decode([Website].self, from: data)
        } catch {
            throw APIError.decodingError
        }
    }
}

enum APIError: Error, LocalizedError {
    case invalidURL
    case encodingError
    case decodingError
    case invalidResponse
    case serverError(Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .encodingError:
            return "Failed to encode request"
        case .decodingError:
            return "Failed to decode response"
        case .invalidResponse:
            return "Invalid response from server"
        case .serverError(let code):
            return "Server error: \(code)"
        }
    }
}
