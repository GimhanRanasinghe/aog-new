"use client"

import { Suspense } from "react"
import { FleetOverview } from "@/components/fleet-overview"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FleetOverviewPageClient() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Overview</h1>
          <p className="text-muted-foreground">View comprehensive aircraft status and schedule information</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <FleetOverview />
        </Suspense>
      </div>
    </div>
  )
}
