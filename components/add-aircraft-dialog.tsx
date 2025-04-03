"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export interface AircraftData {
  id: number
  flight: string
  registration: string
  type: string
  status: "aog" | "maintenance" | "operational"
  location: string
  lastCheck: string
  notifications: boolean
  currentIssue: string | null
  maintenanceHistory: Array<{
    date: string
    type: string
    details: string
  }>
}

interface AddAircraftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAircraft: (aircraft: Omit<AircraftData, "id" | "lastCheck" | "maintenanceHistory">) => void
}

// Sample Air Canada flight data
export const sampleAircraftData = [
  {
    flight: "AC101",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    location: "Toronto Pearson (YYZ), Gate 53",
  },
  {
    flight: "AC202",
    registration: "C-FMXC",
    type: "Boeing 777-200LR",
    location: "Toronto Pearson (YYZ), Gate 47",
  },
  {
    flight: "AC303",
    registration: "C-GHPQ",
    type: "Airbus A320-200",
    location: "Montreal (YUL), Gate 12",
  },
  {
    flight: "AC404",
    registration: "C-GITS",
    type: "Airbus A330-300",
    location: "Vancouver (YVR), Gate C05",
  },
  {
    flight: "AC505",
    registration: "C-GKWJ",
    type: "Boeing 787-9",
    location: "Calgary (YYC), Gate B22",
  },
  {
    flight: "AC606",
    registration: "C-FPCA",
    type: "Boeing 787-8",
    location: "Ottawa (YOW), Gate 14",
  },
  {
    flight: "AC707",
    registration: "C-FVNF",
    type: "Airbus A220-300",
    location: "Halifax (YHZ), Gate 20",
  },
  {
    flight: "AC808",
    registration: "C-GJWI",
    type: "Airbus A321-200",
    location: "Edmonton (YEG), Gate 54",
  },
]

export function AddAircraftDialog({ open, onOpenChange, onAddAircraft }: AddAircraftDialogProps) {
  const [selectedFlight, setSelectedFlight] = useState("")
  const [status, setStatus] = useState<"operational" | "maintenance" | "aog">("operational")
  const [notifications, setNotifications] = useState(true)
  const [currentIssue, setCurrentIssue] = useState("")

  const selectedAircraft = sampleAircraftData.find((aircraft) => aircraft.flight === selectedFlight)

  const handleSubmit = () => {
    if (!selectedAircraft) return

    onAddAircraft({
      flight: selectedAircraft.flight,
      registration: selectedAircraft.registration,
      type: selectedAircraft.type,
      location: selectedAircraft.location,
      status,
      notifications,
      currentIssue: status !== "operational" ? currentIssue : null,
    })

    // Reset form
    setSelectedFlight("")
    setStatus("operational")
    setNotifications(true)
    setCurrentIssue("")

    // Close dialog
    onOpenChange(false)
  }

  const isValid = selectedFlight && (status === "operational" || (status !== "operational" && currentIssue))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Aircraft to Watch List</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="flight">Select Flight</Label>
            <Select value={selectedFlight} onValueChange={setSelectedFlight}>
              <SelectTrigger id="flight">
                <SelectValue placeholder="Select a flight" />
              </SelectTrigger>
              <SelectContent>
                {sampleAircraftData.map((aircraft) => (
                  <SelectItem key={aircraft.flight} value={aircraft.flight}>
                    {aircraft.flight} ({aircraft.registration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAircraft && (
            <>
              <div className="grid gap-2">
                <Label>Aircraft Details</Label>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Type:</span>
                    <span className="col-span-2">{selectedAircraft.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Registration:</span>
                    <span className="col-span-2">{selectedAircraft.registration}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Location:</span>
                    <span className="col-span-2">{selectedAircraft.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as "operational" | "maintenance" | "aog")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="aog">AOG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status !== "operational" && (
                <div className="grid gap-2">
                  <Label htmlFor="issue">Current Issue</Label>
                  <Textarea
                    id="issue"
                    placeholder="Describe the current issue..."
                    value={currentIssue}
                    onChange={(e) => setCurrentIssue(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <div className="text-sm text-muted-foreground">Receive alerts about this aircraft</div>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add to Watch List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

