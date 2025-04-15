"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserPreferences } from "@/lib/user-preferences"
import { LayoutDashboardIcon as LayoutSidebar, LayoutList } from "lucide-react"

interface NavigationStyleToggleProps {
  asMenuItem?: boolean
}

export function NavigationStyleToggle({ asMenuItem = false }: NavigationStyleToggleProps) {
  const { preferences, updateNavigationStyle } = useUserPreferences()

  if (asMenuItem) {
    return (
      <div className="flex items-center justify-between w-full px-2 py-1.5">
        <div className="flex items-center">
          <LayoutSidebar className="mr-2 h-4 w-4" />
          <span>Navigation Style</span>
        </div>
        <Tabs
          value={preferences.navigationStyle}
          onValueChange={(value) => updateNavigationStyle(value as "tabs" | "sidebar")}
          className="h-8"
        >
          <TabsList className="h-7">
            <TabsTrigger value="sidebar" className="h-6 px-2 py-0 text-xs">
              <LayoutSidebar className="h-3 w-3 mr-1" />
              Sidebar
            </TabsTrigger>
            <TabsTrigger value="tabs" className="h-6 px-2 py-0 text-xs">
              <LayoutList className="h-3 w-3 mr-1" />
              Tabs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Navigation Style:</span>
      <Tabs
        value={preferences.navigationStyle}
        onValueChange={(value) => updateNavigationStyle(value as "tabs" | "sidebar")}
        className="ml-4"
      >
        <TabsList>
          <TabsTrigger value="sidebar">
            <LayoutSidebar className="h-4 w-4 mr-1" />
            Sidebar
          </TabsTrigger>
          <TabsTrigger value="tabs">
            <LayoutList className="h-4 w-4 mr-1" />
            Tabs
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
