import { getFullAuthHeaders } from './headers'

export interface ApiKey {
  id: string
  name: string
  createdAt: string
  lastUsed?: string | null
  createdBy?: {
    id: string
    email: string
  } | null
  mask: {
    maskedValuePrefix: string
    maskedValueSuffix: string
    prefix: string
    valueLength: number
  }
  key?: string // 仅在创建时返回完整 key
}

class ApiKeysApi {
  private baseURL = '/api/proxy'

  private async requestWithProxy<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const authHeaders = getFullAuthHeaders()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // 获取 API Keys 列表
  async getApiKeys(): Promise<ApiKey[]> {
    return this.requestWithProxy<ApiKey[]>('/api-keys')
  }

  // 创建新的 API Key
  async createApiKey(data: { name: string }): Promise<ApiKey> {
    return this.requestWithProxy<ApiKey>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 删除 API Key
  async deleteApiKey(keyId: string): Promise<{ message: string }> {
    return this.requestWithProxy<{ message: string }>(`/api-keys/${keyId}`, {
      method: 'DELETE',
    })
  }

  // 更新 API Key 状态
  async updateApiKeyStatus(keyId: string, status: 'active' | 'inactive'): Promise<ApiKey> {
    return this.requestWithProxy<ApiKey>(`/api-keys/${keyId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }
}

export const apiKeysApi = new ApiKeysApi()

// API helpers for easy access
export const apiKeysApiHelpers = {
  getApiKeys: () => apiKeysApi.getApiKeys(),
  createApiKey: (data: { name: string }) => apiKeysApi.createApiKey(data),
  deleteApiKey: (keyId: string) => apiKeysApi.deleteApiKey(keyId),
  updateApiKeyStatus: (keyId: string, status: 'active' | 'inactive') => 
    apiKeysApi.updateApiKeyStatus(keyId, status),
}
