"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { StationSelector } from "@/components/station-selector"
import { AOGCardView } from "@/components/aog-card-view"

export default function AOGCardsPage() {
  const [selectedStation, setSelectedStation] = useState("ALL")

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">AOG Cards</h1>
          <StationSelector value={selectedStation} onChange={setSelectedStation} includeAll={true} />
        </div>
        <AOGCardView station={selectedStation} />
      </div>
    </ProtectedRoute>
  )
}
