import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ClientNavigationWrapper } from "@/components/client-navigation-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 overflow-auto">
        <ClientNavigationWrapper>{children}</ClientNavigationWrapper>
      </div>
    </div>
  )
}
