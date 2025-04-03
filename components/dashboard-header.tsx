"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, Shield, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth, usePermission } from "@/lib/auth"
import { useUserPreferences } from "@/lib/user-preferences"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavigationStyleToggle } from "@/components/navigation-style-toggle"
import { MenuCustomizationDialog } from "@/components/menu-customization-dialog"

export function DashboardHeader() {
  const router = useRouter()
  const { role, user, logout } = useAuth()
  const canAccessAdmin = usePermission("manage_users")
  const { preferences } = useUserPreferences()
  const [menuCustomizationOpen, setMenuCustomizationOpen] = useState(false)

  // Check if Admin Panel should be visible
  const showAdminPanel = canAccessAdmin && preferences.menuVisibility["admin-panel"]

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "aog",
      message: "New AOG: Aircraft FIN-1234 marked as AOG",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "group",
      message: "Group Created: FIN-1234 response team",
      time: "9 min ago",
    },
    {
      id: 3,
      type: "message",
      message: "Message: Parts arriving in 2 hours",
      time: "5 min ago",
    },
  ])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-tr from-black via-zinc-900 to-zinc-800 text-white">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center pl-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D45D4F10-6790-4D43-B083-F5FFBF5C9018_4_5005_c-removebg-preview-gwbCHpXPQCWcINIlPrIAj25y8cc2gS.png"
              alt="Air Canada"
              width={198}
              height={40}
              priority
              className="object-contain"
            />
            <h1 className="sr-only">Air Canada AOG Response Portal</h1>
          </Link>
        </div>
        <div className="flex items-center gap-6 pr-2">
          {showAdminPanel && (
            <Button className="bg-ac-red hover:bg-red-700 text-white border-none" size="sm" asChild>
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4 text-white" />
                Admin Panel
              </Link>
            </Button>
          )}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-white bg-white/10 hover:bg-transparent">
                <Settings className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <NavigationStyleToggle asMenuItem />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setMenuCustomizationOpen(true)
                  }}
                >
                  <Menu className="mr-2 h-4 w-4" />
                  <span>Customize Menu</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative border-white bg-white/10 hover:bg-transparent">
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ac-red text-[10px] text-white">
                  {notifications.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-white bg-white/10 hover:bg-transparent">
                <User className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Name: {user?.name}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <MenuCustomizationDialog open={menuCustomizationOpen} onOpenChange={setMenuCustomizationOpen} />
    </header>
  )
}

