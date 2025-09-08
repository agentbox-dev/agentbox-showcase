'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { TeamProvider } from "@/contexts/TeamContext"
import { CreateTeamProvider } from "@/contexts/CreateTeamContext"
import { useState } from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TeamProvider>
            <CreateTeamProvider>
              {children}
            </CreateTeamProvider>
          </TeamProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}