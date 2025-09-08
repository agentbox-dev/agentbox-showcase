/**
 * Template相关API
 * 包括模板的浏览、创建、管理等功能
 */

import { getApiBaseUrl } from '../api-url'
import { getSupabaseHeaders } from './headers'
import { STORAGE_KEYS } from '@/constants'

// Template相关类型定义 - 匹配服务端Golang结构
export interface TeamUser {
  id: string
  email: string
}

export interface Template {
  // Aliases of the template
  aliases?: string[]
  
  // Number of times the template was built
  buildCount: number
  
  // Identifier of the last successful build for given template
  buildID: string
  
  // CPU cores for the sandbox
  cpuCount: number
  
  // Time when the template was created
  createdAt: string
  
  // User who created the template
  createdBy?: TeamUser
  
  // Disk size for the sandbox in MiB
  diskSizeMB?: number
  
  // Type of the env
  envType: string
  
  // Version of the envd running in the sandbox
  envdVersion?: string
  
  // Time when the template was last used
  lastSpawnedAt: string
  
  // Memory for the sandbox in MiB
  memoryMB: number
  
  // Whether the template is public or only accessible by the team
  public: boolean
  
  // Number of times the template was used
  spawnCount: number
  
  // Identifier of the template
  templateID: string
  
  // Time when the template was last updated
  updatedAt: string
}

// 为了向后兼容，保留原有的Template接口作为扩展接口
export interface ExtendedTemplate extends Template {
  // 前端扩展字段
  name?: string
  description?: string
  category?: string
  tags?: string[]
  author?: string
  version?: string
  status?: 'published' | 'draft' | 'archived'
  popularity?: number
  downloads?: number
  rating?: number
  thumbnail?: string
  preview?: string
  configuration?: {
    resources: {
      cpu: number
      memory: number
      storage: number
    }
    environment: Record<string, string>
    ports: Array<{
      port: number
      protocol: 'tcp' | 'udp'
      public: boolean
    }>
  }
  files?: Array<{
    path: string
    content: string
    type: 'file' | 'directory'
  }>
}

export interface CreateTemplateRequest {
  name: string
  description: string
  category: string
  tags: string[]
  configuration?: {
    resources?: {
      cpu?: number
      memory?: number
      storage?: number
    }
    environment?: Record<string, string>
    ports?: Array<{
      port: number
      protocol: 'tcp' | 'udp'
      public?: boolean
    }>
  }
  files?: Array<{
    path: string
    content: string
    type: 'file' | 'directory'
  }>
}

export interface UpdateTemplateRequest {
  name?: string
  description?: string
  category?: string
  tags?: string[]
  status?: 'published' | 'draft' | 'archived'
  configuration?: {
    resources?: {
      cpu?: number
      memory?: number
      storage?: number
    }
    environment?: Record<string, string>
    ports?: Array<{
      port: number
      protocol: 'tcp' | 'udp'
      public?: boolean
    }>
  }
  files?: Array<{
    path: string
    content: string
    type: 'file' | 'directory'
  }>
}

export interface TemplateSearchParams {
  query?: string
  category?: string
  tags?: string[]
  status?: 'published' | 'draft' | 'archived'
  sortBy?: 'popularity' | 'downloads' | 'rating' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface TemplateSearchResult {
  templates: Template[]
  total: number
  limit: number
  offset: number
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon?: string
  templateCount: number
}

export interface TemplateTag {
  id: string
  name: string
  count: number
}

// API错误类
export class TemplateApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'TemplateApiError'
  }
}

