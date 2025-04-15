"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { getAOGAircraft, getAOGAircraftByStation, type Aircraft } from "@/lib/aircraft-data"
import { ChatButton } from "@/components/chat-button"
import { usePermission } from "@/lib/auth"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AOGCardViewProps {
  station?: string
}

// Interface for static aircraft attributes
interface AircraftAttributes {
  legId: number
  hasMEL: boolean
  hasLMV: boolean
}

export function AOGCardView({ station = "ALL" }: AOGCardViewProps) {
  const [aogAircraft, setAogAircraft] = useState<Aircraft[]>([])
  const [filter, setFilter] = useState<string[]>(["critical", "high", "medium", "low"])
  const [countdowns, setCountdowns] = useState<Record<string, string>>({})
  const [staticAttributes, setStaticAttributes] = useState<Record<string, AircraftAttributes>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initializedRef = useRef<boolean>(false)
  const canJoinChat = usePermission("join_chat")
  const router = useRouter()

  useEffect(() => {
    // Get AOG aircraft based on station filter
    const aircraft = station === "ALL" ? getAOGAircraft() : getAOGAircraftByStation(station)
    setAogAircraft(aircraft)
  }, [station])

  // Filter aircraft by impact level
  const filteredAircraft = aogAircraft.filter(
    (aircraft) => aircraft.currentFault && filter.includes(aircraft.currentFault.impact || "high"),
  )

  // Function to get the border color based on impact
  const getBorderColor = (impact?: string) => {
    switch (impact) {
      case "critical":
        return "border-l-red-600"
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-blue-500"
      default:
        return "border-l-red-500" // Default to high impact
    }
  }

  // Function to get the progress bar color based on time elapsed
  const getProgressColor = (startTime: string, estimatedEndTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(estimatedEndTime).getTime()
    const now = new Date().getTime()
    const total = end - start
    const elapsed = now - start
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100))

    if (percentage < 33) return "bg-gradient-to-r from-orange-500 to-orange-400"
    if (percentage < 66) return "bg-gradient-to-r from-orange-500 to-amber-500"
    return "bg-gradient-to-r from-orange-500 to-red-500"
  }

  // Function to format time as HH:MM:SS
  const formatTimeHMS = (date: Date) => {
    return date.toTimeString().split(" ")[0]
  }

  // Function to calculate and format countdown time
  const formatCountdown = (targetTime: string) => {
    const target = new Date(targetTime).getTime()
    const now = new Date().getTime()
    const diff = target - now

    if (diff <= 0) return "00:00:00"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Function to calculate elapsed time in hours
  const calculateElapsedHours = (startTime: string) => {
    const start = new Date(startTime).getTime()
    const now = new Date().getTime()
    return ((now - start) / (1000 * 60 * 60)).toFixed(1)
  }

  // Function to calculate total estimated time in hours
  const calculateTotalHours = (startTime: string, estimatedEndTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(estimatedEndTime).getTime()
    return ((end - start) / (1000 * 60 * 60)).toFixed(1)
  }

  // Function to handle card click and navigate to fleet overview with highlighted aircraft
  const handleCardClick = (aircraftId: string, e: React.MouseEvent) => {
    // Prevent navigation if clicking on the chat button
    if ((e.target as Element).closest(".chat-button")) {
      e.preventDefault()
      return
    }

    // Store the aircraft ID in sessionStorage to highlight it in fleet overview
    sessionStorage.setItem("highlightedAircraft", aircraftId)

    // Store the active tab preference - default to "details"
    sessionStorage.setItem("activeFleetTab", "details")

    // Navigate to fleet overview with highlight parameter
    router.push(`/dashboard/fleet-overview?highlight=${aircraftId}`)
  }

  // Function to navigate to defects tab
  const navigateToDefects = (aircraftId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click handler from firing
    e.preventDefault() // Prevent any default behavior

    // Store the aircraft ID in sessionStorage to highlight it in fleet overview
    sessionStorage.setItem("highlightedAircraft", aircraftId)

    // Store the active tab preference as "defects"
    sessionStorage.setItem("activeFleetTab", "defects")

    // Navigate to fleet overview with highlight parameter and tab parameter
    router.push(`/dashboard/fleet-overview?highlight=${aircraftId}&tab=defects`)
  }

  // Initialize static attributes and countdowns once when aircraft data is loaded
  useEffect(() => {
    // Skip if we don't have aircraft data yet or if already initialized
    if (aogAircraft.length === 0 || initializedRef.current) return

    // Generate random initial countdown values and static attributes for each aircraft
    const initialCountdowns: Record<string, string> = {}
    const initialAttributes: Record<string, AircraftAttributes> = {}

    aogAircraft.forEach((aircraft) => {
      if (aircraft.currentFault) {
        // Generate countdown
        const hours = Math.floor(Math.random() * 4) + 1
        const minutes = Math.floor(Math.random() * 60)
        const seconds = Math.floor(Math.random() * 60)
        initialCountdowns[aircraft.id] =
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

        // Generate static attributes
        initialAttributes[aircraft.id] = {
          legId: Math.floor(Math.random() * 90000000) + 430000000,
          hasMEL: aircraft.currentFault.description.includes("MEL") || Math.random() > 0.5,
          hasLMV: Math.random() > 0.7,
        }
      }
    })

    setCountdowns(initialCountdowns)
    setStaticAttributes(initialAttributes)
    initializedRef.current = true
  }, [aogAircraft])

  // Set up the countdown timer interval
  useEffect(() => {
    // Skip if we don't have any countdowns yet
    if (Object.keys(countdowns).length === 0) return

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up interval to update countdowns every second
    intervalRef.current = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const newCountdowns = { ...prevCountdowns }
        let hasChanges = false

        Object.entries(newCountdowns).forEach(([id, timeString]) => {
          const [hours, minutes, seconds] = timeString.split(":").map(Number)

          let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1
          if (totalSeconds < 0) totalSeconds = 0

          const newHours = Math.floor(totalSeconds / 3600)
          const newMinutes = Math.floor((totalSeconds % 3600) / 60)
          const newSeconds = totalSeconds % 60

          const newTimeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`

          if (newTimeString !== timeString) {
            newCountdowns[id] = newTimeString
            hasChanges = true
          }
        })

        return hasChanges ? newCountdowns : prevCountdowns
      })
    }, 1000)

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [countdowns])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{filteredAircraft.length} AOG aircraft</div>
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
              Critical Impact
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("high")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "high"])
                } else {
                  setFilter(filter.filter((item) => item !== "high"))
                }
              }}
            >
              High Impact
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("medium")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "medium"])
                } else {
                  setFilter(filter.filter((item) => item !== "medium"))
                }
              }}
            >
              Medium Impact
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.includes("low")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilter([...filter, "low"])
                } else {
                  setFilter(filter.filter((item) => item !== "low"))
                }
              }}
            >
              Low Impact
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAircraft.map((aircraft) => {
          // Skip if no current fault
          if (!aircraft.currentFault) return null

          // Calculate estimated end time based on reported time and estimated resolution
          const reportedTime = aircraft.currentFault.reportedTime || new Date().toISOString()
          const estimatedHours = Number.parseInt(aircraft.currentFault.estimatedResolution.split(" ")[0]) || 4
          const estimatedEndTime = new Date(
            new Date(reportedTime).getTime() + estimatedHours * 60 * 60 * 1000,
          ).toISOString()

          // Get next flight info
          const nextFlight = aircraft.nextFlight
          const flightRoute = nextFlight ? `${aircraft.location} - ${nextFlight.destination}` : "N/A"

          // Get static attributes for this aircraft
          const attrs = staticAttributes[aircraft.id] || {
            legId: 0,
            hasMEL: false,
            hasLMV: false,
          }

          return (
            <div
              key={aircraft.id}
              className={`bg-gray-900 text-white rounded-lg overflow-hidden border-l-4 ${getBorderColor(aircraft.currentFault.impact)} cursor-pointer relative`}
              onClick={(e) => handleCardClick(aircraft.id, e)}
            >
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{aircraft.id}</h3>
                  {attrs.hasMEL && <Badge className="bg-orange-500 text-white">MEL</Badge>}
                  {attrs.hasLMV && <Badge className="bg-yellow-500 text-white">LMV</Badge>}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{aircraft.location}</div>
                  <div className="text-sm text-gray-400">
                    Local time: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-3 flex items-center">
                <div className="w-1 h-8 bg-blue-500 mr-3"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Update:</div>
                  <div className="font-medium">
                    {aircraft.currentFault.description.includes("oil") ? "PAR (Parts)" : "End of Maintenance"}
                  </div>
                </div>
                <div className="text-right">{formatTimeHMS(new Date(estimatedEndTime))}</div>
              </div>

              <div className="p-4 bg-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Flight Departure in:</div>
                    <div className="text-2xl font-bold text-red-500">{countdowns[aircraft.id] || "Loading..."}</div>
                  </div>
                  <div className="text-right font-medium">{flightRoute}</div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-400">LEG ID:</div>
                    <div>{attrs.legId || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-400">Start:</div>
                    <div>
                      {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })}
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-400">Defect:</div>
                    <div>
                      <span
                        className="cursor-pointer text-blue-400 hover:underline"
                        onClick={(e) => navigateToDefects(aircraft.id, e)}
                      >
                        {aircraft.currentFault.id.replace("F-", "M")}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-400">Reason:</div>
                    <div>ETR-{aircraft.currentFault.description.split(" ").slice(0, 3).join(" ").toUpperCase()}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-400">Start time:</div>
                    <div>{formatTimeHMS(new Date(reportedTime))}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">End time:</div>
                    <div>{formatTimeHMS(new Date(estimatedEndTime))}</div>
                  </div>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(reportedTime, estimatedEndTime)}`}
                    style={{
                      width: `${Math.min(
                        100,
                        ((new Date().getTime() - new Date(reportedTime).getTime()) /
                          (new Date(estimatedEndTime).getTime() - new Date(reportedTime).getTime())) *
                          100,
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between mt-2">
                  <div>{calculateElapsedHours(reportedTime)}h</div>
                  <div>{calculateTotalHours(reportedTime, estimatedEndTime)}h</div>
                </div>

                {/* Chat button section hidden as requested */}
                {false && canJoinChat && (
                  <div className="mt-4 flex justify-end chat-button">
                    <ChatButton
                      groupId={aircraft.id === "AC001" ? "group-1" : aircraft.id === "AC003" ? "group-2" : undefined}
                      updates={Math.floor(Math.random() * 10) + 1}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filteredAircraft.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No AOG aircraft found matching the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
