"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, AlertCircle, Clock, MapPin } from "lucide-react"
import { StationSelector } from "@/components/station-selector"

// Mock data - in a real app, this would come from a database
const chatGroups = [
  {
    id: 1,
    name: "FIN-1234 Response Team",
    status: "critical",
    lastMessage: "Parts will arrive in 30 minutes",
    lastMessageTime: "10:45 AM",
    unreadCount: 3,
    ataChapter: "72",
    subChapter: "72-30",
    description: "High pressure compressor stall detected during takeoff sequence",
    station: "YYZ", // Toronto
    members: [
      { id: 1, name: "John Smith", role: "Lead Engineer", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 2, name: "Maria Garcia", role: "Avionics Specialist", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 3, name: "Ahmed Hassan", role: "Mechanical Engineer", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 4, name: "Lisa Chen", role: "Operations Manager", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    messages: [
      {
        id: 1,
        sender: "System",
        content: "Group created for AOG aircraft FIN-1234",
        time: "08:30 AM",
        isSystem: true,
      },
      {
        id: 2,
        sender: "John Smith",
        content: "I'm heading to the aircraft now to assess the engine issue",
        time: "08:35 AM",
        isSystem: false,
        attachments: [],
      },
      {
        id: 3,
        sender: "Maria Garcia",
        content: "I'll join you in 10 minutes with the diagnostic equipment",
        time: "08:40 AM",
        isSystem: false,
        attachments: [],
      },
      {
        id: 4,
        sender: "Ahmed Hassan",
        content: "Initial assessment shows a compressor stall. We'll need replacement parts.",
        time: "09:15 AM",
        isSystem: false,
        attachments: [
          {
            id: 1,
            name: "compressor_inspection.pdf",
            type: "pdf",
            size: "2.4 MB",
            url: "#",
          },
        ],
      },
      {
        id: 5,
        sender: "Lisa Chen",
        content: "I've ordered the parts. ETA 30 minutes.",
        time: "09:30 AM",
        isSystem: false,
        attachments: [],
      },
      {
        id: 6,
        sender: "System",
        content: "Parts order #P-78901 has been placed",
        time: "09:32 AM",
        isSystem: true,
      },
      {
        id: 7,
        sender: "John Smith",
        content: "We'll prepare for installation. Estimated repair time is 4 hours once parts arrive.",
        time: "09:45 AM",
        isSystem: false,
        attachments: [
          {
            id: 2,
            name: "repair_plan.jpg",
            type: "image",
            size: "1.8 MB",
            url: "#",
          },
        ],
      },
      {
        id: 8,
        sender: "Lisa Chen",
        content: "Parts will arrive in 30 minutes",
        time: "10:45 AM",
        isSystem: false,
        attachments: [],
      },
    ],
  },
  {
    id: 2,
    name: "FIN-5678 Response Team",
    status: "in-progress",
    lastMessage: "Hydraulic system repair in progress",
    lastMessageTime: "10:30 AM",
    unreadCount: 0,
    ataChapter: "29",
    subChapter: "29-10",
    description: "Main hydraulic system pressure loss due to leak in landing gear actuator",
    station: "YUL", // Montreal
    members: [
      { id: 5, name: "Sarah Johnson", role: "Hydraulics Specialist", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 6, name: "Carlos Rodriguez", role: "Maintenance Engineer", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 7, name: "Emma Wilson", role: "Quality Control", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    messages: [
      {
        id: 1,
        sender: "System",
        content: "Group created for AOG aircraft FIN-5678",
        time: "10:15 AM",
        isSystem: true,
      },
      {
        id: 2,
        sender: "Sarah Johnson",
        content: "Hydraulic leak identified in the landing gear system",
        time: "10:20 AM",
        isSystem: false,
        attachments: [
          {
            id: 3,
            name: "hydraulic_leak.jpg",
            type: "image",
            size: "3.2 MB",
            url: "#",
          },
        ],
      },
      {
        id: 3,
        sender: "Carlos Rodriguez",
        content: "I've got the replacement parts ready",
        time: "10:25 AM",
        isSystem: false,
        attachments: [],
      },
      {
        id: 4,
        sender: "Sarah Johnson",
        content: "Hydraulic system repair in progress",
        time: "10:30 AM",
        isSystem: false,
        attachments: [],
      },
    ],
  },
  {
    id: 3,
    name: "FIN-9012 Response Team",
    status: "in-progress",
    lastMessage: "Avionics system diagnostics complete",
    lastMessageTime: "10:15 AM",
    unreadCount: 1,
    ataChapter: "34",
    subChapter: "34-25",
    description: "Navigation display system showing intermittent failures during pre-flight checks",
    station: "YVR", // Vancouver
    members: [
      { id: 8, name: "David Chen", role: "Avionics Engineer", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 9, name: "Emma Wilson", role: "Quality Control", avatar: "/placeholder.svg?height=40&width=40" },
      { id: 10, name: "Michael Brown", role: "Technical Support", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    messages: [
      {
        id: 1,
        sender: "System",
        content: "Group created for AOG aircraft FIN-9012",
        time: "09:45 AM",
        isSystem: true,
      },
      {
        id: 2,
        sender: "David Chen",
        content: "Starting avionics system diagnostics",
        time: "09:50 AM",
        isSystem: false,
        attachments: [],
      },
      {
        id: 3,
        sender: "Michael Brown",
        content: "Let me know if you need technical documentation",
        time: "10:00 AM",
        isSystem: false,
        attachments: [
          {
            id: 4,
            name: "avionics_manual.pdf",
            type: "pdf",
            size: "5.7 MB",
            url: "#",
          },
        ],
      },
      {
        id: 4,
        sender: "David Chen",
        content: "Avionics system diagnostics complete",
        time: "10:15 AM",
        isSystem: false,
        attachments: [
          {
            id: 5,
            name: "diagnostic_results.xlsx",
            type: "excel",
            size: "1.2 MB",
            url: "#",
          },
        ],
      },
    ],
  },
]

export function ActiveChats() {
  const [selectedChat, setSelectedChat] = useState(chatGroups[0])
  const [newMessage, setNewMessage] = useState("")
  const [selectedStation, setSelectedStation] = useState("ALL")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return null
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // In a real app, this would send the message to a backend
    console.log("Sending message:", newMessage)

    // Clear the input
    setNewMessage("")
  }

  // Filter chat groups by station
  const filteredChatGroups =
    selectedStation === "ALL" ? chatGroups : chatGroups.filter((chat) => chat.station === selectedStation)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Active Chat Groups</h2>
        <StationSelector value={selectedStation} onChange={setSelectedStation} />
      </div>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Chat Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {filteredChatGroups.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-muted ${
                      selectedChat.id === chat.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getStatusIcon(chat.status)}
                      </div>
                      <div>
                        <div className="font-medium">{chat.name}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {chat.station}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-muted-foreground">{chat.lastMessageTime}</div>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{selectedChat.name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {selectedChat.station} • {selectedChat.members.length} members
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-0">
                <div className="flex h-[calc(100vh-20rem)] flex-col justify-between">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4 py-4">
                      {selectedChat.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isSystem ? "justify-center" : "gap-3"}`}>
                          {!message.isSystem && (
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                              <AvatarFallback>
                                {message.sender
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`flex max-w-[80%] flex-col ${message.isSystem ? "items-center" : ""}`}>
                            {!message.isSystem && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{message.time}</span>
                              </div>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
                                message.isSystem ? "bg-muted text-xs text-muted-foreground" : "bg-primary/10"
                              }`}
                            >
                              {message.content}
                            </div>

                            {/* Display attachments if any */}
                            {!message.isSystem && message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center gap-2 rounded-md border p-2 text-sm"
                                  >
                                    {attachment.type === "pdf" && (
                                      <div className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">PDF</div>
                                    )}
                                    {attachment.type === "image" && (
                                      <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">IMG</div>
                                    )}
                                    {attachment.type === "excel" && (
                                      <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">XLS</div>
                                    )}
                                    <span className="flex-1">{attachment.name}</span>
                                    <span className="text-xs text-muted-foreground">{attachment.size}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="members" className="mt-0">
                <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                  <div className="space-y-4">
                    {selectedChat.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="files" className="mt-0">
                <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                  {selectedChat.messages.some((m) => m.attachments && m.attachments.length > 0) ? (
                    <div className="space-y-4">
                      {selectedChat.messages
                        .filter((m) => m.attachments && m.attachments.length > 0)
                        .flatMap((m) => m.attachments || [])
                        .map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-3 rounded-lg border p-3">
                            {attachment.type === "pdf" && (
                              <div className="rounded bg-red-100 p-2 text-red-800">PDF</div>
                            )}
                            {attachment.type === "image" && (
                              <div className="rounded bg-blue-100 p-2 text-blue-800">IMG</div>
                            )}
                            {attachment.type === "excel" && (
                              <div className="rounded bg-green-100 p-2 text-green-800">XLS</div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{attachment.name}</div>
                              <div className="text-sm text-muted-foreground">{attachment.size}</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>No files shared yet</p>
                        <Button variant="outline" className="mt-4">
                          <Paperclip className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
