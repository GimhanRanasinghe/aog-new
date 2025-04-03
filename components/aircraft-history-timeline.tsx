"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  Wrench,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types for our timeline events
type EventType = "aog" | "fault" | "maintenance" | "check"

interface TimelineEvent {
  id: number
  type: EventType
  date: string
  title: string
  description: string
  duration?: string
  impact?: string
  rootCause?: string
  resolution?: string
  documents?: { id: number; name: string; url: string }[]
  relatedEvents?: number[] // IDs of related events
  severity?: "critical" | "major" | "minor"
  system?: string
  location?: string
  teamLead?: string
}

// Mock data for the timeline
const mockTimelineData: TimelineEvent[] = [
  {
    id: 1,
    type: "aog",
    date: "2023-05-15T08:30:00Z",
    title: "Engine failure",
    description: "Aircraft grounded due to engine failure",
    duration: "29 hours 30 minutes",
    impact: "Flight cancellations: 3, Delays: 5",
    rootCause: "Compressor stall due to foreign object damage",
    resolution: "Engine component replacement and full inspection",
    documents: [
      { id: 1, name: "Incident Report", url: "#" },
      { id: 2, name: "Repair Documentation", url: "#" },
    ],
    relatedEvents: [2, 3],
    severity: "critical",
    system: "Propulsion",
    location: "Terminal 5, Gate A23",
    teamLead: "John Smith",
  },
  {
    id: 2,
    type: "fault",
    date: "2023-05-14T16:45:00Z",
    title: "Engine vibration warning",
    description: "Unusual vibration detected in engine #2",
    rootCause: "Early indication of foreign object damage",
    resolution: "Initial inspection performed, aircraft continued operation with monitoring",
    severity: "minor",
    system: "Propulsion",
    relatedEvents: [1],
  },
  {
    id: 3,
    type: "maintenance",
    date: "2023-05-10T09:00:00Z",
    title: "Routine engine inspection",
    description: "Scheduled maintenance check of all engines",
    resolution: "All parameters within normal range",
    system: "Propulsion",
    relatedEvents: [1, 2],
  },
  {
    id: 4,
    type: "aog",
    date: "2023-03-20T14:30:00Z",
    title: "Fuel system contamination",
    description: "Aircraft grounded due to contaminated fuel",
    duration: "17 hours 45 minutes",
    impact: "Flight cancellations: 2, Delays: 4",
    rootCause: "Contaminated fuel from ground equipment",
    resolution: "Fuel system drain and flush, filter replacement",
    documents: [
      { id: 3, name: "Fuel Quality Report", url: "#" },
      { id: 4, name: "Maintenance Action Report", url: "#" },
    ],
    severity: "major",
    system: "Fuel",
    location: "Terminal 2, Gate D8",
    teamLead: "Carlos Rodriguez",
  },
  {
    id: 5,
    type: "fault",
    date: "2023-03-19T22:15:00Z",
    title: "Fuel pressure fluctuation",
    description: "Irregular fuel pressure readings during flight",
    rootCause: "Early indication of fuel contamination",
    resolution: "Monitored during flight, reported upon landing",
    severity: "minor",
    system: "Fuel",
    relatedEvents: [4],
  },
  {
    id: 6,
    type: "check",
    date: "2023-03-15T08:00:00Z",
    title: "A Check",
    description: "Regular A Check maintenance",
    resolution: "All systems checked and verified",
    system: "Multiple",
  },
  {
    id: 7,
    type: "aog",
    date: "2023-01-10T09:15:00Z",
    title: "Navigation system failure",
    description: "Aircraft grounded due to navigation system malfunction",
    duration: "9 hours 15 minutes",
    impact: "Flight delays: 2",
    rootCause: "Software bug in navigation computer",
    resolution: "Software update and system reset",
    documents: [
      { id: 5, name: "Software Update Log", url: "#" },
      { id: 6, name: "System Test Report", url: "#" },
    ],
    severity: "major",
    system: "Avionics",
    location: "Maintenance Hangar 3",
    teamLead: "Maria Garcia",
  },
  {
    id: 8,
    type: "fault",
    date: "2023-01-09T14:30:00Z",
    title: "Navigation display intermittent",
    description: "Pilots reported intermittent navigation display issues",
    rootCause: "Software bug affecting display refresh",
    resolution: "Logged for maintenance check",
    severity: "minor",
    system: "Avionics",
    relatedEvents: [7],
  },
  {
    id: 9,
    type: "fault",
    date: "2022-12-05T11:20:00Z",
    title: "Cabin pressure sensor fault",
    description: "Erroneous cabin pressure readings",
    rootCause: "Faulty pressure sensor",
    resolution: "Sensor replacement",
    severity: "minor",
    system: "Environmental Control",
  },
  {
    id: 10,
    type: "check",
    date: "2022-10-15T08:00:00Z",
    title: "C Check",
    description: "Comprehensive C Check maintenance",
    resolution: "All systems within parameters",
    system: "Multiple",
  },
]

