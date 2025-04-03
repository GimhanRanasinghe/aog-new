"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Plus, Edit, Trash, AlertCircle, Clock, CheckCircle2, ArrowLeft } from "lucide-react"

// Mock aircraft data
const mockAircraft = [
  {
    id: "AC123",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    status: "aog",
    location: "Toronto Pearson (YYZ), Gate 53",
    issue: "Engine failure",
    lastUpdated: "2023-05-15T08:30:00Z",
  },
  {
    id: "AC456",
    registration: "C-GITS",
    type: "Airbus A330-300",
    status: "aog",
    location: "Montreal (YUL), Gate 12",
    issue: "Hydraulic system leak",
    lastUpdated: "2023-05-15T10:15:00Z",
  },
  {
    id: "AC789",
    registration: "C-FTJP",
    type: "Boeing 787-9",
    status: "aog",
    location: "Vancouver (YVR), Maintenance Hangar 3",
    issue: "Avionics system fault",
    lastUpdated: "2023-05-15T09:45:00Z",
  },
  {
    id: "AC890",
    registration: "C-GHPQ",
    type: "Airbus A320",
    status: "maintenance",
    location: "Calgary (YYC), Remote Stand 42",
    issue: "Landing gear sensor malfunction",
    lastUpdated: "2023-05-15T11:20:00Z",
  },
  {
    id: "AC555",
    registration: "C-GKWJ",
    type: "Boeing 787-9",
    status: "operational",
    location: "Vancouver (YVR), Gate C05",
    issue: null,
    lastUpdated: "2023-05-14T14:30:00Z",
  },
  {
    id: "AC777",
    registration: "C-FIUV",
    type: "Airbus A321",
    status: "operational",
    location: "Toronto Pearson (YYZ), Gate B22",
    issue: null,
    lastUpdated: "2023-05-15T07:15:00Z",
  },
]

export default function AircraftManagement() {
  const [aircraft, setAircraft] = useState(mockAircraft)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingAircraft, setEditingAircraft] = useState<(typeof mockAircraft)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Filter aircraft based on search term and status
  const filteredAircraft = aircraft.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.issue && a.issue.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || a.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aog":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "operational":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  // Get status badge
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

  // Handle editing aircraft
  const handleEditAircraft = (aircraft: (typeof mockAircraft)[0]) => {
    setEditingAircraft(aircraft)
    setIsEditDialogOpen(true)
  }

  // Handle saving aircraft changes
  const handleSaveAircraft = () => {
    if (!editingAircraft) return

    // Update aircraft in state
    setAircraft((prev) => prev.map((a) => (a.id === editingAircraft.id ? editingAircraft : a)))

    setIsEditDialogOpen(false)
  }

  return (
    <ProtectedRoute requiredPermission="manage_aircraft">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Aircraft Management</h1>
            <p className="text-muted-foreground">Manage aircraft information and status</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Aircraft
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search aircraft..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="aog">AOG</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight ID</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAircraft.map((aircraft) => (
                <TableRow key={aircraft.id}>
                  <TableCell className="font-medium">{aircraft.id}</TableCell>
                  <TableCell>{aircraft.registration}</TableCell>
                  <TableCell>{aircraft.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(aircraft.status)}
                      {getStatusBadge(aircraft.status)}
                    </div>
                  </TableCell>
                  <TableCell>{aircraft.location}</TableCell>
                  <TableCell>{aircraft.issue || "None"}</TableCell>
                  <TableCell>{formatDate(aircraft.lastUpdated)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditAircraft(aircraft)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <AlertCircle className="mr-2 h-4 w-4" /> Mark as AOG
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" /> Mark as Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Operational
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Aircraft Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Aircraft</DialogTitle>
              <DialogDescription>Update aircraft information and status</DialogDescription>
            </DialogHeader>

            {editingAircraft && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Flight ID</label>
                    <Input
                      value={editingAircraft.id}
                      onChange={(e) => setEditingAircraft({ ...editingAircraft, id: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration</label>
                    <Input
                      value={editingAircraft.registration}
                      onChange={(e) => setEditingAircraft({ ...editingAircraft, registration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aircraft Type</label>
                  <Input
                    value={editingAircraft.type}
                    onChange={(e) => setEditingAircraft({ ...editingAircraft, type: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingAircraft.status}
                    onValueChange={(value) => setEditingAircraft({ ...editingAircraft, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aog">AOG</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editingAircraft.location}
                    onChange={(e) => setEditingAircraft({ ...editingAircraft, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue</label>
                  <Input
                    value={editingAircraft.issue || ""}
                    onChange={(e) => setEditingAircraft({ ...editingAircraft, issue: e.target.value || null })}
                    placeholder="Enter issue (if any)"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAircraft}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

