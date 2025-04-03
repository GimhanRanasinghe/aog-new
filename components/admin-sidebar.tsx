"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Settings, Shield, PlaneTakeoff, BarChart, Home, Key, ToggleLeft } from "lucide-react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const adminRoutes = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    section: "Access Control",
    items: [
      {
        name: "Role Management",
        href: "/admin/role-management",
        icon: Shield,
      },
      {
        name: "Permission Management",
        href: "/admin/permissions",
        icon: Key,
      },
    ],
  },
  {
    section: "System Configuration",
    items: [
      {
        name: "Feature Management",
        href: "/admin/features",
        icon: ToggleLeft,
      },
      {
        name: "Aircraft Management",
        href: "/admin/aircraft",
        icon: PlaneTakeoff,
      },
      {
        name: "System Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "hidden relative transition-all duration-300 ease-in-out flex-shrink-0 border-r border-border bg-background md:flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-20 items-center border-b border-border px-4 bg-ac-red text-white justify-between">
        {!collapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
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
        <nav className="space-y-4 px-2">
          <TooltipProvider>
            {adminRoutes.map((route, index) =>
              route.section ? (
                <div key={index} className="space-y-1">
                  {!collapsed && (
                    <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {route.section}
                    </h3>
                  )}
                  {route.items?.map((item) => (
                    <Tooltip key={item.href} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                            pathname === item.href
                              ? "bg-ac-red text-white"
                              : "text-foreground hover:bg-muted hover:text-foreground",
                            collapsed && "justify-center px-2",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                          {!collapsed && <span>{item.name}</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <Tooltip key={route.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        pathname === route.href
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
              ),
            )}
          </TooltipProvider>
        </nav>
      </div>
    </div>
  )
}

