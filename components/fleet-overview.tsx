"use client"

import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, ArrowRight, Plane, Calendar, AlertCircle, Filter, Clock } from "lucide-react"
import { type Aircraft, aircraftData, stations } from "@/lib/aircraft-data"
import { ChatPortal } from "@/components/chat-portal"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AircraftDefects } from "@/components/aircraft-defects"
import { useSearchParams } from "next/navigation"

export function FleetOverview() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [aircraft, setAircraft] = useState<Aircraft[]>(aircraftData)
  const [selectedStation, setSelectedStation] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("details")
  const expandedRowRef = useRef<HTMLTableRowElement>(null)
  const highlightedRowRef = useRef<HTMLTableRowElement>(null)
  const searchParams = useSearchParams()

  // Check for highlighted aircraft from URL parameter or sessionStorage
  useEffect(() => {
    const highlightId = searchParams?.get("highlight") || sessionStorage.getItem("highlightedAircraft")

    if (highlightId) {
      // Expand the highlighted row
      setExpandedRow(highlightId)
      setActiveTab("details")

      // Clear the sessionStorage after using it
      sessionStorage.removeItem("highlightedAircraft")

      // Check if we should show aircraft details tab
      const showDetails = sessionStorage.getItem("showAircraftDetails")
      if (showDetails) {
        setActiveTab("details")
        sessionStorage.removeItem("showAircraftDetails")
      }

      // Scroll to the highlighted row after a short delay to ensure rendering
      setTimeout(() => {
        if (highlightedRowRef.current) {
          highlightedRowRef.current.scrollIntoView({ behavior: "smooth", block: "start" })

          // Add a temporary highlight effect
          highlightedRowRef.current.classList.add("bg-yellow-100", "dark:bg-yellow-900/20")
          setTimeout(() => {
            highlightedRowRef.current?.classList.remove("bg-yellow-100", "dark:bg-yellow-900/20")
          }, 2000)
        }
      }, 100)
    }
  }, [searchParams])

  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null)
    } else {
      setExpandedRow(id)
      setActiveTab("details")
    }
  }

  // Scroll to the expanded row when it changes
  useEffect(() => {
    if (expandedRow && expandedRowRef.current) {
      expandedRowRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [expandedRow])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "maintenance":
        return <Badge className="bg-blue-500">Maintenance</Badge>
      case "aog":
        return <Badge className="bg-red-500">AOG</Badge>
      case "scheduled":
        return <Badge className="bg-amber-500">Scheduled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getFlightStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-green-500">On Time</Badge>
      case "delayed":
        return <Badge className="bg-amber-500">Delayed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "probable-delay":
        return <Badge className="bg-yellow-500">Probable Delay</Badge>
      case "imminent-delay":
        return <Badge className="bg-amber-500">Imminent Delay</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filterAircraftByStation = (station: string) => {
    if (station === "all") {
      setAircraft(aircraftData)
    } else {
      setAircraft(aircraftData.filter((ac) => ac.location === station))
    }
    setSelectedStation(station)
  }

  // Check if this aircraft is the one highlighted from terminal view
  const isHighlightedAircraft = (id: string) => {
    const highlightId = searchParams?.get("highlight")
    return highlightId === id
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded-md">
        <div className="text-sm text-muted-foreground">{aircraft.length} aircraft</div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Airport:</span>
          <Select value={selectedStation} onValueChange={filterAircraftByStation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Airport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Airports</SelectItem>
              {stations.map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  {station.code} - {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Aircraft</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Next Flight</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Flight Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aircraft.map((ac) => (
              <>
                <TableRow
                  key={ac.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    isHighlightedAircraft(ac.id) ? "bg-yellow-100 dark:bg-yellow-900/20" : ""
                  }`}
                  onClick={() => toggleRow(ac.id)}
                  ref={(el) => {
                    // Set both refs if this is the expanded row and the highlighted row
                    if (expandedRow === ac.id) expandedRowRef.current = el
                    if (isHighlightedAircraft(ac.id)) highlightedRowRef.current = el
                  }}
                >
                  <TableCell>
                    {expandedRow === ac.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ac.id} ({ac.registration})
                  </TableCell>
                  <TableCell>{ac.type}</TableCell>
                  <TableCell>{getStatusBadge(ac.status)}</TableCell>
                  <TableCell>
                    {ac.location}
                    {ac.gate && <span className="text-xs text-muted-foreground ml-1">Gate {ac.gate}</span>}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight
                      ? ac.nextFlight.flightNumber
                      : ac.status === "maintenance"
                        ? "In Maintenance"
                        : "N/A"}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight
                      ? formatDateTime(ac.nextFlight.departureTime)
                      : ac.status === "maintenance"
                        ? formatDateTime(ac.maintenanceStatus!.dueDate)
                        : "N/A"}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight ? (
                      getFlightStatusBadge(ac.nextFlight.status)
                    ) : ac.status === "maintenance" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={ac.maintenanceStatus!.completionPercentage} className="h-2 w-[60px]" />
                        <span className="text-xs">{ac.maintenanceStatus!.completionPercentage}%</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === ac.id && (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Left 2/3 - Aircraft Details */}
                        <div className="col-span-2 bg-gray-900 text-white p-4">
                          {/* Header with Aircraft ID and AOG Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h3 className="text-lg font-medium">
                              {ac.id} ({ac.registration})
                            </h3>
                            {ac.status === "aog" && <Badge className="bg-red-500 ml-2">AOG</Badge>}
                          </div>

                          {/* Route Information */}
                          <div className="flex items-center gap-2 text-sm mb-4">
                            <Plane className="h-4 w-4" />
                            <span>{ac.location}</span>
                            {ac.gate && <span className="text-gray-400">Gate {ac.gate}</span>}
                            {ac.nextFlight && (
                              <>
                                <ArrowRight className="h-4 w-4" />
                                <span>{ac.nextFlight.destination}</span>
                              </>
                            )}
                            <span className="ml-4">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {ac.nextFlight ? new Date(ac.nextFlight.departureTime).toLocaleDateString() : "N/A"}
                            </span>
                          </div>

                          {/* Delay Impact - Only show for AOG or delayed flights */}
                          {(ac.status === "aog" || (ac.nextFlight && ac.nextFlight.status !== "on-time")) && (
                            <div className="mb-2">
                              <p className="text-sm mb-1">Delay Impact</p>
                              <div className="h-2 w-full bg-red-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{
                                    width: ac.nextFlight?.delayMinutes
                                      ? `${Math.min(100, (ac.nextFlight.delayMinutes / 180) * 100)}%`
                                      : "100%",
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-end mt-1">
                                <span className="text-sm text-red-400">
                                  {ac.nextFlight?.delayMinutes || 180} minutes
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Reason - Only show for AOG or delayed flights */}
                          {(ac.status === "aog" || (ac.nextFlight && ac.nextFlight.status !== "on-time")) && (
                            <div className="mb-4">
                              <p className="text-sm">Reason</p>
                              <p>
                                {ac.nextFlight?.delayReason ||
                                  ac.currentFault?.description ||
                                  "Aircraft technical issue"}
                              </p>
                            </div>
                          )}

                          {/* Tabs */}
                          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-gray-800">
                              <TabsTrigger
                                value="details"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                              >
                                Aircraft Details
                              </TabsTrigger>
                              <TabsTrigger
                                value="defects"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                              >
                                Defects
                              </TabsTrigger>
                              <TabsTrigger
                                value="history"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                              >
                                AOG History
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-0">
                              {/* Two Column Layout */}
                              <div className="grid grid-cols-2 gap-8 mb-6">
                                {/* Aircraft Information */}
                                <div>
                                  <h4 className="text-base font-medium mb-4">Aircraft Information</h4>
                                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                    <p className="text-gray-400">Registration:</p>
                                    <p className="text-right">{ac.registration}</p>

                                    <p className="text-gray-400">Type:</p>
                                    <p className="text-right">{ac.type}</p>

                                    <p className="text-gray-400">Station:</p>
                                    <p className="text-right">{ac.location}</p>

                                    <p className="text-gray-400">Gate:</p>
                                    <p className="text-right">{ac.gate || "N/A"}</p>

                                    <p className="text-gray-400">Flight Phase:</p>
                                    <p className="text-right">{ac.flightPhase || "N/A"}</p>

                                    {ac.technicalInfo && (
                                      <>
                                        <p className="text-gray-400">Manufacturer:</p>
                                        <p className="text-right">{ac.technicalInfo.manufacturer}</p>

                                        <p className="text-gray-400">Engine Type:</p>
                                        <p className="text-right">{ac.technicalInfo.engineType}</p>

                                        <p className="text-gray-400">Total Flight Hours:</p>
                                        <p className="text-right">
                                          {ac.technicalInfo.totalFlightHours?.toLocaleString() || "N/A"}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Schedule Information */}
                                <div>
                                  <h4 className="text-base font-medium mb-4">Schedule Information</h4>
                                  {ac.nextFlight ? (
                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                      <p className="text-gray-400">Flight Number:</p>
                                      <p className="text-right">{ac.nextFlight.flightNumber}</p>

                                      <p className="text-gray-400">Destination:</p>
                                      <p className="text-right">{ac.nextFlight.destination}</p>

                                      <p className="text-gray-400">Scheduled Departure:</p>
                                      <p className="text-right">
                                        {ac.nextFlight.scheduledDeparture ||
                                          formatDateTime(ac.nextFlight.departureTime)}
                                      </p>

                                      <p className="text-gray-400">Estimated Departure:</p>
                                      <p
                                        className={`text-right ${ac.nextFlight.status !== "on-time" ? "text-red-400" : ""}`}
                                      >
                                        {ac.nextFlight.estimatedDeparture ||
                                          formatDateTime(ac.nextFlight.departureTime)}
                                      </p>

                                      <p className="text-gray-400">Scheduled Arrival:</p>
                                      <p className="text-right">
                                        {ac.nextFlight.scheduledArrival || formatDateTime(ac.nextFlight.arrivalTime)}
                                      </p>

                                      <p className="text-gray-400">Estimated Arrival:</p>
                                      <p
                                        className={`text-right ${ac.nextFlight.status !== "on-time" ? "text-red-400" : ""}`}
                                      >
                                        {ac.nextFlight.estimatedArrival || formatDateTime(ac.nextFlight.arrivalTime)}
                                      </p>

                                      <p className="text-gray-400">Status:</p>
                                      <p className="text-right">{getFlightStatusBadge(ac.nextFlight.status)}</p>
                                    </div>
                                  ) : ac.status === "maintenance" ? (
                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                      <p className="text-gray-400">Maintenance Type:</p>
                                      <p className="text-right">{ac.maintenanceStatus?.type}</p>

                                      <p className="text-gray-400">Due Date:</p>
                                      <p className="text-right">{formatDateTime(ac.maintenanceStatus!.dueDate)}</p>

                                      <p className="text-gray-400">Completion:</p>
                                      <div className="text-right flex items-center justify-end gap-2">
                                        <Progress
                                          value={ac.maintenanceStatus!.completionPercentage}
                                          className="h-2 w-[60px]"
                                        />
                                        <span>{ac.maintenanceStatus!.completionPercentage}%</span>
                                      </div>

                                      <p className="text-gray-400">Estimated Completion:</p>
                                      <p className="text-right">
                                        {ac.maintenanceStatus?.estimatedCompletion || "Unknown"}
                                      </p>

                                      {ac.maintenanceStatus?.assignedTechnicians && (
                                        <>
                                          <p className="text-gray-400">Assigned Technicians:</p>
                                          <p className="text-right">
                                            {ac.maintenanceStatus.assignedTechnicians.join(", ")}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400">No scheduled flights</p>
                                  )}
                                </div>
                              </div>

                              {/* Current Fault Information - Only show for AOG aircraft */}
                              {ac.status === "aog" && ac.currentFault && (
                                <div>
                                  <h4 className="text-base font-medium mb-4">Current Fault Information</h4>
                                  <div className="bg-gray-800 p-4 rounded-md">
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-400">{ac.currentFault.id}</span>
                                      </div>
                                      <p className="mt-1">{ac.currentFault.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-400">System</p>
                                        <p>{ac.currentFault.system}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Subsystem</p>
                                        <p>{ac.currentFault.subsystem}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">ATA Chapter</p>
                                        <p>{ac.currentFault.ataChapter}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Est. Resolution</p>
                                        <p>{ac.currentFault.estimatedResolution}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Reported</p>
                                        <p>
                                          {ac.currentFault.reportedTime
                                            ? formatDateTime(ac.currentFault.reportedTime)
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Impact</p>
                                        <p className="capitalize">{ac.currentFault.impact || "High"}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 flex">
                                    <Link
                                      href={`/aircraft/${ac.id}/aog-history`}
                                      className="text-blue-400 flex items-center gap-1 text-sm hover:underline"
                                    >
                                      View Complete AOG History
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="defects" className="mt-0">
                              <AircraftDefects defects={ac.defects || []} aircraftId={ac.id} />
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-base font-medium">AOG History</h4>
                                  <Link
                                    href={`/aircraft/${ac.id}/aog-history`}
                                    className="text-blue-400 flex items-center gap-1 text-sm hover:underline"
                                  >
                                    View Complete History
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>
                                </div>

                                <div className="space-y-3">
                                  {/* This would be populated with actual AOG history data */}
                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">May 15, 2023</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">Hydraulic system pressure loss in Green system</p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 8h 10m</span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">Jan 22, 2023</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">Landing gear proximity sensor fault</p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 5h 15m</span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">Nov 15, 2022</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">
                                      Avionics system fault - Navigation display malfunction
                                    </p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 2h 15m</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Right 1/3 - Communication */}
                        <div className="col-span-1 bg-gray-900 border-l border-gray-700">
                          <div className="p-3 border-b border-gray-700">
                            <h3 className="font-medium text-white">Communication</h3>
                          </div>
                          <div className="h-[600px]">
                            <ChatPortal
                              open={true}
                              onOpenChange={() => {}}
                              aircraftId={ac.id}
                              aircraftReg={ac.registration}
                              simplified={true}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

