"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { AlertCircle, BarChart, History, MessageSquare, Users, PlaneTakeoff, Home, Plane } from "lucide-react"
import { useUserPreferences } from "@/lib/user-preferences"

const dashboardRoutes = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    name: "AOG Aircraft",
    href: "/dashboard/aog",
    icon: AlertCircle,
    id: "aog-aircraft",
  },
  {
    name: "My Aircraft",
    href: "/dashboard/my-aircraft",
    icon: PlaneTakeoff,
    id: "my-aircraft",
  },
  {
    name: "Fleet Overview",
    href: "/dashboard/fleet-overview",
    icon: Plane,
    id: "fleet-overview",
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

export function DashboardTabs({ currentSection }: { currentSection: string }) {
  const { preferences } = useUserPreferences()

  // Filter routes based on visibility settings
  const visibleRoutes = dashboardRoutes.filter(
    (route) => preferences.menuVisibility[route.id as keyof typeof preferences.menuVisibility],
  )

  return (
    <div className="border-b bg-background">
      <nav className="flex overflow-x-auto px-4">
        {visibleRoutes.map((route) => {
          const isActive =
            route.href.endsWith(currentSection) || (currentSection === "dashboard" && route.href === "/dashboard")
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex h-12 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-ac-red text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

