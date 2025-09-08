'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Theme } from '@/types'
import { STORAGE_KEYS, THEME_OPTIONS } from '@/constants'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  availableThemes: readonly { value: Theme; label: string; description: string }[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage to prevent flash
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme
      return savedTheme === 'dark' ? 'dark' : 'light'
    }
    return 'light'
  })

  const availableThemes = THEME_OPTIONS

  // Sync with the script-applied theme on mount
  useEffect(() => {
    console.log('Syncing theme on mount:', theme)
    // Remove any existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`)
  }, [])

  // Apply theme to document
  useEffect(() => {
    console.log('Applying theme:', theme)
    
    // Remove all theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`)
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    
    console.log('Theme applied, document classes:', document.documentElement.classList.toString())
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
