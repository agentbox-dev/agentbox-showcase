// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/user/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  TEAM: {
    LIST: '/teams',
    CREATE: '/teams',
    UPDATE: '/teams/:id',
    DELETE: '/teams/:id',
  },
  TEMPLATES: {
    LIST: '/templates',
    DETAIL: '/templates/:id',
    USE: '/templates/:id/use',
  },
  SANDBOXES: {
    LIST: '/sandboxes',
    CREATE: '/sandboxes',
    DELETE: '/sandboxes/:id',
  },
} as const

// Navigation items
export const NAVIGATION_ITEMS = {
  HOME: { name: 'Home', href: '/home' },
  SANDBOXES: { name: 'Sandboxes', href: '/home/sandboxes' },
  TEMPLATES: { name: 'Templates', href: '/home/templates' },
  AGENTS: { name: 'Agents', href: '/home/agents' },
} as const

export const MANAGE_ITEMS = {
  ANALYTICS: { name: 'Analytics', href: '/home/analytics' },
  TEAM: { name: 'Team', href: '/home/teams' },
  API_KEYS: { name: 'API Keys', href: '/home/api-keys' },
  SETTINGS: { name: 'Settings', href: '/home/settings' },
} as const

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Clean white background' },
  { value: 'dark', label: 'Dark', description: 'Dark mode for low light' },
] as const

// Template categories
export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Analytics', label: 'Analytics' },
  { value: 'Automation', label: 'Automation' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Integration', label: 'Integration' },
  { value: 'Support', label: 'Support' },
  { value: 'Marketing', label: 'Marketing' },
] as const

// Status colors
export const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  popular: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  trending: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  new: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CURRENT_TEAM_ID: 'currentTeamId',
  THEME: 'theme',
} as const
