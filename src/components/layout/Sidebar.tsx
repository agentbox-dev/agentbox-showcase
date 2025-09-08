'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Bot, 
  Box, 
  Settings, 
  FileText, 
  Users, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Key
} from 'lucide-react'
import Image from 'next/image'
import { NavigationItem } from '@/types'
import { NAVIGATION_ITEMS, MANAGE_ITEMS } from '@/constants'

const navigation: NavigationItem[] = [
  { ...NAVIGATION_ITEMS.HOME, icon: LayoutDashboard },
  { ...NAVIGATION_ITEMS.SANDBOXES, icon: Box },
  { ...NAVIGATION_ITEMS.TEMPLATES, icon: FileText },
  { ...NAVIGATION_ITEMS.AGENTS, icon: Bot, badge: 'Coming Soon' },
]

const manage: NavigationItem[] = [
  { ...MANAGE_ITEMS.ANALYTICS, icon: BarChart3, badge: 'Coming Soon' },
  { ...MANAGE_ITEMS.TEAM, icon: Users },
  { ...MANAGE_ITEMS.API_KEYS, icon: Key },
  { ...MANAGE_ITEMS.SETTINGS, icon: Settings },
]


interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image
                src="/agentbox-logo.png"
                alt="AgentBox"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-lg">AgentBox</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="w-8 h-8 rounded-lg overflow-hidden mx-auto hover:opacity-80 transition-opacity">
            <Image
              src="/agentbox-logo.png"
              alt="AgentBox"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Navigation Section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.name} className="relative">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "w-full justify-start h-9",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("w-4 h-4", !collapsed && "mr-2")} />
                      {!collapsed && item.name}
                    </Link>
                  </Button>
                  {!collapsed && item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Manage Section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Manage
          </h3>
          <div className="space-y-1">
            {manage.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.name} className="relative">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "w-full justify-start h-9",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("w-4 h-4", !collapsed && "mr-2")} />
                      {!collapsed && item.name}
                    </Link>
                  </Button>
                  {!collapsed && item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p>AgentBox v1.0.0</p>
            <p>© 2024 AgentBox</p>
          </div>
        </div>
      )}
    </div>
  )
}
