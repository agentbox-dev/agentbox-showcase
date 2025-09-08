'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Team } from '@/types'
import { STORAGE_KEYS } from '@/constants'
import { getCurrentTeamId } from '@/lib/api/headers'
import { teamApi, Team as ApiTeam } from '@/lib/api/team'
import { useAuth } from './AuthContext'

interface TeamContextType {
  currentTeam: Team | null
  teams: Team[]
  setCurrentTeam: (team: Team) => void
  isLoading: boolean
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { teams: authTeams, defaultTeam: authDefaultTeam, isAuthenticated } = useAuth()

  // 从AuthContext同步团队数据
  useEffect(() => {
    console.log('🔄 TeamContext useEffect triggered')
    console.log('🔍 状态检查:', {
      isAuthenticated,
      authTeamsLength: authTeams.length,
      authDefaultTeam: authDefaultTeam ? `${authDefaultTeam.name} (${authDefaultTeam.id})` : 'null',
      savedTeamId: getCurrentTeamId()
    })

    if (isAuthenticated && authTeams.length > 0) {
      // 使用AuthContext中的团队数据
      const savedTeamId = getCurrentTeamId()
      const currentTeamToSet = savedTeamId 
        ? authTeams.find(team => team.id === savedTeamId) 
        : authDefaultTeam || authTeams[0]
      
      console.log('✅ 设置当前团队:', currentTeamToSet ? `${currentTeamToSet.name} (${currentTeamToSet.id})` : 'null')
      setCurrentTeamState(currentTeamToSet || authTeams[0])
      setIsLoading(false)
    } else if (isAuthenticated && authTeams.length === 0) {
      // 用户已登录但没有团队数据，保持加载状态
      console.log('⏳ 用户已登录但团队数据为空，保持加载状态')
      // 不设置isLoading为false，等待团队数据加载
    } else if (!isAuthenticated) {
      // 用户未登录时清空团队数据
      console.log('❌ 用户未登录，清空团队数据')
      setCurrentTeamState(null)
      setIsLoading(false)
    }
  }, [authTeams, authDefaultTeam, isAuthenticated])

  const setCurrentTeam = (team: Team) => {
    setCurrentTeamState(team)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM_ID, team.id)
    }
  }

  return (
    <TeamContext.Provider value={{ 
      currentTeam, 
      teams: authTeams, 
      setCurrentTeam, 
      isLoading 
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
}
