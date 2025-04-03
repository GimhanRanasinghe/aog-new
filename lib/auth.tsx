"use client"

import type React from "react"
import { useState, createContext, useContext, useEffect } from "react"

// Define user roles - expanded with more specific roles
export type UserRole =
  | "admin"
  | "super_admin"
  | "engineer"
  | "senior_engineer"
  | "manager"
  | "operations_manager"
  | "viewer"
  | "maintenance_staff"
  | "logistics_staff"
  | "quality_control"

// Define permission types - expanded with more granular permissions
export type Permission =
  // AOG Management
  | "view_aog"
  | "create_aog"
  | "update_aog"
  | "delete_aog"
  | "approve_aog"
  | "prioritize_aog"

  // Communication
  | "join_chat"
  | "create_chat_group"
  | "add_members_to_chat"
  | "remove_members_from_chat"
  | "send_notifications"

  // Status Management
  | "update_status"
  | "assign_staff"
  | "reassign_staff"
  | "escalate_issue"

  // Reporting
  | "view_reports"
  | "create_reports"
  | "export_reports"
  | "view_analytics"
  | "view_history"

  // Staff Management
  | "view_staff"
  | "manage_staff"
  | "view_staff_schedule"
  | "update_staff_schedule"

  // Aircraft Management
  | "view_aircraft"
  | "manage_aircraft"
  | "add_aircraft"
  | "remove_aircraft"
  | "update_aircraft_details"

  // System Administration
  | "manage_users"
  | "manage_roles"
  | "system_config"
  | "view_logs"
  | "manage_integrations"

// Define user interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  permissions: Permission[]
  lastLogin?: string
  createdAt: string
}

// Define role credentials for login
export interface RoleCredential {
  email: string
  password: string
  role: UserRole
  name: string
  department: string
}

// Role-specific login credentials
export const ROLE_CREDENTIALS: RoleCredential[] = [
  {
    email: "admin@aircanada.com",
    password: "admin123",
    role: "admin",
    name: "Michael Thompson",
    department: "IT",
  },
  {
    email: "superadmin@aircanada.com",
    password: "super123",
    role: "super_admin",
    name: "Jean-Pierre Trudeau",
    department: "Executive",
  },
  {
    email: "manager@aircanada.com",
    password: "manager123",
    role: "manager",
    name: "Robert MacDonald",
    department: "Operations",
  },
  {
    email: "ops@aircanada.com",
    password: "ops123",
    role: "operations_manager",
    name: "Sophie Belanger",
    department: "Operations",
  },
  {
    email: "engineer@aircanada.com",
    password: "engineer123",
    role: "engineer",
    name: "David Chen",
    department: "Mechanical",
  },
  {
    email: "senior@aircanada.com",
    password: "senior123",
    role: "senior_engineer",
    name: "Marie-Claire Dubois",
    department: "Engineering",
  },
  {
    email: "maintenance@aircanada.com",
    password: "maint123",
    role: "maintenance_staff",
    name: "William Singh",
    department: "Maintenance",
  },
  {
    email: "logistics@aircanada.com",
    password: "log123",
    role: "logistics_staff",
    name: "Sarah O'Connor",
    department: "Logistics",
  },
  {
    email: "quality@aircanada.com",
    password: "quality123",
    role: "quality_control",
    name: "Pierre Tremblay",
    department: "Quality",
  },
  {
    email: "viewer@aircanada.com",
    password: "view123",
    role: "viewer",
    name: "Aisha Patel",
    department: "Planning",
  },
]

