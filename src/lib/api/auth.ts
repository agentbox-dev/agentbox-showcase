/**
 * 用户认证相关API
 * 包括注册、登录、修改密码、忘记密码等功能
 */

import { getApiBaseUrl } from '../api-url'
import { getSupabaseHeaders } from './headers'

// 认证相关类型定义
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

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
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

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

// API错误类
export class AuthApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'AuthApiError'
  }
}

// 认证API客户端
class AuthApiClient {
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

    // 添加认证头部
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    config.headers = {
      ...config.headers,
      ...getSupabaseHeaders(sessionToken || undefined, undefined),
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new AuthApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error
      }
      
      // 网络或其他错误
      throw new AuthApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 用户注册
  async signUp(data: SignUpRequest): Promise<AccessTokenResponse> {
    return this.request<AccessTokenResponse>('/user/sign-up', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 用户登录
  async signIn(data: SignInRequest): Promise<AccessTokenResponse> {
    return this.request<AccessTokenResponse>('/user/sign-in', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 忘记密码
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 重置密码
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 修改密码
  async updatePassword(data: UpdatePasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/update-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 刷新Token
  async refreshToken(data: RefreshTokenRequest): Promise<AccessTokenResponse> {
    return this.request<AccessTokenResponse>('/user/refresh-token', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 获取用户信息
  async getProfile(): Promise<User> {
    return this.request<User>('/user/profile')
  }

  // 更新用户信息
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 登出
  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/logout', {
      method: 'POST',
    })
  }
}

// 导出单例实例
export const authApi = new AuthApiClient()

// 便捷函数
export const authApiHelpers = {
  signUp: (email: string, password: string) => 
    authApi.signUp({ email, password }),
  
  signIn: (email: string, password: string) => 
    authApi.signIn({ email, password }),
  
  forgotPassword: (email: string) => 
    authApi.forgotPassword({ email }),
  
  resetPassword: (token: string, password: string) => 
    authApi.resetPassword({ token, password }),
  
  updatePassword: (currentPassword: string, newPassword: string) => 
    authApi.updatePassword({ currentPassword, newPassword }),
  
  refreshToken: (refreshToken: string) => 
    authApi.refreshToken({ refresh_token: refreshToken }),
}
