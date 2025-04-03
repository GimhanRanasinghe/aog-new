"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  Clock,
  AlertTriangle,
  BarChart,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from a database
const aogHistoryData = [
  {
    id: 1,
    fin: "FIN-1234",
    registration: "G-ABCD",
    type: "B777-300ER",
    startDate: "2023-05-15T08:30:00Z",
    endDate: "2023-05-16T14:00:00Z",
    location: "Terminal 5, Gate A23",
    issue: "Engine failure",
    rootCause: "Compressor stall due to foreign object damage",
    resolution: "Engine component replacement and full inspection",
    downtime: "29 hours 30 minutes",
    impact: "Flight cancellations: 3, Delays: 5",
    teamLead: "John Smith",
    documents: [
      { id: 1, name: "Incident Report", url: "#" },
      { id: 2, name: "Repair Documentation", url: "#" },
      { id: 3, name: "Return to Service Certificate", url: "#" },
    ],
    responseTime: "2 hours 15 minutes",
    partsReplaced: [
      { id: 1, name: "Engine fan blade", partNumber: "EFB-9012-C" },
      { id: 2, name: "Compressor module", partNumber: "CM-3456-D" },
      { id: 3, name: "Control unit", partNumber: "CU-7890-E" },
    ],
    costImpact: "High (>$500,000)",
    maintenancePersonnel: [
      { id: 1, name: "John Smith", role: "Team Lead" },
      { id: 2, name: "Michael Chen", role: "Engine Specialist" },
      { id: 3, name: "Sarah Johnson", role: "Avionics Technician" },
    ],
    delayedFlights: [
      { id: 1, flightNumber: "AC123", delay: "3 hours", destination: "Toronto" },
      { id: 2, flightNumber: "AC456", delay: "2 hours", destination: "Vancouver" },
      { id: 3, flightNumber: "AC789", delay: "Cancelled", destination: "Montreal" },
    ],
    supplierInvolvement: "Rolls-Royce technical support team on-site",
    aogOccurrences: 4,
    previousWork: [
      { date: "2023-01-10", description: "Engine overhaul", technician: "Michael Chen" },
      { date: "2022-11-05", description: "Routine maintenance check", technician: "Sarah Johnson" },
      { date: "2022-08-22", description: "Fuel system inspection", technician: "Robert Williams" },
    ],
    historicalImpacts: [
      { date: "2023-01", description: "Engine replacement", impact: "14 days out of service, 42 cancelled flights" },
      { date: "2022-06", description: "Landing gear issue", impact: "3 days out of service, 12 cancelled flights" },
      { date: "2021-11", description: "Avionics failure", impact: "2 days out of service, 8 cancelled flights" },
    ],
    totalDowntimeLastYear: "46 days",
    totalCostImpactLastYear: "$1.2M",
    reliabilityScore: "Medium (72%)",
  },
  {
    id: 2,
    fin: "FIN-5678",
    registration: "G-WXYZ",
    type: "A320neo",
    startDate: "2023-05-01T10:15:00Z",
    endDate: "2023-05-01T18:00:00Z",
    location: "Terminal 3, Gate B12",
    issue: "Hydraulic system leak",
    rootCause: "Worn seal in landing gear hydraulic system",
    resolution: "Seal replacement and hydraulic fluid refill",
    downtime: "7 hours 45 minutes",
    impact: "Flight delays: 2",
    teamLead: "Sarah Johnson",
    documents: [
      { id: 1, name: "Maintenance Log", url: "#" },
      { id: 2, name: "Parts Replacement Record", url: "#" },
    ],
    maintenancePersonnel: [
      { id: 1, name: "Sarah Johnson", role: "Team Lead" },
      { id: 2, name: "Robert Williams", role: "Hydraulics Specialist" },
    ],
    delayedFlights: [
      { id: 1, flightNumber: "AC234", delay: "1 hour", destination: "Calgary" },
      { id: 2, flightNumber: "AC567", delay: "45 minutes", destination: "Ottawa" },
    ],
    supplierInvolvement: "Airbus technical consultation via remote support",
    aogOccurrences: 2,
    previousWork: [
      { date: "2023-03-15", description: "Hydraulic system maintenance", technician: "Robert Williams" },
      { date: "2023-02-01", description: "Routine inspection", technician: "Emma Wilson" },
    ],
    historicalImpacts: [
      { date: "2023-02", description: "Hydraulic pump failure", impact: "2 days out of service, 6 cancelled flights" },
      { date: "2022-09", description: "Electrical issue", impact: "1 day out of service, 4 cancelled flights" },
    ],
    totalDowntimeLastYear: "8 days",
    totalCostImpactLastYear: "$320K",
    reliabilityScore: "High (89%)",
  },
  {
    id: 3,
    fin: "FIN-9012",
    registration: "G-EFGH",
    type: "B787-9",
    startDate: "2023-04-15T09:45:00Z",
    endDate: "2023-04-15T20:30:00Z",
    location: "Maintenance Hangar 3",
    issue: "Avionics system fault",
    rootCause: "Software error in flight management computer",
    resolution: "Software update and system reset",
    downtime: "10 hours 45 minutes",
    impact: "Flight delays: 3",
    teamLead: "David Chen",
    documents: [
      { id: 1, name: "Avionics Test Report", url: "#" },
      { id: 2, name: "Software Update Log", url: "#" },
    ],
    maintenancePersonnel: [
      { id: 1, name: "David Chen", role: "Team Lead" },
      { id: 2, name: "Emily Wilson", role: "Software Engineer" },
      { id: 3, name: "James Taylor", role: "Avionics Specialist" },
    ],
    delayedFlights: [
      { id: 1, flightNumber: "AC345", delay: "2 hours", destination: "Halifax" },
      { id: 2, flightNumber: "AC678", delay: "1.5 hours", destination: "Edmonton" },
      { id: 3, flightNumber: "AC901", delay: "1 hour", destination: "Winnipeg" },
    ],
    supplierInvolvement: "Boeing software support team remote assistance",
    aogOccurrences: 1,
    previousWork: [
      { date: "2023-02-20", description: "Avionics system upgrade", technician: "Emily Wilson" },
      { date: "2022-12-10", description: "Software patch installation", technician: "James Taylor" },
    ],
    historicalImpacts: [
      {
        date: "2022-10",
        description: "Flight management system failure",
        impact: "1 day out of service, 3 cancelled flights",
      },
    ],
    totalDowntimeLastYear: "3 days",
    totalCostImpactLastYear: "$150K",
    reliabilityScore: "Very High (95%)",
  },
  {
    id: 4,
    fin: "FIN-3456",
    registration: "G-IJKL",
    type: "A350-900",
    startDate: "2023-04-10T11:20:00Z",
    endDate: "2023-04-10T16:45:00Z",
    location: "Remote Stand 42",
    issue: "Landing gear sensor malfunction",
    rootCause: "Faulty proximity sensor",
    resolution: "Sensor replacement and calibration",
    downtime: "5 hours 25 minutes",
    impact: "Flight delays: 1",
    teamLead: "Emma Wilson",
    documents: [
      { id: 1, name: "Component Replacement Form", url: "#" },
      { id: 2, name: "Test Flight Report", url: "#" },
    ],
    aogOccurrences: 3,
    previousWork: [
      { date: "2023-03-05", description: "Landing gear inspection", technician: "Robert Williams" },
      { date: "2023-01-15", description: "Sensor calibration", technician: "James Taylor" },
    ],
    historicalImpacts: [
      {
        date: "2023-01",
        description: "Landing gear actuator failure",
        impact: "4 days out of service, 12 cancelled flights",
      },
      { date: "2022-08", description: "Sensor malfunction", impact: "1 day out of service, 3 cancelled flights" },
    ],
    totalDowntimeLastYear: "7 days",
    totalCostImpactLastYear: "$280K",
    reliabilityScore: "High (85%)",
  },
  {
    id: 5,
    fin: "FIN-1234",
    registration: "G-ABCD",
    type: "B777-300ER",
    startDate: "2023-03-20T14:30:00Z",
    endDate: "2023-03-21T08:15:00Z",
    location: "Terminal 2, Gate D8",
    issue: "Fuel system contamination",
    rootCause: "Contaminated fuel from ground equipment",
    resolution: "Fuel system drain and flush, filter replacement",
    downtime: "17 hours 45 minutes",
    impact: "Flight cancellations: 2, Delays: 4",
    teamLead: "Carlos Rodriguez",
    documents: [
      { id: 1, name: "Fuel Quality Report", url: "#" },
      { id: 2, name: "Maintenance Action Report", url: "#" },
    ],
    aogOccurrences: 4,
    previousWork: [
      { date: "2023-02-10", description: "Fuel system inspection", technician: "Carlos Rodriguez" },
      { date: "2023-01-05", description: "Filter replacement", technician: "Robert Williams" },
    ],
    historicalImpacts: [
      { date: "2022-12", description: "Fuel pump failure", impact: "3 days out of service, 9 cancelled flights" },
      { date: "2022-07", description: "Fuel contamination", impact: "2 days out of service, 6 cancelled flights" },
    ],
    totalDowntimeLastYear: "46 days",
    totalCostImpactLastYear: "$1.2M",
    reliabilityScore: "Medium (72%)",
  },
  {
    id: 6,
    fin: "FIN-5678",
    registration: "G-WXYZ",
    type: "A320neo",
    startDate: "2023-02-15T09:00:00Z",
    endDate: "2023-02-15T15:30:00Z",
    location: "Maintenance Hangar 1",
    issue: "APU failure",
    rootCause: "Electrical fault in APU control unit",
    resolution: "Control unit replacement and wiring repair",
    downtime: "6 hours 30 minutes",
    impact: "Flight delays: 2",
    teamLead: "Ahmed Hassan",
    documents: [
      { id: 1, name: "APU Test Report", url: "#" },
      { id: 2, name: "Electrical System Check", url: "#" },
    ],
    aogOccurrences: 2,
    previousWork: [
      { date: "2023-01-20", description: "APU maintenance", technician: "Ahmed Hassan" },
      { date: "2022-11-15", description: "Electrical system check", technician: "Emily Wilson" },
    ],
    historicalImpacts: [
      { date: "2022-11", description: "APU shutdown", impact: "1 day out of service, 3 cancelled flights" },
      {
        date: "2022-05",
        description: "Electrical system failure",
        impact: "2 days out of service, 6 cancelled flights",
      },
    ],
    totalDowntimeLastYear: "8 days",
    totalCostImpactLastYear: "$320K",
    reliabilityScore: "High (89%)",
  },
]

