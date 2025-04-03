"use client"

import type React from "react"

import { useUserPreferences } from "@/lib/user-preferences"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { usePathname } from "next/navigation"

export function DashboardNavigationWrapper({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const pathname = usePathname()

  // Extract the current section from the pathname
  const currentSection = pathname === "/dashboard" ? "dashboard" : pathname.split("/")[2] || "dashboard"

  return (
    <>
      {preferences.navigationStyle === "sidebar" ? (
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      ) : (
        <div className="flex-1">
          <DashboardTabs currentSection={currentSection} />
          <main className="p-6 md:p-8">{children}</main>
        </div>
      )}
    </>
  )
}

