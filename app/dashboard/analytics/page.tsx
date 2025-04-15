"use client"

import { AOGAnalytics } from "@/components/aog-analytics"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requiredPermission="view_analytics">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <AOGAnalytics />
      </div>
    </ProtectedRoute>
  )
}