// Template API客户端
class TemplateApiClient {
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
    const currentTeamId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) : null
    config.headers = {
      ...config.headers,
      ...getSupabaseHeaders(sessionToken || undefined, currentTeamId || undefined),
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new TemplateApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TemplateApiError) {
        throw error
      }
      
      throw new TemplateApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 专门用于代理API的请求方法
  private async requestWithProxy<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // 对于代理API，直接使用相对路径，不需要baseURL
    const url = endpoint
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // 添加认证头部
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const currentTeamId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) : null
    config.headers = {
      ...config.headers,
      ...getSupabaseHeaders(sessionToken || undefined, currentTeamId || undefined),
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new TemplateApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TemplateApiError) {
        throw error
      }
      
      throw new TemplateApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 搜索模板
  async searchTemplates(params: TemplateSearchParams = {}): Promise<TemplateSearchResult> {
    const searchParams = new URLSearchParams()
    
    if (params.query) searchParams.append('query', params.query)
    if (params.category) searchParams.append('category', params.category)
    if (params.tags) searchParams.append('tags', params.tags.join(','))
    if (params.status) searchParams.append('status', params.status)
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.offset) searchParams.append('offset', params.offset.toString())

    return this.request<TemplateSearchResult>(`/templates/search?${searchParams.toString()}`)
  }

  // 获取所有模板
  async getTemplates(limit = 20, offset = 0): Promise<TemplateSearchResult> {
    return this.searchTemplates({ limit, offset })
  }

  // 获取单个模板
  async getTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}`)
  }

  // 创建模板
  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return this.request<Template>('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 更新模板
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<Template> {
    return this.request<Template>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 删除模板
  async deleteTemplate(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/templates/${id}`, {
      method: 'DELETE',
    })
  }

  // 发布模板
  async publishTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}/publish`, {
      method: 'POST',
    })
  }

  // 取消发布模板
  async unpublishTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}/unpublish`, {
      method: 'POST',
    })
  }

  // 克隆模板
  async cloneTemplate(id: string, name?: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  // 获取模板分类
  async getCategories(): Promise<TemplateCategory[]> {
    return this.request<TemplateCategory[]>('/templates/categories')
  }

  // 获取模板标签
  async getTags(): Promise<TemplateTag[]> {
    return this.request<TemplateTag[]>('/templates/tags')
  }

  // 获取热门模板
  async getPopularTemplates(limit = 10): Promise<Template[]> {
    return this.request<Template[]>(`/templates/popular?limit=${limit}`)
  }

  // 获取最新模板
  async getRecentTemplates(limit = 10): Promise<Template[]> {
    return this.request<Template[]>(`/templates/recent?limit=${limit}`)
  }

  // 获取用户创建的模板
  async getUserTemplates(userId?: string): Promise<Template[]> {
    const endpoint = userId ? `/templates/user/${userId}` : '/templates/my'
    return this.request<Template[]>(endpoint)
  }

  // 收藏模板
  async favoriteTemplate(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/templates/${id}/favorite`, {
      method: 'POST',
    })
  }

  // 取消收藏模板
  async unfavoriteTemplate(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/templates/${id}/favorite`, {
      method: 'DELETE',
    })
  }

  // 获取收藏的模板
  async getFavoriteTemplates(): Promise<Template[]> {
    return this.request<Template[]>('/templates/favorites')
  }

  // 评价模板
  async rateTemplate(id: string, rating: number, comment?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/templates/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    })
  }

  // 从模板创建沙箱
  async createSandboxFromTemplate(templateId: string, sandboxName: string): Promise<{ sandboxId: string }> {
    return this.request<{ sandboxId: string }>(`/templates/${templateId}/create-sandbox`, {
      method: 'POST',
      body: JSON.stringify({ name: sandboxName }),
    })
  }

  // 获取团队模板
  async getTeamTemplates(teamId: string): Promise<Template[]> {
    return this.requestWithProxy<Template[]>(`/api/proxy/templates?teamID=${teamId}`)
  }

  // 获取默认模板
  async getDefaultTemplates(): Promise<Template[]> {
    return this.requestWithProxy<Template[]>('/api/proxy/templates')
  }
}

// 导出单例实例
export const templateApi = new TemplateApiClient()

// 便捷函数
export const templateApiHelpers = {
  search: (params: TemplateSearchParams) => templateApi.searchTemplates(params),
  getAll: (limit?: number, offset?: number) => templateApi.getTemplates(limit, offset),
  getById: (id: string) => templateApi.getTemplate(id),
  create: (data: CreateTemplateRequest) => templateApi.createTemplate(data),
  update: (id: string, data: UpdateTemplateRequest) => templateApi.updateTemplate(id, data),
  delete: (id: string) => templateApi.deleteTemplate(id),
  publish: (id: string) => templateApi.publishTemplate(id),
  unpublish: (id: string) => templateApi.unpublishTemplate(id),
  clone: (id: string, name?: string) => templateApi.cloneTemplate(id, name),
  getCategories: () => templateApi.getCategories(),
  getTags: () => templateApi.getTags(),
  getPopular: (limit?: number) => templateApi.getPopularTemplates(limit),
  getRecent: (limit?: number) => templateApi.getRecentTemplates(limit),
  getUserTemplates: (userId?: string) => templateApi.getUserTemplates(userId),
  favorite: (id: string) => templateApi.favoriteTemplate(id),
  unfavorite: (id: string) => templateApi.unfavoriteTemplate(id),
  getFavorites: () => templateApi.getFavoriteTemplates(),
  rate: (id: string, rating: number, comment?: string) => templateApi.rateTemplate(id, rating, comment),
  createSandbox: (templateId: string, sandboxName: string) => templateApi.createSandboxFromTemplate(templateId, sandboxName),
  getTeamTemplates: (teamId: string) => templateApi.getTeamTemplates(teamId),
  getDefaultTemplates: () => templateApi.getDefaultTemplates(),
}
