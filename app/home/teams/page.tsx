'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useTeam } from "@/contexts/TeamContext"
import { useAuth } from "@/contexts/AuthContext"
import { useCreateTeam } from "@/contexts/CreateTeamContext"
import { teamApiHelpers, TeamMember } from "@/lib/api/team"
import { 
  Users, 
  Plus, 
  Settings, 
  Crown,
  Shield,
  User,
  MoreHorizontal,
  Mail,
  Calendar,
  Building,
  Copy,
  RefreshCw,
  UserPlus,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function TeamsPage() {
  const { currentTeam, teams, setCurrentTeam } = useTeam()
  const { user } = useAuth()
  const { openCreateTeamDialog } = useCreateTeam()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  
  // 邀请功能状态
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  
  // 删除功能状态
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)

  // 获取团队成员数据
  const fetchTeamMembers = async (teamId: string) => {
    if (!teamId) return
    
    setIsLoadingMembers(true)
    try {
      const members = await teamApiHelpers.getMembers(teamId, currentTeam?.email)
      setTeamMembers(members)
      console.log('✅ 团队成员数据获取成功:', members)
    } catch (error) {
      console.error('❌ 获取团队成员失败:', error)
      toast.error('Failed to load team members')
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // 当当前团队变化时，获取成员数据
  useEffect(() => {
    if (currentTeam?.id) {
      fetchTeamMembers(currentTeam.id)
    }
  }, [currentTeam?.id])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'member':
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handleRefreshMembers = () => {
    if (currentTeam?.id) {
      fetchTeamMembers(currentTeam.id)
    }
  }

  // 检查当前用户是否为 owner
  const isCurrentUserOwner = () => {
    if (!user || !teamMembers.length) return false
    const currentUserMember = teamMembers.find(member => member.user.email === user.email)
    const isOwner = currentUserMember?.role === 'owner'
    
    // 调试日志
    console.log('🔍 Team page owner check:', {
      currentUserEmail: user.email,
      teamMembers: teamMembers.map(m => ({ email: m.user.email, role: m.role })),
      currentUserMember,
      isOwner
    })
    
    return isOwner
  }

  // 邀请用户加入团队
  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !currentTeam?.id) {
      toast.error('Please enter a valid email address')
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsInviting(true)
    try {
      // 直接使用邮箱调用邀请接口
      await teamApiHelpers.inviteUserToTeam({
        email: inviteEmail,
        teamID: currentTeam.id
      })
      
      toast.success('User invited successfully!')
      setIsInviteDialogOpen(false)
      setInviteEmail('')
      
      // 刷新成员列表
      fetchTeamMembers(currentTeam.id)
    } catch (error) {
      console.error('❌ 邀请用户失败:', error)
      toast.error('Failed to invite user. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  // 删除团队成员
  // 打开删除确认对话框
  const handleDeleteClick = (member: TeamMember) => {
    if (!currentTeam?.id) {
      toast.error('No team selected')
      return
    }

    // 检查权限：只有 owner 可以删除非 owner 用户
    if (!isCurrentUserOwner()) {
      toast.error('Only team owner can remove members')
      return
    }

    // 不允许删除 owner 用户
    if (member.role === 'owner') {
      toast.error('Cannot remove team owner')
      return
    }

    setMemberToDelete(member)
    setIsDeleteDialogOpen(true)
  }

  // 确认删除用户
  const handleConfirmDelete = async () => {
    if (!memberToDelete || !currentTeam?.id) return

    setIsDeleting(memberToDelete.userId)
    try {
      await teamApiHelpers.removeUserFromTeam(memberToDelete.userId, currentTeam.id)
      
      toast.success('Member removed successfully!')
      
      // 刷新成员列表
      fetchTeamMembers(currentTeam.id)
      
      // 关闭对话框
      setIsDeleteDialogOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      console.error('❌ 删除成员失败:', error)
      toast.error('Failed to remove member. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Team</h1>
              <p className="text-muted-foreground">
                💡 If you want to view team list, please check the team selector in the top-right corner of the platform.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleRefreshMembers} disabled={isLoadingMembers}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingMembers ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={openCreateTeamDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>


          {/* Current Team Details */}
          {currentTeam && (
            <div className="space-y-6">
              {/* Part 1 & 2: Team Name and Information in one row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Part 1: Team Name */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Building className="w-4 h-4" />
                      <span>Name</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentTeam.avatar} alt={currentTeam.name} />
                        <AvatarFallback className="text-sm">
                          {currentTeam.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold">{currentTeam.name}</h2>
                        {currentTeam.description && (
                          <p className="text-muted-foreground text-sm mt-1">{currentTeam.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 2: Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Mail className="w-4 h-4" />
                      <span>Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-medium text-muted-foreground w-16">E-Mail:</label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1">
                          {currentTeam.email || 'N/A'}
                        </span>
                        {currentTeam.email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(currentTeam.email, 'Email')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-medium text-muted-foreground w-16">Team ID:</label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1">
                          {currentTeam.id}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(currentTeam.id, 'Team ID')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Part 3: Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Members</span>
                    </div>
                    {isCurrentUserOwner() && (
                      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Invite User to Team</DialogTitle>
                            <DialogDescription>
                              Invite a user to join this team by entering their email address.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleInviteUser}
                              disabled={isInviting || !inviteEmail.trim()}
                            >
                              {isInviting ? 'Inviting...' : 'Invite User'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                      <span>Loading members...</span>
                    </div>
                  ) : teamMembers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          {isCurrentUserOwner() && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.user.avatar} alt={member.user.email} />
                                  <AvatarFallback>
                                    {member.user.email.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {member.user.firstName && member.user.lastName
                                      ? `${member.user.firstName} ${member.user.lastName}`
                                      : member.user.email.split('@')[0]
                                    }
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {member.user.email}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={getRoleColor(member.role)}
                              >
                                {getRoleIcon(member.role)}
                                <span className="ml-1 capitalize">{member.role}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </TableCell>
                            {isCurrentUserOwner() && (
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(member)}
                                  disabled={isDeleting === member.userId || member.role === 'owner'}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {isDeleting === member.userId ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No members found</h3>
                      <p className="text-muted-foreground mb-4">
                        This team doesn't have any members yet.
                      </p>
                      {isCurrentUserOwner() && (
                        <Button onClick={() => setIsInviteDialogOpen(true)}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Members
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* No team available */}
          {!currentTeam && (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No team available</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have access to any teams yet.
                </p>
                <Button onClick={() => setIsCreateTeamDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Team
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remove Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove <strong>{memberToDelete?.user.email}</strong> from the team? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setMemberToDelete(null)
                }}
                disabled={isDeleting !== null}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting !== null}
              >
                {isDeleting ? 'Removing...' : 'Remove Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </DashboardLayout>
    </ProtectedRoute>
  )
}
