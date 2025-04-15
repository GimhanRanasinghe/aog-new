"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, Clock, CheckCircle2, Filter, Plus, History, Bell, BellOff } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ChatButton } from "@/components/chat-button"
import { AddAircraftDialog, type AircraftData } from "./add-aircraft-dialog"
import { toast } from "@/components/ui/use-toast"

// Mock data - in a real app, this would come from a user's preferences in the database
const initialWatchedAircraft = [
  {
    id: 1,
    flight: "AC123",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    status: "aog" as const,
    location: "Toronto Pearson (YYZ), Gate 53",
    lastCheck: "2023-05-15T08:30:00Z",
    notifications: true,
    currentIssue: "Engine failure",
    maintenanceHistory: [
      { date: "2023-04-10", type: "Routine Check", details: "No issues found" },
      { date: "2023-03-15", type: "AOG", details: "Hydraulic leak, repaired" },
      { date: "2023-02-20", type: "Fault", details: "Navigation system error, resolved" },
    ],
  },
  {
    id: 2,
    flight: "AC456",
    registration: "C-GITS",
    type: "Airbus A330-300",
    status: "aog" as const,
    location: "Montreal (YUL), Gate 12",
    lastCheck: "2023-05-15T10:15:00Z",
    notifications: true,
    currentIssue: "Hydraulic system leak",
    maintenanceHistory: [
      { date: "2023-05-01", type: "Routine Check", details: "Minor issues addressed" },
      { date: "2023-04-12", type: "Fault", details: "Cabin pressure sensor replaced" },
    ],
  },
  {
    id: 3,
    flight: "AC555",
    registration: "C-GKWJ",
    type: "Boeing 787-9",
    status: "operational" as const,
    location: "Vancouver (YVR), Gate C05",
    lastCheck: "2023-05-14T14:30:00Z",
    notifications: false,
    currentIssue: null,
    maintenanceHistory: [
      { date: "2023-05-10", type: "Routine Check", details: "All systems normal" },
      { date: "2023-03-25", type: "AOG", details: "Fuel system issue, repaired" },
      { date: "2023-02-15", type: "Fault", details: "Landing gear sensor replaced" },
    ],
  },
  {
    id: 4,
    flight: "AC890",
    registration: "C-GHPQ",
    type: "Airbus A320",
    status: "maintenance" as const,
    location: "Calgary (YYC), Maintenance Hangar 2",
    lastCheck: "2023-05-13T09:45:00Z",
    notifications: true,
    currentIssue: "Scheduled maintenance",
    maintenanceHistory: [
      { date: "2023-04-28", type: "Routine Check", details: "Minor issues found" },
      { date: "2023-04-01", type: "Fault", details: "Avionics update required" },
      { date: "2023-02-10", type: "AOG", details: "Engine component failure, replaced" },
    ],
  },
]

export function MyAircraft() {
  const router = useRouter()
  const [filter, setFilter] = useState<string[]>(["aog", "operational", "maintenance"])
  const [searchTerm, setSearchTerm] = useState("")
  const [watchedAircraft, setWatchedAircraft] = useState<AircraftData[]>(initialWatchedAircraft)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredAircraft = watchedAircraft.filter((aircraft) => {
    const matchesFilter = filter.includes(aircraft.status)
    const matchesSearch =
      aircraft.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.type.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

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

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString()
  }

  const toggleNotifications = (id: number) => {
    setWatchedAircraft((prev) =>
      prev.map((aircraft) => (aircraft.id === id ? { ...aircraft, notifications: !aircraft.notifications } : aircraft)),
    )

    const aircraft = watchedAircraft.find((a) => a.id === id)
    if (aircraft) {
      toast({
        title: `Notifications ${aircraft.notifications ? "disabled" : "enabled"}`,
        description: `You will ${aircraft.notifications ? "no longer" : "now"} receive notifications for ${aircraft.flight} (${aircraft.registration})`,
        duration: 3000,
      })
    }
  }

  const viewAircraftHistory = (flight: string) => {
    router.push(`/aircraft/${flight}/history`)
  }

  const handleAddAircraft = (newAircraft: Omit<AircraftData, "id" | "lastCheck" | "maintenanceHistory">) => {
    // Check if aircraft already exists in the watch list
    const exists = watchedAircraft.some((aircraft) => aircraft.flight === newAircraft.flight)

    if (exists) {
      toast({
        title: "Aircraft already in watch list",
        description: `${newAircraft.flight} (${newAircraft.registration}) is already in your watch list.`,
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Create a new aircraft object with all required fields
    const aircraft: AircraftData = {
      id: Math.max(0, ...watchedAircraft.map((a) => a.id)) + 1,
      lastCheck: new Date().toISOString(),
      maintenanceHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Added to Watch List",
          details: "Aircraft added to personal watch list",
        },
      ],
      ...newAircraft,
    }

    setWatchedAircraft((prev) => [...prev, aircraft])

    toast({
      title: "Aircraft added to watch list",
      description: `${aircraft.flight} (${aircraft.registration}) has been added to your watch list.`,
      duration: 3000,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Search by Flight, REG, or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filter.includes("aog")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilter([...filter, "aog"])
                  } else {
                    setFilter(filter.filter((item) => item !== "aog"))
                  }
                }}
              >
                AOG
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.includes("maintenance")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilter([...filter, "maintenance"])
                  } else {
                    setFilter(filter.filter((item) => item !== "maintenance"))
                  }
                }}
              >
                Maintenance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.includes("operational")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilter([...filter, "operational"])
                  } else {
                    setFilter(filter.filter((item) => item !== "operational"))
                  }
                }}
              >
                Operational
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="flex items-center gap-1" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Aircraft</span>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAircraft.map((aircraft) => (
          <Card key={aircraft.id} className={aircraft.status === "aog" ? "border-red-300" : ""}>
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
                  <span className="font-medium">Last Check:</span>
                  <span className="col-span-2">{formatTime(aircraft.lastCheck)}</span>
                </div>
                {aircraft.currentIssue && (
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <span className="font-medium">Current Issue:</span>
                    <span className="col-span-2">{aircraft.currentIssue}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="font-medium">Recent History:</span>
                  <span className="col-span-2">
                    {aircraft.maintenanceHistory.length > 0
                      ? `${aircraft.maintenanceHistory[0].type} on ${aircraft.maintenanceHistory[0].date}`
                      : "No recent history"}
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleNotifications(aircraft.id)}
                  >
                    {aircraft.notifications ? (
                      <>
                        <Bell className="h-4 w-4" />
                        <span>Notifications On</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="h-4 w-4" />
                        <span>Notifications Off</span>
                      </>
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => viewAircraftHistory(aircraft.flight)}
                    >
                      <History className="h-4 w-4" />
                      <span>History</span>
                    </Button>
                    {aircraft.status === "aog" && (
                      <ChatButton
                        size="sm"
                        groupId={
                          aircraft.flight === "AC123" ? "group-1" : aircraft.flight === "AC456" ? "group-2" : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddAircraftDialog open={dialogOpen} onOpenChange={setDialogOpen} onAddAircraft={handleAddAircraft} />
    </div>
  )
}
