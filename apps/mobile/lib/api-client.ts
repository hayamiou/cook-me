import * as SecureStore from 'expo-secure-store'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

/**
 * API Client avec authentification automatique via Bearer token
 */
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync('accessToken')

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }

    return {
      'Content-Type': 'application/json',
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options

    const headers = requiresAuth
      ? await this.getAuthHeaders()
      : { 'Content-Type': 'application/json' }

    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré ou invalide
          throw new Error('UNAUTHORIZED')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Méthodes de convenance
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  // biome-ignore lint/suspicious/noExplicitAny: data shape depends on caller context
  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: data shape depends on caller context
  async put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Export d'une instance unique
export const apiClient = new ApiClient(API_BASE_URL)

// Export du type pour les réponses
export type { RequestOptions }
