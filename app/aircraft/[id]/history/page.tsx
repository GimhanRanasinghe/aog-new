import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { AlertCircle, Clock, CheckCircle2, FileText, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { ChatButton } from "@/components/chat-button"
import { ataChapters } from "@/components/aog-list"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AircraftHistoryTimeline } from "@/components/aircraft-history-timeline"

// Mock data - in a real app, this would come from a database
const getAircraftData = (id: string) => {
  // This is simplified for the example
  if (id === "AC123" || id === "FIN-1234") {
    return {
      id: id,
      flight: id === "AC123" ? "AC123" : "AC456",
      registration: id === "AC123" ? "C-FGDT" : "G-ABCD",
      type: id === "AC123" ? "Boeing 777-300ER" : "B777-300ER",
      totalFlightHours: 32450,
      lastCheck: "2023-05-15T08:30:00Z",
      status: "aog",
      currentLocation: id === "AC123" ? "Toronto Pearson (YYZ), Gate 53" : "Terminal 5, Gate A23",
      currentIssue: "Engine failure",
      currentAtaChapter: "72",
      currentSubChapter: "72-30",
      currentDescription: "High pressure compressor stall detected during takeoff sequence",
      aogHistory: [
        {
          id: 1,
          startDate: "2023-05-15T08:30:00Z",
          endDate: "2023-05-16T14:00:00Z",
          issue: "Engine failure",
          ataChapter: "72",
          subChapter: "72-30",
          description: "High pressure compressor stall detected during takeoff sequence",
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
        },
        {
          id: 2,
          startDate: "2023-03-20T14:30:00Z",
          endDate: "2023-03-21T08:15:00Z",
          issue: "Fuel system contamination",
          ataChapter: "28",
          subChapter: "28-20",
          description: "Fuel contamination detected during routine sampling",
          rootCause: "Contaminated fuel from ground equipment",
          resolution: "Fuel system drain and flush, filter replacement",
          downtime: "17 hours 45 minutes",
          impact: "Flight cancellations: 2, Delays: 4",
          teamLead: "Carlos Rodriguez",
          documents: [
            { id: 1, name: "Fuel Quality Report", url: "#" },
            { id: 2, name: "Maintenance Action Report", url: "#" },
          ],
        },
        {
          id: 3,
          startDate: "2023-01-10T09:15:00Z",
          endDate: "2023-01-10T18:30:00Z",
          issue: "Navigation system failure",
          ataChapter: "34",
          subChapter: "34-25",
          description: "Navigation display system showing intermittent failures during pre-flight checks",
          rootCause: "Software bug in navigation computer",
          resolution: "Software update and system reset",
          downtime: "9 hours 15 minutes",
          impact: "Flight delays: 2",
          teamLead: "Maria Garcia",
          documents: [
            { id: 1, name: "Software Update Log", url: "#" },
            { id: 2, name: "System Test Report", url: "#" },
          ],
        },
      ],
      faultHistory: [
        {
          id: 1,
          date: "2023-04-10T11:30:00Z",
          system: "Air Conditioning",
          ataChapter: "21",
          subChapter: "21-50",
          description: "Temperature control fault in zone 2",
          action: "Sensor replacement",
          technician: "David Chen",
        },
        {
          id: 2,
          date: "2023-02-15T14:45:00Z",
          system: "Cabin Pressurization",
          ataChapter: "21",
          subChapter: "21-30",
          description: "Intermittent pressure fluctuation",
          action: "Controller recalibration",
          technician: "Sarah Johnson",
        },
        {
          id: 3,
          date: "2023-01-05T09:20:00Z",
          system: "Entertainment System",
          ataChapter: "23",
          subChapter: "23-40",
          description: "System reboot required in business class",
          action: "Software update and reset",
          technician: "Ahmed Hassan",
        },
      ],
      maintenanceChecks: [
        {
          id: 1,
          date: "2023-04-20T08:00:00Z",
          type: "A Check",
          location: "Maintenance Hangar 2",
          findings: "Minor issues addressed",
          nextDue: "2023-07-20T00:00:00Z",
        },
        {
          id: 2,
          date: "2022-10-15T08:00:00Z",
          type: "C Check",
          location: "Maintenance Hangar 1",
          findings: "All systems within parameters",
          nextDue: "2024-10-15T00:00:00Z",
        },
      ],
    }
  } else if (id === "AC456") {
    return {
      id: id,
      flight: "AC456",
      registration: "C-GITS",
      type: "Airbus A330-300",
      totalFlightHours: 28750,
      lastCheck: "2023-05-15T10:15:00Z",
      status: "aog",
      currentLocation: "Montreal (YUL), Gate 12",
      currentIssue: "Hydraulic system leak",
      currentAtaChapter: "29",
      currentSubChapter: "29-10",
      currentDescription: "Main hydraulic system pressure loss due to leak in landing gear actuator",
      aogHistory: [
        {
          id: 1,
          startDate: "2023-05-15T10:15:00Z",
          endDate: "2023-05-15T18:00:00Z",
          issue: "Hydraulic system leak",
          ataChapter: "29",
          subChapter: "29-10",
          description: "Main hydraulic system pressure loss due to leak in landing gear actuator",
          rootCause: "Worn seal in landing gear hydraulic system",
          resolution: "Seal replacement and hydraulic fluid refill",
          downtime: "7 hours 45 minutes",
          impact: "Flight delays: 2",
          teamLead: "Sarah Johnson",
          documents: [
            { id: 1, name: "Maintenance Log", url: "#" },
            { id: 2, name: "Parts Replacement Record", url: "#" },
          ],
        },
      ],
      faultHistory: [
        {
          id: 1,
          date: "2023-05-01T10:30:00Z",
          system: "Hydraulic",
          ataChapter: "29",
          subChapter: "29-10",
          description: "Minor hydraulic pressure fluctuation",
          action: "System inspection",
          technician: "Carlos Rodriguez",
        },
      ],
      maintenanceChecks: [
        {
          id: 1,
          date: "2023-04-15T08:00:00Z",
          type: "A Check",
          location: "Maintenance Hangar 1",
          findings: "All systems within parameters",
          nextDue: "2023-07-15T00:00:00Z",
        },
      ],
    }
  }
  return null
}

