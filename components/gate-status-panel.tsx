"use client"

import { useEffect, useState } from "react"
import { Clock, Plane, Map, PlaneLanding, PlaneTakeoff, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { aircraftData, getAircraftById } from "@/lib/aircraft-data"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GateStatusPanelProps {
  selectedGateId: string | null
  selectedGate?: any | null
}

export function GateStatusPanel({ selectedGateId, selectedGate }: GateStatusPanelProps) {
  const [aircraft, setAircraft] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (selectedGateId) {
      // Extract the gate number from the gate ID (e.g., "gate_E22" -> "E22")
      const gateNumber = selectedGateId.replace("gate_", "")

      // Find aircraft at this gate in YYZ
      const aircraftAtGate = aircraftData.find((ac) => ac.location === "YYZ" && ac.gate === gateNumber)

      setAircraft(aircraftAtGate)
    } else {
      setAircraft(null)
    }
  }, [selectedGateId])

  const navigateToFleetView = () => {
    if (aircraft) {
      // Navigate to the fleet overview page with a query parameter to highlight this aircraft
      router.push(`/dashboard/fleet-overview?highlight=${aircraft.id}`)

      // Store the aircraft ID in sessionStorage to maintain the highlight state
      sessionStorage.setItem("highlightedAircraft", aircraft.id)
    }
  }

  // Get aircraft details if a flight is assigned
  const aircraft2 = selectedGate?.assignedFlight ? getAircraftById(selectedGate.assignedFlight.aircraftId) : null

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!selectedGateId || !selectedGate) {
    return (
      <div className="h-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <Map className="h-12 w-12 mb-2 opacity-50" />
        <h3 className="text-lg font-medium mb-1">No Gate Selected</h3>
        <p className="text-sm">Select a gate to view its details</p>
      </div>
    )
  }

  return (
    <div className="h-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-300 dark:border-gray-600">
        <h3 className="font-medium">{selectedGate.label}</h3>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {selectedGate.direction === "inbound" ? (
              <PlaneLanding className="h-4 w-4 text-blue-500" />
            ) : (
              <PlaneTakeoff className="h-4 w-4 text-green-500" />
            )}
            <span className="font-medium capitalize">{selectedGate.direction}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedGate.direction === "inbound" ? "Arriving flights" : "Departing flights"}
          </div>
        </div>

        {/* Assigned Flight Section */}
        {selectedGate.assignedFlight ? (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-lg">{selectedGate.assignedFlight.flightNumber}</div>
                {aircraft2?.status === "aog" ? (
                  <Badge className="bg-red-500">AOG</Badge>
                ) : aircraft2?.nextFlight?.status === "delayed" ? (
                  <Badge className="bg-amber-500">Delayed</Badge>
                ) : (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Aircraft:</div>
                <div className="font-medium">
                  <Link
                    href={`/dashboard/fleet-overview?highlight=${aircraft2?.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {aircraft2?.id} ({aircraft2?.registration})
                  </Link>
                </div>

                <div className="text-gray-500 dark:text-gray-400">Type:</div>
                <div>{aircraft2?.type || "Unknown"}</div>

                <div className="text-gray-500 dark:text-gray-400">
                  {selectedGate.direction === "inbound" ? "Arrival:" : "Departure:"}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(
                    selectedGate.direction === "inbound"
                      ? aircraft2?.nextFlight?.arrivalTime
                      : aircraft2?.nextFlight?.departureTime,
                  )}
                </div>

                {aircraft2?.nextFlight?.status === "delayed" && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Delay:</div>
                    <div className="text-red-500">{aircraft2.nextFlight.delayMinutes} minutes</div>

                    <div className="text-gray-500 dark:text-gray-400">Reason:</div>
                    <div>{aircraft2.nextFlight.delayReason || "Unknown"}</div>
                  </>
                )}

                {aircraft2?.status === "aog" && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">Issue:</div>
                    <div className="text-red-500">{aircraft2.currentFault?.description || "Technical issue"}</div>

                    <div className="text-gray-500 dark:text-gray-400">Est. Resolution:</div>
                    <div>{aircraft2.currentFault?.estimatedResolution || "Unknown"}</div>
                  </>
                )}
              </div>

              {aircraft2 && (
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/dashboard/fleet-overview?highlight=${aircraft2.id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View aircraft details
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center text-gray-500 dark:text-gray-400">
            <Plane className="h-8 w-8 mb-2 opacity-50" />
            <p>No flight currently assigned to this gate</p>
          </div>
        )}
      </div>
    </div>
  )
}

