'use client'

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Bot, Brain, Zap, Code, Database, Cloud, Shield, Users, 
  AlertTriangle, Clock, FileText, Settings, Globe, Layers
} from "lucide-react"

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Agents</h1>
              <p className="text-muted-foreground">
                Create, manage, and deploy intelligent AI agents
              </p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
              Coming Soon
            </Badge>
          </div>

          {/* Development Notice */}
          <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertTitle>Feature Coming Soon</AlertTitle>
            <AlertDescription>
              The Agents platform is currently under active development. We're building powerful tools to help you create, manage, and deploy intelligent AI agents. Stay tuned for updates!
            </AlertDescription>
          </Alert>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agent Creation */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span>Agent Creation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Build custom AI agents with intuitive drag-and-drop interface
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Visual agent builder</li>
                  <li>• Pre-built templates</li>
                  <li>• Custom logic configuration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Management */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Settings className="w-5 h-5 text-green-600" />
                  <span>Agent Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Monitor and manage your deployed agents
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Real-time monitoring</li>
                  <li>• Performance analytics</li>
                  <li>• Version control</li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Deployment */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Cloud className="w-5 h-5 text-purple-600" />
                  <span>Agent Deployment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Deploy agents to various platforms and environments
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• One-click deployment</li>
                  <li>• Multi-platform support</li>
                  <li>• Auto-scaling</li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Marketplace */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <span>Agent Marketplace</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Discover and share pre-built agents
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Community agents</li>
                  <li>• Rating system</li>
                  <li>• Easy integration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Analytics */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span>Agent Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Deep insights into agent performance and behavior
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Usage statistics</li>
                  <li>• Performance metrics</li>
                  <li>• Learning insights</li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Security */}
            <Card className="border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span>Agent Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security for your agents
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Access controls</li>
                  <li>• Data encryption</li>
                  <li>• Audit logs</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Development Timeline */}
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>Development Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Phase 1: Core Infrastructure</p>
                    <p className="text-sm text-muted-foreground">Agent creation and basic management tools</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium text-muted-foreground">Phase 2: Advanced Features</p>
                    <p className="text-sm text-muted-foreground">Analytics, monitoring, and deployment tools</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-medium text-muted-foreground">Phase 3: Marketplace & Community</p>
                    <p className="text-sm text-muted-foreground">Agent sharing and community features</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Bot className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ready to Build the Future?</h3>
                  <p className="text-muted-foreground">
                    Be the first to know when our Agents platform launches. Join our waitlist for early access and exclusive updates.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Badge variant="outline" className="px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    Early Access
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    Community
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
