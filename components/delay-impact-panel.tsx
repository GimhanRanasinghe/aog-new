"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Plane, DollarSign, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getAircraftById } from "@/lib/aircraft-data"

// Mock NETLINE feed data
interface DelayData {
  id: string
  flight: string
  registration: string
  scheduledDeparture: string
  estimatedDeparture: string
  origin: string
  destination: string
  delayStatus: "probable" | "imminent" | "aog" | "ontime"
  delayMinutes: number
  delayCode?: string
  delayReason?: string
  faultRelation?: {
    faultId: string
    description: string
    system: string
    impact: "high" | "medium" | "low"
  }
  passengerCount: number
  connectingFlights: number
  crewImpact: boolean
  maintenanceSlotImpact: boolean
}

// Update the component props to accept an aircraft object and status
interface DelayImpactPanelProps {
  aircraft: {
    id: string
    registration: string
    type: string
    estimatedDelay?: number
    delayReason?: string
    destination?: string
    origin?: string
    flightPhase?: "arriving" | "arrived" | "departing"
  }
  status: "on-time" | "probable-delay" | "imminent-delay" | "aog"
}

const mockNetlineData: DelayData[] = [
  {
    id: "DL1001",
    flight: "AC123",
    registration: "C-FGDT",
    scheduledDeparture: "2023-05-15T14:30:00Z",
    estimatedDeparture: "2023-05-15T17:30:00Z",
    origin: "YYZ",
    destination: "LHR",
    delayStatus: "aog",
    delayMinutes: 180,
    delayCode: "41",
    delayReason: "Aircraft technical issue - Engine failure",
    faultRelation: {
      faultId: "F-2023-0456",
      description: "Engine #2 failure",
      system: "Propulsion",
      impact: "high",
    },
    passengerCount: 342,
    connectingFlights: 15,
    crewImpact: true,
    maintenanceSlotImpact: true,
  },
  {
    id: "DL1002",
    flight: "AC456",
    registration: "C-GITS",
    scheduledDeparture: "2023-05-15T16:15:00Z",
    estimatedDeparture: "2023-05-15T18:15:00Z",
    origin: "YUL",
    destination: "CDG",
    delayStatus: "imminent",
    delayMinutes: 120,
    delayCode: "42",
    delayReason: "Aircraft technical issue - Hydraulic system leak",
    faultRelation: {
      faultId: "F-2023-0457",
      description: "Hydraulic system leak in landing gear",
      system: "Hydraulics",
      impact: "medium",
    },
    passengerCount: 298,
    connectingFlights: 8,
    crewImpact: true,
    maintenanceSlotImpact: false,
  },
  {
    id: "DL1003",
    flight: "AC789",
    registration: "C-FPCA",
    scheduledDeparture: "2023-05-15T18:45:00Z",
    estimatedDeparture: "2023-05-15T19:45:00Z",
    origin: "YVR",
    destination: "NRT",
    delayStatus: "probable",
    delayMinutes: 60,
    delayCode: "43",
    delayReason: "Aircraft technical issue - Avionics fault",
    faultRelation: {
      faultId: "F-2023-0458",
      description: "Navigation system error",
      system: "Avionics",
      impact: "low",
    },
    passengerCount: 325,
    connectingFlights: 12,
    crewImpact: false,
    maintenanceSlotImpact: false,
  },
  {
    id: "DL1004",
    flight: "AC555",
    registration: "C-GKWJ",
    scheduledDeparture: "2023-05-15T20:00:00Z",
    estimatedDeparture: "2023-05-15T20:00:00Z",
    origin: "YYC",
    destination: "MEX",
    delayStatus: "ontime",
    delayMinutes: 0,
    passengerCount: 189,
    connectingFlights: 5,
    crewImpact: false,
    maintenanceSlotImpact: false,
  },
  {
    id: "DL1005",
    flight: "AC202",
    registration: "C-FMXC",
    scheduledDeparture: "2023-05-15T21:30:00Z",
    estimatedDeparture: "2023-05-15T22:15:00Z",
    origin: "YYZ",
    destination: "LAX",
    delayStatus: "probable",
    delayMinutes: 45,
    delayCode: "81",
    delayReason: "Weather conditions at destination",
    passengerCount: 212,
    connectingFlights: 7,
    crewImpact: false,
    maintenanceSlotImpact: false,
  },
  {
    id: "DL1006",
    flight: "AC890",
    registration: "C-GHPQ",
    scheduledDeparture: "2023-05-16T06:15:00Z",
    estimatedDeparture: "2023-05-16T09:15:00Z",
    origin: "YYC",
    destination: "YYZ",
    delayStatus: "imminent",
    delayMinutes: 180,
    delayCode: "44",
    delayReason: "Aircraft technical issue - Scheduled maintenance overrun",
    faultRelation: {
      faultId: "F-2023-0459",
      description: "Extended maintenance required",
      system: "Multiple",
      impact: "medium",
    },
    passengerCount: 156,
    connectingFlights: 10,
    crewImpact: true,
    maintenanceSlotImpact: true,
  },
]

