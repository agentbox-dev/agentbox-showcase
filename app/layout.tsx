import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TooltipProvider } from "@/components/ui/tooltip"
import Providers from './providers'
import ClientProviders from './client-providers'
import { themeScript } from '@/lib/theme-script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgentBox - AI Sandboxes for Enterprise-Grade Agents',
  description: 'Open-source, secure environment with real-world tools for enterprise-grade AI agents. Power your automations, research agents, and AI workflows.',
  authors: [{ name: 'AgentBox' }],
  openGraph: {
    title: 'AgentBox - AI Sandboxes for Enterprise-Grade Agents',
    description: 'Open-source, secure environment with real-world tools for enterprise-grade AI agents. Power your automations, research agents, and AI workflows.',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovable_dev',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="theme-light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <Providers>
          <TooltipProvider>
            <ClientProviders />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
