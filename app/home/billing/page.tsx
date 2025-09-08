'use client'

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  FileText,
  Settings
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function BillingPage() {
  const [currentPlan] = useState('Pro')
  const [billingCycle] = useState('monthly')
  const [nextBillingDate] = useState('2024-02-15')

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '5 Sandboxes',
        '1 Team Member',
        'Basic Templates',
        'Community Support',
        '1GB Storage'
      ],
      current: false,
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Best for growing teams',
      features: [
        'Unlimited Sandboxes',
        'Up to 10 Team Members',
        'All Templates',
        'Priority Support',
        '100GB Storage',
        'Advanced Analytics',
        'API Access'
      ],
      current: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Unlimited Team Members',
        'Custom Templates',
        '24/7 Phone Support',
        'Unlimited Storage',
        'Custom Integrations',
        'SLA Guarantee',
        'Dedicated Account Manager'
      ],
      current: false,
      popular: false
    }
  ]

  const billingHistory = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - Monthly'
    }
  ]

  const usageStats = [
    {
      label: 'Sandboxes Used',
      value: '12',
      limit: 'Unlimited',
      percentage: 0,
      icon: Globe
    },
    {
      label: 'Team Members',
      value: '3',
      limit: '10',
      percentage: 30,
      icon: Users
    },
    {
      label: 'Storage Used',
      value: '2.4 GB',
      limit: '100 GB',
      percentage: 2.4,
      icon: FileText
    },
    {
      label: 'API Calls',
      value: '1,247',
      limit: '10,000',
      percentage: 12.47,
      icon: Zap
    }
  ]

  const handleUpgrade = (planName: string) => {
    toast.success(`Upgrading to ${planName} plan...`)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <CreditCard className="h-7 w-7 text-blue-600" />
                <span>Billing & Usage</span>
              </h1>
              <p className="text-muted-foreground">
                Manage your subscription, view usage, and download invoices
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
              The Billing & Usage dashboard is currently under active development. We're working hard to bring you comprehensive billing management, usage analytics, and subscription controls. Please check back soon for updates!
            </AlertDescription>
          </Alert>

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentPlan} Plan</h3>
                  <p className="text-muted-foreground">Billed {billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$29/month</p>
                  <p className="text-sm text-muted-foreground">Next billing: {nextBillingDate}</p>
                </div>
              </div>
              <Separator />
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {usageStats.map((stat, index) => (
                <Card key={index} className="opacity-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-muted-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">of {stat.limit}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Plans */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.current ? 'ring-2 ring-blue-500' : 'opacity-50'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className={plan.current ? '' : 'text-muted-foreground'}>{plan.name}</span>
                      {plan.current && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Current
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className={plan.current ? '' : 'text-muted-foreground'}>
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-bold ${plan.current ? '' : 'text-muted-foreground'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-muted-foreground ${plan.current ? '' : 'text-muted-foreground'}`}>
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 ${plan.current ? 'text-green-600' : 'text-muted-foreground'}`} />
                          <span className={`text-sm ${plan.current ? '' : 'text-muted-foreground'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "outline" : "default"}
                      disabled
                    >
                      {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                    {!plan.current && (
                      <Badge variant="outline" className="w-full justify-center text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Billing History</span>
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-muted-foreground">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-muted-foreground">{invoice.amount}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="opacity-50">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                  <Button variant="outline" size="sm" disabled>
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
