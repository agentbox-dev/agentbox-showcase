/**
 * API URL utilities
 * Centralized API URL construction and management
 */

import { clientEnv, serverEnv } from './env'

/**
 * Get the base API URL
 * Uses serverEnv for server-side code, clientEnv for client-side code
 */
export function getApiBaseUrl(): string {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    return serverEnv.API_URL
  }
  return clientEnv.API_URL
}

/**
 * Build a complete API URL with endpoint
 * @param endpoint - The API endpoint (e.g., '/user-teams', 'user-teams')
 * @param params - Optional query parameters
 * @returns Complete API URL
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  const baseUrl = getApiBaseUrl()
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // Build query string if params provided
  let queryString = ''
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    queryString = `?${searchParams.toString()}`
  }
  
  return `${baseUrl}${cleanEndpoint}${queryString}`
}

/**
 * Common API endpoints
 * Pre-defined endpoints for consistency
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_IN: '/user/sign-in',
    SIGN_UP: '/user/sign-up',
    REFRESH_TOKEN: '/user/refresh-token',
    FORGOT_PASSWORD: '/user/forgot-password',
    RESET_PASSWORD: '/user/reset-password',
    UPDATE_PASSWORD: '/user/update-password',
    ACCESS_TOKEN: '/access-token',
  },
  
  // User & Teams
  USER: {
    TEAMS: '/user-teams',
    PROFILE: '/user/profile',
  },
  
  // Team Management
  TEAM: {
    CREATE: '/team',
    MEMBERS: '/user-team-by-team',
    INVITE: '/user-team',
    REMOVE_MEMBER: (userId: string, teamId: string) => `/user-team/${userId}/${teamId}`,
    USER_BY_IDS: '/user-by-ids',
  },
  
  // Sandboxes
  SANDBOXES: {
    LIST: '/sandboxes',
    CREATE: '/sandboxes',
    GET: (id: string) => `/sandboxes/${id}`,
    UPDATE: (id: string) => `/sandboxes/${id}`,
    DELETE: (id: string) => `/sandboxes/${id}`,
  },
  
  // Templates
  TEMPLATES: {
    LIST: '/templates',
    DEFAULT: '/default-templates',
    CREATE: '/templates',
    GET: (id: string) => `/templates/${id}`,
    UPDATE: (id: string) => `/templates/${id}`,
    DELETE: (id: string) => `/templates/${id}`,
  },
  
  // API Keys
  API_KEYS: {
    LIST: '/api-keys',
    CREATE: '/api-keys',
    GET: (id: string) => `/api-keys/${id}`,
    UPDATE: (id: string) => `/api-keys/${id}`,
    DELETE: (id: string) => `/api-keys/${id}`,
  },
} as const

/**
 * Helper functions for common API URL patterns
 */
export const apiUrlHelpers = {
  /**
   * Build user teams URL
   */
  userTeams: (userId: string) => buildApiUrl(API_ENDPOINTS.USER.TEAMS, { user_id: userId }),
  
  /**
   * Build team members URL
   */
  teamMembers: (teamId: string) => buildApiUrl(API_ENDPOINTS.TEAM.MEMBERS, { team_id: teamId }),
  
  /**
   * Build user by IDs URL
   */
  usersByIds: (userIds: string) => buildApiUrl(API_ENDPOINTS.TEAM.USER_BY_IDS, { user_ids: userIds }),
  
  /**
   * Build sandboxes URL with optional state filter
   */
  sandboxes: (state?: string) => buildApiUrl(API_ENDPOINTS.SANDBOXES.LIST, state ? { state } : undefined),
  
  /**
   * Build templates URL with optional team ID
   */
  templates: (teamId?: string) => buildApiUrl(API_ENDPOINTS.TEMPLATES.LIST, teamId ? { teamID: teamId } : undefined),
  
  /**
   * Build default templates URL
   */
  defaultTemplates: () => buildApiUrl(API_ENDPOINTS.TEMPLATES.DEFAULT),
  
  /**
   * Build API keys URL
   */
  apiKeys: () => buildApiUrl(API_ENDPOINTS.API_KEYS.LIST),
  
  /**
   * Build specific API key URL
   */
  apiKey: (keyId: string) => buildApiUrl(API_ENDPOINTS.API_KEYS.GET(keyId)),
  
  /**
   * Build access token URL
   */
  accessToken: () => buildApiUrl(API_ENDPOINTS.AUTH.ACCESS_TOKEN),
  
  /**
   * Build team creation URL
   */
  createTeam: () => buildApiUrl(API_ENDPOINTS.TEAM.CREATE),
  
  /**
   * Build team member invitation URL
   */
  inviteTeamMember: () => buildApiUrl(API_ENDPOINTS.TEAM.INVITE),
  
  /**
   * Build remove team member URL
   */
  removeTeamMember: (userId: string, teamId: string) => buildApiUrl(API_ENDPOINTS.TEAM.REMOVE_MEMBER(userId, teamId)),
} as const

/**
 * Type for API endpoint parameters
 */
export type ApiEndpointParams = Record<string, string | number>

/**
 * Type for API URL builder function
 */
export type ApiUrlBuilder = (...args: any[]) => string
