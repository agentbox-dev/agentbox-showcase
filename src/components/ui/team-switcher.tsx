'use client'

import { useState } from 'react'
import { useTeam } from '@/contexts/TeamContext'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  Users, 
  Plus, 
  Settings,
  Crown,
  Shield,
  User
} from 'lucide-react'
import Link from 'next/link'

interface TeamSwitcherProps {
  onCreateTeam?: () => void
}

export function TeamSwitcher({ onCreateTeam }: TeamSwitcherProps) {
  const { currentTeam, teams, setCurrentTeam } = useTeam()
  const [open, setOpen] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3" />
      case 'admin':
        return <Shield className="w-3 h-3" />
      case 'member':
        return <User className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'member':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!currentTeam) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-accent"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentTeam.avatar} alt={currentTeam.name} />
            <AvatarFallback>
              {currentTeam.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentTeam.name}</span>
            <span className="text-xs text-muted-foreground">
              {currentTeam.memberCount} member{currentTeam.memberCount !== 1 ? 's' : ''}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => {
              setCurrentTeam(team)
              setOpen(false)
            }}
            className="flex items-center space-x-3 p-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={team.avatar} alt={team.name} />
              <AvatarFallback>
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium truncate">{team.name}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getRoleColor(team.role)}`}
                >
                  {getRoleIcon(team.role)}
                  <span className="ml-1">{team.role}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {team.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
              </p>
            </div>
            {currentTeam.id === team.id && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            setOpen(false)
            onCreateTeam?.()
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
