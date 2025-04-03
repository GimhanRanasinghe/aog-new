"use client"

import { AOGHistory } from "@/components/aog-history"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HistoryPage() {
  return (
    <ProtectedRoute requiredPermission="view_history">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">AOG History</h1>
        <AOGHistory />
      </div>
    </ProtectedRoute>
  )
}

