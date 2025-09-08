'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useTeam } from "@/contexts/TeamContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { 
  Bot, 
  Box, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Activity,
  Users
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const { currentTeam } = useTeam()

  // Mock data
  const stats = {
    totalAgents: 12,
    activeAgents: 8,
    totalSandboxes: 15,
    runningSandboxes: 3,
    apiCalls: 1234,
    successRate: 98.5
  }

  const recentActivity = [
    {
      id: 1,
      type: 'agent',
      name: 'Data Analysis Agent',
      status: 'completed',
      time: '2 minutes ago',
      duration: '1m 23s'
    },
    {
      id: 2,
      type: 'sandbox',
      name: 'Web Scraping Environment',
      status: 'running',
      time: '5 minutes ago',
      duration: '3m 45s'
    },
    {
      id: 3,
      type: 'agent',
      name: 'Email Automation Agent',
      status: 'waiting',
      time: '10 minutes ago',
      duration: null
    },
    {
      id: 4,
      type: 'sandbox',
      name: 'ML Training Environment',
      status: 'completed',
      time: '15 minutes ago',
      duration: '12m 30s'
    }
  ]

  const templates = [
    {
      id: 1,
      name: 'Data Analysis Agent',
      description: 'Analyze datasets and generate insights',
      category: 'Analytics',
      popularity: 95,
      lastUsed: '2 hours ago',
      status: 'popular'
    },
    {
      id: 2,
      name: 'Web Scraping Bot',
      description: 'Extract data from websites automatically',
      category: 'Automation',
      popularity: 87,
      lastUsed: '1 day ago',
      status: 'popular'
    },
    {
      id: 3,
      name: 'Email Automation',
      description: 'Automated email processing and responses',
      category: 'Communication',
      popularity: 72,
      lastUsed: '3 days ago',
      status: 'trending'
    },
    {
      id: 4,
      name: 'API Integration',
      description: 'Connect and sync data between services',
      category: 'Integration',
      popularity: 68,
      lastUsed: '1 week ago',
      status: 'new'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getTemplateStatusColor = (status: string) => {
    switch (status) {
      case 'popular':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'trending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
              <p className="text-muted-foreground">
                {currentTeam ? (
                  <>Here's what's happening in <span className="font-medium">{currentTeam.name}</span></>
                ) : (
                  "Here's what's happening with your agents and sandboxes"
                )}
              </p>
            </div>
            <Button asChild>
              <Link href="/home/agents/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeAgents} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sandboxes</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSandboxes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.runningSandboxes} running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.apiCalls.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <Progress value={stats.successRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest executions and sandbox activities
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/home/activity">
                        View All
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className="flex-shrink-0">
                          {activity.type === 'agent' ? (
                            <Bot className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Box className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(activity.status)}
                            <Badge variant="secondary" className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                            {activity.duration && (
                              <span className="text-xs text-muted-foreground">
                                {activity.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Info & Templates */}
            <div className="space-y-6">
              {/* Current Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Current Team</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentTeam ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentTeam.avatar} alt={currentTeam.name} />
                          <AvatarFallback>
                            {currentTeam.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{currentTeam.name}</h4>
                          <p className="text-sm text-muted-foreground">{currentTeam.description}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={getTemplateStatusColor(currentTeam.role === 'owner' ? 'popular' : currentTeam.role === 'admin' ? 'trending' : 'new')}
                        >
                          {currentTeam.role}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{currentTeam.memberCount} member{currentTeam.memberCount !== 1 ? 's' : ''}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/home/teams">
                            Switch Team
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No team selected</p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link href="/home/teams">Select Team</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Templates */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Popular Templates</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/home/templates">
                        View All
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div key={template.id} className="p-3 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>{template.category}</span>
                              <span>{template.popularity}% popular</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary"
                              className={`text-xs ${getTemplateStatusColor(template.status)}`}
                            >
                              {template.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last used: {template.lastUsed}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
