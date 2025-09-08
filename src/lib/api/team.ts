/**
 * Team相关API
 * 包括团队的创建、管理、成员管理等功能
 */

import { getApiBaseUrl } from '../api-url'
import { getSupabaseHeaders } from './headers'
import { STORAGE_KEYS } from '@/constants'

// Team相关类型定义
export interface Team {
  id: string
  name: string
  description?: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  memberCount: number
  createdAt: string
  updatedAt: string
  settings?: {
    allowMemberInvite: boolean
    allowSandboxCreation: boolean
    allowTemplateCreation: boolean
    maxSandboxes: number
    maxMembers: number
  }
  billing?: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'cancelled' | 'past_due'
    currentPeriodEnd: string
  }
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
}

export interface CreateTeamRequest {
  name: string
  description?: string
  avatar?: string
  settings?: {
    allowMemberInvite?: boolean
    allowSandboxCreation?: boolean
    allowTemplateCreation?: boolean
    maxSandboxes?: number
    maxMembers?: number
  }
}

export interface UpdateTeamRequest {
  name?: string
  description?: string
  avatar?: string
  settings?: {
    allowMemberInvite?: boolean
    allowSandboxCreation?: boolean
    allowTemplateCreation?: boolean
    maxSandboxes?: number
    maxMembers?: number
  }
}

export interface InviteMemberRequest {
  email: string
  role: 'admin' | 'member'
  message?: string
}

export interface UpdateMemberRoleRequest {
  userId: string
  role: 'admin' | 'member'
}

export interface TeamStats {
  teamId: string
  totalSandboxes: number
  activeSandboxes: number
  totalTemplates: number
  totalMembers: number
  storageUsed: number
  bandwidthUsed: number
  lastActivity: string
}

export interface TeamActivity {
  id: string
  teamId: string
  userId: string
  action: string
  description: string
  metadata?: Record<string, any>
  timestamp: string
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
}

// API错误类
export class TeamApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'TeamApiError'
  }
}

