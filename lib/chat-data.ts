export type ChatMessage = {
  id: string
  aircraftId: string
  sender: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  content: string
  timestamp: string
  attachments?: {
    id: string
    name: string
    type: string
    url: string
    thumbnailUrl?: string
    size?: string
  }[]
  isRead?: boolean
}

export type ChatThread = {
  id: string
  aircraftId: string
  title: string
  participants: {
    id: string
    name: string
    role: string
    avatar?: string
  }[]
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  status: "active" | "resolved" | "pending"
  priority: "low" | "medium" | "high" | "critical"
  relatedTo?: {
    type: string
    id: string
    description: string
  }
}

// Mock users
const users = {
  pilot1: {
    id: "user-1",
    name: "Capt. James Wilson",
    role: "Pilot",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  engineer1: {
    id: "user-2",
    name: "Sarah Chen",
    role: "Maintenance Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  dispatcher1: {
    id: "user-3",
    name: "Michael Rodriguez",
    role: "Flight Dispatcher",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  mechanic1: {
    id: "user-4",
    name: "Ahmed Hassan",
    role: "Aircraft Mechanic",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  manager1: {
    id: "user-5",
    name: "Lisa Johnson",
    role: "Maintenance Manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  technician1: {
    id: "user-6",
    name: "Carlos Mendez",
    role: "Avionics Technician",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  ops1: {
    id: "user-7",
    name: "Emma Thompson",
    role: "Operations Controller",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  system: {
    id: "system",
    name: "System",
    role: "Automated Notification",
    avatar: "/placeholder.svg?height=40&width=40",
  },
}

// Mock chat threads
export const chatThreads: ChatThread[] = [
  // AC001 - Engine failure thread
  {
    id: "thread-1",
    aircraftId: "AC001",
    title: "Engine #2 N1 rotation issue",
    participants: [users.pilot1, users.engineer1, users.manager1, users.mechanic1],
    messages: [
      {
        id: "msg-1-1",
        aircraftId: "AC001",
        sender: users.pilot1,
        content:
          "During pre-flight checks, we've noticed abnormal N1 rotation on Engine #2. FADEC is showing fault code E2-4372. Request maintenance assistance.",
        timestamp: "2023-05-15T08:10:00Z",
      },
      {
        id: "msg-1-2",
        aircraftId: "AC001",
        sender: users.system,
        content: "AOG status has been automatically triggered for AC001 based on critical fault detection.",
        timestamp: "2023-05-15T08:12:00Z",
      },
      {
        id: "msg-1-3",
        aircraftId: "AC001",
        sender: users.engineer1,
        content:
          "Acknowledged. Maintenance team is being dispatched to your location. Please provide FADEC diagnostic readout if possible.",
        timestamp: "2023-05-15T08:15:00Z",
      },
      {
        id: "msg-1-4",
        aircraftId: "AC001",
        sender: users.pilot1,
        content: "Here's the FADEC diagnostic readout. Engine parameters are out of normal range.",
        timestamp: "2023-05-15T08:20:00Z",
        attachments: [
          {
            id: "attach-1-1",
            name: "FADEC_Diagnostic_AC001_E2.pdf",
            type: "application/pdf",
            url: "#",
            size: "1.2 MB",
          },
        ],
      },
      {
        id: "msg-1-5",
        aircraftId: "AC001",
        sender: users.manager1,
        content:
          "I've reviewed the diagnostic data. This appears to be a fuel metering issue. We'll need to replace the fuel metering unit. Estimated repair time is 7 hours.",
        timestamp: "2023-05-15T08:45:00Z",
      },
      {
        id: "msg-1-6",
        aircraftId: "AC001",
        sender: users.ops1,
        content:
          "Operations has been notified. We're rescheduling AC016 and subsequent flights. Passengers will be notified of the delay.",
        timestamp: "2023-05-15T09:00:00Z",
      },
      {
        id: "msg-1-7",
        aircraftId: "AC001",
        sender: users.mechanic1,
        content: "Team has arrived at the aircraft. Beginning inspection of Engine #2 fuel metering system.",
        timestamp: "2023-05-15T09:15:00Z",
      },
      {
        id: "msg-1-8",
        aircraftId: "AC001",
        sender: users.mechanic1,
        content:
          "Initial inspection confirms fuel metering unit malfunction. We've located a replacement part in our YVR inventory. Estimated time to retrieve and install is 5-6 hours.",
        timestamp: "2023-05-15T09:45:00Z",
        attachments: [
          {
            id: "attach-1-2",
            name: "Engine2_Inspection_Photos.zip",
            type: "application/zip",
            url: "#",
            size: "8.5 MB",
          },
        ],
      },
      {
        id: "msg-1-9",
        aircraftId: "AC001",
        sender: users.manager1,
        content:
          "Approved for part replacement. Please proceed with the repair and keep this thread updated with progress.",
        timestamp: "2023-05-15T10:00:00Z",
      },
      {
        id: "msg-1-10",
        aircraftId: "AC001",
        sender: users.mechanic1,
        content: "Replacement part has arrived. Beginning removal of faulty component.",
        timestamp: "2023-05-15T11:30:00Z",
      },
    ],
    createdAt: "2023-05-15T08:10:00Z",
    updatedAt: "2023-05-15T11:30:00Z",
    status: "active",
    priority: "critical",
    relatedTo: {
      type: "fault",
      id: "F-2023-0456",
      description: "Engine #2 failure - N1 rotation issue with FADEC fault indication",
    },
  },

  // AC003 - Engine oil pressure thread
  {
    id: "thread-2",
    aircraftId: "AC003",
    title: "Engine oil pressure fluctuations",
    participants: [users.pilot1, users.engineer1, users.mechanic1, users.ops1],
    messages: [
      {
        id: "msg-2-1",
        aircraftId: "AC003",
        sender: users.pilot1,
        content:
          "During pre-flight checks, we're seeing oil pressure fluctuations on both engines. Values are oscillating between 38-52 PSI. Normal range should be steady at 42-45 PSI.",
        timestamp: "2023-05-15T11:25:00Z",
      },
      {
        id: "msg-2-2",
        aircraftId: "AC003",
        sender: users.engineer1,
        content:
          "Can you confirm if there are any other abnormal indications? Any unusual vibrations or temperature readings?",
        timestamp: "2023-05-15T11:28:00Z",
      },
      {
        id: "msg-2-3",
        aircraftId: "AC003",
        sender: users.pilot1,
        content:
          "No unusual vibrations, but oil temperature is slightly elevated at 112°C. Here's the EICAS screenshot showing the fluctuations over the last 15 minutes.",
        timestamp: "2023-05-15T11:32:00Z",
        attachments: [
          {
            id: "attach-2-1",
            name: "EICAS_OilPressure_AC003.jpg",
            type: "image/jpeg",
            url: "#",
            thumbnailUrl: "#",
            size: "1.8 MB",
          },
        ],
      },
      {
        id: "msg-2-4",
        aircraftId: "AC003",
        sender: users.system,
        content: "AOG status has been automatically triggered for AC003 based on critical engine parameter deviation.",
        timestamp: "2023-05-15T11:35:00Z",
      },
      {
        id: "msg-2-5",
        aircraftId: "AC003",
        sender: users.engineer1,
        content:
          "Based on the data, this appears to be an oil pump pressure regulator issue. We'll need to dispatch a team to inspect and potentially replace the regulators on both engines.",
        timestamp: "2023-05-15T11:40:00Z",
      },
      {
        id: "msg-2-6",
        aircraftId: "AC003",
        sender: users.ops1,
        content:
          "Operations notified. We're looking at a minimum 4-hour delay for flight AC881. Passenger notifications are being prepared.",
        timestamp: "2023-05-15T11:45:00Z",
      },
      {
        id: "msg-2-7",
        aircraftId: "AC003",
        sender: users.mechanic1,
        content: "Maintenance team dispatched from CDG main hangar. ETA to aircraft is 30 minutes.",
        timestamp: "2023-05-15T11:50:00Z",
      },
    ],
    createdAt: "2023-05-15T11:25:00Z",
    updatedAt: "2023-05-15T11:50:00Z",
    status: "active",
    priority: "high",
    relatedTo: {
      type: "fault",
      id: "F-2023-0789",
      description: "Engine oil pressure fluctuations detected during pre-flight checks",
    },
  },

  // AC002 - APU start failure thread
  {
    id: "thread-3",
    aircraftId: "AC002",
    title: "APU start failure during C-Check",
    participants: [users.engineer1, users.technician1, users.manager1],
    messages: [
      {
        id: "msg-3-1",
        aircraftId: "AC002",
        sender: users.technician1,
        content:
          "During C-Check testing, APU failed to start. Getting fault code APU-285. Initial inspection shows possible fuel control unit issue.",
        timestamp: "2023-05-10T14:20:00Z",
      },
      {
        id: "msg-3-2",
        aircraftId: "AC002",
        sender: users.engineer1,
        content:
          "Please run the APU diagnostic test sequence and send me the results. We'll need to determine if this is related to the recent APU controller update.",
        timestamp: "2023-05-10T14:25:00Z",
      },
      {
        id: "msg-3-3",
        aircraftId: "AC002",
        sender: users.technician1,
        content:
          "Diagnostic test completed. Results attached. Test confirms fuel control unit malfunction. Recommend replacement.",
        timestamp: "2023-05-10T14:45:00Z",
        attachments: [
          {
            id: "attach-3-1",
            name: "APU_Diagnostic_Results.pdf",
            type: "application/pdf",
            url: "#",
            size: "2.3 MB",
          },
        ],
      },
      {
        id: "msg-3-4",
        aircraftId: "AC002",
        sender: users.manager1,
        content:
          "Approved for FCU replacement. Please add this to the C-Check work package. Do we have the part in stock?",
        timestamp: "2023-05-10T15:00:00Z",
      },
      {
        id: "msg-3-5",
        aircraftId: "AC002",
        sender: users.technician1,
        content: "Confirmed part is in stock. Will add to work package and schedule replacement for tomorrow morning.",
        timestamp: "2023-05-10T15:10:00Z",
      },
    ],
    createdAt: "2023-05-10T14:20:00Z",
    updatedAt: "2023-05-10T15:10:00Z",
    status: "active",
    priority: "medium",
    relatedTo: {
      type: "maintenance",
      id: "C-CHECK-2023-AC002",
      description: "C-Check Maintenance",
    },
  },

  // AC123 - Routine maintenance thread
  {
    id: "thread-4",
    aircraftId: "AC123",
    title: "Pre-flight inspection findings",
    participants: [users.pilot1, users.mechanic1],
    messages: [
      {
        id: "msg-4-1",
        aircraftId: "AC123",
        sender: users.pilot1,
        content:
          "During walk-around, noticed a small dent on the leading edge of the right wing, approximately 30cm from the wing root. Can maintenance take a look before our departure?",
        timestamp: "2023-05-15T13:15:00Z",
        attachments: [
          {
            id: "attach-4-1",
            name: "Wing_Dent_Photo.jpg",
            type: "image/jpeg",
            url: "#",
            thumbnailUrl: "#",
            size: "1.2 MB",
          },
        ],
      },
      {
        id: "msg-4-2",
        aircraftId: "AC123",
        sender: users.mechanic1,
        content:
          "Received. Sending a technician to your location now. Will assess if this is within allowable damage limits.",
        timestamp: "2023-05-15T13:18:00Z",
      },
      {
        id: "msg-4-3",
        aircraftId: "AC123",
        sender: users.mechanic1,
        content:
          "Technician has inspected the dent. It measures 2.3cm x 1.5cm with a depth of 0.4cm, which is within allowable limits per SRM 57-10-01. Aircraft is cleared for flight. We've documented this in the maintenance log for future reference.",
        timestamp: "2023-05-15T13:35:00Z",
        attachments: [
          {
            id: "attach-4-2",
            name: "Damage_Assessment_Report.pdf",
            type: "application/pdf",
            url: "#",
            size: "0.8 MB",
          },
        ],
      },
      {
        id: "msg-4-4",
        aircraftId: "AC123",
        sender: users.pilot1,
        content: "Thank you for the quick response. Acknowledged and proceeding with flight preparations.",
        timestamp: "2023-05-15T13:38:00Z",
      },
    ],
    createdAt: "2023-05-15T13:15:00Z",
    updatedAt: "2023-05-15T13:38:00Z",
    status: "resolved",
    priority: "low",
  },

  // AC808 - Weather radar issue thread
  {
    id: "thread-5",
    aircraftId: "AC808",
    title: "Weather radar false returns",
    participants: [users.pilot1, users.technician1, users.engineer1],
    messages: [
      {
        id: "msg-5-1",
        aircraftId: "AC808",
        sender: users.pilot1,
        content:
          "We've been experiencing intermittent false returns on the weather radar system. Issue occurs approximately every 15-20 minutes and lasts for about 30 seconds. System then returns to normal operation.",
        timestamp: "2023-05-13T11:15:00Z",
      },
      {
        id: "msg-5-2",
        aircraftId: "AC808",
        sender: users.engineer1,
        content:
          "Can you provide more details? Are the false returns appearing in any specific pattern or location on the display?",
        timestamp: "2023-05-13T11:20:00Z",
      },
      {
        id: "msg-5-3",
        aircraftId: "AC808",
        sender: users.pilot1,
        content:
          "The false returns typically appear as scattered precipitation echoes across the entire display, regardless of actual weather conditions. I've attached a video showing the issue occurring during our last flight.",
        timestamp: "2023-05-13T11:25:00Z",
        attachments: [
          {
            id: "attach-5-1",
            name: "Weather_Radar_Issue.mp4",
            type: "video/mp4",
            url: "#",
            size: "5.7 MB",
          },
        ],
      },
      {
        id: "msg-5-4",
        aircraftId: "AC808",
        sender: users.technician1,
        content:
          "Based on the video, this appears to be a known issue with the signal processing module. We'll need to perform diagnostic tests and possibly replace the module. Can you confirm when the aircraft will be available for maintenance?",
        timestamp: "2023-05-13T11:40:00Z",
      },
      {
        id: "msg-5-5",
        aircraftId: "AC808",
        sender: users.pilot1,
        content:
          "Aircraft will be at YUL overnight tonight. Available for maintenance from approximately 19:00 until 05:00 tomorrow.",
        timestamp: "2023-05-13T11:45:00Z",
      },
      {
        id: "msg-5-6",
        aircraftId: "AC808",
        sender: users.technician1,
        content: "Scheduled maintenance for tonight at 20:00. Will update this thread with findings and resolution.",
        timestamp: "2023-05-13T12:00:00Z",
      },
    ],
    createdAt: "2023-05-13T11:15:00Z",
    updatedAt: "2023-05-13T12:00:00Z",
    status: "pending",
    priority: "medium",
    relatedTo: {
      type: "defect",
      id: "DEF-2023-0133",
      description: "Weather radar occasional false returns",
    },
  },
]

// Function to get chat threads for a specific aircraft
export function getChatThreadsForAircraft(aircraftId: string): ChatThread[] {
  return chatThreads.filter((thread) => thread.aircraftId === aircraftId)
}

// Function to get all messages for a specific aircraft
export function getAllMessagesForAircraft(aircraftId: string): ChatMessage[] {
  const threads = getChatThreadsForAircraft(aircraftId)
  return threads.flatMap((thread) => thread.messages)
}

// Function to get the most recent message for each aircraft
export function getMostRecentMessageByAircraft(): Record<string, ChatMessage> {
  const result: Record<string, ChatMessage> = {}

  chatThreads.forEach((thread) => {
    if (thread.messages.length > 0) {
      const mostRecent = thread.messages.reduce((latest, current) => {
        return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      })

      if (
        !result[thread.aircraftId] ||
        new Date(mostRecent.timestamp) > new Date(result[thread.aircraftId].timestamp)
      ) {
        result[thread.aircraftId] = mostRecent
      }
    }
  })

  return result
}

