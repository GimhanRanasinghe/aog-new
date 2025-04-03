"use client"

import { MyAircraft } from "@/components/my-aircraft"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MyAircraftPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Aircraft</h1>
        </div>
        <div className="w-full">
          <MyAircraft />
        </div>
      </div>
    </ProtectedRoute>
  )
}