export default function AircraftHistoryPage({ params }: { params: { id: string } }) {
  const aircraftData = getAircraftData(params.id)

  if (!aircraftData) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aog":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aog":
        return <Badge variant="destructive">AOG</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Maintenance
          </Badge>
        )
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Operational
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(aircraftData.status)}
            <h1 className="text-2xl font-bold tracking-tight">
              {aircraftData.flight
                ? `${aircraftData.flight} (${aircraftData.registration})`
                : `${aircraftData.registration}`}
            </h1>
            {getStatusBadge(aircraftData.status)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Download History</Button>
            {aircraftData.status === "aog" && <ChatButton groupId="group-1" label="Join AOG Response" />}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aircraft Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Aircraft Type</h3>
                <p className="text-lg font-semibold">{aircraftData.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Flight Hours</h3>
                <p className="text-lg font-semibold">{aircraftData.totalFlightHours}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Location</h3>
                <p className="text-lg font-semibold">{aircraftData.currentLocation}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Check</h3>
                <p className="text-lg font-semibold">{formatDate(aircraftData.lastCheck)}</p>
              </div>
              {aircraftData.currentIssue && (
                <>
                  <div className="md:col-span-2 lg:col-span-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Current Issue</h3>
                    <p className="text-lg font-semibold text-red-600">{aircraftData.currentIssue}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <h3 className="text-sm font-medium text-muted-foreground">ATA Chapter</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        {aircraftData.currentAtaChapter}
                      </Badge>
                      <span className="font-semibold">{ataChapters[aircraftData.currentAtaChapter]}</span>
                      <span className="text-sm text-muted-foreground">({aircraftData.currentSubChapter})</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{aircraftData.currentDescription}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="aog" className="space-y-4">
          <TabsList>
            {params.id === "FIN-1234" && <TabsTrigger value="timeline">Timeline View</TabsTrigger>}
            <TabsTrigger value="aog">AOG History</TabsTrigger>
            <TabsTrigger value="faults">Fault History</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance Checks</TabsTrigger>
          </TabsList>

          {params.id === "FIN-1234" && (
            <TabsContent value="timeline" className="space-y-4">
              <AircraftHistoryTimeline aircraftFin={aircraftData.id} aircraftReg={aircraftData.registration} />
            </TabsContent>
          )}

          <TabsContent value="aog" className="space-y-4">
            {aircraftData.aogHistory.map((aog) => (
              <Card key={aog.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{aog.issue}</CardTitle>
                    <Badge variant="destructive">AOG</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(aog.startDate)} - {formatDate(aog.endDate)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">ATA Chapter</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-800">
                          {aog.ataChapter}
                        </Badge>
                        <span>{ataChapters[aog.ataChapter]}</span>
                        <span className="text-sm text-muted-foreground">({aog.subChapter})</span>
                      </div>
                      <p className="mt-1 text-sm">{aog.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Root Cause</h3>
                      <p className="text-sm">{aog.rootCause}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Resolution</h3>
                      <p className="text-sm">{aog.resolution}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Downtime</h3>
                      <p className="text-sm">{aog.downtime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Impact</h3>
                      <p className="text-sm">{aog.impact}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Team Lead</h3>
                      <p className="text-sm">{aog.teamLead}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Documentation</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {aog.documents.map((doc) => (
                          <Button key={doc.id} variant="outline" size="sm" className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{doc.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="faults" className="space-y-4">
            {aircraftData.faultHistory.map((fault) => (
              <Card key={fault.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{fault.system}</CardTitle>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Fault
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(fault.date)}</div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">ATA Chapter</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-800">
                          {fault.ataChapter}
                        </Badge>
                        <span>{ataChapters[fault.ataChapter]}</span>
                        <span className="text-sm text-muted-foreground">({fault.subChapter})</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm">{fault.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Action Taken</h3>
                      <p className="text-sm">{fault.action}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Technician</h3>
                      <p className="text-sm">{fault.technician}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            {aircraftData.maintenanceChecks.map((check) => (
              <Card key={check.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{check.type}</CardTitle>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Maintenance
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(check.date)}</div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p className="text-sm">{check.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Findings</h3>
                      <p className="text-sm">{check.findings}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Next Due</h3>
                      <p className="text-sm">{formatDate(check.nextDue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
