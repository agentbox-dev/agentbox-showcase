/**
 * Environment variables configuration
 * This file provides type-safe access to environment variables
 */

// Server-side environment variables
export const serverEnv = {
  API_URL: process.env.API_URL || 'https://api.agentbox.lingyiwanwu.com',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-secret',
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
} as const

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agentbox.lingyiwanwu.com',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  ENABLE_SW: process.env.NEXT_PUBLIC_ENABLE_SW === 'true',
} as const

// Validate required environment variables
export function validateEnv() {
  const required = ['API_URL', 'NEXTAUTH_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Environment type
export type Environment = 'development' | 'production' | 'test'

export function getEnvironment(): Environment {
  return (process.env.NODE_ENV as Environment) || 'development'
}

export const isDevelopment = getEnvironment() === 'development'
export const isProduction = getEnvironment() === 'production'
export const isTest = getEnvironment() === 'test'
