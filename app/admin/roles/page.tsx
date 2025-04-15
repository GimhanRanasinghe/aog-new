"use client"

import { useState } from "react"
import { useAuth, type UserRole, type Permission, DEFAULT_ROLE_PERMISSIONS } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, ArrowLeft } from "lucide-react"

export default function RoleManagement() {
  const { users } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS)

  // Count users by role
  const usersByRole = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Toggle a permission for a role
  const togglePermission = (role: UserRole, permission: Permission) => {
    if (!editMode) return

    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      if (newPermissions[role].includes(permission)) {
        newPermissions[role] = newPermissions[role].filter((p) => p !== permission)
      } else {
        newPermissions[role] = [...newPermissions[role], permission]
      }
      return newPermissions
    })
  }

  // Save role permissions
  const saveRolePermissions = () => {
    // In a real app, this would call an API to update role permissions
    setEditMode(false)
    // Show success message
  }

  // Get role badge color
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "engineer":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute requiredPermission="manage_users">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">Configure role-based access control settings</p>
          </div>
          {editMode ? (
            <Button onClick={saveRolePermissions}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Permissions
            </Button>
          )}
        </div>

        <Tabs defaultValue="admin">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="engineer">Engineer</TabsTrigger>
            <TabsTrigger value="viewer">Viewer</TabsTrigger>
          </TabsList>

          {(["admin", "manager", "engineer", "viewer"] as UserRole[]).map((role) => (
            <TabsContent key={role} value={role}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {role.charAt(0).toUpperCase() + role.slice(1)} Role
                        <Badge variant={getRoleBadgeVariant(role)}>{usersByRole[role] || 0} Users</Badge>
                      </CardTitle>
                      <CardDescription>Configure permissions for the {role} role</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4">
                      <h3 className="font-medium">AOG Management</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-view_aog`}
                            checked={rolePermissions[role].includes("view_aog")}
                            onCheckedChange={() => togglePermission(role, "view_aog")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-view_aog`}>View AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-create_aog`}
                            checked={rolePermissions[role].includes("create_aog")}
                            onCheckedChange={() => togglePermission(role, "create_aog")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-create_aog`}>Create AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-update_aog`}
                            checked={rolePermissions[role].includes("update_aog")}
                            onCheckedChange={() => togglePermission(role, "update_aog")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-update_aog`}>Update AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-delete_aog`}
                            checked={rolePermissions[role].includes("delete_aog")}
                            onCheckedChange={() => togglePermission(role, "delete_aog")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-delete_aog`}>Delete AOG</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Communication</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-join_chat`}
                            checked={rolePermissions[role].includes("join_chat")}
                            onCheckedChange={() => togglePermission(role, "join_chat")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-join_chat`}>Join Chat</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-update_status`}
                            checked={rolePermissions[role].includes("update_status")}
                            onCheckedChange={() => togglePermission(role, "update_status")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-update_status`}>Update Status</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-assign_staff`}
                            checked={rolePermissions[role].includes("assign_staff")}
                            onCheckedChange={() => togglePermission(role, "assign_staff")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-assign_staff`}>Assign Staff</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Reporting</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-view_reports`}
                            checked={rolePermissions[role].includes("view_reports")}
                            onCheckedChange={() => togglePermission(role, "view_reports")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-view_reports`}>View Reports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-view_analytics`}
                            checked={rolePermissions[role].includes("view_analytics")}
                            onCheckedChange={() => togglePermission(role, "view_analytics")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-view_analytics`}>View Analytics</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-view_history`}
                            checked={rolePermissions[role].includes("view_history")}
                            onCheckedChange={() => togglePermission(role, "view_history")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-view_history`}>View History</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Staff Management</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-view_staff`}
                            checked={rolePermissions[role].includes("view_staff")}
                            onCheckedChange={() => togglePermission(role, "view_staff")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-view_staff`}>View Staff</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-manage_staff`}
                            checked={rolePermissions[role].includes("manage_staff")}
                            onCheckedChange={() => togglePermission(role, "manage_staff")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-manage_staff`}>Manage Staff</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Administration</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-manage_users`}
                            checked={rolePermissions[role].includes("manage_users")}
                            onCheckedChange={() => togglePermission(role, "manage_users")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-manage_users`}>Manage Users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-system_config`}
                            checked={rolePermissions[role].includes("system_config")}
                            onCheckedChange={() => togglePermission(role, "system_config")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-system_config`}>System Config</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role}-manage_aircraft`}
                            checked={rolePermissions[role].includes("manage_aircraft")}
                            onCheckedChange={() => togglePermission(role, "manage_aircraft")}
                            disabled={!editMode}
                          />
                          <Label htmlFor={`${role}-manage_aircraft`}>Manage Aircraft</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">{rolePermissions[role].length} permissions enabled</p>
                  {editMode && (
                    <Button variant="outline" onClick={saveRolePermissions}>
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
