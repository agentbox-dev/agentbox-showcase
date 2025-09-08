'use client'

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  Mail, 
  Phone, 
  Clock, 
  Search,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Users,
  Settings,
  Zap,
  Shield,
  Globe,
  AlertTriangle
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement contact form submission
    toast.success('Support request submitted successfully!')
    setContactForm({ subject: '', message: '', priority: 'medium' })
  }

  const faqItems = [
    {
      question: "How do I create a new sandbox?",
      answer: "Navigate to the Sandboxes page and click the 'Create Sandbox' button. Select your template and configure the resources."
    },
    {
      question: "What templates are available?",
      answer: "We offer various templates including Python, Node.js, React, and custom environments. Check the Templates page for the full list."
    },
    {
      question: "How do I manage team members?",
      answer: "Go to the Team page where you can invite new members, manage roles, and view team information."
    },
    {
      question: "How do I generate API keys?",
      answer: "Visit the API Keys page under Team management to create, view, and manage your API keys."
    },
    {
      question: "What are the usage limits?",
      answer: "Usage limits depend on your plan. Check your current usage in the Analytics section (coming soon)."
    }
  ]

  const quickLinks = [
    { title: "Getting Started Guide", icon: BookOpen, href: "#", description: "Learn the basics of AgentBox" },
    { title: "API Documentation", icon: FileText, href: "#", description: "Complete API reference" },
    { title: "Video Tutorials", icon: Video, href: "#", description: "Step-by-step video guides" },
    { title: "Community Forum", icon: Users, href: "#", description: "Connect with other users" },
    { title: "System Status", icon: Globe, href: "#", description: "Check service status" }
  ]

  const supportChannels = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      contact: "support@agentbox.com",
      availability: "24/7"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageSquare,
      contact: "Available in dashboard",
      availability: "Mon-Fri 9AM-6PM PST"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: Phone,
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri 9AM-6PM PST"
    }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <HelpCircle className="h-7 w-7 text-blue-600" />
                <span>Help & Support</span>
              </h1>
              <p className="text-muted-foreground">
                Get help, find answers, and connect with our support team
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
              The Help & Support center is currently under active development. We're working hard to bring you comprehensive support tools, documentation, and assistance features. Please check back soon for updates!
            </AlertDescription>
          </Alert>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Help Center</span>
              </CardTitle>
              <CardDescription>
                Find answers to common questions and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search for help articles, guides, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  disabled
                />
                <Button disabled>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <Card key={index} className="opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <link.icon className="h-5 w-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-muted-foreground">{link.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Coming Soon
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index} className="opacity-50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 text-muted-foreground">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportChannels.map((channel, index) => (
                <Card key={index} className="opacity-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <channel.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{channel.title}</span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{channel.contact}</p>
                    <p className="text-xs text-muted-foreground">{channel.availability}</p>
                    <Badge variant="outline" className="text-xs">
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Send us a Message</CardTitle>
              <CardDescription className="text-muted-foreground">
                Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Please provide as much detail as possible about your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                  <Button type="submit" disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">All systems operational</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
