'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTeam } from '@/contexts/TeamContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Play, 
  Square,
  Plus, 
  Search, 
  Filter,
  Activity,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Terminal,
  FileText,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import { sandboxApiHelpers, Sandbox } from '@/lib/api/sandbox'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

function SandboxesPage() {
  const { user, isAuthenticated } = useAuth()
  const { currentTeam } = useTeam()
  
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  // 加载运行中的沙箱
  const loadSandboxes = async () => {
    if (!currentTeam?.id) {
      console.warn('No team selected, cannot fetch sandboxes')
      return
    }

    try {
      const data = await sandboxApiHelpers.getRunningSandboxes()
      setSandboxes(data)
    } catch (error) {
      console.error('Failed to fetch sandboxes:', error)
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
      
      console.log('🔄 Refreshing sandboxes...')
      await loadSandboxes()
      toast.success('Data refreshed successfully!')
      console.log('✅ Refresh completed successfully')
    } catch (error) {
      console.error('❌ Failed to refresh sandboxes:', error)
      setError(error instanceof Error ? error.message : 'Failed to refresh sandboxes')
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // 复制到剪贴板
  const handleCopy = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemKey))
      toast.success('Copied to clipboard')
      
      // 2秒后清除复制状态
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemKey)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Copy failed')
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-3 h-3" />
      case 'stopped':
        return <Square className="w-3 h-3" />
      case 'error':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <Square className="w-3 h-3" />
    }
  }

  // 过滤沙箱
  const filteredSandboxes = sandboxes.filter(sandbox => {
    const matchesSearch = sandbox.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sandbox.sandboxID.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sandbox.state === statusFilter
    return matchesSearch && matchesStatus
  })

  // 分页
  const totalPages = Math.ceil(filteredSandboxes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedSandboxes = filteredSandboxes.slice(startIndex, endIndex)

  // 获取所有状态选项
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
    { value: 'error', label: 'Error' },
  ]

  // 设置mounted状态，防止水合错误
  useEffect(() => {
    setMounted(true)
    
    // 在客户端加载时从 localStorage 恢复状态
    if (typeof window !== 'undefined') {
      const savedSearchQuery = localStorage.getItem('sandboxes-search-query') || ''
      const savedStatusFilter = localStorage.getItem('sandboxes-status-filter') || 'all'
      
      setSearchQuery(savedSearchQuery)
      setStatusFilter(savedStatusFilter)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!currentTeam?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        await loadSandboxes()
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [currentTeam?.id, user?.id])

  // 保存状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandboxes-search-query', searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandboxes-status-filter', statusFilter)
    }
  }, [statusFilter])

  // 防止水合错误，只在客户端渲染后才进行认证检查
  if (!mounted) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // 如果没有认证，显示登录提示
  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-muted-foreground">Please login to view sandboxes</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-12 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sandboxes Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // 错误状态
  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadSandboxes}>Retry</Button>
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
              <h1 className="text-2xl font-bold">Sandboxes</h1>
              <p className="text-muted-foreground">
                Manage and monitor your running sandboxes
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
                Create Sandbox
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Running</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {sandboxes.filter(s => s.state === 'running').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Stopped</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {sandboxes.filter(s => s.state === 'stopped').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {sandboxes.filter(s => s.state === 'error').length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sandboxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredSandboxes.length)} of {filteredSandboxes.length} sandboxes
            </p>
          </div>

          {/* Sandboxes List */}
          {paginatedSandboxes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Terminal className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sandboxes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first sandbox'
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Sandbox
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SandboxID</TableHead>
                    <TableHead>TemplateID & Name</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Metadata</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSandboxes.map((sandbox) => (
                    <TableRow key={sandbox.sandboxID}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{sandbox.sandboxID}-{sandbox.clientID}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopy(`${sandbox.sandboxID}-${sandbox.clientID}`, `sandbox-${sandbox.sandboxID}`)}
                          >
                            {copiedItems.has(`sandbox-${sandbox.sandboxID}`) ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold">{sandbox.alias}</div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground font-mono">
                              {sandbox.templateID}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0"
                              onClick={() => handleCopy(sandbox.templateID, `template-${sandbox.templateID}`)}
                            >
                              {copiedItems.has(`template-${sandbox.templateID}`) ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Cpu className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{sandbox.cpuCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MemoryStick className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{sandbox.memoryMB}MB</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {Object.keys(sandbox.metadata).length > 0 
                            ? `${Object.keys(sandbox.metadata).length} items`
                            : 'Empty'
                          }
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {new Date(sandbox.startedAt).toISOString().replace('T', ' ').slice(0, 19)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {sandbox.endAt 
                          ? new Date(sandbox.endAt).toISOString().replace('T', ' ').slice(0, 19)
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center space-x-1 text-xs w-fit ${getStatusColor(sandbox.state)}`}
                        >
                          {getStatusIcon(sandbox.state)}
                          <span className="capitalize">{sandbox.state}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// 使用 React.memo 优化组件，避免不必要的重新渲染
export default memo(SandboxesPage)