export function DelayImpactPanel() {
  const searchParams = useSearchParams()
  const flightId = searchParams.get("id")
  const [aircraft, setAircraft] = useState(null)

  useEffect(() => {
    if (flightId) {
      const aircraftData = getAircraftById(flightId)
      setAircraft(aircraftData)
    }
  }, [flightId])

  if (!aircraft) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select an aircraft from the Fleet Overview to view delay impact details</p>
      </div>
    )
  }

  // Now use aircraft data in your component
  const {
    status,
    registration,
    type,
    gate,
    destination,
    origin,
    scheduledDepartureTime,
    estimatedDepartureTime,
    delayReason,
    estimatedDelay,
    impactDetails,
  } = aircraft

  // Determine impact levels based on status
  const operationalImpact =
    status === "aog" ? 100 : status === "imminent-delay" ? 75 : status === "probable-delay" ? 50 : 10
  const passengerImpact =
    status === "aog" ? 90 : status === "imminent-delay" ? 70 : status === "probable-delay" ? 40 : 5
  const financialImpact =
    status === "aog" ? 95 : status === "imminent-delay" ? 65 : status === "probable-delay" ? 45 : 8

  // Calculate downstream effects
  const affectedFlights = status === "aog" ? 5 : status === "imminent-delay" ? 3 : status === "probable-delay" ? 1 : 0
  const estimatedCost =
    status === "aog" ? 25000 : status === "imminent-delay" ? 12000 : status === "probable-delay" ? 5000 : 0

  return (
    <div className="space-y-6">
      {flightId && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Flight {flightId}</h2>
            {registration && <p className="text-muted-foreground">Aircraft: {registration}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Operational Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{operationalImpact}%</div>
              <div
                className={cn(
                  "rounded-full w-2 h-2",
                  operationalImpact > 70
                    ? "bg-red-500"
                    : operationalImpact > 40
                      ? "bg-amber-500"
                      : operationalImpact > 20
                        ? "bg-yellow-500"
                        : "bg-green-500",
                )}
              />
            </div>
            <Progress value={operationalImpact} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Passenger Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{passengerImpact}%</div>
              <div
                className={cn(
                  "rounded-full w-2 h-2",
                  passengerImpact > 70
                    ? "bg-red-500"
                    : passengerImpact > 40
                      ? "bg-amber-500"
                      : passengerImpact > 20
                        ? "bg-yellow-500"
                        : "bg-green-500",
                )}
              />
            </div>
            <Progress value={passengerImpact} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Financial Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{financialImpact}%</div>
              <div
                className={cn(
                  "rounded-full w-2 h-2",
                  financialImpact > 70
                    ? "bg-red-500"
                    : financialImpact > 40
                      ? "bg-amber-500"
                      : financialImpact > 20
                        ? "bg-yellow-500"
                        : "bg-green-500",
                )}
              />
            </div>
            <Progress value={financialImpact} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Downstream Effects</CardTitle>
          <CardDescription>Impact on connected flights and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Affected Flights</h4>
                <div className="flex items-center">
                  <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-xl font-bold">{affectedFlights}</span>
                </div>
                {affectedFlights > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {aircraft.flightPhase === "arriving" || aircraft.flightPhase === "arrived"
                      ? `Impacts on connecting flights from ${aircraft.origin || "origin"}`
                      : `Impacts on connecting flights to ${aircraft.destination || "destination"}`}
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Estimated Cost</h4>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-xl font-bold">${estimatedCost.toLocaleString()}</span>
                </div>
                {estimatedCost > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Includes crew, passenger compensation, and operational costs
                  </p>
                )}
              </div>
            </div>

            {aircraft.delayReason && (
              <div>
                <h4 className="text-sm font-medium mb-2">Delay Reason</h4>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Issue Identified</AlertTitle>
                  <AlertDescription>{aircraft.delayReason}</AlertDescription>
                </Alert>
              </div>
            )}

            {status !== "on-time" && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                <div className="space-y-2">
                  {status === "aog" && (
                    <>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                        <span>Initiate AOG response protocol immediately</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                        <span>Contact maintenance team for emergency response</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                        <span>Prepare passenger rebooking options</span>
                      </div>
                    </>
                  )}
                  {status === "imminent-delay" && (
                    <>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                        <span>Prepare maintenance team for potential issues</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                        <span>Alert ground operations for possible schedule changes</span>
                      </div>
                    </>
                  )}
                  {status === "probable-delay" && (
                    <>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                        <span>Monitor situation closely</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                        <span>Prepare contingency plans</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
