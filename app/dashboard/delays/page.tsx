"use client"

import { DelayImpactPanel } from "@/components/delay-impact-panel"
import { ProtectedRoute } from "@/components/protected-route"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DelayImpactPage() {
  const searchParams = useSearchParams()
  const flightId = searchParams.get("id")
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {flightId ? `Delay Impact: Flight ${flightId}` : "Delay Impact"}
          </h1>
          {flightId && (
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Fleet Overview
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <DelayImpactPanel />
        </div>
      </div>
    </ProtectedRoute>
  )
}

