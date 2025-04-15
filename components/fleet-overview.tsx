"use client"

import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Plane,
  Calendar,
  AlertCircle,
  Filter,
  Clock,
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertTriangle,
  User,
  Camera,
  Paperclip,
} from "lucide-react"
import { type Aircraft, aircraftData, stations } from "@/lib/aircraft-data"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AircraftDefects } from "@/components/aircraft-defects"
import { ChatPortal } from "@/components/chat-portal"

// Helper function to generate MEL reference number
const generateMELNumber = (ataChapter: string) => {
  const ataParts = ataChapter.split("-")
  const mainAta = ataParts[0].replace("ATA ", "")
  const subAta = ataParts.length > 1 ? ataParts[1] : Math.floor(Math.random() * 90 + 10).toString()
  return `${mainAta}-${subAta}-${Math.floor(Math.random() * 90 + 10)}`
}

// Helper function to generate future date
const generateFutureDate = (daysFromNow: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} 00:00:00`
}

// Work Order Types and Statuses
type WorkOrderStatus = "OPEN" | "IN PROGRESS" | "COMPLETED" | "DEFERRED" | "CANCELLED"
type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
type WorkOrderType =
  | "ROUTINE"
  | "NON-ROUTINE"
  | "INSPECTION"
  | "MODIFICATION"
  | "REPAIR"
  | "OVERHAUL"
  | "TROUBLESHOOTING"

// Work Order Interface
interface WorkOrder {
  id: string
  aircraftId: string
  type: WorkOrderType
  description: string
  status: WorkOrderStatus
  priority: WorkOrderPriority
  createdDate: string
  dueDate: string
  estimatedManHours: number
  actualManHours?: number
  assignedTechnicians: string[]
  ataChapter?: string
  relatedMEL?: string
  location: string
  taskCards: TaskCard[]
  parts?: Part[]
  notes?: WorkOrderNote[]
  completedDate?: string
  signedBy?: string
}

interface TaskCard {
  id: string
  description: string
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "DEFERRED"
  estimatedHours: number
  actualHours?: number
  assignedTo?: string
  completedBy?: string
  completedDate?: string
}

interface Part {
  partNumber: string
  description: string
  quantity: number
  status: "AVAILABLE" | "ON ORDER" | "BACKORDERED" | "INSTALLED"
  location?: string
  estimatedArrival?: string
}

interface WorkOrderNote {
  timestamp: string
  author: string
  text: string
  attachments?: string[]
}

// Remark/Event interface
interface AircraftRemark {
  id: string
  aircraftId: string
  type: string
  timestamp: string
  author: string
  text: string
  attachments?: string[]
}

// Generate mock remarks for each aircraft
const generateRemarksForAircraft = (aircraft: Aircraft): AircraftRemark[] => {
  const remarks: AircraftRemark[] = []

  // Number of remarks based on aircraft status
  let numRemarks = Math.floor(Math.random() * 5) + 2 // 2-6 remarks for most aircraft

  if (aircraft.status === "aog") {
    numRemarks = Math.floor(Math.random() * 5) + 5 // 5-9 remarks for AOG aircraft
  }

  // Common authors
  const authors = [
    "John Smith",
    "Maria Garcia",
    "Ahmed Hassan",
    "Sarah Johnson",
    "Carlos Rodriguez",
    "Lisa Chen",
    "Michael Wong",
    "Emma Wilson",
    "David Patel",
    "Olivia Martinez",
  ]

  // Remark types
  const remarkTypes = [
    "OEM (Supplier)",
    "Start of Maintenance",
    "RPR (Repair)",
    "TRS (Troubleshooting)",
    "MOV (Aircraft Movement)",
    "PAR (Parts)",
    "ENG (Engineering)",
    "LOG (Logistics)",
    "QA (Quality Assurance)",
    "OPS (Operations)",
  ]

  // Generate dates in the past 7 days, sorted from newest to oldest
  const today = new Date()
  const dates: Date[] = []

  for (let i = 0; i < numRemarks; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - Math.floor(Math.random() * 7)) // 0-7 days ago
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))
    dates.push(date)
  }

  // Sort dates from newest to oldest
  dates.sort((a, b) => b.getTime() - a.getTime())

  // Generate remarks
  for (let i = 0; i < numRemarks; i++) {
    const remarkType = remarkTypes[Math.floor(Math.random() * remarkTypes.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]

    let text = ""

    // Generate text based on type and aircraft status
    if (remarkType === "TRS (Troubleshooting)") {
      const issues = [
        "Initial inspection completed. Found hydraulic leak in actuator.",
        "Troubleshooting electrical system. Found loose connection in panel P5.",
        "Performed diagnostic on avionics. System reboot resolved intermittent fault.",
        "Inspected landing gear. Found worn bushing that needs replacement.",
        "Checked engine parameters. All readings within normal limits.",
      ]
      text = issues[Math.floor(Math.random() * issues.length)]
    } else if (remarkType === "PAR (Parts)") {
      const partTexts = [
        "Parts ordered: Hydraulic actuator P/N 45678. ETA 24 hours.",
        "Received replacement parts for cabin air system.",
        "Waiting for part delivery. Expected by tomorrow morning.",
        "Expedited shipping requested for critical components.",
        "Parts inventory checked. All required components available on-site.",
      ]
      text = partTexts[Math.floor(Math.random() * partTexts.length)]
    } else if (remarkType === "RPR (Repair)") {
      const repairTexts = [
        "Completed repair of hydraulic line. Pressure test successful.",
        "Replaced faulty component. System functioning normally.",
        "Repair in progress. Estimated completion in 3 hours.",
        "Temporary repair applied. Permanent fix scheduled for next maintenance.",
        "Repair completed and verified by quality control.",
      ]
      text = repairTexts[Math.floor(Math.random() * repairTexts.length)]
    } else {
      const generalTexts = [
        "Update: Maintenance proceeding as scheduled.",
        "Coordination with engineering team for technical support.",
        "Documentation updated in maintenance system.",
        "Crew briefed on current status.",
        "Scheduled next inspection for tomorrow.",
      ]
      text = generalTexts[Math.floor(Math.random() * generalTexts.length)]
    }

    // Add aircraft-specific context for AOG aircraft
    if (aircraft.status === "aog" && i === 0) {
      if (aircraft.currentFault) {
        text = `AOG situation assessment: ${aircraft.currentFault.description}`
      } else {
        text = "AOG declared. Technical team dispatched for immediate assessment."
      }
    }

    // Add attachments randomly
    const hasAttachments = Math.random() > 0.7
    const attachments = hasAttachments
      ? ["inspection_photo.jpg", "technical_diagram.pdf"].slice(0, Math.floor(Math.random() * 2) + 1)
      : undefined

    remarks.push({
      id: `RMK-${aircraft.id}-${i + 1}`,
      aircraftId: aircraft.id,
      type: remarkType,
      timestamp: dates[i].toISOString(),
      author: author,
      text: text,
      attachments: attachments,
    })
  }

  // Special case for AC129 to match the screenshot
  if (aircraft.id === "AC129") {
    remarks.unshift({
      id: "RMK-AC129-SPECIAL-3",
      aircraftId: "AC129",
      type: "TRS (Troubleshooting)",
      timestamp: new Date().toISOString(),
      author: "Michael Macht",
      text: "HYD LEAK FOUND TO BE OUT OF LIMITS, PCU CHANGE REQUIRED. (MACHT / 1145-MOC)",
      attachments: ["hydraulic_leak.jpg"],
    })

    remarks.unshift({
      id: "RMK-AC129-SPECIAL-2",
      aircraftId: "AC129",
      type: "TRS (Troubleshooting)",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
      author: "Michael Macht",
      text: "HYD LEAK FOUND FROM F / CTL ACTUATOR, RH AILERON PCU. INVESTIGATION IN PROGRESS. (MACHT / 0950-MOC)",
      attachments: undefined,
    })

    remarks.unshift({
      id: "RMK-AC129-SPECIAL-1",
      aircraftId: "AC129",
      type: "Start of Maintenance",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
      author: "System",
      text: "Start X",
      attachments: undefined,
    })
  }

  return remarks
}

// Generate remarks for all aircraft
const allRemarks: Record<string, AircraftRemark[]> = {}
aircraftData.forEach((aircraft) => {
  allRemarks[aircraft.id] = generateRemarksForAircraft(aircraft)
})

// Generate mock work orders for each aircraft
const generateWorkOrdersForAircraft = (aircraft: Aircraft): WorkOrder[] => {
  const workOrders: WorkOrder[] = []

  // Number of work orders based on aircraft status
  let numWorkOrders = 1
  if (aircraft.status === "maintenance") {
    numWorkOrders = Math.floor(Math.random() * 5) + 3 // 3-7 work orders
  } else if (aircraft.status === "aog") {
    numWorkOrders = Math.floor(Math.random() * 3) + 2 // 2-4 work orders
  } else {
    numWorkOrders = Math.floor(Math.random() * 3) + 1 // 1-3 work orders
  }

  // Common technician names
  const technicians = [
    "John Smith",
    "Maria Garcia",
    "Ahmed Hassan",
    "Sarah Johnson",
    "Carlos Rodriguez",
    "Lisa Chen",
    "Michael Wong",
    "Emma Wilson",
    "David Patel",
    "Olivia Martinez",
  ]

  // Generate work orders
  for (let i = 0; i < numWorkOrders; i++) {
    // Generate a realistic work order ID
    const year = new Date().getFullYear().toString().substring(2)
    const workOrderId = `WO-${year}-${aircraft.id.replace("AC", "")}-${String(i + 1).padStart(3, "0")}`

    // Determine work order type and status based on aircraft status
    let woType: WorkOrderType = "ROUTINE"
    let woStatus: WorkOrderStatus = "OPEN"
    let woPriority: WorkOrderPriority = "MEDIUM"

    if (aircraft.status === "aog") {
      woType = ["REPAIR", "TROUBLESHOOTING"][Math.floor(Math.random() * 2)] as WorkOrderType
      woStatus = ["OPEN", "IN PROGRESS"][Math.floor(Math.random() * 2)] as WorkOrderStatus
      woPriority = ["HIGH", "CRITICAL"][Math.floor(Math.random() * 2)] as WorkOrderPriority
    } else if (aircraft.status === "maintenance") {
      woType = ["INSPECTION", "MODIFICATION", "OVERHAUL"][Math.floor(Math.random() * 3)] as WorkOrderType
      woStatus = ["OPEN", "IN PROGRESS", "COMPLETED"][Math.floor(Math.random() * 3)] as WorkOrderStatus
      woPriority = ["MEDIUM", "HIGH"][Math.floor(Math.random() * 2)] as WorkOrderPriority
    } else {
      woType = ["ROUTINE", "INSPECTION", "NON-ROUTINE"][Math.floor(Math.random() * 3)] as WorkOrderType
      woStatus = ["OPEN", "IN PROGRESS", "COMPLETED", "DEFERRED"][Math.floor(Math.random() * 4)] as WorkOrderStatus
      woPriority = ["LOW", "MEDIUM"][Math.floor(Math.random() * 2)] as WorkOrderPriority
    }

    // Generate description based on type and aircraft defects
    let description = ""
    let ataChapter = ""

    if (aircraft.defects && aircraft.defects.length > 0 && i < aircraft.defects.length) {
      // Use existing defect information
      description = aircraft.defects[i].description
      ataChapter = aircraft.defects[i].ataChapter || ""
    } else {
      // Generate generic descriptions
      const descriptions = [
        "Perform scheduled maintenance check",
        "Replace hydraulic pump",
        "Inspect landing gear",
        "Troubleshoot avionics system",
        "Replace cabin air filter",
        "Repair cargo door seal",
        "Inspect engine components",
        "Replace flight control actuator",
        "Calibrate navigation system",
        "Perform borescope inspection",
      ]
      description = descriptions[Math.floor(Math.random() * descriptions.length)]

      // Generate ATA chapter
      const ataChapters = [
        "ATA 21-00-00",
        "ATA 24-00-00",
        "ATA 27-00-00",
        "ATA 28-00-00",
        "ATA 29-00-00",
        "ATA 30-00-00",
        "ATA 32-00-00",
        "ATA 34-00-00",
      ]
      ataChapter = ataChapters[Math.floor(Math.random() * ataChapters.length)]
    }

    // Generate dates
    const today = new Date()
    const createdDate = new Date(today)
    createdDate.setDate(today.getDate() - Math.floor(Math.random() * 30)) // 0-30 days ago

    const dueDate = new Date(createdDate)
    dueDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 30) + 5) // 5-35 days after creation

    let completedDate: string | undefined = undefined
    if (woStatus === "COMPLETED") {
      const completed = new Date(createdDate)
      completed.setDate(
        createdDate.getDate() + Math.floor(Math.random() * (today.getDate() - createdDate.getDate() + 1)),
      )
      completedDate = completed.toISOString()
    }

    // Format dates
    const createdDateStr = createdDate.toISOString()
    const dueDateStr = dueDate.toISOString()

    // Assign technicians
    const numTechs = Math.floor(Math.random() * 3) + 1 // 1-3 technicians
    const assignedTechs: string[] = []
    for (let j = 0; j < numTechs; j++) {
      const tech = technicians[Math.floor(Math.random() * technicians.length)]
      if (!assignedTechs.includes(tech)) {
        assignedTechs.push(tech)
      }
    }

    // Generate task cards
    const numTasks = Math.floor(Math.random() * 5) + 1 // 1-5 tasks
    const taskCards: TaskCard[] = []

    for (let j = 0; j < numTasks; j++) {
      let taskStatus: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "DEFERRED" = "NOT STARTED"

      if (woStatus === "COMPLETED") {
        taskStatus = "COMPLETED"
      } else if (woStatus === "IN PROGRESS") {
        taskStatus = ["NOT STARTED", "IN PROGRESS", "COMPLETED"][Math.floor(Math.random() * 3)] as any
      } else if (woStatus === "DEFERRED") {
        taskStatus = "DEFERRED"
      }

      const taskEstHours = Math.floor(Math.random() * 8) + 1 // 1-8 hours
      let taskActualHours: number | undefined = undefined

      if (taskStatus === "COMPLETED") {
        // Actual hours is estimated +/- 30%
        taskActualHours = Math.round(taskEstHours * (0.7 + Math.random() * 0.6) * 10) / 10
      }

      const taskCompletedBy =
        taskStatus === "COMPLETED" ? assignedTechs[Math.floor(Math.random() * assignedTechs.length)] : undefined
      let taskCompletedDate: string | undefined = undefined

      if (taskStatus === "COMPLETED" && completedDate) {
        const completed = new Date(completedDate)
        completed.setHours(completed.getHours() - Math.floor(Math.random() * 8))
        taskCompletedDate = completed.toISOString()
      }

      const taskDescriptions = [
        "Remove and replace component",
        "Inspect for damage or wear",
        "Perform functional test",
        "Clean and lubricate",
        "Calibrate system",
        "Troubleshoot fault",
        "Document findings",
        "Perform operational check",
        "Install new parts",
        "Verify system operation",
      ]

      taskCards.push({
        id: `${workOrderId}-T${j + 1}`,
        description: `${taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)]}`,
        status: taskStatus,
        estimatedHours: taskEstHours,
        actualHours: taskActualHours,
        assignedTo: assignedTechs[Math.floor(Math.random() * assignedTechs.length)],
        completedBy: taskCompletedBy,
        completedDate: taskCompletedDate,
      })
    }

    // Generate parts if needed
    let parts: Part[] | undefined = undefined
    if (woType === "REPAIR" || woType === "OVERHAUL" || woType === "MODIFICATION") {
      const numParts = Math.floor(Math.random() * 3) + 1 // 1-3 parts
      parts = []

      const partStatuses: ("AVAILABLE" | "ON ORDER" | "BACKORDERED" | "INSTALLED")[] = [
        "AVAILABLE",
        "ON ORDER",
        "BACKORDERED",
        "INSTALLED",
      ]

      for (let j = 0; j < numParts; j++) {
        const partStatus = partStatuses[Math.floor(Math.random() * partStatuses.length)]
        let estimatedArrival: string | undefined = undefined

        if (partStatus === "ON ORDER" || partStatus === "BACKORDERED") {
          const arrival = new Date()
          arrival.setDate(arrival.getDate() + Math.floor(Math.random() * 14) + 1) // 1-14 days
          estimatedArrival = arrival.toISOString()
        }

        parts.push({
          partNumber: `P${Math.floor(Math.random() * 900000) + 100000}`,
          description: [
            "Hydraulic actuator",
            "Fuel pump",
            "Circuit board",
            "Sensor assembly",
            "Valve",
            "Filter element",
            "Seal kit",
            "Bearing",
            "Switch",
            "Connector",
          ][Math.floor(Math.random() * 10)],
          quantity: Math.floor(Math.random() * 5) + 1,
          status: partStatus,
          location:
            partStatus === "AVAILABLE"
              ? ["Main Warehouse", "Line Storage", "Hangar Storage"][Math.floor(Math.random() * 3)]
              : undefined,
          estimatedArrival,
        })
      }
    }

    // Generate notes
    let notes: WorkOrderNote[] | undefined = undefined
    const numNotes = Math.floor(Math.random() * 3) // 0-2 notes

    if (numNotes > 0) {
      notes = []
      for (let j = 0; j < numNotes; j++) {
        const noteDate = new Date(createdDate)
        noteDate.setHours(noteDate.getHours() + Math.floor(Math.random() * 48)) // 0-48 hours after creation

        const noteTexts = [
          "Initial inspection completed. Found additional issues that need to be addressed.",
          "Parts have been ordered. Estimated arrival in 2-3 days.",
          "Completed functional testing. All systems operating within normal parameters.",
          "Encountered difficulty accessing component. May require special tooling.",
          "Customer requested additional inspection of adjacent components.",
          "Maintenance manual procedure requires update. Contacted engineering for clarification.",
          "Deferred task due to parts availability. Will resume when parts arrive.",
          "Found corrosion during inspection. Documenting extent and location.",
          "Completed all required tasks. Documentation updated in maintenance system.",
        ]

        notes.push({
          timestamp: noteDate.toISOString(),
          author: technicians[Math.floor(Math.random() * technicians.length)],
          text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
          attachments: Math.random() > 0.7 ? ["inspection_photo.jpg"] : undefined,
        })
      }

      // Sort notes by timestamp
      if (notes.length > 1) {
        notes.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      }
    }

    // Calculate estimated and actual man hours
    const estimatedManHours = taskCards.reduce((sum, task) => sum + task.estimatedHours, 0)
    let actualManHours: number | undefined = undefined

    if (woStatus === "COMPLETED") {
      actualManHours = taskCards.reduce((sum, task) => sum + (task.actualHours || 0), 0)
    }

    // Create work order
    const workOrder: WorkOrder = {
      id: workOrderId,
      aircraftId: aircraft.id,
      type: woType,
      description,
      status: woStatus,
      priority: woPriority,
      createdDate: createdDateStr,
      dueDate: dueDateStr,
      estimatedManHours,
      actualManHours,
      assignedTechnicians: assignedTechs,
      ataChapter,
      location: aircraft.location,
      taskCards,
      parts,
      notes,
      completedDate,
      signedBy: completedDate ? assignedTechs[0] : undefined,
    }

    // Add related MEL if applicable
    if (
      aircraft.defects &&
      aircraft.defects.length > 0 &&
      i < aircraft.defects.length &&
      aircraft.defects[i].category &&
      aircraft.defects[i].category.includes("MEL")
    ) {
      workOrder.relatedMEL = generateMELNumber(aircraft.defects[i].ataChapter || "")
    }

    workOrders.push(workOrder)
  }

  // Special case for AC129 to match the screenshot
  if (aircraft.id === "AC129") {
    workOrders.push({
      id: "WO-23-129-001",
      aircraftId: "AC129",
      type: "REPAIR",
      description: "AILERON ACTUATOR REPLACEMENT DUE TO HYDRAULIC LEAK",
      status: "IN PROGRESS",
      priority: "HIGH",
      createdDate: "2023-05-14T08:30:00Z",
      dueDate: "2023-05-16T17:00:00Z",
      estimatedManHours: 12,
      assignedTechnicians: ["John Smith", "Maria Garcia"],
      ataChapter: "ATA 27-10-00",
      relatedMEL: "27-10-07",
      location: "YYZ",
      taskCards: [
        {
          id: "WO-23-129-001-T1",
          description: "Remove faulty actuator",
          status: "COMPLETED",
          estimatedHours: 3,
          actualHours: 2.5,
          assignedTo: "John Smith",
          completedBy: "John Smith",
          completedDate: "2023-05-14T11:30:00Z",
        },
        {
          id: "WO-23-129-001-T2",
          description: "Install new actuator",
          status: "IN PROGRESS",
          estimatedHours: 4,
          assignedTo: "Maria Garcia",
        },
        {
          id: "WO-23-129-001-T3",
          description: "Perform operational test",
          status: "NOT STARTED",
          estimatedHours: 2,
          assignedTo: "John Smith",
        },
        {
          id: "WO-23-129-001-T4",
          description: "Document and close work order",
          status: "NOT STARTED",
          estimatedHours: 1,
          assignedTo: "Maria Garcia",
        },
      ],
      parts: [
        {
          partNumber: "ACT-27-10-456",
          description: "Aileron Actuator Assembly",
          quantity: 1,
          status: "INSTALLED",
        },
        {
          partNumber: "SEAL-27-10-789",
          description: "Hydraulic Seal Kit",
          quantity: 1,
          status: "INSTALLED",
        },
      ],
      notes: [
        {
          timestamp: "2023-05-14T09:15:00Z",
          author: "John Smith",
          text: "Initial inspection confirms hydraulic leak from actuator rear casing. Replacement required.",
        },
        {
          timestamp: "2023-05-14T12:00:00Z",
          author: "Maria Garcia",
          text: "Old actuator removed. New actuator installation in progress.",
          attachments: ["actuator_removal.jpg"],
        },
      ],
    })
  }

  return workOrders
}

// Generate work orders for all aircraft
const allWorkOrders: Record<string, WorkOrder[]> = {}
aircraftData.forEach((aircraft) => {
  allWorkOrders[aircraft.id] = generateWorkOrdersForAircraft(aircraft)
})

export function FleetOverview() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [aircraft, setAircraft] = useState<Aircraft[]>(aircraftData)
  const [selectedStation, setSelectedStation] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("details")
  const [updateType, setUpdateType] = useState<string>("OEM (Supplier)")
  const [remarks, setRemarks] = useState<string>("")
  const [workOrderSearch, setWorkOrderSearch] = useState<string>("")
  const expandedRowRef = useRef<HTMLTableRowElement>(null)
  const highlightedRowRef = useRef<HTMLTableRowElement>(null)
  const searchParams = useSearchParams()

  // Check for highlighted aircraft from URL parameter or sessionStorage
  useEffect(() => {
    const highlightId = searchParams?.get("highlight") || sessionStorage.getItem("highlightedAircraft")

    if (highlightId) {
      // Expand the highlighted row
      setExpandedRow(highlightId)

      // Check if we should show a specific tab
      const tabParam = searchParams?.get("tab")
      const storedTab = sessionStorage.getItem("activeFleetTab")

      // Set the active tab with priority to URL parameter, then sessionStorage
      if (tabParam) {
        setActiveTab(tabParam)
      } else if (storedTab) {
        setActiveTab(storedTab)
      } else {
        setActiveTab("details")
      }

      // Clear the sessionStorage after using it
      sessionStorage.removeItem("highlightedAircraft")
      sessionStorage.removeItem("activeFleetTab")
      sessionStorage.removeItem("showAircraftDetails") // Clean up old storage item

      // Scroll to the highlighted row after a short delay to ensure rendering
      setTimeout(() => {
        if (highlightedRowRef.current) {
          highlightedRowRef.current.scrollIntoView({ behavior: "smooth", block: "start" })

          // Add a temporary highlight effect
          highlightedRowRef.current.classList.add("bg-yellow-100", "dark:bg-yellow-900/20")
          setTimeout(() => {
            highlightedRowRef.current?.classList.remove("bg-yellow-100", "dark:bg-yellow-900/20")
          }, 2000)
        }
      }, 100)
    }
  }, [searchParams])

  // Modify the toggleRow function to reset scroll position when collapsing
  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null)
      // When collapsing, scroll to the row that was expanded
      setTimeout(() => {
        if (highlightedRowRef.current) {
          highlightedRowRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
          window.scrollBy({
            top: -20,
            behavior: "smooth",
          })
        }
      }, 50)
    } else {
      setExpandedRow(id)
      setActiveTab("details")
    }
  }

  // Scroll to the expanded row when it changes
  useEffect(() => {
    if (expandedRow && expandedRowRef.current) {
      // Add a small delay to ensure the row is fully expanded before scrolling
      setTimeout(() => {
        // Use scrollIntoView with block: "start" to align the top of the element with the top of the viewport
        expandedRowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Scroll up slightly to show the header of the row
        window.scrollBy({
          top: -20,
          behavior: "smooth",
        })
      }, 150) // Increased delay to ensure content is rendered
    }
  }, [expandedRow])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "maintenance":
        return <Badge className="bg-blue-500">Maintenance</Badge>
      case "aog":
        return <Badge className="bg-red-500">AOG</Badge>
      case "scheduled":
        return <Badge className="bg-amber-500">Scheduled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getFlightStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-green-500">On Time</Badge>
      case "delayed":
        return <Badge className="bg-amber-500">Delayed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "probable-delay":
        return <Badge className="bg-yellow-500">Probable Delay</Badge>
      case "imminent-delay":
        return <Badge className="bg-amber-500">Imminent Delay</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getWorkOrderStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-blue-500">Open</Badge>
      case "IN PROGRESS":
        return <Badge className="bg-amber-500">In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>
      case "DEFERRED":
        return <Badge className="bg-purple-500">Deferred</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getWorkOrderPriorityBadge = (priority: WorkOrderPriority) => {
    switch (priority) {
      case "LOW":
        return <Badge className="bg-green-500">Low</Badge>
      case "MEDIUM":
        return <Badge className="bg-blue-500">Medium</Badge>
      case "HIGH":
        return <Badge className="bg-amber-500">High</Badge>
      case "CRITICAL":
        return <Badge className="bg-red-500">Critical</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "IN PROGRESS":
        return <Clock3 className="h-4 w-4 text-amber-500" />
      case "NOT STARTED":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "DEFERRED":
        return <AlertTriangle className="h-4 w-4 text-purple-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filterAircraftByStation = (station: string) => {
    if (station === "all") {
      setAircraft(aircraftData)
    } else {
      setAircraft(aircraftData.filter((ac) => ac.location === station))
    }
    setSelectedStation(station)
  }

  // Check if this aircraft is the one highlighted from terminal view
  const isHighlightedAircraft = (id: string) => {
    const highlightId = searchParams?.get("highlight")
    return highlightId === id
  }

  const handleAddLogEntry = () => {
    // In a real application, this would send the data to a server
    alert(`Log entry added: ${updateType} - ${remarks}`)
    setRemarks("")
  }

  // Function to get MEL items from defects
  const getMELItems = (ac: Aircraft) => {
    if (!ac.defects || ac.defects.length === 0) {
      return []
    }

    // Filter defects that are MEL items (category contains "MEL")
    return ac.defects
      .filter(
        (defect) =>
          defect.category &&
          (defect.category.includes("MEL") ||
            defect.category === "MEL A" ||
            defect.category === "MEL B" ||
            defect.category === "MEL C"),
      )
      .map((defect) => {
        // Generate MEL reference number based on ATA chapter if available
        const melNumber = defect.ataChapter
          ? generateMELNumber(defect.ataChapter)
          : `${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 90 + 10)}`

        // Extract ATA chapter number
        const ataMatch = defect.ataChapter ? defect.ataChapter.match(/(\d+)-(\d+)/) : null
        const ataNumber = ataMatch ? `${ataMatch[1]}-${ataMatch[2]}` : "XX-XX"

        // Generate dates
        const deferDate = defect.reportedDate ? new Date(defect.reportedDate) : new Date()
        const deferDateStr = `${deferDate.getFullYear()}-${String(deferDate.getMonth() + 1).padStart(2, "0")}-${String(deferDate.getDate()).padStart(2, "0")} 00:00:00`

        // Due date is between 10-30 days after defer date
        const dueDate = new Date(deferDate)
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 20 + 10))
        const dueDateStr = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}-${String(dueDate.getDate()).padStart(2, "0")} 00:00:00`

        // Planned LCL date is 5-15 days after due date
        const lclDate = new Date(dueDate)
        lclDate.setDate(lclDate.getDate() + Math.floor(Math.random() * 10 + 5))
        const lclDateStr = `${lclDate.getFullYear()}-${String(lclDate.getMonth() + 1).padStart(2, "0")}-${String(lclDate.getDate()).padStart(2, "0")} 23:00:00`

        // Generate work order number
        const workOrder = `${Math.floor(Math.random() * 900000 + 100000)}`

        // Generate restriction based on system
        let restriction = "NO AUTOLAND"
        if (defect.system === "Auxiliary Power Unit") {
          restriction = "APU INOP"
        } else if (defect.system === "Environmental Control") {
          restriction = "PACK 1 INOP"
        } else if (defect.system === "In-Flight Entertainment") {
          restriction = "IFE INOP"
        } else if (defect.system === "Navigation") {
          restriction = "WEATHER RADAR INOP"
        } else if (defect.system === "Electrical Power") {
          restriction = "GALLEY POWER REDUCED"
        }

        return {
          melNumber,
          ataNumber,
          restriction,
          description: defect.description,
          deferDate: deferDateStr,
          dueDate: dueDateStr,
          lclDate: lclDateStr,
          workOrder,
          status: defect.status === "deferred" ? "ACTIVE" : "ACTIVE",
          category: defect.category || "MEL C",
        }
      })
  }

  // Function to get historical MEL items
  const getHistoricalMELItems = (ac: Aircraft) => {
    // Generate 0-3 historical MEL items
    const count = Math.floor(Math.random() * 4)
    const items = []

    for (let i = 0; i < count; i++) {
      const melNumber = `${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 90 + 10)}`

      // Generate a past date (30-180 days ago)
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 150 + 30))
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

      // Generate a description
      const descriptions = [
        "CABIN PRESSURE CONTROLLER FAULT",
        "CABIN READING LIGHT ROW 12 INOP",
        "WEATHER RADAR DISPLAY DEGRADED",
        "APU BLEED AIR VALVE INOP",
        "CARGO DOOR SEAL WEAR",
        "PASSENGER SEAT 14D RECLINE INOP",
        "GALLEY OVEN 2 INOP",
        "LAVATORY 3 SMOKE DETECTOR FAULT",
      ]

      items.push({
        melNumber,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: dateStr,
        status: "CLEARED",
      })
    }

    return items
  }

  // Special case for AC129 to match the screenshot
  const getAC129MELData = () => {
    return {
      melNumber: "22-11-07",
      ataNumber: "22-10",
      restriction: "NO AUTOLAND",
      description:
        "LIB AILERON ACTUATOR DRIPPING FROM REAR CASING @ 40 DROPS/10 MIN DYNAMIC, EXCEEDING THE LIMIT OF 1 DROP/10 MIN DYNAMIC IAW AMM BD500-A-J27-11-01-01AAA-364B-A.",
      deferDate: "2025-03-03 00:00:00",
      dueDate: "2025-03-27 00:00:00",
      lclDate: "2025-04-09 23:00:00",
      workOrder: "1461112",
      status: "ACTIVE",
      category: "MEL C",
    }
  }

  // Filter work orders based on search
  const getFilteredWorkOrders = (aircraftId: string) => {
    const workOrders = allWorkOrders[aircraftId] || []

    if (!workOrderSearch) return workOrders

    const search = workOrderSearch.toLowerCase()
    return workOrders.filter(
      (wo) =>
        wo.id.toLowerCase().includes(search) ||
        wo.description.toLowerCase().includes(search) ||
        wo.type.toLowerCase().includes(search) ||
        wo.status.toLowerCase().includes(search) ||
        wo.priority.toLowerCase().includes(search) ||
        (wo.ataChapter && wo.ataChapter.toLowerCase().includes(search)) ||
        wo.assignedTechnicians.some((tech) => tech.toLowerCase().includes(search)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded-md">
        <div className="text-sm text-muted-foreground">{aircraft.length} aircraft</div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Airport:</span>
          <Select value={selectedStation} onValueChange={filterAircraftByStation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Airport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Airports</SelectItem>
              {stations.map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  {station.code} - {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Aircraft</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Next Flight</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Flight Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aircraft.map((ac) => (
              <>
                <TableRow
                  key={ac.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    isHighlightedAircraft(ac.id) ? "bg-yellow-100 dark:bg-yellow-900/20" : ""
                  }`}
                  onClick={() => toggleRow(ac.id)}
                  ref={(el) => {
                    // Set both refs if this is the expanded row and the highlighted row
                    if (expandedRow === ac.id) expandedRowRef.current = el
                    if (isHighlightedAircraft(ac.id)) highlightedRowRef.current = el
                  }}
                >
                  <TableCell>
                    {expandedRow === ac.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ac.id} ({ac.registration})
                  </TableCell>
                  <TableCell>{ac.type}</TableCell>
                  <TableCell>{getStatusBadge(ac.status)}</TableCell>
                  <TableCell>
                    {ac.location}
                    {ac.gate && <span className="text-xs text-muted-foreground ml-1">Gate {ac.gate}</span>}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight
                      ? ac.nextFlight.flightNumber
                      : ac.status === "maintenance"
                        ? "In Maintenance"
                        : "N/A"}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight
                      ? formatDateTime(ac.nextFlight.departureTime)
                      : ac.status === "maintenance"
                        ? formatDateTime(ac.maintenanceStatus!.dueDate)
                        : "N/A"}
                  </TableCell>
                  <TableCell>
                    {ac.nextFlight ? (
                      getFlightStatusBadge(ac.nextFlight.status)
                    ) : ac.status === "maintenance" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={ac.maintenanceStatus!.completionPercentage} className="h-2 w-[60px]" />
                        <span className="text-xs">{ac.maintenanceStatus!.completionPercentage}%</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === ac.id && (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Left 2/3 - Aircraft Details */}
                        <div className="col-span-full bg-gray-900 text-white p-4">
                          {/* Header with Aircraft ID and AOG Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              <h3 className="text-lg font-medium">
                                {ac.id} ({ac.registration})
                              </h3>
                              {ac.status === "aog" && <Badge className="bg-red-500 ml-2">AOG</Badge>}
                            </div>
                            <ChatPortal
                              open={true}
                              onOpenChange={() => {}}
                              aircraftId={ac.id}
                              aircraftReg={ac.registration}
                              simplified={true}
                            />
                          </div>
                          {/* <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h3 className="text-lg font-medium">
                              {ac.id} ({ac.registration})
                            </h3>
                            {ac.status === "aog" && <Badge className="bg-red-500 ml-2">AOG</Badge>}
                            <div className="h-[600px]">
                            <ChatPortal
                              open={true}
                              onOpenChange={() => {}}
                              aircraftId={ac.id}
                              aircraftReg={ac.registration}
                              simplified={true}
                            />
                          </div>
                          </div> */}

                          {/* Route Information */}
                          <div className="flex items-center gap-2 text-sm mb-4">
                            <Plane className="h-4 w-4" />
                            <span>{ac.location}</span>
                            {ac.gate && <span className="text-gray-400">Gate {ac.gate}</span>}
                            {ac.nextFlight && (
                              <>
                                <ArrowRight className="h-4 w-4" />
                                <span>{ac.nextFlight.destination}</span>
                              </>
                            )}
                            <span className="ml-4">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {ac.nextFlight ? new Date(ac.nextFlight.departureTime).toLocaleDateString() : "N/A"}
                            </span>
                          </div>

                          {/* Delay Impact - Only show for AOG or delayed flights */}
                          {(ac.status === "aog" || (ac.nextFlight && ac.nextFlight.status !== "on-time")) && (
                            <div className="mb-2">
                              <p className="text-sm mb-1">Delay Impact</p>
                              <div className="h-2 w-full bg-red-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{
                                    width: ac.nextFlight?.delayMinutes
                                      ? `${Math.min(100, (ac.nextFlight.delayMinutes / 180) * 100)}%`
                                      : "100%",
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-end mt-1">
                                <span className="text-sm text-red-400">
                                  {ac.nextFlight?.delayMinutes || 180} minutes
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Reason - Only show for AOG or delayed flights */}
                          {(ac.status === "aog" || (ac.nextFlight && ac.nextFlight.status !== "on-time")) && (
                            <div className="mb-4">
                              <p className="text-sm">Reason</p>
                              <p>
                                {ac.nextFlight?.delayReason ||
                                  ac.currentFault?.description ||
                                  "Aircraft technical issue"}
                              </p>
                            </div>
                          )}

                          {/* Tabs */}
                          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-gray-800">
                              <TabsTrigger
                                value="details"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                              >
                                Aircraft Details
                              </TabsTrigger>
                              <TabsTrigger
                                value="wo"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white relative z-30 cursor-pointer hover:bg-gray-800 transition-colors"
                              >
                                Work Order
                              </TabsTrigger>
                              <TabsTrigger
                                value="create-event"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white relative z-30 cursor-pointer hover:bg-gray-800 transition-colors"
                              >
                                Remarks
                              </TabsTrigger>
                              <TabsTrigger
                                value="defects"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white relative z-30 cursor-pointer hover:bg-gray-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveTab("defects")
                                }}
                              >
                                Defects
                              </TabsTrigger>
                              <TabsTrigger
                                value="mel"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white relative z-30 cursor-pointer hover:bg-gray-800 transition-colors"
                              >
                                MEL
                              </TabsTrigger>
                              <TabsTrigger
                                value="history"
                                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                              >
                                AOG History
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-0">
                              {/* Two Column Layout */}
                              <div className="grid grid-cols-2 gap-8 mb-6">
                                {/* Aircraft Information */}
                                <div>
                                  <h4 className="text-base font-medium mb-4">Aircraft Information</h4>
                                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                    <p className="text-gray-400">Registration:</p>
                                    <p className="text-right">{ac.registration}</p>

                                    <p className="text-gray-400">Type:</p>
                                    <p className="text-right">{ac.type}</p>

                                    <p className="text-gray-400">Station:</p>
                                    <p className="text-right">{ac.location}</p>

                                    <p className="text-gray-400">Gate:</p>
                                    <p className="text-right">{ac.gate || "N/A"}</p>

                                    <p className="text-gray-400">Flight Phase:</p>
                                    <p className="text-right">{ac.flightPhase || "N/A"}</p>

                                    {ac.technicalInfo && (
                                      <>
                                        <p className="text-gray-400">Manufacturer:</p>
                                        <p className="text-right">{ac.technicalInfo.manufacturer}</p>

                                        <p className="text-gray-400">Engine Type:</p>
                                        <p className="text-right">{ac.technicalInfo.engineType}</p>

                                        <p className="text-gray-400">Total Flight Hours:</p>
                                        <p className="text-right">
                                          {ac.technicalInfo.totalFlightHours?.toLocaleString() || "N/A"}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Schedule Information */}
                                <div>
                                  <h4 className="text-base font-medium mb-4">Schedule Information</h4>
                                  {ac.nextFlight ? (
                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                      <p className="text-gray-400">Flight Number:</p>
                                      <p className="text-right">{ac.nextFlight.flightNumber}</p>

                                      <p className="text-gray-400">Destination:</p>
                                      <p className="text-right">{ac.nextFlight.destination}</p>

                                      <p className="text-gray-400">Scheduled Departure:</p>
                                      <p className="text-right">
                                        {ac.nextFlight.scheduledDeparture ||
                                          formatDateTime(ac.nextFlight.departureTime)}
                                      </p>

                                      <p className="text-gray-400">Estimated Departure:</p>
                                      <p
                                        className={`text-right ${ac.nextFlight.status !== "on-time" ? "text-red-400" : ""}`}
                                      >
                                        {ac.nextFlight.estimatedDeparture ||
                                          formatDateTime(ac.nextFlight.departureTime)}
                                      </p>

                                      <p className="text-gray-400">Scheduled Arrival:</p>
                                      <p className="text-right">
                                        {ac.nextFlight.scheduledArrival || formatDateTime(ac.nextFlight.arrivalTime)}
                                      </p>

                                      <p className="text-gray-400">Estimated Arrival:</p>
                                      <p
                                        className={`text-right ${ac.nextFlight.status !== "on-time" ? "text-red-400" : ""}`}
                                      >
                                        {ac.nextFlight.estimatedArrival || formatDateTime(ac.nextFlight.arrivalTime)}
                                      </p>

                                      <p className="text-gray-400">Status:</p>
                                      <p className="text-right">{getFlightStatusBadge(ac.nextFlight.status)}</p>
                                    </div>
                                  ) : ac.status === "maintenance" ? (
                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                      <p className="text-gray-400">Maintenance Type:</p>
                                      <p className="text-right">{ac.maintenanceStatus?.type}</p>

                                      <p className="text-gray-400">Due Date:</p>
                                      <p className="text-right">{formatDateTime(ac.maintenanceStatus!.dueDate)}</p>

                                      <p className="text-gray-400">Completion:</p>
                                      <div className="text-right flex items-center justify-end gap-2">
                                        <Progress
                                          value={ac.maintenanceStatus!.completionPercentage}
                                          className="h-2 w-[60px]"
                                        />
                                        <span>{ac.maintenanceStatus!.completionPercentage}%</span>
                                      </div>

                                      <p className="text-gray-400">Estimated Completion:</p>
                                      <p className="text-right">
                                        {ac.maintenanceStatus?.estimatedCompletion || "Unknown"}
                                      </p>

                                      {ac.maintenanceStatus?.assignedTechnicians && (
                                        <>
                                          <p className="text-gray-400">Assigned Technicians:</p>
                                          <p className="text-right">
                                            {ac.maintenanceStatus.assignedTechnicians.join(", ")}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400">No scheduled flights</p>
                                  )}
                                </div>
                              </div>

                              {/* Current Fault Information - Only show for AOG aircraft */}
                              {ac.status === "aog" && ac.currentFault && (
                                <div>
                                  <h4 className="text-base font-medium mb-4">Current Fault Information</h4>
                                  <div className="bg-gray-800 p-4 rounded-md">
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-400">{ac.currentFault.id}</span>
                                      </div>
                                      <p className="mt-1">{ac.currentFault.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-400">System</p>
                                        <p>{ac.currentFault.system}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Subsystem</p>
                                        <p>{ac.currentFault.subsystem}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">ATA Chapter</p>
                                        <p>{ac.currentFault.ataChapter}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Est. Resolution</p>
                                        <p>{ac.currentFault.estimatedResolution}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Reported</p>
                                        <p>
                                          {ac.currentFault.reportedTime
                                            ? formatDateTime(ac.currentFault.reportedTime)
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-400">Impact</p>
                                        <p className="capitalize">{ac.currentFault.impact || "High"}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 flex">
                                    <Link
                                      href={`/aircraft/${ac.id}/aog-history`}
                                      className="text-blue-400 flex items-center gap-1 text-sm hover:underline"
                                    >
                                      View Complete AOG History
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            {/* Work Orders Tab */}
                            <TabsContent value="wo" className="mt-0">
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-xl font-bold">Work Orders</h3>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                      <Input
                                        placeholder="Search work orders..."
                                        className="pl-8 bg-gray-800 border-gray-700 text-white"
                                        value={workOrderSearch}
                                        onChange={(e) => setWorkOrderSearch(e.target.value)}
                                      />
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700">New Work Order</Button>
                                  </div>
                                </div>

                                {/* Work Orders List */}
                                <div className="space-y-4">
                                  {getFilteredWorkOrders(ac.id).length > 0 ? (
                                    getFilteredWorkOrders(ac.id).map((wo) => (
                                      <div key={wo.id} className="bg-gray-800 p-4 rounded-md">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5 text-blue-400" />
                                            <span className="text-blue-400 font-bold">{wo.id}</span>
                                            {getWorkOrderStatusBadge(wo.status)}
                                            {getWorkOrderPriorityBadge(wo.priority)}
                                          </div>
                                          <div className="text-sm text-gray-400">{wo.type}</div>
                                        </div>

                                        <div className="mb-4">
                                          <p className="text-lg font-medium">{wo.description}</p>
                                          {wo.ataChapter && (
                                            <p className="text-sm text-gray-400 mt-1">{wo.ataChapter}</p>
                                          )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                          <div>
                                            <p className="text-xs text-gray-400">CREATED:</p>
                                            <p className="font-medium">{formatDate(wo.createdDate)}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-400">DUE DATE:</p>
                                            <p className="font-medium">{formatDate(wo.dueDate)}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-400">EST. MAN HOURS:</p>
                                            <p className="font-medium">{wo.estimatedManHours}</p>
                                          </div>
                                          {wo.actualManHours && (
                                            <div>
                                              <p className="text-xs text-gray-400">ACTUAL HOURS:</p>
                                              <p className="font-medium">{wo.actualManHours}</p>
                                            </div>
                                          )}
                                        </div>

                                        {/* Task Cards */}
                                        <div className="mb-4">
                                          <p className="text-sm font-medium mb-2">Task Cards</p>
                                          <div className="space-y-2">
                                            {wo.taskCards.map((task) => (
                                              <div
                                                key={task.id}
                                                className="flex items-center gap-2 bg-gray-700 p-2 rounded-md"
                                              >
                                                {getTaskStatusIcon(task.status)}
                                                <div className="flex-1">
                                                  <p className="text-sm">{task.description}</p>
                                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span>{task.estimatedHours} hrs est.</span>
                                                    {task.actualHours && <span>{task.actualHours} hrs actual</span>}
                                                    {task.assignedTo && (
                                                      <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {task.assignedTo}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                <Badge
                                                  className={
                                                    task.status === "COMPLETED"
                                                      ? "bg-green-500"
                                                      : task.status === "IN PROGRESS"
                                                        ? "bg-amber-500"
                                                        : task.status === "DEFERRED"
                                                          ? "bg-purple-500"
                                                          : "bg-gray-500"
                                                  }
                                                >
                                                  {task.status}
                                                </Badge>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Parts Section */}
                                        {wo.parts && wo.parts.length > 0 && (
                                          <div className="mb-4">
                                            <p className="text-sm font-medium mb-2">Parts</p>
                                            <div className="space-y-2">
                                              {wo.parts.map((part, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-center justify-between bg-gray-700 p-2 rounded-md"
                                                >
                                                  <div>
                                                    <p className="text-sm">{part.description}</p>
                                                    <p className="text-xs text-gray-400">P/N: {part.partNumber}</p>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-sm">Qty: {part.quantity}</span>
                                                    <Badge
                                                      className={
                                                        part.status === "AVAILABLE"
                                                          ? "bg-green-500"
                                                          : part.status === "INSTALLED"
                                                            ? "bg-blue-500"
                                                            : part.status === "ON ORDER"
                                                              ? "bg-amber-500"
                                                              : "bg-red-500"
                                                      }
                                                    >
                                                      {part.status}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Notes Section */}
                                        {wo.notes && wo.notes.length > 0 && (
                                          <div className="mb-4">
                                            <p className="text-sm font-medium mb-2">Notes</p>
                                            <div className="space-y-2">
                                              {wo.notes.map((note, idx) => (
                                                <div key={idx} className="bg-gray-700 p-2 rounded-md">
                                                  <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">{note.author}</span>
                                                    <span className="text-xs text-gray-400">
                                                      {formatDateTime(note.timestamp)}
                                                    </span>
                                                  </div>
                                                  <p className="text-sm">{note.text}</p>
                                                  {note.attachments && note.attachments.length > 0 && (
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-blue-400">
                                                      <Paperclip className="h-3 w-3" />
                                                      {note.attachments.join(", ")}
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Assigned Technicians */}
                                        <div>
                                          <p className="text-sm font-medium mb-2">Assigned Technicians</p>
                                          <div className="flex flex-wrap gap-2">
                                            {wo.assignedTechnicians.map((tech, idx) => (
                                              <Badge key={idx} className="bg-gray-700 text-white">
                                                <User className="h-3 w-3 mr-1" />
                                                {tech}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Related MEL if applicable */}
                                        {wo.relatedMEL && (
                                          <div className="mt-4 pt-4 border-t border-gray-700">
                                            <p className="text-sm text-amber-400">Related MEL: #{wo.relatedMEL}</p>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-4 text-center text-gray-400">
                                      <p>No work orders found</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="create-event" className="mt-0">
                              <div className="space-y-6">
                                <div className="p-4 bg-gray-800 rounded-md">
                                  <h3 className="text-xl font-bold mb-4">Add New Remark</h3>

                                  <div className="space-y-4">
                                    <div>
                                      <label htmlFor="update-type" className="block text-sm font-medium mb-1">
                                        Update Type:
                                      </label>
                                      <Select value={updateType} onValueChange={setUpdateType}>
                                        <SelectTrigger id="update-type" className="w-full bg-gray-700 border-gray-600">
                                          <SelectValue placeholder="Select update type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="OEM (Supplier)">OEM (Supplier)</SelectItem>
                                          <SelectItem value="Start of Maintenance">Start of Maintenance</SelectItem>
                                          <SelectItem value="RPR (Repair)">RPR (Repair)</SelectItem>
                                          <SelectItem value="TRS (Troubleshooting)">TRS (Troubleshooting)</SelectItem>
                                          <SelectItem value="MOV (Aircraft Movement)">
                                            MOV (Aircraft Movement)
                                          </SelectItem>
                                          <SelectItem value="PAR (Parts)">PAR (Parts)</SelectItem>
                                          <SelectItem value="ENG (Engineering)">ENG (Engineering)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label htmlFor="remarks" className="block text-sm font-medium mb-1">
                                        Remarks:
                                      </label>
                                      <Textarea
                                        id="remarks"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Enter details about the event..."
                                        className="min-h-[120px] bg-gray-700 border-gray-600"
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
                                      >
                                        <Camera className="h-4 w-4" />
                                        Take Photo
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
                                      >
                                        <Paperclip className="h-4 w-4" />
                                        Attach File
                                      </Button>
                                    </div>

                                    <div className="flex justify-end">
                                      <Button onClick={handleAddLogEntry} className="bg-blue-600 hover:bg-blue-700">
                                        Add Remark
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">Remarks History</h3>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-gray-800 hover:bg-gray-700 text-white"
                                      >
                                        Filter
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-gray-800 hover:bg-gray-700 text-white"
                                      >
                                        Export
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Timeline of remarks */}
                                  <div className="space-y-1">
                                    {allRemarks[ac.id]?.map((remark, index) => (
                                      <div
                                        key={remark.id}
                                        className={`bg-gray-800 p-4 rounded-md ${index === 0 ? "border-l-4 border-blue-500" : ""}`}
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{remark.type}</h4>
                                            <Badge className="bg-gray-700">{remark.author}</Badge>
                                          </div>
                                          <span className="text-sm text-gray-400">
                                            {new Date(remark.timestamp).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: false,
                                            })}
                                          </span>
                                        </div>
                                        <p className="text-sm mb-2">{remark.text}</p>

                                        {remark.attachments && remark.attachments.length > 0 && (
                                          <div className="flex items-center gap-2 mt-2">
                                            {remark.attachments.map((attachment, i) => (
                                              <div key={i} className="flex items-center gap-1 text-xs text-blue-400">
                                                <Paperclip className="h-3 w-3" />
                                                <span>{attachment}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        <div className="text-xs text-gray-500 mt-2">
                                          {new Date(remark.timestamp).toLocaleDateString([], {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="defects" className="mt-0 relative z-10">
                              <div className="min-h-[200px]">
                                <AircraftDefects defects={ac.defects || []} aircraftId={ac.id} />
                              </div>
                            </TabsContent>

                            <TabsContent value="mel" className="mt-0">
                              <div className="space-y-6">
                                <h3 className="text-xl font-bold">Minimum Equipment List</h3>

                                {ac.id === "AC129" ? (
                                  <div className="bg-gray-800 p-4 rounded-md border-l-4 border-amber-500">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <span className="text-amber-500 font-bold">
                                          MEL #{getAC129MELData().melNumber}
                                        </span>
                                        <Badge className="bg-amber-600">ATA: {getAC129MELData().ataNumber}</Badge>
                                      </div>
                                    </div>

                                    <div className="mb-4">
                                      <p className="text-lg font-medium mb-2">{getAC129MELData().restriction}</p>
                                      <p className="text-sm text-gray-400">{getAC129MELData().description}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                      <div>
                                        <p className="text-xs text-gray-400">DEFER DATE:</p>
                                        <p className="font-medium">{getAC129MELData().deferDate}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400">DUE DATE:</p>
                                        <p className="font-medium text-amber-400">{getAC129MELData().dueDate}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400">PLANNED LCL DATE:</p>
                                        <p className="font-medium">{getAC129MELData().lclDate}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-400">WORK ORDER:</p>
                                      <p className="font-medium">{getAC129MELData().workOrder}</p>
                                    </div>
                                  </div>
                                ) : ac.defects && ac.defects.length > 0 ? (
                                  <>
                                    {getMELItems(ac).length > 0 ? (
                                      getMELItems(ac).map((mel, index) => (
                                        <div
                                          key={index}
                                          className="bg-gray-800 p-4 rounded-md border-l-4 border-amber-500 mb-4"
                                        >
                                          <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                              <span className="text-amber-500 font-bold">MEL #{mel.melNumber}</span>
                                              <Badge className="bg-amber-600">ATA: {mel.ataNumber}</Badge>
                                            </div>
                                          </div>

                                          <div className="mb-4">
                                            <p className="text-lg font-medium mb-2">{mel.restriction}</p>
                                            <p className="text-sm text-gray-400">{mel.description}</p>
                                          </div>

                                          <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                              <p className="text-xs text-gray-400">DEFER DATE:</p>
                                              <p className="font-medium">{mel.deferDate}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-gray-400">DUE DATE:</p>
                                              <p className="font-medium text-amber-400">{mel.dueDate}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-gray-400">PLANNED LCL DATE:</p>
                                              <p className="font-medium">{mel.lclDate}</p>
                                            </div>
                                          </div>

                                          <div>
                                            <p className="text-xs text-gray-400">WORK ORDER:</p>
                                            <p className="font-medium">{mel.workOrder}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-4 text-center text-gray-400">
                                        <p>No MEL items for this aircraft</p>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="p-4 text-center text-gray-400">
                                    <p>No MEL items for this aircraft</p>
                                  </div>
                                )}

                                {/* MEL History Section */}
                                {(ac.id === "AC129" || (ac.defects && ac.defects.length > 0)) && (
                                  <div className="mt-4">
                                    <h4 className="text-lg font-medium mb-3">MEL History</h4>
                                    <div className="space-y-3">
                                      {ac.id === "AC129" ? (
                                        <>
                                          <div className="bg-gray-800 p-3 rounded-md">
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-amber-500 font-medium">MEL #21-31-02</span>
                                                <Badge className="bg-green-600">CLEARED</Badge>
                                              </div>
                                              <span className="text-sm text-gray-400">2025-02-15</span>
                                            </div>
                                            <p className="text-sm mb-1">CABIN PRESSURE CONTROLLER FAULT</p>
                                          </div>

                                          <div className="bg-gray-800 p-3 rounded-md">
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-amber-500 font-medium">MEL #33-44-01</span>
                                                <Badge className="bg-green-600">CLEARED</Badge>
                                              </div>
                                              <span className="text-sm text-gray-400">2025-01-22</span>
                                            </div>
                                            <p className="text-sm mb-1">CABIN READING LIGHT ROW 12 INOP</p>
                                          </div>
                                        </>
                                      ) : (
                                        getHistoricalMELItems(ac).map((item, index) => (
                                          <div key={index} className="bg-gray-800 p-3 rounded-md">
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-amber-500 font-medium">
                                                  MEL #{item.melNumber}
                                                </span>
                                                <Badge className="bg-green-600">{item.status}</Badge>
                                              </div>
                                              <span className="text-sm text-gray-400">{item.date}</span>
                                            </div>
                                            <p className="text-sm mb-1">{item.description}</p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-base font-medium">AOG History</h4>
                                  <Link
                                    href={`/aircraft/${ac.id}/aog-history`}
                                    className="text-blue-400 flex items-center gap-1 text-sm hover:underline"
                                  >
                                    View Complete History
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>
                                </div>

                                <div className="space-y-3">
                                  {/* This would be populated with actual AOG history data */}
                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">May 15, 2023</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">Hydraulic system pressure loss in Green system</p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 8h 10m</span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">Jan 22, 2023</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">Landing gear proximity sensor fault</p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 5h 15m</span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-red-500">AOG</Badge>
                                        <span className="text-sm">Nov 15, 2022</span>
                                      </div>
                                      <Badge className="bg-green-500">Resolved</Badge>
                                    </div>
                                    <p className="text-sm mb-1">
                                      Avionics system fault - Navigation display malfunction
                                    </p>
                                    <div className="flex items-center text-xs text-gray-400 gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Downtime: 2h 15m</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Right 1/3 - Communication */}
                        {/* <div className="col-span-1 bg-gray-900 border-l border-gray-700">
                          <div className="p-3 border-b border-gray-700">
                            <h3 className="font-medium text-white">Communication</h3>
                          </div>
                          <div className="h-[600px]">
                            <ChatPortal
                              open={true}
                              onOpenChange={() => {}}
                              aircraftId={ac.id}
                              aircraftReg={ac.registration}
                              simplified={true}
                            />
                          </div>
                        </div> */}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
