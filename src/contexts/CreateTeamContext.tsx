'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { teamApiHelpers } from '@/lib/api/team'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, XCircle, XSquare, XOctagon } from 'lucide-react'

interface CreateTeamContextType {
  isCreateTeamDialogOpen: boolean
  openCreateTeamDialog: () => void
  closeCreateTeamDialog: () => void
}

const CreateTeamContext = createContext<CreateTeamContextType | undefined>(undefined)

export function CreateTeamProvider({ children }: { children: ReactNode }) {
  const { user, fetchTeams } = useAuth()
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)

  const openCreateTeamDialog = () => {
    setIsCreateTeamDialogOpen(true)
  }

  const closeCreateTeamDialog = () => {
    setIsCreateTeamDialogOpen(false)
    setNewTeamName('')
  }

  // 创建团队
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Team name is required')
      return
    }

    setIsCreatingTeam(true)
    try {
      // 创建团队
      const newTeam = await teamApiHelpers.create({
        name: newTeamName.trim()
      })

      toast.success('Team created successfully!')
      
      // 关闭弹窗并重置表单
      closeCreateTeamDialog()
      
      // 刷新团队列表（不阻塞UI）
      if (user?.id) {
        try {
          await fetchTeams(user.id)
        } catch (refreshError) {
          console.error('⚠️ Failed to refresh team list:', refreshError)
          // 不显示错误提示，因为团队已经创建成功了
        }
      }
    } catch (error) {
      console.error('❌ Failed to create team:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      })
      toast.error('Failed to create team. Please try again.')
    } finally {
      setIsCreatingTeam(false)
    }
  }

  const value: CreateTeamContextType = {
    isCreateTeamDialogOpen,
    openCreateTeamDialog,
    closeCreateTeamDialog,
  }

  return (
    <CreateTeamContext.Provider value={value}>
      {children}
      {/* 统一的创建团队弹窗 */}
      <CreateTeamDialog 
        isOpen={isCreateTeamDialogOpen}
        onClose={closeCreateTeamDialog}
        newTeamName={newTeamName}
        setNewTeamName={setNewTeamName}
        isCreatingTeam={isCreatingTeam}
        onCreateTeam={handleCreateTeam}
      />
    </CreateTeamContext.Provider>
  )
}

// 创建团队弹窗组件
interface CreateTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  newTeamName: string
  setNewTeamName: (name: string) => void
  isCreatingTeam: boolean
  onCreateTeam: () => void
}

function CreateTeamDialog({ 
  isOpen, 
  onClose, 
  newTeamName, 
  setNewTeamName, 
  isCreatingTeam, 
  onCreateTeam 
}: CreateTeamDialogProps) {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => {
        // 完全禁用 onOpenChange，防止点击外部区域关闭
        // 只允许通过按钮关闭
      }}
    >
      <DialogContent className={`sm:max-w-[425px] ${isCreatingTeam ? '[&>button]:pointer-events-none [&>button]:opacity-50' : ''} [&>button:not(.custom-close-btn)]:hidden`}>
        {/* 简洁的关闭按钮 */}
        <button
          type="button"
          className="custom-close-btn absolute right-2 top-2 z-10 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          onClick={onClose}
          disabled={isCreatingTeam}
        >
          <span className="text-lg font-normal leading-none">×</span>
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Enter a name for your new team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamName" className="text-right">
              Team Name
            </Label>
            <Input
              id="teamName"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="col-span-3"
              placeholder="Enter team name"
              disabled={isCreatingTeam}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreatingTeam}
          >
            Cancel
          </Button>
          <Button
            onClick={onCreateTeam}
            disabled={isCreatingTeam || !newTeamName.trim()}
          >
            {isCreatingTeam ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useCreateTeam() {
  const context = useContext(CreateTeamContext)
  if (context === undefined) {
    throw new Error('useCreateTeam must be used within a CreateTeamProvider')
  }
  return context
}
