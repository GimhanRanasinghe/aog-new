import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAircraftById, getDefectsForAircraft } from "@/lib/aircraft-data"
import { AlertCircle, ArrowLeft, Calendar, Clock, Filter, PenToolIcon as Tool, Search } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function AircraftDefectsPage({ params }: { params: { id: string } }) {
  const aircraft = getAircraftById(params.id)

  if (!aircraft) {
    notFound()
  }

  const defects = getDefectsForAircraft(params.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      case "high":
        return <Badge className="bg-amber-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>
      case "in-progress":
        return <Badge className="bg-amber-500">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "deferred":
        return <Badge className="bg-purple-500">Deferred</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        {/* <Link href={`/aircraft/${params.id}`}> */}
        <Link href={`/dashboard/fleet-overview?highlight=${params.id}`}>
          {/* dashboard/fleet-overview?highlight=AC118 */}
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {aircraft.registration} ({aircraft.type}) - All Defects
        </h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Aircraft Defects</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search defects..." className="pl-8 w-[250px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="deferred">Deferred</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Defects</TabsTrigger>
              <TabsTrigger value="all">All Defects</TabsTrigger>
              <TabsTrigger value="deferred">Deferred</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4">
              {defects.filter((d) => d.status !== "resolved").length > 0 ? (
                defects
                  .filter((d) => d.status !== "resolved")
                  .map((defect) => (
                    <DefectCard
                      key={defect.id}
                      defect={defect}
                      formatDate={formatDate}
                      getPriorityBadge={getPriorityBadge}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No active defects found for this aircraft.
                </div>
              )}
            </TabsContent>
            <TabsContent value="all" className="space-y-4">
              {defects.length > 0 ? (
                defects.map((defect) => (
                  <DefectCard
                    key={defect.id}
                    defect={defect}
                    formatDate={formatDate}
                    getPriorityBadge={getPriorityBadge}
                    getStatusBadge={getStatusBadge}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">No defects found for this aircraft.</div>
              )}
            </TabsContent>
            <TabsContent value="deferred" className="space-y-4">
              {defects.filter((d) => d.status === "deferred").length > 0 ? (
                defects
                  .filter((d) => d.status === "deferred")
                  .map((defect) => (
                    <DefectCard
                      key={defect.id}
                      defect={defect}
                      formatDate={formatDate}
                      getPriorityBadge={getPriorityBadge}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No deferred defects found for this aircraft.
                </div>
              )}
            </TabsContent>
            <TabsContent value="resolved" className="space-y-4">
              {defects.filter((d) => d.status === "resolved").length > 0 ? (
                defects
                  .filter((d) => d.status === "resolved")
                  .map((defect) => (
                    <DefectCard
                      key={defect.id}
                      defect={defect}
                      formatDate={formatDate}
                      getPriorityBadge={getPriorityBadge}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No resolved defects found for this aircraft.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

type Defect = {
  id: string
  description: string
  system?: string
  subsystem?: string
  ataChapter?: string
  reportedDate: string
  status: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedResolution?: string
  assignedTo?: string
  reportedBy?: string
  location?: string
  category?: string
  deferralRef?: string
  deferredUntil?: string
}

function DefectCard({
  defect,
  formatDate,
  getPriorityBadge,
  getStatusBadge,
}: {
  defect: Defect
  formatDate: (date: string) => string
  getPriorityBadge: (priority: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
}) {
  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-amber-400">{defect.id}</span>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityBadge(defect.priority)}
          {getStatusBadge(defect.status)}
        </div>
      </div>

      <p className="mb-3 text-lg font-medium">{defect.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm mb-4">
        {defect.system && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">System:</p>
            <p>{defect.system}</p>
          </div>
        )}

        {defect.subsystem && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">Subsystem:</p>
            <p>{defect.subsystem}</p>
          </div>
        )}

        {defect.ataChapter && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">ATA Chapter:</p>
            <p>{defect.ataChapter}</p>
          </div>
        )}

        {defect.location && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">Location:</p>
            <p>{defect.location}</p>
          </div>
        )}

        {defect.category && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">Category:</p>
            <p>{defect.category}</p>
          </div>
        )}

        {defect.reportedBy && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">Reported By:</p>
            <p>{defect.reportedBy}</p>
          </div>
        )}

        {defect.assignedTo && (
          <div className="flex items-center gap-2">
            <p className="text-gray-400">Assigned To:</p>
            <p>{defect.assignedTo}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Reported: {formatDate(defect.reportedDate)}</span>
        </div>

        {defect.estimatedResolution && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Est. Resolution: {defect.estimatedResolution}</span>
          </div>
        )}

        {defect.assignedTo && (
          <div className="flex items-center gap-1">
            <Tool className="h-3 w-3" />
            <span>Assigned to: {defect.assignedTo}</span>
          </div>
        )}

        {defect.deferredUntil && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Deferred until: {formatDate(defect.deferredUntil)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