// Define role permissions mapping with expanded roles and permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Administrative roles
  super_admin: [
    "view_aog",
    "create_aog",
    "update_aog",
    "delete_aog",
    "approve_aog",
    "prioritize_aog",
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "remove_members_from_chat",
    "send_notifications",
    "update_status",
    "assign_staff",
    "reassign_staff",
    "escalate_issue",
    "view_reports",
    "create_reports",
    "export_reports",
    "view_analytics",
    "view_history",
    "view_staff",
    "manage_staff",
    "view_staff_schedule",
    "update_staff_schedule",
    "view_aircraft",
    "manage_aircraft",
    "add_aircraft",
    "remove_aircraft",
    "update_aircraft_details",
    "manage_users",
    "manage_roles",
    "system_config",
    "view_logs",
    "manage_integrations",
  ],

  admin: [
    "view_aog",
    "create_aog",
    "update_aog",
    "delete_aog",
    "approve_aog",
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "remove_members_from_chat",
    "send_notifications",
    "update_status",
    "assign_staff",
    "reassign_staff",
    "escalate_issue",
    "view_reports",
    "create_reports",
    "export_reports",
    "view_analytics",
    "view_history",
    "view_staff",
    "manage_staff",
    "view_staff_schedule",
    "update_staff_schedule",
    "view_aircraft",
    "manage_aircraft",
    "add_aircraft",
    "remove_aircraft",
    "manage_users",
    "view_logs",
  ],

  // Management roles
  operations_manager: [
    "view_aog",
    "create_aog",
    "update_aog",
    "approve_aog",
    "prioritize_aog",
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "send_notifications",
    "update_status",
    "assign_staff",
    "reassign_staff",
    "escalate_issue",
    "view_reports",
    "create_reports",
    "export_reports",
    "view_analytics",
    "view_history",
    "view_staff",
    "manage_staff",
    "view_staff_schedule",
    "update_staff_schedule",
    "view_aircraft",
  ],

  manager: [
    "view_aog",
    "create_aog",
    "update_aog",
    "approve_aog",
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "send_notifications",
    "update_status",
    "assign_staff",
    "reassign_staff",
    "view_reports",
    "view_analytics",
    "view_history",
    "view_staff",
    "view_staff_schedule",
    "view_aircraft",
  ],

  // Engineering roles
  senior_engineer: [
    "view_aog",
    "create_aog",
    "update_aog",
    "prioritize_aog",
    "join_chat",
    "create_chat_group",
    "add_members_to_chat",
    "update_status",
    "assign_staff",
    "view_reports",
    "view_history",
    "view_staff",
    "view_staff_schedule",
    "view_aircraft",
  ],

  engineer: [
    "view_aog",
    "create_aog",
    "update_aog",
    "join_chat",
    "update_status",
    "view_reports",
    "view_history",
    "view_staff",
    "view_aircraft",
  ],

  // Specialized roles
  maintenance_staff: [
    "view_aog",
    "update_aog",
    "join_chat",
    "update_status",
    "view_history",
    "view_staff",
    "view_aircraft",
  ],

  logistics_staff: ["view_aog", "join_chat", "view_history", "view_staff", "view_aircraft"],

  quality_control: [
    "view_aog",
    "approve_aog",
    "join_chat",
    "view_reports",
    "view_history",
    "view_staff",
    "view_aircraft",
  ],

  // Basic role
  viewer: ["view_aog", "view_reports", "view_history", "view_staff", "view_aircraft"],
}

// Mock users for the admin panel with expanded roles
const mockUsersList = [
  {
    id: "super-admin",
    name: "Jean-Pierre Trudeau",
    email: "superadmin@aircanada.com",
    role: "super_admin" as UserRole,
    department: "Executive",
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin,
    createdAt: "2022-01-05T09:15:00Z",
  },
  {
    id: "admin-user",
    name: "Michael Thompson",
    email: "admin@aircanada.com",
    role: "admin" as UserRole,
    department: "IT",
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
    createdAt: "2022-08-05T09:15:00Z",
  },
  {
    id: "ops-manager",
    name: "Sophie Belanger",
    email: "opsmanager@aircanada.com",
    role: "operations_manager" as UserRole,
    department: "Operations",
    permissions: DEFAULT_ROLE_PERMISSIONS.operations_manager,
    createdAt: "2022-09-10T14:45:00Z",
  },
  {
    id: "manager-user",
    name: "Robert MacDonald",
    email: "manager@aircanada.com",
    role: "manager" as UserRole,
    department: "Operations",
    permissions: DEFAULT_ROLE_PERMISSIONS.manager,
    createdAt: "2022-11-10T14:45:00Z",
  },
  {
    id: "senior-engineer",
    name: "Marie-Claire Dubois",
    email: "seniorengineer@aircanada.com",
    role: "senior_engineer" as UserRole,
    department: "Engineering",
    permissions: DEFAULT_ROLE_PERMISSIONS.senior_engineer,
    createdAt: "2022-12-15T08:30:00Z",
  },
  {
    id: "engineer-user",
    name: "David Chen",
    email: "engineer@aircanada.com",
    role: "engineer" as UserRole,
    department: "Mechanical",
    permissions: DEFAULT_ROLE_PERMISSIONS.engineer,
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "maintenance-staff",
    name: "William Singh",
    email: "maintenance@aircanada.com",
    role: "maintenance_staff" as UserRole,
    department: "Maintenance",
    permissions: DEFAULT_ROLE_PERMISSIONS.maintenance_staff,
    createdAt: "2023-02-10T11:30:00Z",
  },
  {
    id: "logistics-staff",
    name: "Sarah O'Connor",
    email: "logistics@aircanada.com",
    role: "logistics_staff" as UserRole,
    department: "Logistics",
    permissions: DEFAULT_ROLE_PERMISSIONS.logistics_staff,
    createdAt: "2023-02-15T11:30:00Z",
  },
  {
    id: "quality-control",
    name: "Pierre Tremblay",
    email: "quality@aircanada.com",
    role: "quality_control" as UserRole,
    department: "Quality",
    permissions: DEFAULT_ROLE_PERMISSIONS.quality_control,
    createdAt: "2023-02-18T11:30:00Z",
  },
  {
    id: "viewer-user",
    name: "Aisha Patel",
    email: "viewer@aircanada.com",
    role: "viewer" as UserRole,
    department: "Planning",
    permissions: DEFAULT_ROLE_PERMISSIONS.viewer,
    createdAt: "2023-02-20T11:30:00Z",
  },
]

