import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock, PenToolIcon as Tool, Calendar, ArrowUpRight } from "lucide-react"
import Link from "next/link"

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

interface AircraftDefectsProps {
  defects: Defect[]
  aircraftId: string
}

export function AircraftDefects({ defects, aircraftId }: AircraftDefectsProps) {
  // If no defects are provided, use mock data
  const displayDefects =
    defects.length > 0
      ? defects
      : [
          {
            id: "DEF-2023-0123",
            description: "Cabin overhead bin latch malfunction in row 23",
            system: "Cabin Interior",
            subsystem: "Overhead Bins",
            ataChapter: "ATA 25-21-00",
            reportedDate: "2023-05-10T14:30:00Z",
            status: "deferred",
            priority: "low",
            estimatedResolution: "Next C-Check",
            assignedTo: "Maintenance Planning",
            reportedBy: "Cabin Crew",
            location: "Cabin - Row 23",
            category: "Non-MEL",
            deferralRef: "DEF-2023-0045",
            deferredUntil: "2023-08-15T00:00:00Z",
          },
          {
            id: "DEF-2023-0124",
            description: "Galley water heater intermittent operation",
            system: "Galley",
            subsystem: "Water System",
            ataChapter: "ATA 25-30-00",
            reportedDate: "2023-05-12T09:15:00Z",
            status: "open",
            priority: "medium",
            estimatedResolution: "48 hours",
            assignedTo: "John Smith",
            reportedBy: "Cabin Crew",
            location: "Forward Galley",
            category: "MEL C",
          },
          {
            id: "DEF-2023-0125",
            description: "Lavatory smoke detector test failure",
            system: "Environmental Control",
            subsystem: "Smoke Detection",
            ataChapter: "ATA 26-15-00",
            reportedDate: "2023-05-14T16:45:00Z",
            status: "in-progress",
            priority: "high",
            estimatedResolution: "24 hours",
            assignedTo: "Maria Rodriguez",
            reportedBy: "Maintenance",
            location: "Aft Lavatory",
            category: "MEL B",
          },
        ]

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-medium">Aircraft Defects</h4>
          <Link
            href={`/aircraft/${aircraftId}/defects`}
            className="text-blue-400 flex items-center gap-1 text-sm hover:underline"
          >
            View All Defects
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {displayDefects.map((defect) => (
            <div key={defect.id} className="bg-gray-800 p-4 rounded-md">
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

              <p className="mb-3">{defect.description}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {defect.system && (
                  <>
                    <p className="text-gray-400">System:</p>
                    <p>{defect.system}</p>
                  </>
                )}

                {defect.subsystem && (
                  <>
                    <p className="text-gray-400">Subsystem:</p>
                    <p>{defect.subsystem}</p>
                  </>
                )}

                {defect.ataChapter && (
                  <>
                    <p className="text-gray-400">ATA Chapter:</p>
                    <p>{defect.ataChapter}</p>
                  </>
                )}

                {defect.location && (
                  <>
                    <p className="text-gray-400">Location:</p>
                    <p>{defect.location}</p>
                  </>
                )}

                {defect.category && (
                  <>
                    <p className="text-gray-400">Category:</p>
                    <p>{defect.category}</p>
                  </>
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
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
