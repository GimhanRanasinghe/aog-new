"use client"

import { useState } from "react"
import { KPIDashboard } from "@/components/kpi-dashboard"
import { ProtectedRoute } from "@/components/protected-route"
import { StationSelector } from "@/components/station-selector"

export default function DashboardPage() {
  const [selectedStation, setSelectedStation] = useState("ALL")

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
          <StationSelector value={selectedStation} onChange={setSelectedStation} includeAll={true} />
        </div>
        <KPIDashboard station={selectedStation} />
      </div>
    </ProtectedRoute>
  )
}

