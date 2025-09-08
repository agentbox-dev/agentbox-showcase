/**
 * 统一API入口
 * 导出所有API模块和类型
 */

// 导出认证API
export * from './auth'

// 导出沙箱API
export * from './sandbox'

// 导出模板API
export * from './template'

// 导出团队API
export * from './team'

// 导出头部管理
export * from './headers'

// 通用类型和工具
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

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

// 健康检查
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/health`)
    return response.ok
  } catch {
    return false
  }
}

// API状态检查
export async function getApiStatus(): Promise<{
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version?: string
}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/health`)
    const data = await response.json()
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: data.version
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    }
  }
}
