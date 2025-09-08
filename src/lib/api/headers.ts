/**
 * Supabase API 头部管理
 * 统一管理所有API请求的认证头部
 */

import { STORAGE_KEYS } from '@/constants'

export const SUPABASE_TOKEN_HEADER = 'X-Supabase-Token'
export const SUPABASE_TEAM_HEADER = 'X-Supabase-Team'

/*
export const SUPABASE_AUTH_HEADERS = (token?: string, teamId?: string) => ({
  [SUPABASE_TOKEN_HEADER]: token,
  ...(teamId && { [SUPABASE_TEAM_HEADER]: teamId }),
})
*/

export function getSupabaseHeaders(token?: string, teamId?: string) {
  const headers: Record<string, string> = {}

  if (token) headers[SUPABASE_TOKEN_HEADER] = token
  if (teamId) headers[SUPABASE_TEAM_HEADER] = teamId

  return headers
}

/**
 * 从localStorage获取认证信息并生成头部
 */
export function getAuthHeaders(teamId?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  return getSupabaseHeaders(token || undefined, teamId)
}

/**
 * 获取当前选中的团队ID
 */
export function getCurrentTeamId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) || undefined
}

/**
 * 获取完整的认证头部（包含token和当前团队ID）
 */
export function getFullAuthHeaders() {
  const teamId = getCurrentTeamId()
  return getAuthHeaders(teamId)
}
