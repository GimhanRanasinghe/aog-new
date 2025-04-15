"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth, type Permission, type UserRole } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Save, Plus, Shield, Users, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Group permissions by category for better organization
const permissionCategories = {
  "AOG Management": ["view_aog", "create_aog", "update_aog", "delete_aog", "approve_aog", "prioritize_aog"],
  Communication: [
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "remove_members_from_chat",
    "send_notifications",
  ],
  "Status Management": ["update_status", "assign_staff", "reassign_staff", "escalate_issue"],
  Reporting: ["view_reports", "create_reports", "export_reports", "view_analytics", "view_history"],
  "Staff Management": ["view_staff", "manage_staff", "view_staff_schedule", "update_staff_schedule"],
  "Aircraft Management": [
    "view_aircraft",
    "manage_aircraft",
    "add_aircraft",
    "remove_aircraft",
    "update_aircraft_details",
  ],
  "System Administration": ["manage_users", "manage_roles", "system_config", "view_logs", "manage_integrations"],
}

// Format permission name for display
const formatPermissionName = (permission: string): string => {
  return permission
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Format role name for display
const formatRoleName = (role: string): string => {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function RoleManagementPage() {
  const { users, getAllRoles, getAllPermissions, getRolePermissions, updateRolePermissions } = useAuth()

  const [roles, setRoles] = useState<UserRole[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([])
  const [editMode, setEditMode] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleBase, setNewRoleBase] = useState<UserRole | "">("")

  // Ref for checkbox indeterminate state
  const checkboxRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Count users by role
  const usersByRole = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Load roles and permissions on component mount
  useEffect(() => {
    setRoles(getAllRoles())
    setAllPermissions(getAllPermissions())

    // Select the first role by default
    const availableRoles = getAllRoles()
    if (availableRoles.length > 0 && !selectedRole) {
      const firstRole = availableRoles[0]
      setSelectedRole(firstRole)
      setRolePermissions(getRolePermissions(firstRole))
    }
  }, [getAllRoles, getAllPermissions, getRolePermissions, selectedRole])

  // Update checkbox indeterminate state when permissions change
  useEffect(() => {
    Object.entries(permissionCategories).forEach(([category]) => {
      if (checkboxRefs.current[category]) {
        checkboxRefs.current[category]!.indeterminate = isCategoryPartiallySelected(category)
      }
    })
  }, [rolePermissions])

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setRolePermissions(getRolePermissions(role))
    setEditMode(false)
  }

  // Toggle a permission for the selected role
  const togglePermission = (permission: Permission) => {
    if (!editMode) return

    setRolePermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission)
      } else {
        return [...prev, permission]
      }
    })
  }

  // Save role permissions
  const saveRolePermissions = () => {
    if (!selectedRole) return

    updateRolePermissions(selectedRole, rolePermissions)
    setEditMode(false)

    toast({
      title: "Role Updated",
      description: `Permissions for ${formatRoleName(selectedRole)} have been updated.`,
    })
  }

  // Add a new role
  const handleAddRole = () => {
    // In a real app, you would call an API to create a new role
    // For this demo, we'll just show a toast
    toast({
      title: "Role Creation",
      description: `This would create a new role "${newRoleName}" based on ${newRoleBase ? formatRoleName(newRoleBase) : "no base role"}.`,
    })

    setIsAddRoleDialogOpen(false)
    setNewRoleName("")
    setNewRoleBase("")
  }

  // Get role badge color
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "destructive"
      case "admin":
        return "destructive"
      case "operations_manager":
      case "manager":
        return "default"
      case "senior_engineer":
      case "engineer":
        return "secondary"
      case "maintenance_staff":
      case "logistics_staff":
      case "quality_control":
        return "outline"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  // Check if a category has any permissions selected
  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories]
    return (
      categoryPermissions.some((p) => rolePermissions.includes(p as Permission)) &&
      !categoryPermissions.every((p) => rolePermissions.includes(p as Permission))
    )
  }

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories]
    return categoryPermissions.every((p) => rolePermissions.includes(p as Permission))
  }

  // Toggle all permissions in a category
  const toggleCategory = (category: string) => {
    if (!editMode) return

    const categoryPermissions = permissionCategories[category as keyof typeof permissionCategories] as Permission[]
    const isFullySelected = isCategoryFullySelected(category)

    setRolePermissions((prev) => {
      if (isFullySelected) {
        // Remove all permissions in this category
        return prev.filter((p) => !categoryPermissions.includes(p))
      } else {
        // Add all permissions in this category
        const newPermissions = [...prev]
        categoryPermissions.forEach((p) => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p)
          }
        })
        return newPermissions
      }
    })
  }

  return (
    <ProtectedRoute requiredPermission="manage_roles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">Configure role-based access control settings</p>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <Button onClick={saveRolePermissions}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Permissions
              </Button>
            )}
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role to the system. You can base it on an existing role to copy its permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      placeholder="Enter role name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base-role">Base Role (Optional)</Label>
                    <Select value={newRoleBase} onValueChange={(value) => setNewRoleBase(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a base role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {formatRoleName(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      The new role will inherit all permissions from the selected base role.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole} disabled={!newRoleName}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Role List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles
              </CardTitle>
              <CardDescription>Select a role to manage its permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted ${
                      selectedRole === role ? "bg-muted" : ""
                    }`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(role)}>{formatRoleName(role)}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{usersByRole[role] || 0} users</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Management */}
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedRole ? formatRoleName(selectedRole) : "Select a Role"} Permissions</CardTitle>
                {selectedRole && (
                  <Badge variant={getRoleBadgeVariant(selectedRole as UserRole)}>{formatRoleName(selectedRole)}</Badge>
                )}
              </div>
              <CardDescription>
                {editMode
                  ? "Check or uncheck permissions to modify this role's access rights"
                  : "View the permissions assigned to this role"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRole ? (
                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`category-${category}`}
                          ref={(el) => (checkboxRefs.current[category] = el)}
                          checked={isCategoryFullySelected(category)}
                          onCheckedChange={() => toggleCategory(category)}
                          disabled={!editMode}
                        />
                        <Label htmlFor={`category-${category}`} className="text-base font-semibold">
                          {category}
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-3 pl-6 md:grid-cols-2 lg:grid-cols-3">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2">
                            <Checkbox
                              id={`permission-${permission}`}
                              checked={rolePermissions.includes(permission as Permission)}
                              onCheckedChange={() => togglePermission(permission as Permission)}
                              disabled={!editMode}
                            />
                            <Label htmlFor={`permission-${permission}`}>{formatPermissionName(permission)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Shield className="mx-auto h-10 w-10 opacity-50" />
                    <p className="mt-2">Select a role to view and manage its permissions</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {selectedRole && (
                <>
                  <div className="text-sm text-muted-foreground">{rolePermissions.length} permissions enabled</div>
                  {editMode && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveRolePermissions}>Save Changes</Button>
                    </div>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* User Role Assignment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Role Assignment
            </CardTitle>
            <CardDescription>View and manage which users are assigned to each role</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="by-role">
              <TabsList className="mb-4">
                <TabsTrigger value="by-role">By Role</TabsTrigger>
                <TabsTrigger value="by-user">By User</TabsTrigger>
              </TabsList>

              <TabsContent value="by-role">
                <div className="space-y-6">
                  {roles.map((role) => {
                    const usersWithRole = users.filter((user) => user.role === role)
                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(role)}>{formatRoleName(role)}</Badge>
                          <span className="text-sm text-muted-foreground">({usersWithRole.length} users)</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {usersWithRole.length > 0 ? (
                            usersWithRole.map((user) => (
                              <div key={user.id} className="flex items-center justify-between rounded-md border p-2">
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Change
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full rounded-md border border-dashed p-4 text-center text-muted-foreground">
                              No users assigned to this role
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="by-user">
                <div className="space-y-4">
                  <div className="relative">
                    <Input placeholder="Search users..." className="pl-8" />
                    <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-medium">User</th>
                          <th className="px-4 py-2 text-left font-medium">Department</th>
                          <th className="px-4 py-2 text-left font-medium">Current Role</th>
                          <th className="px-4 py-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="px-4 py-2">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-2">{user.department}</td>
                            <td className="px-4 py-2">
                              <Badge variant={getRoleBadgeVariant(user.role)}>{formatRoleName(user.role)}</Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Select defaultValue={user.role}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Change role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {formatRoleName(role)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Role Conflicts and Security Warnings */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Security Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <div className="space-y-4">
              <p>
                <strong>Principle of Least Privilege:</strong> Ensure users are assigned roles with only the permissions
                they need to perform their job functions.
              </p>
              <p>
                <strong>Role Separation:</strong> Maintain separation of duties by ensuring critical functions require
                multiple roles to complete.
              </p>
              <p>
                <strong>Regular Audits:</strong> Periodically review role assignments and permissions to ensure they
                remain appropriate.
              </p>
              <p>
                <strong>Documentation:</strong> Maintain documentation of role definitions, permissions, and assignment
                policies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
