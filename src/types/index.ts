// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  avatar?: string
}

// Team types - 匹配API返回的数据结构
export interface Team {
  id: string
  name: string
  tier: string
  email: string
  slug: string
  created_at: string
  edges: Record<string, any>
  // 前端扩展字段
  description?: string
  role?: 'owner' | 'admin' | 'member'  // 可选字段，用于前端逻辑
  memberCount?: number  // 可选字段，用于前端显示
  avatar?: string
}

// Auth types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  company?: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Template types
export interface Template {
  id: number
  name: string
  description: string
  category: string
  popularity: number
  downloads: number
  rating: number
  lastUpdated: string
  status: 'popular' | 'trending' | 'new'
  tags: string[]
  author: string
}

// Activity types
export interface Activity {
  id: number
  type: 'agent' | 'sandbox'
  name: string
  status: 'completed' | 'running' | 'waiting' | 'error'
  time: string
  duration?: string
}

// Navigation types
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

// Theme types
export type Theme = 'light' | 'dark'

// API types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}
