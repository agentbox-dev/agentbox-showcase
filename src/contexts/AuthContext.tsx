'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { clientEnv } from '@/lib/env'
import { authApi, authApiHelpers, AuthApiError } from '@/lib/api/auth'
import { teamApiHelpers, Team } from '@/lib/api/team'
import { validateLoginResponse } from '@/lib/login-validator'
import { STORAGE_KEYS } from '@/constants'

// 在开发模式下加载验证工具
if (typeof window !== 'undefined' && clientEnv.DEBUG_MODE) {
  import('@/lib/login-validator')
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  teams: Team[]
  defaultTeam: Team | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  refreshToken: () => Promise<void>
  fetchTeams: (userId?: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName?: string  // Optional, not used in backend
  lastName?: string   // Optional, not used in backend
  company?: string    // Optional, not used in backend
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [defaultTeam, setDefaultTeam] = useState<Team | null>(null)

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const expiresAt = localStorage.getItem('token_expires_at')
        
        if (token && expiresAt) {
          // Check if token is expired
          const now = Date.now() / 1000
          const expires = parseInt(expiresAt)
          
          if (now < expires) {
            // Token is still valid, verify it with the server
            console.log('Valid token found, verifying with server...')
            try {
              // Try to get user teams to verify token is still valid
              const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
              if (userInfo.id) {
                await fetchTeams(userInfo.id)
                // If successful, set user as authenticated
                setUser(userInfo)
                console.log('Token verified successfully, user auto-logged in')
              } else {
                console.log('No user info found, clearing tokens')
                localStorage.removeItem('auth_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token_expires_at')
                localStorage.removeItem('user_info')
              }
            } catch (error) {
              console.log('Token verification failed:', error)
              // Token is invalid, clean up
              localStorage.removeItem('auth_token')
              localStorage.removeItem('refresh_token')
              localStorage.removeItem('token_expires_at')
              localStorage.removeItem('user_info')
            }
          } else {
            // Token expired, clean up
            console.log('Token expired, cleaning up')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('token_expires_at')
            localStorage.removeItem('user_info')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_expires_at')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('🔍 开始登录验证...')
      console.log('📧 邮箱:', email)
      console.log('🔑 密码:', password ? '***' : '(空)')
      
      const response = await authApiHelpers.signIn(email, password)
      
      console.log('📋 登录API响应:', response)
      
      // 验证响应结构
      const validation = validateLoginResponse(response)
      
      if (!validation.isValid) {
        console.error('❌ 登录响应验证失败:', validation.errors)
        throw new Error(`登录响应格式错误: ${validation.errors.join(', ')}`)
      }
      
      console.log('✅ 登录响应验证通过')
      
      // Store tokens
      localStorage.setItem('auth_token', response.access_token)
      
      // 只有当 refresh_token 不是 "None" 时才存储
      if (response.refresh_token && response.refresh_token !== "None") {
        localStorage.setItem('refresh_token', response.refresh_token)
      } else {
        localStorage.removeItem('refresh_token')
      }
      
      localStorage.setItem('token_expires_at', response.expires_at.toString())
      
      console.log('💾 Token已存储到localStorage')
      console.log('   - access_token:', response.access_token.substring(0, 20) + '...')
      console.log('   - refresh_token:', response.refresh_token === "None" ? 'None (not stored)' : response.refresh_token.substring(0, 20) + '...')
      console.log('   - expires_at:', new Date(response.expires_at * 1000).toLocaleString())
      
      // Extract user data from response
      const userData = response.user
      const extractedUser = {
        id: userData.id || '1',
        email: userData.email || email,
        firstName: userData.first_name || userData.firstName || '',
        lastName: userData.last_name || userData.lastName || '',
        company: userData.company || '',
        avatar: userData.avatar || userData.avatar_url || ''
      }
      
      console.log('👤 提取的用户数据:', extractedUser)
      setUser(extractedUser)
      
      // 保存用户信息到localStorage，用于页面刷新后恢复状态
      localStorage.setItem('user_info', JSON.stringify(extractedUser))
      
      // 登录成功后获取团队列表，直接传递用户ID
      await fetchTeams(extractedUser.id)
      
    } catch (error) {
      console.error('❌ 登录失败:', error)
      
      // 清理可能存在的无效token
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('token_expires_at')
      setUser(null)
      
      // 始终抛出错误，不进行fallback
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      console.log('🔍 开始用户注册...')
      console.log('📧 邮箱:', userData.email)
      
      const response = await authApiHelpers.signUp(userData.email, userData.password)
      
      console.log('📋 注册API响应:', response)
      console.log('✅ 注册成功!')
      
      // 注册成功后不自动登录，用户需要重新登录
      // 不设置用户状态和token，让用户手动登录
      
    } catch (error) {
      console.error('❌ 注册失败:', error)
      
      // 在开发模式下，如果API失败，也不自动登录
      if (clientEnv.DEBUG_MODE) {
        console.warn('API call failed in demo mode:', error)
        // 在demo模式下也不自动设置用户状态
        // 让用户手动登录以保持一致性
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expires_at')
    localStorage.removeItem('user_info')
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM_ID)
    setUser(null)
    setTeams([])
    setDefaultTeam(null)
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      await authApiHelpers.updatePassword(currentPassword, newPassword)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      await authApiHelpers.forgotPassword(email)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true)
    try {
      await authApiHelpers.resetPassword(token, newPassword)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token')
      if (!refreshTokenValue || refreshTokenValue === "None") {
        throw new Error('No refresh token available')
      }
      
      const response = await authApiHelpers.refreshToken(refreshTokenValue)
      
      // Update stored tokens
      localStorage.setItem('auth_token', response.access_token)
      
      // 只有当 refresh_token 不是 "None" 时才存储
      if (response.refresh_token && response.refresh_token !== "None") {
        localStorage.setItem('refresh_token', response.refresh_token)
      } else {
        localStorage.removeItem('refresh_token')
      }
      
      localStorage.setItem('token_expires_at', response.expires_at.toString())
      
      // Update user data if available
      if (response.user) {
        const userData = response.user
        setUser({
          id: userData.id || '1',
          email: userData.email || user?.email || '',
          firstName: userData.first_name || userData.firstName || user?.firstName || '',
          lastName: userData.last_name || userData.lastName || user?.lastName || '',
          company: userData.company || user?.company || '',
          avatar: userData.avatar || userData.avatar_url || user?.avatar || ''
        })
      }
    } catch (error) {
      // If refresh fails, logout user
      logout()
      throw error
    }
  }

  const fetchTeams = async (userId?: string) => {
    try {
      const targetUserId = userId || user?.id
      if (!targetUserId) {
        throw new Error('用户ID不存在，无法获取团队列表')
      }
      
      console.log('🔍 获取用户团队列表...')
      console.log('👤 用户ID:', targetUserId)
      const teamsData = await teamApiHelpers.getUserTeams(targetUserId)
      console.log('📋 团队列表:', teamsData)
      
      setTeams(teamsData)
      
      // 设置默认团队（只有在没有保存的团队ID时才设置）
      if (teamsData.length > 0) {
        const savedTeamId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) : null
        
        if (savedTeamId) {
          // 如果有保存的团队ID，尝试找到对应的团队
          const savedTeam = teamsData.find(team => team.id === savedTeamId)
          if (savedTeam) {
            setDefaultTeam(savedTeam)
            console.log('✅ 使用保存的团队:', savedTeam.name)
          } else {
            // 保存的团队ID无效，使用第一个团队
            const defaultTeamToSet = teamsData[0]
            setDefaultTeam(defaultTeamToSet)
            localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM_ID, defaultTeamToSet.id)
            console.log('⚠️ 保存的团队ID无效，使用第一个团队:', defaultTeamToSet.name)
          }
        } else {
          // 没有保存的团队ID，使用第一个团队作为默认团队
          const defaultTeamToSet = teamsData[0]
          setDefaultTeam(defaultTeamToSet)
          localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM_ID, defaultTeamToSet.id)
          console.log('✅ 设置默认团队:', defaultTeamToSet.name)
        }
      } else {
        setDefaultTeam(null)
        console.log('⚠️ 用户没有任何团队')
      }
    } catch (error) {
      console.error('❌ 获取团队列表失败:', error)
      // 不再使用模拟数据，确保只有真正登录成功才能获取团队数据
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    teams,
    defaultTeam,
    login,
    register,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    fetchTeams,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
