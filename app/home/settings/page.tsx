'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff, User, Mail, Building, Shield, Bell, Globe, Key, Copy, Trash2, AlertTriangle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { getSupabaseHeaders } from "@/lib/api/headers"
import Link from "next/link"

export default function SettingsPage() {
  const { user, updatePassword } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [accessToken, setAccessToken] = useState<string>('')
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const [isUpdatingToken, setIsUpdatingToken] = useState(false)
  const [showUpdateTokenDialog, setShowUpdateTokenDialog] = useState(false)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const currentPassword = formData.get('currentPassword') as string
      const newPassword = formData.get('newPassword') as string
      const confirmPassword = formData.get('confirmNewPassword') as string
      
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
      
      await updatePassword(currentPassword, newPassword)
      toast.success('Password updated successfully')
      
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Password update failed:', error)
      toast.error('Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const fetchAccessToken = async () => {
    if (isLoadingToken) return
    
    setIsLoadingToken(true)
    try {
      const supabaseAccessToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      
      if (!supabaseAccessToken) {
        toast.error('No authentication token found')
        return
      }

      const response = await fetch('/api/access-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getSupabaseHeaders(supabaseAccessToken, undefined),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAccessToken(data.access_token || data.token || 'No token returned')
      toast.success('Access token loaded successfully')
    } catch (error) {
      console.error('Failed to fetch access token:', error)
      toast.error('Failed to fetch access token')
      setAccessToken('Failed to load token')
    } finally {
      setIsLoadingToken(false)
    }
  }

  const getAccessToken = () => {
    if (accessToken) {
      return accessToken
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || ''
    }
    return ''
  }

  const getDisplayToken = () => {
    if (!showAccessToken) {
      return '' // 隐藏状态下不显示任何值
    }
    return getAccessToken()
  }

  const copyAccessToken = () => {
    const token = getAccessToken()
    navigator.clipboard.writeText(token)
    toast.success('Access token copied to clipboard')
  }

  const handleUpdateToken = () => {
    setShowUpdateTokenDialog(true)
  }

  const updateAccessToken = async () => {
    if (isUpdatingToken) return
    
    setIsUpdatingToken(true)
    setShowUpdateTokenDialog(false)
    
    try {
      const supabaseAccessToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      
      if (!supabaseAccessToken) {
        toast.error('No authentication token found')
        return
      }

      const response = await fetch('/api/access-token', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getSupabaseHeaders(supabaseAccessToken, undefined),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAccessToken(data.access_token || data.token || 'No token returned')
      toast.success('Access token updated successfully')
    } catch (error) {
      console.error('Failed to update access token:', error)
      toast.error('Failed to update access token')
    } finally {
      setIsUpdatingToken(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      // TODO: Implement delete account API call
      // await deleteAccount()
      toast.error('Account deletion is not yet implemented')
    } catch (error) {
      console.error('Account deletion failed:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security</span>
                <Badge variant="secondary" className="ml-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                  Coming Soon
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
                <Badge variant="secondary" className="ml-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                  Coming Soon
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* E-Mail Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>E-Mail</span>
                  </CardTitle>
                  <CardDescription>
                    Your account email address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email address cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Access Token Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Access Token</span>
                  </CardTitle>
                  <CardDescription>
                    Your API access token for programmatic access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessToken" className="text-sm font-medium">Access Token</Label>
                    <div className="relative">
                      <Input
                        id="accessToken"
                        type={showAccessToken ? "text" : "password"}
                        value={getDisplayToken()}
                        readOnly
                        className="bg-muted pr-24"
                        placeholder={isLoadingToken ? "Loading token..." : "Click the eye icon to view your access token"}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            // 每次点击都获取最新的Token
                            await fetchAccessToken()
                            setShowAccessToken(!showAccessToken)
                          }}
                          className="h-6 w-6 p-0"
                          disabled={isLoadingToken}
                        >
                          {isLoadingToken ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                          ) : showAccessToken ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleUpdateToken}
                          className="h-6 w-6 p-0"
                          disabled={isUpdatingToken}
                          title="Update Token"
                        >
                          {isUpdatingToken ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={copyAccessToken}
                          className="h-6 w-6 p-0"
                          disabled={!showAccessToken || !getAccessToken() || isLoadingToken}
                          title="Copy Token"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep your access token secure and do not share it with others.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Password Change</span>
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone Section */}
              <Card className="border-red-200 dark:border-red-800 opacity-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Account deletion is currently not supported. Please contact support if you need assistance with your account.
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button variant="destructive" disabled>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Not Supported
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Development Notice */}
              <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle>Feature Coming Soon</AlertTitle>
                <AlertDescription>
                  The Security settings are currently under active development. We're working hard to bring you comprehensive security features including two-factor authentication, session management, and security logs. Please check back soon for updates!
                </AlertDescription>
              </Alert>

              <Card className="opacity-50">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-muted-foreground">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app to generate verification codes
                      </p>
                    </div>
                    <Button variant="outline" disabled>Enable</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-muted-foreground">SMS Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Receive verification codes via SMS
                      </p>
                    </div>
                    <Button variant="outline" disabled>Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              {/* Development Notice */}
              <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle>Feature Coming Soon</AlertTitle>
                <AlertDescription>
                  The Notifications settings are currently under active development. We're working hard to bring you comprehensive notification management including email preferences, push notifications, and activity alerts. Please check back soon for updates!
                </AlertDescription>
              </Alert>

              <Card className="opacity-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-muted-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-muted-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-muted-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via SMS
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <ThemeSelector />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Other Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Additional customization options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred language
                        </p>
                      </div>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Timezone</p>
                        <p className="text-sm text-muted-foreground">
                          Set your timezone for accurate timestamps
                        </p>
                      </div>
                      <Button variant="outline" size="sm">UTC-8 (PST)</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Update Token Confirmation Dialog */}
        <AlertDialog open={showUpdateTokenDialog} onOpenChange={setShowUpdateTokenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <span>Update Access Token</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to update your access token? This will generate a new token and invalidate the current one. 
                <br /><br />
                <strong className="text-orange-600 dark:text-orange-400">Warning:</strong> Any applications or services using the current token will need to be updated with the new token.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdatingToken}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={updateAccessToken}
                disabled={isUpdatingToken}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isUpdatingToken ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Token'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
