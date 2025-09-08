'use client'

import { useState, useEffect, useCallback } from 'react'

interface UsePageStateOptions {
  key: string
  initialValue: any
  persist?: boolean
}

/**
 * 自定义 hook 用于管理页面状态，支持持久化到 localStorage
 * 这是 Next.js 业界规范的状态管理方式
 */
export function usePageState<T>({ key, initialValue, persist = true }: UsePageStateOptions) {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined' && persist) {
      try {
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : initialValue
      } catch (error) {
        console.warn(`Failed to load state for key ${key}:`, error)
        return initialValue
      }
    }
    return initialValue
  })

  const setStateWithPersistence = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' ? (newState as (prev: T) => T)(prevState) : newState
      
      if (typeof window !== 'undefined' && persist) {
        try {
          localStorage.setItem(key, JSON.stringify(nextState))
        } catch (error) {
          console.warn(`Failed to save state for key ${key}:`, error)
        }
      }
      
      return nextState
    })
  }, [key, persist])

  // 清理 localStorage 的函数
  const clearState = useCallback(() => {
    if (typeof window !== 'undefined' && persist) {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Failed to clear state for key ${key}:`, error)
      }
    }
    setState(initialValue)
  }, [key, persist, initialValue])

  return [state, setStateWithPersistence, clearState] as const
}

/**
 * 用于管理 API 数据缓存的 hook
 */
export function useApiCache<T>(key: string, cacheTime = 5 * 60 * 1000) {
  const [cache, setCache] = useState<{ data: T; timestamp: number } | null>(null)

  const setCachedData = useCallback((data: T) => {
    setCache({ data, timestamp: Date.now() })
  }, [])

  const getCachedData = useCallback((): T | null => {
    if (!cache) return null
    
    const now = Date.now()
    if (now - cache.timestamp > cacheTime) {
      setCache(null)
      return null
    }
    
    return cache.data
  }, [cache, cacheTime])

  const clearCache = useCallback(() => {
    setCache(null)
  }, [])

  return { setCachedData, getCachedData, clearCache, isCached: !!cache }
}
