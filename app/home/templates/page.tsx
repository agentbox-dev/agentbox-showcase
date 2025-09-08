'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useTeam } from "@/contexts/TeamContext"
import { useAuth } from "@/contexts/AuthContext"
import { templateApiHelpers, Template } from "@/lib/api/template"
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye,
  Bot,
  TrendingUp,
  Clock,
  Users,
  Plus,
  Grid3X3,
  List,
  Building2,
  Globe,
  RefreshCw
} from "lucide-react"
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 12

function TemplatesPage() {
  const { currentTeam } = useTeam()
  const { user, isAuthenticated, fetchTeams } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [teamTemplates, setTeamTemplates] = useState<Template[]>([])
  const [defaultTemplates, setDefaultTemplates] = useState<Template[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 合并所有模板
  const allTemplates = [
    ...teamTemplates.map(t => ({ ...t, source: 'team' as const })),
    ...defaultTemplates.map(t => ({ ...t, source: 'default' as const }))
  ]

  // 过滤模板
  const filteredTemplates = allTemplates.filter(template => {
    // 使用aliases作为搜索字段，因为服务端没有name字段
    const matchesSearch = (template.aliases && template.aliases.some(alias => 
      alias.toLowerCase().includes(searchQuery.toLowerCase())
    )) || template.templateID.toLowerCase().includes(searchQuery.toLowerCase())
    
    // 使用envType作为分类
    const matchesCategory = selectedCategory === 'all' || template.envType === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 按更新时间排序，最近更新的排在最前面
  const sortedTemplates = filteredTemplates.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime()
    const dateB = new Date(b.updatedAt).getTime()
    return dateB - dateA // 降序排列，最新的在前
  })

  // 分页
  const totalPages = Math.ceil(sortedTemplates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTemplates = sortedTemplates.slice(startIndex, endIndex)

  // 获取所有分类（使用envType）
  const categories = Array.from(new Set(allTemplates.map(t => t.envType)))
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ]

  // 加载模板数据
  const loadTemplates = async () => {
    if (!currentTeam?.id) {
      console.warn('No team selected, cannot fetch templates')
      return
    }

    try {
      // 并行加载团队模板和默认模板
      const [teamTemplatesData, defaultTemplatesData] = await Promise.all([
        templateApiHelpers.getTeamTemplates(currentTeam.id),
        templateApiHelpers.getDefaultTemplates()
      ])

      setTeamTemplates(teamTemplatesData)
      setDefaultTemplates(defaultTemplatesData)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      throw error
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    console.log('🔄 Refresh button clicked - starting refresh...')
    
    if (!isAuthenticated || !currentTeam) {
      console.log('❌ User not authenticated or no current team')
      return
    }

    try {
      setIsRefreshing(true)
      setError(null)
      
      console.log('🔄 Refreshing templates...')
      console.log('🏢 Current team:', currentTeam.name, currentTeam.id)

      await loadTemplates()
      toast.success('Data refreshed successfully!')
      console.log('✅ Refresh completed successfully')
    } catch (error) {
      console.error('❌ Failed to refresh templates:', error)
      setError(error instanceof Error ? error.message : 'Failed to refresh templates')
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // 在客户端加载时从 localStorage 恢复状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSearchQuery = localStorage.getItem('templates-search-query') || ''
      const savedCategory = localStorage.getItem('templates-selected-category') || 'all'
      const savedViewMode = (localStorage.getItem('templates-view-mode') as 'grid' | 'list') || 'list'
      
      setSearchQuery(savedSearchQuery)
      setSelectedCategory(savedCategory)
      setViewMode(savedViewMode)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!currentTeam?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        await loadTemplates()
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [currentTeam?.id, user?.id])

  // 重置分页当搜索或过滤改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // 保存状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('templates-search-query', searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('templates-selected-category', selectedCategory)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('templates-view-mode', viewMode)
    }
  }, [viewMode])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getTemplateStatusColor = (isPublic: boolean) => {
    return isPublic ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
  }

  const getSourceIcon = (source: 'team' | 'default') => {
    return source === 'team' ? <Building2 className="w-4 h-4" /> : <Globe className="w-4 h-4" />
  }

  const getSourceColor = (source: 'team' | 'default') => {
    return source === 'team' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50'
  }

  const getSourceLabel = (source: 'team' | 'default') => {
    return source === 'team' ? 'Team' : 'Default'
  }

  const getTemplateDisplayName = (template: Template) => {
    if (template.aliases && template.aliases.length > 0 && template.aliases[0].trim()) {
      return template.aliases[0]
    }
    return 'N/A'
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadTemplates}>Retry</Button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Templates</h1>
              <p className="text-muted-foreground">
                Browse team templates and system default templates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button type="button">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Team Templates</p>
                    <p className="text-2xl font-bold">{teamTemplates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Default Templates</p>
                    <p className="text-2xl font-bold">{defaultTemplates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Grid3X3 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Total Templates</p>
                    <p className="text-2xl font-bold">{allTemplates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedTemplates.length)} of {sortedTemplates.length} templates
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getSourceIcon('team')}
                <span>Team ({teamTemplates.length})</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getSourceIcon('default')}
                <span>Default ({defaultTemplates.length})</span>
              </Badge>
            </div>
          </div>

          {/* Templates Grid/List */}
          {paginatedTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No templates available for this team'
                  }
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
              : "space-y-2"
            }>
              {paginatedTemplates.map((template) => (
                viewMode === 'grid' ? (
                  <Card key={`${template.source}-${template.templateID}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with Source and EnvType */}
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center space-x-1 text-xs ${getSourceColor(template.source)}`}
                          >
                            {getSourceIcon(template.source)}
                            <span>{getSourceLabel(template.source)}</span>
                          </Badge>
                          <Badge 
                            variant="default"
                            className="text-xs bg-primary text-primary-foreground font-medium"
                          >
                            {template.envType}
                          </Badge>
                        </div>

                        {/* Template ID and Name */}
                        <div>
                          <h3 className="font-medium text-sm truncate" title={getTemplateDisplayName(template)}>
                            {getTemplateDisplayName(template)}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate" title={template.templateID}>
                            ID: {template.templateID}
                          </p>
                        </div>

                        {/* Core Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">CPU:</span>
                            <span className="font-medium">{template.cpuCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Memory:</span>
                            <span className="font-medium">{template.memoryMB}MB</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Spawns:</span>
                            <span className="font-medium">{template.spawnCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Visibility:</span>
                            <Badge 
                              variant="secondary"
                              className={`text-xs px-1 py-0 ${getTemplateStatusColor(template.public)}`}
                            >
                              {template.public ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Updated:</span>
                            <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`${template.source}-${template.templateID}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        {/* Left side - Template info */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`flex items-center space-x-1 text-xs ${getSourceColor(template.source)}`}
                            >
                              {getSourceIcon(template.source)}
                              <span>{getSourceLabel(template.source)}</span>
                            </Badge>
                            <Badge 
                              variant="default"
                              className="text-xs bg-primary text-primary-foreground font-medium"
                            >
                              {template.envType}
                            </Badge>
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate" title={getTemplateDisplayName(template)}>
                              {getTemplateDisplayName(template)}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate" title={template.templateID}>
                              ID: {template.templateID}
                            </p>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div>CPU: {template.cpuCount}</div>
                            <div>Memory: {template.memoryMB}MB</div>
                            <div>Spawns: {template.spawnCount}</div>
                            <div className="flex items-center space-x-1">
                              <span>Visibility:</span>
                              <Badge 
                                variant="secondary"
                                className={`text-xs px-1 py-0 ${getTemplateStatusColor(template.public)}`}
                              >
                                {template.public ? 'Public' : 'Private'}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div>Created: {new Date(template.createdAt).toLocaleDateString()}</div>
                            <div>Updated: {new Date(template.updatedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) handlePageChange(currentPage - 1)
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) handlePageChange(currentPage + 1)
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// 使用 React.memo 优化组件，避免不必要的重新渲染
export default memo(TemplatesPage)