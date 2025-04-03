"use client"

import { useState } from "react"
import { useAuth, type UserRole, type Permission } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Plus, Edit, Trash, ArrowLeft } from "lucide-react"

export default function UserManagement() {
  const { users, updateUserRole, updateUserPermissions, addUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<(typeof users)[0] | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add User state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    department: "",
    role: "viewer" as UserRole,
  })

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Handle opening the edit dialog
  const handleEditUser = (user: (typeof users)[0]) => {
    setEditingUser(user)
    setSelectedRole(user.role)
    setSelectedPermissions(user.permissions)
    setIsEditDialogOpen(true)
  }

  // Handle saving user changes
  const handleSaveUser = () => {
    if (!editingUser || selectedRole === "") return

    // Update user role
    updateUserRole(editingUser.id, selectedRole as UserRole)

    // Update user permissions
    updateUserPermissions(editingUser.id, selectedPermissions)

    setIsEditDialogOpen(false)
  }

  // Handle adding a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department) return

    addUser({
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      role: newUser.role,
      permissions: [],
      lastLogin: "",
    })

    // Reset form
    setNewUser({
      name: "",
      email: "",
      department: "",
      role: "viewer" as UserRole,
    })

    setIsAddDialogOpen(false)
  }

  // Toggle a permission
  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission)
      } else {
        return [...prev, permission]
      }
    })
  }

  // Get role badge color
  const getRoleBadgeVariant = (role: UserRole): "default" | "destructive" | "outline" | "secondary" => {
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

  // Get role badge custom colors
  const getRoleBadgeColors = (role: UserRole): string => {
    switch (role) {
      case "super_admin":
        return "bg-red-600 text-white hover:bg-red-700"
      case "admin":
        return "bg-red-500 text-white hover:bg-red-600"
      case "operations_manager":
        return "bg-blue-600 text-white hover:bg-blue-700"
      case "manager":
        return "bg-blue-500 text-white hover:bg-blue-600"
      case "senior_engineer":
        return "bg-green-600 text-white hover:bg-green-700"
      case "engineer":
        return "bg-green-500 text-white hover:bg-green-600"
      case "maintenance_staff":
        return "bg-yellow-600 text-white hover:bg-yellow-700"
      case "logistics_staff":
        return "bg-orange-500 text-white hover:bg-orange-600"
      case "quality_control":
        return "bg-purple-500 text-white hover:bg-purple-600"
      case "viewer":
        return "bg-gray-500 text-white hover:bg-gray-600"
      default:
        return "bg-gray-500 text-white hover:bg-gray-600"
    }
  }

  // Format role name for display
  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
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
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="engineer">Engineer</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColors(user.role)}>{formatRoleName(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user role and permissions</DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{editingUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="operations_manager">Operations Manager</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="senior_engineer">Senior Engineer</SelectItem>
                        <SelectItem value="maintenance_staff">Maintenance Staff</SelectItem>
                        <SelectItem value="logistics_staff">Logistics Staff</SelectItem>
                        <SelectItem value="quality_control">Quality Control</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view_aog"
                            checked={selectedPermissions.includes("view_aog")}
                            onCheckedChange={() => togglePermission("view_aog")}
                          />
                          <Label htmlFor="view_aog">View AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="create_aog"
                            checked={selectedPermissions.includes("create_aog")}
                            onCheckedChange={() => togglePermission("create_aog")}
                          />
                          <Label htmlFor="create_aog">Create AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="update_aog"
                            checked={selectedPermissions.includes("update_aog")}
                            onCheckedChange={() => togglePermission("update_aog")}
                          />
                          <Label htmlFor="update_aog">Update AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="delete_aog"
                            checked={selectedPermissions.includes("delete_aog")}
                            onCheckedChange={() => togglePermission("delete_aog")}
                          />
                          <Label htmlFor="delete_aog">Delete AOG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="join_chat"
                            checked={selectedPermissions.includes("join_chat")}
                            onCheckedChange={() => togglePermission("join_chat")}
                          />
                          <Label htmlFor="join_chat">Join Chat</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="update_status"
                            checked={selectedPermissions.includes("update_status")}
                            onCheckedChange={() => togglePermission("update_status")}
                          />
                          <Label htmlFor="update_status">Update Status</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="assign_staff"
                            checked={selectedPermissions.includes("assign_staff")}
                            onCheckedChange={() => togglePermission("assign_staff")}
                          />
                          <Label htmlFor="assign_staff">Assign Staff</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view_reports"
                            checked={selectedPermissions.includes("view_reports")}
                            onCheckedChange={() => togglePermission("view_reports")}
                          />
                          <Label htmlFor="view_reports">View Reports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view_analytics"
                            checked={selectedPermissions.includes("view_analytics")}
                            onCheckedChange={() => togglePermission("view_analytics")}
                          />
                          <Label htmlFor="view_analytics">View Analytics</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view_history"
                            checked={selectedPermissions.includes("view_history")}
                            onCheckedChange={() => togglePermission("view_history")}
                          />
                          <Label htmlFor="view_history">View History</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="view_staff"
                            checked={selectedPermissions.includes("view_staff")}
                            onCheckedChange={() => togglePermission("view_staff")}
                          />
                          <Label htmlFor="view_staff">View Staff</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage_staff"
                            checked={selectedPermissions.includes("manage_staff")}
                            onCheckedChange={() => togglePermission("manage_staff")}
                          />
                          <Label htmlFor="manage_staff">Manage Staff</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manage_users"
                            checked={selectedPermissions.includes("manage_users")}
                            onCheckedChange={() => togglePermission("manage_users")}
                          />
                          <Label htmlFor="manage_users">Manage Users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="system_config"
                            checked={selectedPermissions.includes("system_config")}
                            onCheckedChange={() => togglePermission("system_config")}
                          />
                          <Label htmlFor="system_config">System Config</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Enter department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="operations_manager">Operations Manager</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="senior_engineer">Senior Engineer</SelectItem>
                      <SelectItem value="maintenance_staff">Maintenance Staff</SelectItem>
                      <SelectItem value="logistics_staff">Logistics Staff</SelectItem>
                      <SelectItem value="quality_control">Quality Control</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

