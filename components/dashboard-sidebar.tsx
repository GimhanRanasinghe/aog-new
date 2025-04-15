"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  History,
  MessageSquare,
  Users,
  Home,
  ChevronLeft,
  ChevronRight,
  Plane,
  Map,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserPreferences } from "@/lib/user-preferences"

const dashboardRoutes = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    name: "Terminal View",
    href: "/dashboard/terminal",
    icon: Map,
    id: "terminal-view",
  },
  {
    name: "Fleet Overview",
    href: "/dashboard/fleet-overview",
    icon: Plane,
    id: "fleet-overview",
  },
  {
    name: "AOG Cards",
    href: "/dashboard/aog-cards",
    icon: AlertCircle,
    id: "aog-cards",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
    id: "analytics",
  },
  {
    name: "AOG History",
    href: "/dashboard/history",
    icon: History,
    id: "aog-history",
  },
  {
    name: "Active Chats",
    href: "/dashboard/chats",
    icon: MessageSquare,
    id: "active-chats",
  },
  {
    name: "Staff Directory",
    href: "/dashboard/staff",
    icon: Users,
    id: "staff-directory",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { preferences } = useUserPreferences()

  // Filter routes based on visibility settings
  const visibleRoutes = dashboardRoutes.filter(
    (route) => preferences.menuVisibility[route.id as keyof typeof preferences.menuVisibility] !== false,
  )

  return (
    <div
      className={cn(
        "hidden relative transition-all duration-300 ease-in-out flex-shrink-0 border-r border-border bg-background md:flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-4 bg-ac-red text-white justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iconAC-bQ2QBOxLry9CiCs574Jon72QkjX4Qd.png"
              alt="Air Canada Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <h2 className="text-lg font-semibold">AOG Response Portal</h2>
          </div>
        )}
        {collapsed && (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iconAC-bQ2QBOxLry9CiCs574Jon72QkjX4Qd.png"
            alt="Air Canada Logo"
            width={24}
            height={24}
            className="mx-auto"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-ac-red/80"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <div className="py-4 flex-1">
        <nav className="space-y-1 px-2">
          <TooltipProvider>
            {visibleRoutes.map((route) => (
              <Tooltip key={route.href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      pathname === route.href || (pathname === "/dashboard" && route.href === "/dashboard")
                        ? "bg-ac-red text-white"
                        : "text-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{route.name}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{route.name}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>
    </div>
  )
}
