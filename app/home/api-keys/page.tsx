'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw,
  Shield,
  AlertTriangle,
  Copy,
  Check
} from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useTeam } from "@/contexts/TeamContext"
import { toast } from "sonner"
import { apiKeysApiHelpers, ApiKey as ApiKeyType } from "@/lib/api/api-keys"
import { teamApiHelpers, TeamMember } from "@/lib/api/team"

export default function ApiKeysPage() {
  const { user } = useAuth()
  const { currentTeam } = useTeam()
  const [apiKeys, setApiKeys] = useState<ApiKeyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<ApiKeyType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isShowKeyDialogOpen, setIsShowKeyDialogOpen] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ key: string; name: string } | null>(null)

  // Fetch API Keys from backend
  const fetchApiKeys = async () => {
    if (!currentTeam?.id) {
      console.warn('No team selected, cannot fetch API keys')
      return
    }

    try {
      const data = await apiKeysApiHelpers.getApiKeys()
      // Sort by creation time, newest first
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA // Descending order (newest first)
      })
      setApiKeys(sortedData)
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      throw error
    }
  }

  // Fetch team members and check if current user is owner
  const fetchTeamMembers = async () => {
    if (!currentTeam?.id || !user?.email) {
      setIsOwner(false)
      return
    }

    try {
      const members = await teamApiHelpers.getMembers(currentTeam.id, currentTeam.email)
      setTeamMembers(members)
      
      // Check if current user is owner based on email
      const currentUserMember = members.find(member => member.user.email === user.email)
      const userIsOwner = currentUserMember?.role === 'owner'
      setIsOwner(userIsOwner)
    } catch (error) {
      console.error('Failed to fetch team members:', error)
      setIsOwner(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!currentTeam?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Load both API keys and team members in parallel
        await Promise.all([
          fetchApiKeys(),
          fetchTeamMembers()
        ])
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [currentTeam?.id, user?.id])

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    if (!currentTeam?.id) {
      toast.error('No team selected')
      return
    }

    setIsCreating(true)
    try {
      const newKey = await apiKeysApiHelpers.createApiKey({ name: newKeyName })
      // Add new key at the beginning since it's the newest
      setApiKeys(prev => [newKey, ...prev])
      setNewKeyName('')
      setIsCreateDialogOpen(false)
      
      // 显示新创建的 API Key
      setNewlyCreatedKey({ 
        key: newKey.key || 'API Key not returned', 
        name: newKey.name 
      })
      setIsShowKeyDialogOpen(true)
      
      toast.success('API Key created successfully!')
    } catch (error) {
      console.error('Failed to create API Key:', error)
      toast.error('Failed to create API Key')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteApiKey = (apiKey: ApiKeyType) => {
    if (!isOwner) {
      toast.error('Only team owners can delete API keys')
      return
    }
    
    setKeyToDelete(apiKey)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteApiKey = async () => {
    if (!keyToDelete) return

    setIsDeleting(true)
    try {
      await apiKeysApiHelpers.deleteApiKey(keyToDelete.id)
      setApiKeys(prev => prev.filter(key => key.id !== keyToDelete.id))
      toast.success('API Key deleted successfully!')
      setIsDeleteDialogOpen(false)
      setKeyToDelete(null)
    } catch (error) {
      console.error('Failed to delete API Key:', error)
      toast.error('Failed to delete API Key')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyApiKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast.success('API Key copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy API Key:', error)
      toast.error('Failed to copy API Key')
    }
  }

  const handleRefresh = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentTeam?.id) {
      toast.error('No team selected')
      return
    }
    
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchApiKeys(),
        fetchTeamMembers()
      ])
      toast.success('Data refreshed successfully!')
    } catch (error) {
      console.error('Failed to refresh data:', error)
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const maskKey = (apiKey: ApiKeyType) => {
    const { mask } = apiKey
    // 减少点的数量，最多显示8个点
    const maxDots = 8
    const actualDots = Math.min(maxDots, mask.valueLength - mask.maskedValuePrefix.length - mask.maskedValueSuffix.length)
    const maskedMiddle = '•'.repeat(actualDots)
    return `${mask.prefix}${mask.maskedValuePrefix}${maskedMiddle}${mask.maskedValueSuffix}`
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">API Keys</h1>
              <p className="text-muted-foreground">
                Manage your API keys for accessing AgentBox services
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                type="button"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to access AgentBox services programmatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="My API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateApiKey}
                    disabled={isCreating || !newKeyName.trim()}
                  >
                    {isCreating ? 'Creating...' : 'Create API Key'}
                  </Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* API Keys List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Your API Keys</span>
              </CardTitle>
              <CardDescription>
                Manage and monitor your API keys. Keep them secure and rotate them regularly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading API keys...</span>
                </div>
              ) : apiKeys.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <span>{apiKey.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {maskKey(apiKey)}
                          </code>
                        </TableCell>
                        <TableCell>
                          {apiKey.createdBy ? (
                            <div className="text-sm">
                              <div className="font-medium">{apiKey.createdBy.email}</div>
                              <div className="text-muted-foreground text-xs">{apiKey.createdBy.id}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">System</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(apiKey.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                        </TableCell>
                        <TableCell>
                          {isOwner ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteApiKey(apiKey)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete API Key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <div className="h-8 w-8 flex items-center justify-center" title="Only team owners can delete API keys">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any API keys yet. Create your first API key to get started.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First API Key
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>API Usage</span>
                <Badge variant="secondary" className="text-xs">
                  Under Development
                </Badge>
              </CardTitle>
              <CardDescription>
                API usage tracking and analytics are currently under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-sm">
                    We're working on comprehensive API usage tracking and analytics. 
                    This feature will include request counts, rate limits, and detailed usage statistics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Delete API Key</span>
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the API key "{keyToDelete?.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium">Warning</p>
                      <p>Deleting this API key will immediately revoke access for any applications using it. Make sure to update your applications with a new API key before proceeding.</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false)
                    setKeyToDelete(null)
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteApiKey}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete API Key'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Show New API Key Dialog */}
          <Dialog open={isShowKeyDialogOpen} onOpenChange={setIsShowKeyDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-green-600" />
                  <span>API Key Created Successfully</span>
                </DialogTitle>
                <DialogDescription>
                  Your new API key has been created. Please copy and store it securely - you won't be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">API Key Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{newlyCreatedKey?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <code className="flex-1 text-sm bg-muted px-3 py-2 rounded border font-mono break-all">
                        {newlyCreatedKey?.key}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => newlyCreatedKey && handleCopyApiKey(newlyCreatedKey.key)}
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important Security Notice</p>
                      <p>This is the only time you'll be able to see your API key. Make sure to copy it and store it in a secure location. If you lose it, you'll need to create a new one.</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setIsShowKeyDialogOpen(false)
                    setNewlyCreatedKey(null)
                  }}
                >
                  I've Saved My API Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