// Create auth context
interface AuthContextType {
  user: User | null
  role: UserRole
  isAuthenticated: boolean
  hasPermission: (permission: Permission) => boolean
  logout: () => void
  users: User[]
  updateUserPermissions: (userId: string, permissions: Permission[]) => void
  updateUserRole: (userId: string, role: UserRole) => void
  login: (email: string, password: string) => Promise<boolean>
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  deleteUser: (userId: string) => void
  updateRolePermissions: (role: UserRole, permissions: Permission[]) => void
  getRolePermissions: (role: UserRole) => Permission[]
  getAllRoles: () => UserRole[]
  getAllPermissions: () => Permission[]
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "viewer",
  isAuthenticated: false,
  hasPermission: () => false,
  logout: () => {},
  users: [],
  updateUserPermissions: () => {},
  updateUserRole: () => {},
  login: async () => false,
  addUser: () => {},
  deleteUser: () => {},
  updateRolePermissions: () => {},
  getRolePermissions: () => [],
  getAllRoles: () => [],
  getAllPermissions: () => [],
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>(mockUsersList)
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, Permission[]>>(DEFAULT_ROLE_PERMISSIONS)

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("User restored from localStorage:", parsedUser.name, parsedUser.role)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt with:", email, password)

    // Find matching credentials
    const matchedCredential = ROLE_CREDENTIALS.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password,
    )

    if (matchedCredential) {
      // Create user with appropriate role and permissions
      const loggedInUser = {
        id: `user-${Date.now()}`,
        name: matchedCredential.name,
        email: matchedCredential.email,
        role: matchedCredential.role,
        department: matchedCredential.department,
        permissions: DEFAULT_ROLE_PERMISSIONS[matchedCredential.role],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      setUser(loggedInUser)
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
      console.log(`Login successful as ${matchedCredential.role}:`, loggedInUser.name)
      return true
    }

    console.log("Login failed: Invalid credentials")
    return false
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  // Update user permissions
  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return { ...u, permissions }
        }
        return u
      }),
    )

    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  // Update user role
  const updateUserRole = (userId: string, role: UserRole) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role,
            permissions: rolePermissions[role],
          }
        }
        return u
      }),
    )

    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        role,
        permissions: rolePermissions[role],
      }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  // Add a new user
  const addUser = (newUser: Omit<User, "id" | "createdAt">) => {
    const user = {
      ...newUser,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    setAllUsers((prev) => [...prev, user])
  }

  // Delete a user
  const deleteUser = (userId: string) => {
    setAllUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  // Update permissions for a role
  const updateRolePermissions = (role: UserRole, permissions: Permission[]) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: permissions,
    }))

    // Update all users with this role to have the new permissions
    setAllUsers((prev) =>
      prev.map((user) => {
        if (user.role === role) {
          return {
            ...user,
            permissions,
          }
        }
        return user
      }),
    )

    // Update current user if affected
    if (user && user.role === role) {
      const updatedUser = { ...user, permissions }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  // Get permissions for a role
  const getRolePermissions = (role: UserRole): Permission[] => {
    return rolePermissions[role] || []
  }

  // Get all available roles
  const getAllRoles = (): UserRole[] => {
    return Object.keys(rolePermissions) as UserRole[]
  }

  // Get all available permissions
  const getAllPermissions = (): Permission[] => {
    // Return all possible permissions defined in the Permission type
    return [
      // AOG Management
      "view_aog",
      "create_aog",
      "update_aog",
      "delete_aog",
      "approve_aog",
      "prioritize_aog",
      // Communication
      "join_chat",
      "create_chat_group",
      "add_members_to_chat",
      "remove_members_from_chat",
      "send_notifications",
      // Status Management
      "update_status",
      "assign_staff",
      "reassign_staff",
      "escalate_issue",
      // Reporting
      "view_reports",
      "create_reports",
      "export_reports",
      "view_analytics",
      "view_history",
      // Staff Management
      "view_staff",
      "manage_staff",
      "view_staff_schedule",
      "update_staff_schedule",
      // Aircraft Management
      "view_aircraft",
      "manage_aircraft",
      "add_aircraft",
      "remove_aircraft",
      "update_aircraft_details",
      // System Administration
      "manage_users",
      "manage_roles",
      "system_config",
      "view_logs",
      "manage_integrations",
    ]
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "viewer",
        isAuthenticated: !!user,
        hasPermission,
        logout,
        users: allUsers,
        updateUserPermissions,
        updateUserRole,
        login,
        addUser,
        deleteUser,
        updateRolePermissions,
        getRolePermissions,
        getAllRoles,
        getAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Custom hook to use user role
export function useUserRole() {
  const { role } = useAuth()
  return { role }
}

// Custom hook to check permissions
export function usePermission(permission: Permission) {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