export function AircraftHistoryTimeline({
  aircraftFin = "FIN-1234",
  aircraftReg = "G-ABCD",
}: {
  aircraftFin?: string
  aircraftReg?: string
}) {
  // State for filtering and viewing
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>(mockTimelineData)
  const [filteredData, setFilteredData] = useState<TimelineEvent[]>(mockTimelineData)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [viewMode, setViewMode] = useState<"vertical" | "horizontal">("vertical")
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string[]>(["aog", "fault", "maintenance", "check"])
  const [timeRange, setTimeRange] = useState("all")
  const [showRelated, setShowRelated] = useState(true)

  const timelineRef = useRef<HTMLDivElement>(null)

  // Filter the timeline data based on current filters
  useEffect(() => {
    let filtered = timelineData.filter((event) => {
      // Filter by type
      if (!filterType.includes(event.type)) return false

      // Filter by search term
      if (
        searchTerm &&
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Filter by time range
      if (timeRange !== "all") {
        const eventDate = new Date(event.date)
        const now = new Date()

        if (timeRange === "3months") {
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(now.getMonth() - 3)
          if (eventDate < threeMonthsAgo) return false
        } else if (timeRange === "6months") {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(now.getMonth() - 6)
          if (eventDate < sixMonthsAgo) return false
        } else if (timeRange === "1year") {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(now.getFullYear() - 1)
          if (eventDate < oneYearAgo) return false
        }
      }

      return true
    })

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredData(filtered)
  }, [timelineData, filterType, searchTerm, timeRange])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get icon for event type
  const getEventIcon = (type: EventType, severity?: string) => {
    switch (type) {
      case "aog":
        return <AlertCircle className={`h-5 w-5 ${severity === "critical" ? "text-red-600" : "text-orange-500"}`} />
      case "fault":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "maintenance":
        return <Wrench className="h-5 w-5 text-blue-500" />
      case "check":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  // Get badge for event type
  const getEventBadge = (type: EventType, severity?: string) => {
    switch (type) {
      case "aog":
        if (severity === "critical") {
          return <Badge variant="destructive">Critical AOG</Badge>
        }
        return <Badge variant="destructive">AOG</Badge>
      case "fault":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Fault
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Maintenance
          </Badge>
        )
      case "check":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Check
          </Badge>
        )
      default:
        return null
    }
  }

  // Navigate to a specific event
  const navigateToEvent = (eventId: number) => {
    const event = timelineData.find((e) => e.id === eventId)
    if (event) {
      setSelectedEvent(event)

      // Scroll to the event in the timeline
      const eventElement = document.getElementById(`timeline-event-${eventId}`)
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  // Find related events for the selected event
  const getRelatedEvents = () => {
    if (!selectedEvent || !selectedEvent.relatedEvents) return []

    return timelineData.filter((event) => selectedEvent.relatedEvents?.includes(event.id))
  }

  // Zoom controls
  const zoomIn = () => {
    if (zoomLevel < 2) setZoomLevel(zoomLevel + 0.25)
  }

  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.25)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">
          {aircraftFin} ({aircraftReg}) History Timeline
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Event Types</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="filter-aog"
                    checked={filterType.includes("aog")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterType([...filterType, "aog"])
                      } else {
                        setFilterType(filterType.filter((t) => t !== "aog"))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="filter-aog" className="text-sm font-medium">
                    AOG Events
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="filter-fault"
                    checked={filterType.includes("fault")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterType([...filterType, "fault"])
                      } else {
                        setFilterType(filterType.filter((t) => t !== "fault"))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="filter-fault" className="text-sm font-medium">
                    Faults
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="filter-maintenance"
                    checked={filterType.includes("maintenance")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterType([...filterType, "maintenance"])
                      } else {
                        setFilterType(filterType.filter((t) => t !== "maintenance"))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="filter-maintenance" className="text-sm font-medium">
                    Maintenance
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="filter-check"
                    checked={filterType.includes("check")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterType([...filterType, "check"])
                      } else {
                        setFilterType(filterType.filter((t) => t !== "check"))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="filter-check" className="text-sm font-medium">
                    Checks
                  </label>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={zoomOut} disabled={zoomLevel <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomIn} disabled={zoomLevel >= 2}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "vertical" ? "horizontal" : "vertical")}
          >
            {viewMode === "vertical" ? "Horizontal View" : "Vertical View"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Timeline View */}
        <div className={`${selectedEvent ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <Card>
            <CardContent className="p-4">
              {filteredData.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No events found matching your criteria</p>
                </div>
              ) : (
                <div
                  ref={timelineRef}
                  className={`relative ${viewMode === "vertical" ? "space-y-4" : "flex overflow-x-auto pb-4"}`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "top left",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {/* Timeline line */}
                  {viewMode === "vertical" && <div className="absolute left-6 top-0 h-full w-0.5 bg-border" />}

                  {/* Timeline events */}
                  {filteredData.map((event, index) => (
                    <div
                      key={event.id}
                      id={`timeline-event-${event.id}`}
                      className={`
                        relative 
                        ${viewMode === "vertical" ? "ml-6 pl-6" : "min-w-[300px] px-2"}
                        ${selectedEvent?.id === event.id ? "ring-2 ring-primary rounded-lg" : ""}
                      `}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {/* Timeline node */}
                      {viewMode === "vertical" && (
                        <div className="absolute -left-1.5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background">
                          {getEventIcon(event.type, event.severity)}
                        </div>
                      )}

                      <div
                        className={`
                        rounded-lg border p-3 
                        ${event.type === "aog" && event.severity === "critical" ? "border-red-300" : ""}
                        ${event.type === "aog" && event.severity !== "critical" ? "border-orange-300" : ""}
                        ${event.type === "fault" ? "border-amber-300" : ""}
                        ${event.type === "maintenance" ? "border-blue-300" : ""}
                        ${event.type === "check" ? "border-green-300" : ""}
                      `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {viewMode === "horizontal" && getEventIcon(event.type, event.severity)}
                            <span className="font-medium">{event.title}</span>
                          </div>
                          {getEventBadge(event.type, event.severity)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDate(event.date)}
                          {event.duration && ` • ${event.duration}`}
                        </div>
                        <p className="mt-2 text-sm">{event.description}</p>

                        {/* Show related events indicators */}
                        {event.relatedEvents && event.relatedEvents.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Related:</span>
                            {event.relatedEvents.map((relatedId) => {
                              const relatedEvent = timelineData.find((e) => e.id === relatedId)
                              if (!relatedEvent) return null

                              return (
                                <TooltipProvider key={relatedId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigateToEvent(relatedId)
                                        }}
                                      >
                                        {getEventIcon(relatedEvent.type, relatedEvent.severity)}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{relatedEvent.title}</p>
                                      <p className="text-xs">{formatDate(relatedEvent.date)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        {selectedEvent && (
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getEventIcon(selectedEvent.type, selectedEvent.severity)}
                    <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  </div>
                  {getEventBadge(selectedEvent.type, selectedEvent.severity)}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                    <p>{formatDate(selectedEvent.date)}</p>
                  </div>

                  {selectedEvent.duration && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                      <p>{selectedEvent.duration}</p>
                    </div>
                  )}

                  {selectedEvent.system && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">System</h4>
                      <p>{selectedEvent.system}</p>
                    </div>
                  )}

                  {selectedEvent.location && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                      <p>{selectedEvent.location}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p>{selectedEvent.description}</p>
                  </div>

                  {selectedEvent.rootCause && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Root Cause</h4>
                      <p>{selectedEvent.rootCause}</p>
                    </div>
                  )}

                  {selectedEvent.resolution && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Resolution</h4>
                      <p>{selectedEvent.resolution}</p>
                    </div>
                  )}

                  {selectedEvent.impact && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Impact</h4>
                      <p>{selectedEvent.impact}</p>
                    </div>
                  )}

                  {selectedEvent.teamLead && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Team Lead</h4>
                      <p>{selectedEvent.teamLead}</p>
                    </div>
                  )}

                  {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Documentation</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedEvent.documents.map((doc) => (
                          <Button key={doc.id} variant="outline" size="sm" className="flex items-center gap-1" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                              <span>{doc.name}</span>
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Events Section */}
                  {selectedEvent.relatedEvents && selectedEvent.relatedEvents.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">Related Events</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowRelated(!showRelated)}>
                          {showRelated ? "Hide" : "Show"}
                        </Button>
                      </div>

                      {showRelated && (
                        <div className="mt-2 space-y-2">
                          {getRelatedEvents().map((event) => (
                            <div
                              key={event.id}
                              className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-muted"
                              onClick={() => navigateToEvent(event.id)}
                            >
                              <div className="flex items-center gap-2">
                                {getEventIcon(event.type, event.severity)}
                                <div>
                                  <p className="text-sm font-medium">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                                </div>
                              </div>
                              {getEventBadge(event.type, event.severity)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

