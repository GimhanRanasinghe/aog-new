"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AOGList } from "@/components/aog-list"
import { MarkAOGDialog } from "@/components/mark-aog-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { StationSelector } from "@/components/station-selector"
import { AlertTriangle, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, Plane, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AOGPage() {
  const [selectedStation, setSelectedStation] = useState("ALL")

  // Mock data for the statistics cards - in a real app, this would be calculated from actual data
  const getStationSpecificStats = (station: string) => {
    switch (station) {
      case "YYZ":
        return {
          total: 1,
          critical: 0,
          inProgress: 1,
          resolved: 2,
        }
      case "YUL":
        return {
          total: 1,
          critical: 0,
          inProgress: 0,
          resolved: 1,
        }
      case "YVR":
        return {
          total: 1,
          critical: 1,
          inProgress: 0,
          resolved: 0,
        }
      default: // ALL
        return {
          total: 3,
          critical: 1,
          inProgress: 1,
          resolved: 3,
        }
    }
  }

  const stats = getStationSpecificStats(selectedStation)

  return (
    <ProtectedRoute requiredPermission="view_aog">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">AOG Aircraft</h1>
          <div className="flex items-center gap-4">
            <StationSelector value={selectedStation} onChange={setSelectedStation} />
            <MarkAOGDialog />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total AOG</CardTitle>
              <CardDescription>Aircraft on ground</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.total}</div>
                <Plane className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-red-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  +1
                </span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical AOG</CardTitle>
              <CardDescription>Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-blue-500 flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  No change
                </span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <CardDescription>Teams assigned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  +1
                </span>{" "}
                more than yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CardDescription>Aircraft returned to service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                  -1
                </span>{" "}
                compared to yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <AOGList stationFilter={selectedStation} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
