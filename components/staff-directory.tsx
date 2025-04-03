"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Mail, MessageSquare } from "lucide-react"

// Mock data - in a real app, this would come from a database
const staffMembers = [
  {
    id: 1,
    name: "John Smith",
    role: "Lead Engineer",
    department: "Mechanical",
    status: "available",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "john.smith@airport.com",
      phone: "+44 7123 456789",
    },
    skills: ["Engine Repair", "Structural Analysis", "AOG Response"],
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Avionics Specialist",
    department: "Avionics",
    status: "busy",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "maria.garcia@airport.com",
      phone: "+44 7123 456790",
    },
    skills: ["Avionics Troubleshooting", "Navigation Systems", "Radar Systems"],
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    role: "Mechanical Engineer",
    department: "Mechanical",
    status: "available",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "ahmed.hassan@airport.com",
      phone: "+44 7123 456791",
    },
    skills: ["Hydraulic Systems", "Landing Gear", "Structural Repair"],
  },
  {
    id: 4,
    name: "Lisa Chen",
    role: "Operations Manager",
    department: "Operations",
    status: "away",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "lisa.chen@airport.com",
      phone: "+44 7123 456792",
    },
    skills: ["Resource Management", "AOG Coordination", "Logistics"],
  },
  {
    id: 5,
    name: "Sarah Johnson",
    role: "Hydraulics Specialist",
    department: "Mechanical",
    status: "available",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "sarah.johnson@airport.com",
      phone: "+44 7123 456793",
    },
    skills: ["Hydraulic Systems", "Fluid Dynamics", "Component Testing"],
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    role: "Maintenance Engineer",
    department: "Maintenance",
    status: "busy",
    avatar: "/placeholder.svg?height=80&width=80",
    contact: {
      email: "carlos.rodriguez@airport.com",
      phone: "+44 7123 456794",
    },
    skills: ["Routine Maintenance", "Fault Diagnosis", "Documentation"],
  },
]

export function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = filterDepartment === null || staff.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(staffMembers.map((staff) => staff.department)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or skill..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filterDepartment === null ? "default" : "outline"} onClick={() => setFilterDepartment(null)}>
            All
          </Button>
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={filterDepartment === dept ? "default" : "outline"}
              onClick={() => setFilterDepartment(dept)}
            >
              {dept}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                    <AvatarFallback>
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(staff.status)} ring-2 ring-background`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{staff.name}</h3>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                  <Badge variant="outline" className="mt-1">
                    {staff.department}
                  </Badge>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {staff.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.contact.phone}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

