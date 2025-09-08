/**
 * API service for AgentBox backend integration
 * Handles all API calls to the AgentBox service
 */

import { getApiBaseUrl } from './api-url'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  createdAt?: string
  updatedAt?: string
}

export interface AccessTokenResponse {
  access_token: string
  expires_at: number
  expires_in: number
  provider_refresh_token: string
  provider_token: string
  refresh_token: string
  token_type: string
  user: Record<string, any>
  weak_password: Record<string, any>
}

export interface AuthResponse {
  token: string
  user: User
}

export interface SignUpRequest {
  email: string
  password: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Base API client
class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = getApiBaseUrl()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // Authentication endpoints
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/user/sign-up', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signIn(data: SignInRequest): Promise<AccessTokenResponse> {
    return this.request<AccessTokenResponse>('/user/sign-in', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePassword(data: UpdatePasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/update-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async refreshToken(): Promise<AccessTokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401)
    }
    
    return this.request<AccessTokenResponse>('/user/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  // User profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>('/user/profile')
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/health')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Helper functions for common operations
export const authApi = {
  signUp: (email: string, password: string) => 
    apiClient.signUp({ email, password }),
  
  signIn: (email: string, password: string) => 
    apiClient.signIn({ email, password }),
  
  forgotPassword: (email: string) => 
    apiClient.forgotPassword({ email }),
  
  resetPassword: (token: string, password: string) => 
    apiClient.resetPassword({ token, password }),
  
  updatePassword: (currentPassword: string, newPassword: string) => 
    apiClient.updatePassword({ currentPassword, newPassword }),
  
  refreshToken: () => apiClient.refreshToken(),
}

export const userApi = {
  getProfile: () => apiClient.getProfile(),
  updateProfile: (data: Partial<User>) => apiClient.updateProfile(data),
}

// Utility function to check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.healthCheck()
    return true
  } catch {
    return false
  }
}
