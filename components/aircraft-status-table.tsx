"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Status color mapping
const statusColors = {
  "on-time": "bg-green-500",
  "probable-delay": "bg-yellow-500",
  "imminent-delay": "bg-amber-500",
  aog: "bg-red-500",
}

const statusLabels = {
  "on-time": "On Time",
  "probable-delay": "Probable Delay",
  "imminent-delay": "Imminent Delay",
  aog: "AOG",
}

// Flight phase mapping
const flightPhaseLabels = {
  arriving: "Arriving",
  arrived: "Arrived",
  departing: "Departing",
}

type AircraftData = {
  id: string
  registration: string
  type: string
  gate: string
  position: { x: number; y: number }
  status: "on-time" | "probable-delay" | "imminent-delay" | "aog"
  destination: string
  departureTime: string
  delayReason?: string
  estimatedDelay?: number
  flightPhase?: "arriving" | "arrived" | "departing"
  origin?: string
  arrivalTime?: string
}

interface AircraftStatusTableProps {
  aircraftData: AircraftData[]
  onSelectAircraft: (aircraft: AircraftData) => void
}

export function AircraftStatusTable({ aircraftData, onSelectAircraft }: AircraftStatusTableProps) {
  const [blinkingState, setBlinkingState] = useState<Record<string, boolean>>({})

  // Set up blinking effect for AOG aircraft
  useEffect(() => {
    const blinkingStates: Record<string, boolean> = {}
    const intervals: Record<string, NodeJS.Timeout> = {}

    aircraftData.forEach((aircraft) => {
      if (aircraft.status === "aog") {
        blinkingStates[aircraft.id] = true
        intervals[aircraft.id] = setInterval(() => {
          setBlinkingState((prev) => ({
            ...prev,
            [aircraft.id]: !prev[aircraft.id],
          }))
        }, 500) // Blink every 500ms for AOG
      }
    })

    setBlinkingState(blinkingStates)

    // Clean up intervals
    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval))
    }
  }, [aircraftData])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Flight</TableHead>
            <TableHead>Aircraft</TableHead>
            <TableHead>Origin/Destination</TableHead>
            <TableHead>Gate</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Flight Phase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aircraftData.map((aircraft) => (
            <TableRow
              key={aircraft.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectAircraft(aircraft)}
            >
              <TableCell className="font-medium">{aircraft.id}</TableCell>
              <TableCell>
                {aircraft.registration} ({aircraft.type.split(" ")[0]})
              </TableCell>
              <TableCell>
                {aircraft.flightPhase === "arriving" || aircraft.flightPhase === "arrived"
                  ? aircraft.origin
                  : aircraft.destination}
              </TableCell>
              <TableCell>{aircraft.gate}</TableCell>
              <TableCell>
                {aircraft.flightPhase === "arriving" || aircraft.flightPhase === "arrived"
                  ? aircraft.arrivalTime
                  : aircraft.departureTime}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {aircraft.status === "aog" ? (
                    <div className="flex items-center gap-1">
                      <svg
                        viewBox="0 0 24 24"
                        className={cn(
                          "w-5 h-5 fill-current text-red-500",
                          blinkingState[aircraft.id] ? "opacity-100" : "opacity-30",
                        )}
                      >
                        <path d="M22,16v-2l-8.5-5V3.5C13.5,2.67,12.83,2,12,2s-1.5,0.67-1.5,1.5V9L2,14v2l8.5-2.5V19L8,20.5V22l4-1l4,1v-1.5L13.5,19 v-5.5L22,16z" />
                      </svg>
                      <Badge className={statusColors[aircraft.status]}>{statusLabels[aircraft.status]}</Badge>
                    </div>
                  ) : (
                    <Badge className={statusColors[aircraft.status]}>{statusLabels[aircraft.status]}</Badge>
                  )}
                  {aircraft.estimatedDelay && aircraft.status !== "on-time" && (
                    <span className="text-xs text-muted-foreground">{aircraft.estimatedDelay} min</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="font-normal">
                  {flightPhaseLabels[aircraft.flightPhase || "departing"]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