export function AOGHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [timeframe, setTimeframe] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [aircraftFilter, setAircraftFilter] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<Record<number, string>>({})

  // Get unique aircraft identifiers (FIN/REG)
  const uniqueAircraft = Array.from(new Set(aogHistoryData.map((item) => `${item.fin} (${item.registration})`)))

  // Filter data based on search term, timeframe, and aircraft selection
  const filteredData = aogHistoryData.filter((item) => {
    // Search filter
    const matchesSearch =
      item.fin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rootCause.toLowerCase().includes(searchTerm.toLowerCase())

    // Timeframe filter
    const itemDate = new Date(item.startDate)
    const now = new Date()
    let matchesTimeframe = true

    if (timeframe === "30days") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(now.getDate() - 30)
      matchesTimeframe = itemDate >= thirtyDaysAgo
    } else if (timeframe === "90days") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(now.getDate() - 90)
      matchesTimeframe = itemDate >= ninetyDaysAgo
    } else if (timeframe === "year") {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      matchesTimeframe = itemDate >= oneYearAgo
    }

    // Aircraft filter
    const aircraftIdentifier = `${item.fin} (${item.registration})`
    const matchesAircraft = aircraftFilter.length === 0 || aircraftFilter.includes(aircraftIdentifier)

    return matchesSearch && matchesTimeframe && matchesAircraft
  })

  // Sort by most recent first
  const sortedData = [...filteredData].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const durationMs = endDate.getTime() - startDate.getTime()

    // Convert to hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours} hours ${minutes} minutes`
  }

  const toggleExpand = (id: number) => {
    setExpandedItems((prevItems) =>
      prevItems.includes(id) ? prevItems.filter((item) => item !== id) : [...prevItems, id],
    )

    // Set default active tab when expanding
    if (!activeTab[id]) {
      setActiveTab((prev) => ({ ...prev, [id]: "details" }))
    }
  }

  const handleTabChange = (id: number, tab: string) => {
    setActiveTab((prev) => ({ ...prev, [id]: tab }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by FIN, REG, or issue..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Aircraft</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueAircraft.map((aircraft) => (
                <DropdownMenuCheckboxItem
                  key={aircraft}
                  checked={aircraftFilter.includes(aircraft)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAircraftFilter([...aircraftFilter, aircraft])
                    } else {
                      setAircraftFilter(aircraftFilter.filter((item) => item !== aircraft))
                    }
                  }}
                >
                  {aircraft}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-4">
        {sortedData.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No AOG history found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          sortedData.map((item) => (
            <Card key={item.id} className={expandedItems.includes(item.id) ? "border-primary shadow-md" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-lg">
                    {item.fin} ({item.registration})
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    <span>{item.aogOccurrences} AOG events</span>
                  </Badge>
                  <Badge variant="destructive">AOG</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Aircraft Type:</span>
                    <span className="col-span-2">{item.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Issue:</span>
                    <span className="col-span-2">{item.issue}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Start Time:</span>
                    <span className="col-span-2">{formatDate(item.startDate)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">End Time:</span>
                    <span className="col-span-2">{formatDate(item.endDate)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Downtime:</span>
                    <span className="col-span-2">{item.downtime}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Total Downtime (Year):</span>
                    <span className="col-span-2 font-semibold text-amber-600">{item.totalDowntimeLastYear}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Reliability Score:</span>
                    <span
                      className={`col-span-2 font-semibold ${
                        item.reliabilityScore.includes("High")
                          ? "text-green-600"
                          : item.reliabilityScore.includes("Medium")
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {item.reliabilityScore}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full justify-between hover:bg-muted"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <span>{expandedItems.includes(item.id) ? "Show Less" : "Show Details"}</span>
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedItems.includes(item.id) && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <Tabs
                      value={activeTab[item.id] || "details"}
                      onValueChange={(value) => handleTabChange(item.id, value)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details" className="text-xs">
                          Details
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-xs">
                          History
                        </TabsTrigger>
                        <TabsTrigger value="work" className="text-xs">
                          Work Done
                        </TabsTrigger>
                        <TabsTrigger value="impact" className="text-xs">
                          Impact
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Root Cause Analysis</h3>
                          <p className="text-sm">{item.rootCause}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Resolution</h3>
                          <p className="text-sm">{item.resolution}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Impact</h3>
                          <p className="text-sm">{item.impact}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Team Lead</h3>
                          <p className="text-sm">{item.teamLead}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Location</h3>
                          <p className="text-sm">{item.location}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Response Time</h3>
                          <p className="text-sm">{item.responseTime || Math.floor(Math.random() * 4) + 1 + " hours"}</p>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Parts Replaced</h3>
                          <ul className="list-disc pl-5 text-sm">
                            {item.partsReplaced ? (
                              item.partsReplaced.map((part, index) => (
                                <li key={index}>
                                  {part.name} (P/N: {part.partNumber})
                                </li>
                              ))
                            ) : item.id % 2 === 0 ? (
                              <>
                                <li>Hydraulic pump (P/N: HP-2234-A)</li>
                                <li>Pressure sensor (P/N: PS-5678-B)</li>
                              </>
                            ) : (
                              <>
                                <li>Engine fan blade (P/N: EFB-9012-C)</li>
                                <li>Compressor module (P/N: CM-3456-D)</li>
                                <li>Control unit (P/N: CU-7890-E)</li>
                              </>
                            )}
                          </ul>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Documentation</h3>
                          <div className="flex flex-wrap gap-2">
                            {item.documents.map((doc) => (
                              <Button key={doc.id} variant="outline" size="sm" className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{doc.name}</span>
                              </Button>
                            ))}
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>Maintenance Log</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>Parts Requisition</span>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <History className="h-4 w-4" />
                            AOG History
                          </h3>
                          <div className="rounded-md border">
                            <div className="grid grid-cols-3 gap-4 p-3 font-medium bg-muted text-sm">
                              <div>Date</div>
                              <div>Issue</div>
                              <div>Impact</div>
                            </div>
                            {item.historicalImpacts ? (
                              item.historicalImpacts.map((event, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 p-3 text-sm border-t">
                                  <div>{event.date}</div>
                                  <div>{event.description}</div>
                                  <div className="text-red-600">{event.impact}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-muted-foreground">No historical data available</div>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Recurring Issues
                          </h3>
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Engine-related issues</span>
                              <span className="text-sm text-red-600">{Math.floor(item.id * 1.5)} occurrences</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-red-600"
                                style={{ width: `${Math.min(item.id * 15, 100)}%` }}
                              ></div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium">Hydraulic system issues</span>
                              <span className="text-sm text-amber-600">{Math.floor(item.id * 0.8)} occurrences</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-amber-600"
                                style={{ width: `${Math.min(item.id * 8, 100)}%` }}
                              ></div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium">Avionics issues</span>
                              <span className="text-sm text-green-600">{Math.floor(item.id * 0.5)} occurrences</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-green-600"
                                style={{ width: `${Math.min(item.id * 5, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="work" className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Previous Maintenance Work
                          </h3>
                          <div className="rounded-md border">
                            <div className="grid grid-cols-3 gap-4 p-3 font-medium bg-muted text-sm">
                              <div>Date</div>
                              <div>Description</div>
                              <div>Technician</div>
                            </div>
                            {item.previousWork ? (
                              item.previousWork.map((work, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 p-3 text-sm border-t">
                                  <div>{work.date}</div>
                                  <div>{work.description}</div>
                                  <div>{work.technician}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-muted-foreground">No previous work data available</div>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Maintenance Personnel</h3>
                          {item.maintenancePersonnel ? (
                            <div className="space-y-1">
                              {item.maintenancePersonnel.map((person, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{person.name}</span>
                                  <span className="text-muted-foreground">{person.role}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No personnel data available</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Supplier Involvement</h3>
                          <p className="text-sm">{item.supplierInvolvement || "No supplier involvement recorded"}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="impact" className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <BarChart className="h-4 w-4" />
                            Financial Impact
                          </h3>
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Total Cost Impact (Last Year)</span>
                              <span className="text-sm font-bold text-red-600">
                                {item.totalCostImpactLastYear || "$250K"}
                              </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium">Current Incident Cost</span>
                              <span className="text-sm font-medium">
                                {item.id % 3 === 0
                                  ? "High (>$500,000)"
                                  : item.id % 3 === 1
                                    ? "Medium ($100,000 - $500,000)"
                                    : "Low (<$100,000)"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Affected Flights</h3>
                          {item.delayedFlights ? (
                            <div className="space-y-1">
                              {item.delayedFlights.map((flight, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    Flight {flight.flightNumber} to {flight.destination}
                                  </span>
                                  <span
                                    className={
                                      flight.delay === "Cancelled" ? "text-red-500 font-medium" : "text-amber-500"
                                    }
                                  >
                                    {flight.delay}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No affected flights data available</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Operational Impact</h3>
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Total Downtime (Last Year)</span>
                              <span className="text-sm font-bold text-red-600">
                                {item.totalDowntimeLastYear || "12 days"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Cancelled Flights (Last Year)</span>
                              <span className="text-sm font-bold text-red-600">{Math.floor(item.id * 7)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Delayed Flights (Last Year)</span>
                              <span className="text-sm font-bold text-amber-600">{Math.floor(item.id * 12)}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

