/**
 * Sandbox相关API
 * 包括沙箱的创建、管理、运行等功能
 */

import { getApiBaseUrl } from '../api-url'
import { getSupabaseHeaders } from './headers'
import { STORAGE_KEYS } from '@/constants'

// Sandbox相关类型定义
export interface Sandbox {
  alias: string
  clientID: string
  cpuCount: number
  diskSizeMB: number
  endAt: string
  envdVersion: string
  memoryMB: number
  metadata: Record<string, any>
  sandboxID: string
  startedAt: string
  state: 'running' | 'stopped' | 'starting' | 'stopping' | 'error'
  templateID: string
}

export interface CreateSandboxRequest {
  name: string
  description?: string
  template?: string
  environment?: Record<string, string>
  resources?: {
    cpu?: number
    memory?: number
    storage?: number
  }
}

export interface UpdateSandboxRequest {
  name?: string
  description?: string
  environment?: Record<string, string>
  resources?: {
    cpu?: number
    memory?: number
    storage?: number
  }
}

export interface SandboxLog {
  id: string
  sandboxId: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  source?: string
}

export interface SandboxStats {
  sandboxId: string
  cpu: number
  memory: number
  storage: number
  networkIn: number
  networkOut: number
  uptime: number
  timestamp: string
}

// API错误类
export class SandboxApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'SandboxApiError'
  }
}

// Sandbox API客户端
class SandboxApiClient {
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
        throw new SandboxApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof SandboxApiError) {
        throw error
      }
      
      throw new SandboxApiError(
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
        throw new SandboxApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof SandboxApiError) {
        throw error
      }

      throw new SandboxApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 获取所有沙箱
  async getSandboxes(): Promise<Sandbox[]> {
    return this.request<Sandbox[]>('/sandboxes')
  }

  // 获取运行中的沙箱
  async getRunningSandboxes(): Promise<Sandbox[]> {
    return this.requestWithProxy<Sandbox[]>('/api/proxy/sandboxes?state=running')
  }

  // 获取单个沙箱
  async getSandbox(id: string): Promise<Sandbox> {
    return this.request<Sandbox>(`/sandboxes/${id}`)
  }

  // 创建沙箱
  async createSandbox(data: CreateSandboxRequest): Promise<Sandbox> {
    return this.request<Sandbox>('/sandboxes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 更新沙箱
  async updateSandbox(id: string, data: UpdateSandboxRequest): Promise<Sandbox> {
    return this.request<Sandbox>(`/sandboxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 删除沙箱
  async deleteSandbox(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sandboxes/${id}`, {
      method: 'DELETE',
    })
  }

  // 启动沙箱
  async startSandbox(id: string): Promise<Sandbox> {
    return this.request<Sandbox>(`/sandboxes/${id}/start`, {
      method: 'POST',
    })
  }

  // 停止沙箱
  async stopSandbox(id: string): Promise<Sandbox> {
    return this.request<Sandbox>(`/sandboxes/${id}/stop`, {
      method: 'POST',
    })
  }

  // 重启沙箱
  async restartSandbox(id: string): Promise<Sandbox> {
    return this.request<Sandbox>(`/sandboxes/${id}/restart`, {
      method: 'POST',
    })
  }

  // 获取沙箱日志
  async getSandboxLogs(id: string, limit = 100): Promise<SandboxLog[]> {
    return this.request<SandboxLog[]>(`/sandboxes/${id}/logs?limit=${limit}`)
  }

  // 获取沙箱统计信息
  async getSandboxStats(id: string): Promise<SandboxStats> {
    return this.request<SandboxStats>(`/sandboxes/${id}/stats`)
  }

  // 在沙箱中执行命令
  async executeCommand(id: string, command: string): Promise<{ output: string; exitCode: number }> {
    return this.request<{ output: string; exitCode: number }>(`/sandboxes/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    })
  }

  // 上传文件到沙箱
  async uploadFile(id: string, file: File, path: string): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    return this.request<{ message: string }>(`/sandboxes/${id}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      },
    })
  }

  // 从沙箱下载文件
  async downloadFile(id: string, path: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/sandboxes/${id}/download?path=${encodeURIComponent(path)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    if (!response.ok) {
      throw new SandboxApiError(`Failed to download file: ${response.statusText}`, response.status)
    }

    return response.blob()
  }
}

// 导出单例实例
export const sandboxApi = new SandboxApiClient()

// 便捷函数
export const sandboxApiHelpers = {
  getSandboxes: () => sandboxApi.getSandboxes(),
  getRunningSandboxes: () => sandboxApi.getRunningSandboxes(),
  getSandbox: (id: string) => sandboxApi.getSandbox(id),
  createSandbox: (data: CreateSandboxRequest) => sandboxApi.createSandbox(data),
  updateSandbox: (id: string, data: UpdateSandboxRequest) => sandboxApi.updateSandbox(id, data),
  deleteSandbox: (id: string) => sandboxApi.deleteSandbox(id),
  startSandbox: (id: string) => sandboxApi.startSandbox(id),
  stopSandbox: (id: string) => sandboxApi.stopSandbox(id),
  restartSandbox: (id: string) => sandboxApi.restartSandbox(id),
  getLogs: (id: string, limit?: number) => sandboxApi.getSandboxLogs(id, limit),
  getStats: (id: string) => sandboxApi.getSandboxStats(id),
  executeCommand: (id: string, command: string) => sandboxApi.executeCommand(id, command),
  uploadFile: (id: string, file: File, path: string) => sandboxApi.uploadFile(id, file, path),
  downloadFile: (id: string, path: string) => sandboxApi.downloadFile(id, path),
}
