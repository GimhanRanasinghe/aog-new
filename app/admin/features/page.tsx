"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Save,
  AlertTriangle,
  Info,
  Settings,
  MessageSquare,
  PlaneTakeoff,
  BarChart,
  Users,
  Shield,
  Bell,
  ArrowLeft,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Define system features with their default states
interface SystemFeature {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
  requiredPermission?: string
  icon: React.ReactNode
  impactLevel: "low" | "medium" | "high"
}

export default function FeatureManagementPage() {
  // Initial features state
  const [features, setFeatures] = useState<SystemFeature[]>([
    // Communication Features
    {
      id: "chat",
      name: "Chat System",
      description: "Enable real-time chat functionality for AOG response teams",
      enabled: true,
      category: "communication",
      requiredPermission: "join_chat",
      icon: <MessageSquare className="h-5 w-5" />,
      impactLevel: "high",
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Enable system notifications for AOG events and updates",
      enabled: true,
      category: "communication",
      requiredPermission: "send_notifications",
      icon: <Bell className="h-5 w-5" />,
      impactLevel: "medium",
    },
    {
      id: "group_chat",
      name: "Group Chat Creation",
      description: "Allow users to create new chat groups",
      enabled: true,
      category: "communication",
      requiredPermission: "create_chat_group",
      icon: <Users className="h-5 w-5" />,
      impactLevel: "medium",
    },

    // AOG Management Features
    {
      id: "aog_creation",
      name: "AOG Creation",
      description: "Allow users to mark aircraft as AOG",
      enabled: true,
      category: "aog",
      requiredPermission: "create_aog",
      icon: <PlaneTakeoff className="h-5 w-5" />,
      impactLevel: "high",
    },
    {
      id: "aog_approval",
      name: "AOG Approval Workflow",
      description: "Require approval for AOG status changes",
      enabled: true,
      category: "aog",
      requiredPermission: "approve_aog",
      icon: <Shield className="h-5 w-5" />,
      impactLevel: "high",
    },
    {
      id: "aog_prioritization",
      name: "AOG Prioritization",
      description: "Allow prioritization of AOG incidents",
      enabled: true,
      category: "aog",
      requiredPermission: "prioritize_aog",
      icon: <AlertTriangle className="h-5 w-5" />,
      impactLevel: "medium",
    },

    // Analytics Features
    {
      id: "analytics_dashboard",
      name: "Analytics Dashboard",
      description: "Enable analytics dashboard for AOG metrics",
      enabled: true,
      category: "analytics",
      requiredPermission: "view_analytics",
      icon: <BarChart className="h-5 w-5" />,
      impactLevel: "low",
    },
    {
      id: "report_export",
      name: "Report Export",
      description: "Allow exporting of reports and analytics data",
      enabled: true,
      category: "analytics",
      requiredPermission: "export_reports",
      icon: <BarChart className="h-5 w-5" />,
      impactLevel: "low",
    },

    // Integration Features
    {
      id: "netline_integration",
      name: "NETLINE Integration",
      description: "Enable integration with NETLINE system",
      enabled: true,
      category: "integrations",
      requiredPermission: "manage_integrations",
      icon: <Settings className="h-5 w-5" />,
      impactLevel: "high",
    },
    {
      id: "email_notifications",
      name: "Email Notifications",
      description: "Send email notifications for AOG events",
      enabled: true,
      category: "integrations",
      requiredPermission: "send_notifications",
      icon: <Bell className="h-5 w-5" />,
      impactLevel: "medium",
    },

    // Security Features
    {
      id: "mfa",
      name: "Multi-Factor Authentication",
      description: "Require MFA for user login",
      enabled: false,
      category: "security",
      icon: <Shield className="h-5 w-5" />,
      impactLevel: "high",
    },
    {
      id: "session_timeout",
      name: "Session Timeout",
      description: "Automatically log out inactive users",
      enabled: true,
      category: "security",
      icon: <Shield className="h-5 w-5" />,
      impactLevel: "medium",
    },
    {
      id: "audit_logging",
      name: "Audit Logging",
      description: "Log all system actions for audit purposes",
      enabled: true,
      category: "security",
      icon: <Info className="h-5 w-5" />,
      impactLevel: "high",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { hasPermission } = useAuth()

  // Filter features based on search and active tab
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeTab === "all" || feature.category === activeTab

    return matchesSearch && matchesCategory
  })

  // Toggle feature enabled state
  const toggleFeature = (id: string) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => (feature.id === id ? { ...feature, enabled: !feature.enabled } : feature)),
    )
  }

  // Save changes
  const saveChanges = () => {
    // In a real app, this would call an API to save the feature configuration
    toast({
      title: "Features Updated",
      description: "Your feature configuration has been saved.",
    })
  }

  // Get impact level badge
  const getImpactBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>
      case "medium":
        return <Badge variant="default">Medium Impact</Badge>
      case "low":
        return <Badge variant="outline">Low Impact</Badge>
      default:
        return null
    }
  }

  // Group features by category for the summary
  const featuresByCategory = features.reduce(
    (acc, feature) => {
      acc[feature.category] = acc[feature.category] || { total: 0, enabled: 0 }
      acc[feature.category].total += 1
      if (feature.enabled) acc[feature.category].enabled += 1
      return acc
    },
    {} as Record<string, { total: number; enabled: number }>,
  )

  // Format category name
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <ProtectedRoute requiredPermission="system_config">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Feature Management</h1>
            <p className="text-muted-foreground">Enable or disable system features and set permissions</p>
          </div>
          <Button onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        {/* Feature Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">All Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{features.length}</div>
              <p className="text-xs text-muted-foreground">{features.filter((f) => f.enabled).length} enabled</p>
            </CardContent>
          </Card>

          {Object.entries(featuresByCategory).map(([category, stats]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{formatCategoryName(category)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">{stats.enabled} enabled</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Feature List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="aog">AOG Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredFeatures.length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No features found matching your search</p>
                </CardContent>
              </Card>
            ) : (
              filteredFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} onToggle={toggleFeature} />
              ))
            )}
          </TabsContent>

          {["communication", "aog", "analytics", "integrations", "security"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredFeatures.length === 0 ? (
                <Card>
                  <CardContent className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No features found matching your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredFeatures.map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} onToggle={toggleFeature} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Warning for High Impact Changes */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <p>
              Disabling core features may impact system functionality and user experience. Features marked as "High
              Impact" should be changed with caution, preferably during scheduled maintenance windows.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

// Feature Card Component
function FeatureCard({
  feature,
  onToggle,
}: {
  feature: SystemFeature
  onToggle: (id: string) => void
}) {
  return (
    <Card className={feature.enabled ? "" : "border-dashed opacity-70"}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 rounded-md bg-primary/10 p-2">{feature.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{feature.name}</h3>
              {getImpactBadge(feature.impactLevel)}
            </div>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
            {feature.requiredPermission && (
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  Requires: {feature.requiredPermission}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`toggle-${feature.id}`} className="sr-only">
            Toggle {feature.name}
          </Label>
          <Switch id={`toggle-${feature.id}`} checked={feature.enabled} onCheckedChange={() => onToggle(feature.id)} />
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get impact badge
function getImpactBadge(level: "low" | "medium" | "high") {
  switch (level) {
    case "high":
      return <Badge variant="destructive">High Impact</Badge>
    case "medium":
      return <Badge variant="default">Medium Impact</Badge>
    case "low":
      return <Badge variant="outline">Low Impact</Badge>
    default:
      return null
  }
}

