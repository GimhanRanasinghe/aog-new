"use client"

import { useUserPreferences } from "@/lib/user-preferences"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardTabs } from "./dashboard-tabs"
import type { ReactNode } from "react"

export function ClientNavigationWrapper({ children }: { children: ReactNode }) {
  const { preferences } = useUserPreferences()

  return (
    <div className="flex h-full">
      {preferences.navigationStyle === "sidebar" ? (
        <>
          <DashboardSidebar />
          <div className="flex-1 p-6 md:p-8">{children}</div>
        </>
      ) : (
        <div className="flex-1">
          <DashboardTabs />
          <div className="p-6 md:p-8">{children}</div>
        </div>
      )}
    </div>
  )
}
