"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, CheckCircle2, Filter, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatButton } from "@/components/chat-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePermission } from "@/lib/auth"

// ATA Chapter definitions
export const ataChapters: Record<string, string> = {
  "21": "Air Conditioning",
  "22": "Auto Flight",
  "23": "Communications",
  "24": "Electrical Power",
  "25": "Equipment/Furnishings",
  "26": "Fire Protection",
  "27": "Flight Controls",
  "28": "Fuel",
  "29": "Hydraulic Power",
  "30": "Ice & Rain Protection",
  "31": "Indicating/Recording Systems",
  "32": "Landing Gear",
  "33": "Lights",
  "34": "Navigation",
  "35": "Oxygen",
  "36": "Pneumatic",
  "38": "Water/Waste",
  "49": "Auxiliary Power Unit",
  "52": "Doors",
  "53": "Fuselage",
  "54": "Nacelles/Pylons",
  "56": "Windows",
  "57": "Wings",
  "71": "Power Plant",
  "72": "Engine",
  "73": "Engine Fuel & Control",
  "74": "Ignition",
  "75": "Air",
  "76": "Engine Controls",
  "77": "Engine Indicating",
  "78": "Exhaust",
  "79": "Oil",
  "80": "Starting",
}

// Mock data - in a real app, this would come from the NETLINE feed
const aogAircraft = [
  {
    id: 1,
    flight: "AC123",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    location: "Toronto Pearson (YYZ), Gate 53",
    station: "YYZ",
    status: "critical",
    issue: "Engine failure",
    ataChapter: "72",
    subChapter: "72-30",
    description: "High pressure compressor stall detected during takeoff sequence",
    timeReported: "2023-05-15T08:30:00Z",
    estimatedRepair: "2023-05-16T14:00:00Z",
    assignedTeam: ["John Smith", "Maria Garcia", "Ahmed Hassan"],
    updates: 12,
  },
  {
    id: 2,
    flight: "AC456",
    registration: "C-GITS",
    type: "Airbus A330-300",
    location: "Montreal (YUL), Gate 12",
    station: "YUL",
    status: "in-progress",
    issue: "Hydraulic system leak",
    ataChapter: "29",
    subChapter: "29-10",
    description: "Main hydraulic system pressure loss due to leak in landing gear actuator",
    timeReported: "2023-05-15T10:15:00Z",
    estimatedRepair: "2023-05-15T18:00:00Z",
    assignedTeam: ["Sarah Johnson", "Carlos Rodriguez"],
    updates: 8,
  },
  {
    id: 3,
    flight: "AC789",
    registration: "C-FTJP",
    type: "Boeing 787-9",
    location: "Vancouver (YVR), Maintenance Hangar 3",
    station: "YVR",
    status: "in-progress",
    issue: "Avionics system fault",
    ataChapter: "34",
    subChapter: "34-25",
    description: "Navigation display system showing intermittent failures during pre-flight checks",
    timeReported: "2023-05-15T09:45:00Z",
    estimatedRepair: "2023-05-15T20:30:00Z",
    assignedTeam: ["David Chen", "Emma Wilson"],
    updates: 5,
  },
  {
    id: 4,
    flight: "AC890",
    registration: "C-GHPQ",
    type: "Airbus A320",
    location: "Calgary (YYC), Remote Stand 42",
    station: "YYC",
    status: "pending",
    issue: "Landing gear sensor malfunction",
    ataChapter: "32",
    subChapter: "32-45",
    description: "Proximity sensor for nose landing gear position indicating fault during retraction test",
    timeReported: "2023-05-15T11:20:00Z",
    estimatedRepair: "2023-05-15T16:45:00Z",
    assignedTeam: [],
    updates: 2,
  },
]

interface AOGListProps {
  stationFilter?: string
}

export function AOGList({ stationFilter = "ALL" }: AOGListProps) {
  const [filter, setFilter] = useState<string[]>(["critical", "in-progress", "pending"])
  const canJoinChat = usePermission("join_chat")

  // Filter by station first
  const stationFilteredAircraft =
    stationFilter === "ALL" ? aogAircraft : aogAircraft.filter((aircraft) => aircraft.station === stationFilter)

  // Then filter by status
  const filteredAircraft = stationFilteredAircraft.filter((aircraft) => filter.includes(aircraft.status))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filter.includes("critical")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "critical"])
                } else {
                  setFilter(filter.filter((item) => item !== "critical"))
                }
              }}
            >
              Critical
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("in-progress")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "in-progress"])
                } else {
                  setFilter(filter.filter((item) => item !== "in-progress"))
                }
              }}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("pending")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "pending"])
                } else {
                  setFilter(filter.filter((item) => item !== "pending"))
                }
              }}
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("resolved")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "resolved"])
                } else {
                  setFilter(filter.filter((item) => item !== "resolved"))
                }
              }}
            >
              Resolved
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAircraft.map((aircraft) => (
          <Card key={aircraft.id} className={aircraft.status === "critical" ? "border-red-300" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(aircraft.status)}
                <CardTitle className="text-lg">
                  {aircraft.flight} ({aircraft.registration})
                </CardTitle>
              </div>
              {getStatusBadge(aircraft.status)}
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Aircraft Type:</span>
                  <span className="col-span-2">{aircraft.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Location:</span>
                  <span className="col-span-2">{aircraft.location}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Issue:</span>
                  <span className="col-span-2">{aircraft.issue}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">ATA Chapter:</span>
                  <span className="col-span-2 flex items-center gap-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800">
                      {aircraft.ataChapter}
                    </Badge>
                    <span>{ataChapters[aircraft.ataChapter]}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{aircraft.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Reported:</span>
                  <span className="col-span-2">{formatTime(aircraft.timeReported)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Est. Repair:</span>
                  <span className="col-span-2">{formatTime(aircraft.estimatedRepair)}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Team:</span>
                  <span className="col-span-2">
                    {aircraft.assignedTeam.length > 0 ? aircraft.assignedTeam.join(", ") : "Not assigned yet"}
                  </span>
                </div>
                {canJoinChat && (
                  <div className="mt-4 flex justify-end">
                    <ChatButton
                      groupId={aircraft.id === 1 ? "group-1" : aircraft.id === 2 ? "group-2" : undefined}
                      updates={aircraft.updates}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
