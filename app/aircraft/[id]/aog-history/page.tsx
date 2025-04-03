"use client"

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AircraftAOGHistory } from "@/components/aircraft-aog-history"
import { Skeleton } from "@/components/ui/skeleton"
import { getAircraftById, getAOGHistoryForAircraft } from "@/lib/aircraft-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AircraftAOGHistoryPageProps {
  params: {
    id: string
  }
}

export default function AircraftAOGHistoryPage({ params }: AircraftAOGHistoryPageProps) {
  const aircraft = getAircraftById(params.id)

  if (!aircraft) {
    notFound()
  }

  // Get AOG history for this specific aircraft
  const aogHistory = getAOGHistoryForAircraft(params.id)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {aircraft.registration} - {aircraft.type}
        </h1>
        <p className="text-muted-foreground">Aircraft ID: {aircraft.id}</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <AircraftAOGHistory aircraft={aircraft} aogHistory={aogHistory} />
      </Suspense>
    </div>
  )
}

