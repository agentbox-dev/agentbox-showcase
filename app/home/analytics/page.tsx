'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  AlertTriangle,
  Construction
} from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Monitor and analyze your AgentBox usage and performance
              </p>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
              <Construction className="w-3 h-3 mr-1" />
              Under Development
            </Badge>
          </div>

          {/* Development Notice */}
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-300">
              <strong>Development Phase:</strong> The Analytics feature is currently under development. 
              We're working on comprehensive analytics and reporting capabilities to help you track 
              your AgentBox usage, performance metrics, and insights. Stay tuned for updates!
            </AlertDescription>
          </Alert>

          {/* Coming Soon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Usage Analytics */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Usage Analytics</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track API calls, sandbox usage, and resource consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Performance Metrics</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor response times, success rates, and system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Insights */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Team Insights</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Analyze team collaboration and usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Activity Timeline</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View detailed activity logs and audit trails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Monitoring */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Real-time Monitoring</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Live monitoring of system status and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Reports */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Custom Reports</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Create and schedule custom analytics reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Development Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Construction className="w-5 h-5" />
                <span>Development Timeline</span>
              </CardTitle>
              <CardDescription>
                Here's what we're working on for the Analytics feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Basic usage tracking and metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Performance monitoring dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Team collaboration insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Custom reporting and exports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Real-time alerts and notifications</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