// Team API客户端
class TeamApiClient {
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
        throw new TeamApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TeamApiError) {
        throw error
      }
      
      throw new TeamApiError(
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
        throw new TeamApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TeamApiError) {
        throw error
      }
      
      throw new TeamApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 获取用户的所有团队
  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams')
  }

  // 根据用户ID获取团队列表
  async getUserTeams(userId: string): Promise<Team[]> {
    // 使用代理API来避免CORS问题
    return this.requestWithProxy<Team[]>(`/api/proxy/user-teams?user_id=${userId}`)
  }

  // 获取单个团队
  async getTeam(id: string): Promise<Team> {
    return this.request<Team>(`/teams/${id}`)
  }

  // 创建团队
  async createTeam(data: CreateTeamRequest): Promise<Team> {
    const url = '/api/proxy/team'
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    // 添加认证头部（创建团队时不需要 team ID）
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    config.headers = {
      ...config.headers,
      ...getSupabaseHeaders(sessionToken || undefined, undefined),
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new TeamApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TeamApiError) {
        throw error
      }
      
      throw new TeamApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      )
    }
  }

  // 更新团队
  async updateTeam(id: string, data: UpdateTeamRequest): Promise<Team> {
    return this.request<Team>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // 删除团队
  async deleteTeam(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${id}`, {
      method: 'DELETE',
    })
  }

  // 获取团队成员
  async getTeamMembers(teamId: string, teamEmail?: string): Promise<TeamMember[]> {
    // 第一步：获取团队成员关系
    const teamMembers = await this.requestWithProxy<Array<{
      id: number
      user_id: string
      team_id: string
      is_default?: boolean
      edges: Record<string, any>
    }>>(`/api/proxy/user-team-by-team?team_id=${teamId}`)

    if (teamMembers.length === 0) {
      return []
    }

    // 第二步：提取用户ID列表
    const userIds = teamMembers.map(member => member.user_id).join(',')

    // 第三步：获取用户详细信息
    const users = await this.requestWithProxy<Array<{
      id: string
      email: string
      firstName?: string
      lastName?: string
      avatar?: string
    }>>(`/api/proxy/user-by-ids?user_ids=${userIds}`)

    // 第四步：组合数据
    const result: TeamMember[] = teamMembers.map(teamMember => {
      const user = users.find(u => u.id === teamMember.user_id)
      
      // 角色判断逻辑
      let role: 'owner' | 'admin' | 'member' = 'member'
      
      // 方法1: 尝试从 edges 中获取角色信息
      if (teamMember.edges && teamMember.edges.role) {
        role = teamMember.edges.role
      }
      // 方法2: 使用 is_default 判断（如果 is_default 为 true，通常是 owner）
      else if (teamMember.is_default) {
        role = 'owner'
      }
      // 方法3: 根据用户邮箱判断（临时解决方案）
      // 如果用户邮箱与团队邮箱相同，可能是 owner
      else if (user?.email && teamEmail && user.email === teamEmail) {
        role = 'owner'
      }
      
      // 调试日志
      console.log('🔍 Team member role debug:', {
        userId: teamMember.user_id,
        userEmail: user?.email,
        teamEmail: teamEmail,
        is_default: teamMember.is_default,
        edges: teamMember.edges,
        determinedRole: role,
        isEmailMatch: user?.email === teamEmail
      })
      
      return {
        id: teamMember.id.toString(),
        userId: teamMember.user_id,
        teamId: teamMember.team_id,
        role: role,
        joinedAt: new Date().toISOString(), // 暂时使用当前时间，实际应该从API获取
        user: user || {
          id: teamMember.user_id,
          email: 'Unknown',
          firstName: undefined,
          lastName: undefined,
          avatar: undefined
        }
      }
    })

    return result
  }

  // 邀请成员
  async inviteMember(teamId: string, data: InviteMemberRequest): Promise<{ message: string; inviteId: string }> {
    return this.request<{ message: string; inviteId: string }>(`/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 邀请用户加入团队 (使用 /user-team 接口)
  async inviteUserToTeam(data: {
    email: string
    teamID: string
  }): Promise<{ message: string }> {
    return this.requestWithProxy<{ message: string }>('/api/proxy/user-team', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 删除团队成员 (使用 /user-team/${userId}/${teamId} 接口)
  async removeUserFromTeam(userId: string, teamId: string): Promise<{ message: string }> {
    return this.requestWithProxy<{ message: string }>(`/api/proxy/user-team/${userId}/${teamId}`, {
      method: 'DELETE',
    })
  }

  // 更新成员角色
  async updateMemberRole(teamId: string, data: UpdateMemberRoleRequest): Promise<TeamMember> {
    return this.request<TeamMember>(`/teams/${teamId}/members/${data.userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role: data.role }),
    })
  }

  // 移除成员
  async removeMember(teamId: string, userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    })
  }

  // 离开团队
  async leaveTeam(teamId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${teamId}/leave`, {
      method: 'POST',
    })
  }

  // 转让团队所有权
  async transferOwnership(teamId: string, newOwnerId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${teamId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ newOwnerId }),
    })
  }

  // 获取团队统计信息
  async getTeamStats(teamId: string): Promise<TeamStats> {
    return this.request<TeamStats>(`/teams/${teamId}/stats`)
  }

  // 获取团队活动日志
  async getTeamActivity(teamId: string, limit = 50, offset = 0): Promise<TeamActivity[]> {
    return this.request<TeamActivity[]>(`/teams/${teamId}/activity?limit=${limit}&offset=${offset}`)
  }

  // 获取团队邀请
  async getTeamInvites(teamId: string): Promise<Array<{
    id: string
    email: string
    role: 'admin' | 'member'
    status: 'pending' | 'accepted' | 'expired'
    invitedBy: string
    invitedAt: string
    expiresAt: string
  }>> {
    return this.request<Array<{
      id: string
      email: string
      role: 'admin' | 'member'
      status: 'pending' | 'accepted' | 'expired'
      invitedBy: string
      invitedAt: string
      expiresAt: string
    }>>(`/teams/${teamId}/invites`)
  }

  // 取消邀请
  async cancelInvite(teamId: string, inviteId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${teamId}/invites/${inviteId}`, {
      method: 'DELETE',
    })
  }

  // 接受团队邀请
  async acceptInvite(inviteToken: string): Promise<{ message: string; team: Team }> {
    return this.request<{ message: string; team: Team }>('/teams/accept-invite', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken }),
    })
  }

  // 拒绝团队邀请
  async rejectInvite(inviteToken: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/teams/reject-invite', {
      method: 'POST',
      body: JSON.stringify({ token: inviteToken }),
    })
  }

  // 获取团队设置
  async getTeamSettings(teamId: string): Promise<Team['settings']> {
    return this.request<Team['settings']>(`/teams/${teamId}/settings`)
  }

  // 更新团队设置
  async updateTeamSettings(teamId: string, settings: Team['settings']): Promise<Team['settings']> {
    return this.request<Team['settings']>(`/teams/${teamId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // 获取团队计费信息
  async getTeamBilling(teamId: string): Promise<Team['billing']> {
    return this.request<Team['billing']>(`/teams/${teamId}/billing`)
  }

  // 更新团队计费计划
  async updateTeamBilling(teamId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/teams/${teamId}/billing`, {
      method: 'PUT',
      body: JSON.stringify({ plan }),
    })
  }
}

// 导出单例实例
export const teamApi = new TeamApiClient()

// 便捷函数
export const teamApiHelpers = {
  getAll: () => teamApi.getTeams(),
  getUserTeams: (userId: string) => teamApi.getUserTeams(userId),
  getById: (id: string) => teamApi.getTeam(id),
  create: (data: CreateTeamRequest) => teamApi.createTeam(data),
  update: (id: string, data: UpdateTeamRequest) => teamApi.updateTeam(id, data),
  delete: (id: string) => teamApi.deleteTeam(id),
  getMembers: (teamId: string, teamEmail?: string) => teamApi.getTeamMembers(teamId, teamEmail),
  inviteMember: (teamId: string, data: InviteMemberRequest) => teamApi.inviteMember(teamId, data),
  inviteUserToTeam: (data: { email: string; teamID: string }) => teamApi.inviteUserToTeam(data),
  removeUserFromTeam: (userId: string, teamId: string) => teamApi.removeUserFromTeam(userId, teamId),
  updateMemberRole: (teamId: string, data: UpdateMemberRoleRequest) => teamApi.updateMemberRole(teamId, data),
  removeMember: (teamId: string, userId: string) => teamApi.removeMember(teamId, userId),
  leave: (teamId: string) => teamApi.leaveTeam(teamId),
  transferOwnership: (teamId: string, newOwnerId: string) => teamApi.transferOwnership(teamId, newOwnerId),
  getStats: (teamId: string) => teamApi.getTeamStats(teamId),
  getActivity: (teamId: string, limit?: number, offset?: number) => teamApi.getTeamActivity(teamId, limit, offset),
  getInvites: (teamId: string) => teamApi.getTeamInvites(teamId),
  cancelInvite: (teamId: string, inviteId: string) => teamApi.cancelInvite(teamId, inviteId),
  acceptInvite: (inviteToken: string) => teamApi.acceptInvite(inviteToken),
  rejectInvite: (inviteToken: string) => teamApi.rejectInvite(inviteToken),
  getSettings: (teamId: string) => teamApi.getTeamSettings(teamId),
  updateSettings: (teamId: string, settings: Team['settings']) => teamApi.updateTeamSettings(teamId, settings),
  getBilling: (teamId: string) => teamApi.getTeamBilling(teamId),
  updateBilling: (teamId: string, plan: 'free' | 'pro' | 'enterprise') => teamApi.updateTeamBilling(teamId, plan),
}
