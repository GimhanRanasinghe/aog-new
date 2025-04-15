"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Save, AlertTriangle, Lock, User, Key, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth, type Permission } from "@/lib/auth"

// Define permission interface with additional metadata
interface PermissionWithMetadata {
  id: Permission
  name: string
  description: string
  enabled: boolean
  category: string
  defaultRoles: string[]
  securityLevel: "low" | "medium" | "high"
}

export default function PermissionManagementPage() {
  // Initial permissions state with metadata
  const [permissions, setPermissions] = useState<PermissionWithMetadata[]>([
    // AOG Management Permissions
    {
      id: "view_aog",
      name: "View AOG",
      description: "View aircraft on ground status and details",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin", "manager", "engineer", "viewer"],
      securityLevel: "low",
    },
    {
      id: "create_aog",
      name: "Create AOG",
      description: "Mark aircraft as AOG",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin", "manager", "engineer"],
      securityLevel: "medium",
    },
    {
      id: "update_aog",
      name: "Update AOG",
      description: "Update AOG status and details",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin", "manager", "engineer"],
      securityLevel: "medium",
    },
    {
      id: "delete_aog",
      name: "Delete AOG",
      description: "Remove AOG status",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin"],
      securityLevel: "high",
    },
    {
      id: "approve_aog",
      name: "Approve AOG",
      description: "Approve AOG status changes",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin", "manager"],
      securityLevel: "high",
    },
    {
      id: "prioritize_aog",
      name: "Prioritize AOG",
      description: "Set priority level for AOG incidents",
      enabled: true,
      category: "aog",
      defaultRoles: ["admin", "manager", "senior_engineer"],
      securityLevel: "medium",
    },

    // Communication Permissions
    {
      id: "join_chat",
      name: "Join Chat",
      description: "Join AOG response chat groups",
      enabled: true,
      category: "communication",
      defaultRoles: ["admin", "manager", "engineer", "maintenance_staff"],
      securityLevel: "low",
    },
    {
      id: "create_chat_group",
      name: "Create Chat Group",
      description: "Create new chat groups",
      enabled: true,
      category: "communication",
      defaultRoles: ["admin", "manager", "senior_engineer"],
      securityLevel: "medium",
    },
    {
      id: "add_members_to_chat",
      name: "Add Chat Members",
      description: "Add members to chat groups",
      enabled: true,
      category: "communication",
      defaultRoles: ["admin", "manager", "senior_engineer"],
      securityLevel: "medium",
    },
    {
      id: "remove_members_from_chat",
      name: "Remove Chat Members",
      description: "Remove members from chat groups",
      enabled: true,
      category: "communication",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },
    {
      id: "send_notifications",
      name: "Send Notifications",
      description: "Send system notifications",
      enabled: true,
      category: "communication",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },

    // Status Management Permissions
    {
      id: "update_status",
      name: "Update Status",
      description: "Update aircraft status",
      enabled: true,
      category: "status",
      defaultRoles: ["admin", "manager", "engineer", "maintenance_staff"],
      securityLevel: "medium",
    },
    {
      id: "assign_staff",
      name: "Assign Staff",
      description: "Assign staff to AOG response teams",
      enabled: true,
      category: "status",
      defaultRoles: ["admin", "manager", "senior_engineer"],
      securityLevel: "medium",
    },
    {
      id: "reassign_staff",
      name: "Reassign Staff",
      description: "Change staff assignments",
      enabled: true,
      category: "status",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },
    {
      id: "escalate_issue",
      name: "Escalate Issue",
      description: "Escalate AOG issues to higher priority",
      enabled: true,
      category: "status",
      defaultRoles: ["admin", "manager", "senior_engineer"],
      securityLevel: "high",
    },

    // Reporting Permissions
    {
      id: "view_reports",
      name: "View Reports",
      description: "View system reports",
      enabled: true,
      category: "reporting",
      defaultRoles: ["admin", "manager", "engineer", "viewer"],
      securityLevel: "low",
    },
    {
      id: "create_reports",
      name: "Create Reports",
      description: "Create new reports",
      enabled: true,
      category: "reporting",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },
    {
      id: "export_reports",
      name: "Export Reports",
      description: "Export reports to external formats",
      enabled: true,
      category: "reporting",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },
    {
      id: "view_analytics",
      name: "View Analytics",
      description: "Access analytics dashboard",
      enabled: true,
      category: "reporting",
      defaultRoles: ["admin", "manager"],
      securityLevel: "medium",
    },
    {
      id: "view_history",
      name: "View History",
      description: "View historical AOG data",
      enabled: true,
      category: "reporting",
      defaultRoles: ["admin", "manager", "engineer", "viewer"],
      securityLevel: "low",
    },

    // Administration Permissions
    {
      id: "manage_users",
      name: "Manage Users",
      description: "Create, update, and delete users",
      enabled: true,
      category: "admin",
      defaultRoles: ["admin", "super_admin"],
      securityLevel: "high",
    },
    {
      id: "manage_roles",
      name: "Manage Roles",
      description: "Create and modify roles",
      enabled: true,
      category: "admin",
      defaultRoles: ["admin", "super_admin"],
      securityLevel: "high",
    },
    {
      id: "system_config",
      name: "System Configuration",
      description: "Configure system settings",
      enabled: true,
      category: "admin",
      defaultRoles: ["admin", "super_admin"],
      securityLevel: "high",
    },
    {
      id: "view_logs",
      name: "View Logs",
      description: "Access system logs",
      enabled: true,
      category: "admin",
      defaultRoles: ["admin"],
      securityLevel: "medium",
    },
    {
      id: "manage_integrations",
      name: "Manage Integrations",
      description: "Configure system integrations",
      enabled: true,
      category: "admin",
      defaultRoles: ["admin", "super_admin"],
      securityLevel: "high",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { getAllRoles } = useAuth()

  // Filter permissions based on search and active tab
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeTab === "all" || permission.category === activeTab

    return matchesSearch && matchesCategory
  })

  // Toggle permission enabled state
  const togglePermission = (id: Permission) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.id === id ? { ...permission, enabled: !permission.enabled } : permission,
      ),
    )
  }

  // Save changes
  const saveChanges = () => {
    // In a real app, this would call an API to save the permission configuration
    toast({
      title: "Permissions Updated",
      description: "Your permission configuration has been saved.",
    })
  }

  // Get security level badge
  const getSecurityBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">High Security</Badge>
      case "medium":
        return <Badge variant="default">Medium Security</Badge>
      case "low":
        return <Badge variant="outline">Low Security</Badge>
      default:
        return null
    }
  }

  // Group permissions by category for the summary
  const permissionsByCategory = permissions.reduce(
    (acc, permission) => {
      acc[permission.category] = acc[permission.category] || { total: 0, enabled: 0 }
      acc[permission.category].total += 1
      if (permission.enabled) acc[permission.category].enabled += 1
      return acc
    },
    {} as Record<string, { total: number; enabled: number }>,
  )

  // Format category name
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <ProtectedRoute requiredPermission="manage_roles">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permission Management</h1>
            <p className="text-muted-foreground">Enable or disable system permissions</p>
          </div>
          <Button onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        {/* Permission Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">All Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permissions.length}</div>
              <p className="text-xs text-muted-foreground">{permissions.filter((p) => p.enabled).length} enabled</p>
            </CardContent>
          </Card>

          {Object.entries(permissionsByCategory).map(([category, stats]) => (
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
              placeholder="Search permissions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Permission List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Permissions</TabsTrigger>
            <TabsTrigger value="aog">AOG Management</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="status">Status Management</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="admin">Administration</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredPermissions.length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No permissions found matching your search</p>
                </CardContent>
              </Card>
            ) : (
              filteredPermissions.map((permission) => (
                <PermissionCard key={permission.id} permission={permission} onToggle={togglePermission} />
              ))
            )}
          </TabsContent>

          {["aog", "communication", "status", "reporting", "admin"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredPermissions.filter((p) => p.category === category).length === 0 ? (
                <Card>
                  <CardContent className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No permissions found matching your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPermissions
                  .filter((p) => p.category === category)
                  .map((permission) => (
                    <PermissionCard key={permission.id} permission={permission} onToggle={togglePermission} />
                  ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Warning for High Security Permissions */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Security Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <p>
              Disabling core permissions may impact system functionality and user access. Permissions marked as "High
              Security" should be managed with caution as they control access to sensitive system functions.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

// Permission Card Component
function PermissionCard({
  permission,
  onToggle,
}: {
  permission: PermissionWithMetadata
  onToggle: (id: Permission) => void
}) {
  return (
    <Card className={permission.enabled ? "" : "border-dashed opacity-70"}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 rounded-md bg-primary/10 p-2">
            {permission.securityLevel === "high" ? (
              <Lock className="h-5 w-5" />
            ) : permission.securityLevel === "medium" ? (
              <Key className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{permission.name}</h3>
              {getSecurityBadge(permission.securityLevel)}
            </div>
            <p className="text-sm text-muted-foreground">{permission.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {permission.defaultRoles.map((role) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`toggle-${permission.id}`} className="sr-only">
            Toggle {permission.name}
          </Label>
          <Switch
            id={`toggle-${permission.id}`}
            checked={permission.enabled}
            onCheckedChange={() => onToggle(permission.id)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get security badge
function getSecurityBadge(level: "low" | "medium" | "high") {
  switch (level) {
    case "high":
      return <Badge variant="destructive">High Security</Badge>
    case "medium":
      return <Badge variant="default">Medium Security</Badge>
    case "low":
      return <Badge variant="outline">Low Security</Badge>
    default:
      return null
  }
}
