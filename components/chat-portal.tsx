"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, CheckCheck, Clock, Send, File, Paperclip } from "lucide-react"

// Types
interface ChatMessage {
  id: string
  senderId: string
  text: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "file" | "audio"
    url: string
    name?: string
    size?: string
  }[]
  isSystemMessage?: boolean
}

interface ChatMember {
  id: string
  name: string
  avatar: string
  role: string
  status: "online" | "offline" | "away"
  lastSeen?: string
}

interface ChatGroup {
  id: string
  name: string
  description?: string
  members: ChatMember[]
  messages: ChatMessage[]
  createdAt: string
  aircraftFin?: string
  aircraftReg?: string
  aircraftType?: string
  aircraftIssue?: string
  ataChapter?: string
  subChapter?: string
  issueDescription?: string
  isAOGGroup: boolean
}

// Mock data
const mockUsers: Record<string, ChatMember> = {
  "user-1": {
    id: "user-1",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Lead Engineer",
    status: "online",
  },
  "user-2": {
    id: "user-2",
    name: "Maria Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Avionics Specialist",
    status: "online",
  },
  "user-3": {
    id: "user-3",
    name: "Ahmed Hassan",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Mechanical Engineer",
    status: "away",
    lastSeen: "10 minutes ago",
  },
  "user-4": {
    id: "user-4",
    name: "Lisa Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Operations Manager",
    status: "offline",
    lastSeen: "2 hours ago",
  },
  "user-5": {
    id: "user-5",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Hydraulics Specialist",
    status: "online",
  },
  "user-6": {
    id: "user-6",
    name: "Carlos Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Maintenance Engineer",
    status: "online",
  },
  system: {
    id: "system",
    name: "System",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Automated Notifications",
    status: "online",
  },
  "current-user": {
    id: "current-user",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Engineer",
    status: "online",
  },
}

// Enhanced mock chat groups with attachments
const mockChatGroups: ChatGroup[] = [
  {
    id: "group-1",
    name: "AC123 (C-FGDT) Response Team",
    description: "AOG response team for aircraft AC123 (C-FGDT)",
    members: [
      mockUsers["user-1"],
      mockUsers["user-2"],
      mockUsers["user-3"],
      mockUsers["user-4"],
      mockUsers["current-user"],
    ],
    messages: [
      {
        id: "msg-1",
        senderId: "system",
        text: "Group created for AOG aircraft AC123 (C-FGDT) - ATA Chapter 72 (Engine) - High pressure compressor stall",
        timestamp: "2023-05-15T04:30:00Z",
        status: "delivered",
        isSystemMessage: true,
      },
      {
        id: "msg-2",
        senderId: "user-1",
        text: "I'm heading to the aircraft now to assess the engine issue",
        timestamp: "2023-05-15T04:35:00Z",
        status: "read",
      },
      {
        id: "msg-3",
        senderId: "user-2",
        text: "I'll join you in 10 minutes with the diagnostic equipment",
        timestamp: "2023-05-15T04:40:00Z",
        status: "read",
      },
      {
        id: "msg-4",
        senderId: "user-3",
        text: "Initial assessment shows a compressor stall. We'll need replacement parts.",
        timestamp: "2023-05-15T05:15:00Z",
        status: "read",
        attachments: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=400",
            name: "engine-inspection.jpg",
            size: "2.4 MB",
          },
        ],
      },
      {
        id: "msg-5",
        senderId: "user-4",
        text: "I've ordered the parts. ETA 30 minutes.",
        timestamp: "2023-05-15T05:30:00Z",
        status: "read",
      },
      {
        id: "msg-6",
        senderId: "system",
        text: "Parts order #P-78901 has been placed",
        timestamp: "2023-05-15T05:32:00Z",
        status: "delivered",
        isSystemMessage: true,
      },
      {
        id: "msg-7",
        senderId: "user-1",
        text: "We'll prepare for installation. Estimated repair time is 4 hours once parts arrive.",
        timestamp: "2023-05-15T05:45:00Z",
        status: "read",
        attachments: [
          {
            type: "file",
            url: "#",
            name: "GE90-115B_Repair_Procedure.pdf",
            size: "4.8 MB",
          },
        ],
      },
      {
        id: "msg-8",
        senderId: "user-4",
        text: "Parts will arrive in 30 minutes",
        timestamp: "2023-05-15T06:45:00Z",
        status: "read",
      },
    ],
    createdAt: "2023-05-15T04:30:00Z",
    aircraftFin: "AC123",
    aircraftReg: "C-FGDT",
    aircraftType: "Boeing 777-300ER",
    aircraftIssue: "Engine failure",
    ataChapter: "72",
    subChapter: "72-30",
    issueDescription: "High pressure compressor stall detected during takeoff sequence",
    isAOGGroup: true,
  },
  {
    id: "group-2",
    name: "AC456 (C-GITS) Response Team",
    description: "AOG response team for aircraft AC456 (C-GITS)",
    members: [mockUsers["user-5"], mockUsers["user-6"], mockUsers["current-user"]],
    messages: [
      {
        id: "msg-1",
        senderId: "system",
        text: "Group created for AOG aircraft AC456 (C-GITS) - ATA Chapter 29 (Hydraulic Power) - Main hydraulic system pressure loss",
        timestamp: "2023-05-15T10:15:00Z",
        status: "delivered",
        isSystemMessage: true,
      },
      {
        id: "msg-2",
        senderId: "user-5",
        text: "Hydraulic leak identified in the landing gear system",
        timestamp: "2023-05-15T10:20:00Z",
        status: "read",
        attachments: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=400",
            name: "hydraulic-leak.jpg",
            size: "1.8 MB",
          },
        ],
      },
      {
        id: "msg-3",
        senderId: "user-6",
        text: "I've got the replacement parts ready",
        timestamp: "2023-05-15T10:25:00Z",
        status: "read",
      },
      {
        id: "msg-4",
        senderId: "user-5",
        text: "Hydraulic system repair in progress",
        timestamp: "2023-05-15T10:30:00Z",
        status: "read",
      },
    ],
    createdAt: "2023-05-15T10:15:00Z",
    aircraftFin: "AC456",
    aircraftReg: "C-GITS",
    aircraftType: "Airbus A330-300",
    aircraftIssue: "Hydraulic system leak",
    ataChapter: "29",
    subChapter: "29-10",
    issueDescription: "Main hydraulic system pressure loss due to leak in landing gear actuator",
    isAOGGroup: true,
  },
  {
    id: "group-3",
    name: "Air Canada Engineering Team",
    description: "General engineering team discussions",
    members: [
      mockUsers["user-1"],
      mockUsers["user-2"],
      mockUsers["user-3"],
      mockUsers["user-5"],
      mockUsers["user-6"],
      mockUsers["current-user"],
    ],
    messages: [
      {
        id: "msg-1",
        senderId: "user-1",
        text: "Team meeting tomorrow at 9 AM to discuss the new maintenance procedures",
        timestamp: "2023-05-14T15:00:00Z",
        status: "read",
      },
      {
        id: "msg-2",
        senderId: "user-2",
        text: "I'll prepare the presentation on the avionics updates",
        timestamp: "2023-05-14T15:05:00Z",
        status: "read",
        attachments: [
          {
            type: "file",
            url: "#",
            name: "Avionics_Updates_Q2_2023.pptx",
            size: "3.2 MB",
          },
        ],
      },
      {
        id: "msg-3",
        senderId: "user-3",
        text: "Don't forget we also need to review the new safety protocols",
        timestamp: "2023-05-14T15:10:00Z",
        status: "read",
      },
    ],
    createdAt: "2023-01-01T00:00:00Z",
    isAOGGroup: false,
  },
]

// Helper functions
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "sending":
      return <Clock className="h-3 w-3 text-muted-foreground" />
    case "sent":
      return <Check className="h-3 w-3 text-muted-foreground" />
    case "delivered":
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />
    case "read":
      return <CheckCheck className="h-3 w-3 text-blue-500" />
    default:
      return null
  }
}

// Chat Component
interface ChatPortalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialGroupId?: string
  aircraftId?: string
  aircraftReg?: string
  simplified?: boolean
}

export function ChatPortal({
  open = false,
  onOpenChange = () => {},
  initialGroupId,
  aircraftId,
  aircraftReg,
  simplified = false,
}: ChatPortalProps) {
  // Find the chat group for the specific aircraft if provided
  const findChatGroupForAircraft = () => {
    if (aircraftId) {
      const group = mockChatGroups.find((g) => g.aircraftFin === aircraftId || g.aircraftReg === aircraftReg)
      return group ? group.id : initialGroupId || null
    }
    return initialGroupId || null
  }

  const [activeGroupId, setActiveGroupId] = useState<string | null>(findChatGroupForAircraft())
  const [newMessage, setNewMessage] = useState("")
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(mockChatGroups)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeGroupId) {
      const newMessageObject: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "current-user",
        text: newMessage,
        timestamp: new Date().toISOString(),
        status: "sending",
      }

      setChatGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === activeGroupId ? { ...group, messages: [...group.messages, newMessageObject] } : group,
        ),
      )

      setNewMessage("")

      // Optimistically update the message status to 'sent' after a short delay
      setTimeout(() => {
        setChatGroups((prevGroups) =>
          prevGroups.map((group) => {
            if (group.id === activeGroupId) {
              const updatedMessages = group.messages.map((message) =>
                message.id === newMessageObject.id ? { ...message, status: "sent" } : message,
              )
              return { ...group, messages: updatedMessages }
            }
            return group
          }),
        )
      }, 500)
    }
  }

  const activeGroup = chatGroups.find((group) => group.id === activeGroupId)

  // Create a default group if none exists for this aircraft
  useEffect(() => {
    if (!activeGroup && aircraftId && aircraftReg) {
      const defaultGroup: ChatGroup = {
        id: `group-${aircraftId}`,
        name: `${aircraftId} (${aircraftReg}) Communication`,
        description: `Communication for aircraft ${aircraftId}`,
        members: [mockUsers["current-user"], mockUsers["user-1"], mockUsers["user-2"]],
        messages: [
          {
            id: "msg-default-1",
            senderId: "system",
            text: `Communication channel created for aircraft ${aircraftId} (${aircraftReg})`,
            timestamp: new Date().toISOString(),
            status: "delivered",
            isSystemMessage: true,
          },
        ],
        createdAt: new Date().toISOString(),
        aircraftFin: aircraftId,
        aircraftReg: aircraftReg,
        isAOGGroup: false,
      }

      setChatGroups((prevGroups) => [...prevGroups, defaultGroup])
      setActiveGroupId(`group-${aircraftId}`)
    }
  }, [activeGroup, aircraftId, aircraftReg])

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeGroupId, chatGroups])

  // Function to group messages by date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groupedMessages: { [key: string]: ChatMessage[] } = {}

    messages.forEach((message) => {
      const date = formatMessageDate(message.timestamp)
      if (!groupedMessages[date]) {
        groupedMessages[date] = []
      }
      groupedMessages[date].push(message)
    })

    return Object.entries(groupedMessages)
  }

  // If simplified mode is enabled (for Fleet Overview)
  if (simplified && activeGroup) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {activeGroup.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isSystemMessage
                    ? "justify-center"
                    : message.senderId === "current-user"
                      ? "justify-end"
                      : "justify-start"
                }`}
              >
                {!message.isSystemMessage && message.senderId !== "current-user" && (
                  <Avatar className="mr-2 mt-1 h-8 w-8">
                    <AvatarImage src={mockUsers[message.senderId]?.avatar || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>
                      {mockUsers[message.senderId]?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isSystemMessage
                      ? "bg-muted text-xs text-muted-foreground"
                      : message.senderId === "current-user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                  }`}
                >
                  {!message.isSystemMessage && message.senderId !== "current-user" && (
                    <p className="mb-1 text-xs font-medium">{mockUsers[message.senderId]?.name}</p>
                  )}
                  <p>{message.text}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className={`rounded-md ${
                            message.senderId === "current-user" ? "bg-primary-foreground/20" : "bg-background"
                          } p-2`}
                        >
                          {attachment.type === "image" ? (
                            <div>
                              <div className="overflow-hidden rounded-md">
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name || "Image"}
                                  className="h-auto max-h-40 w-full object-cover"
                                />
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="text-xs">{attachment.name}</span>
                                {attachment.size && <span className="text-xs">{attachment.size}</span>}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <File className="h-5 w-5" />
                              <div className="flex-1 overflow-hidden">
                                <p className="truncate text-xs font-medium">{attachment.name}</p>
                                {attachment.size && <p className="text-xs">{attachment.size}</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {message.senderId === "current-user" && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1"
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={handleSendMessage} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] flex-col border rounded-md overflow-hidden">
      {activeGroup ? (
        <>
          {/* Chat Header */}
          <div className="flex h-14 items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>
                  {activeGroup.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{activeGroup.name}</h3>
                <p className="text-xs text-muted-foreground">{activeGroup.members.length} members</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {groupMessagesByDate(activeGroup.messages).map(([date, messages]) => (
                <div key={date}>
                  <div className="relative mb-4 flex items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="mx-4 flex-shrink bg-background text-xs text-muted-foreground">{date}</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSystemMessage
                            ? "justify-center"
                            : message.senderId === "current-user"
                              ? "justify-end"
                              : "justify-start"
                        }`}
                      >
                        {!message.isSystemMessage && message.senderId !== "current-user" && (
                          <Avatar className="mr-2 mt-1 h-8 w-8">
                            <AvatarImage
                              src={mockUsers[message.senderId]?.avatar || "/placeholder.svg?height=40&width=40"}
                            />
                            <AvatarFallback>
                              {mockUsers[message.senderId]?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.isSystemMessage
                              ? "bg-muted text-xs text-muted-foreground"
                              : message.senderId === "current-user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                          }`}
                        >
                          {!message.isSystemMessage && message.senderId !== "current-user" && (
                            <p className="mb-1 text-xs font-medium">{mockUsers[message.senderId]?.name}</p>
                          )}
                          <p>{message.text}</p>

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className={`rounded-md ${
                                    message.senderId === "current-user" ? "bg-primary-foreground/20" : "bg-background"
                                  } p-2`}
                                >
                                  {attachment.type === "image" ? (
                                    <div>
                                      <div className="overflow-hidden rounded-md">
                                        <img
                                          src={attachment.url || "/placeholder.svg"}
                                          alt={attachment.name || "Image"}
                                          className="h-auto max-h-60 w-full object-cover"
                                        />
                                      </div>
                                      <div className="mt-1 flex items-center justify-between">
                                        <span className="text-xs">{attachment.name}</span>
                                        {attachment.size && <span className="text-xs">{attachment.size}</span>}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <File className="h-5 w-5" />
                                      <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-xs font-medium">{attachment.name}</p>
                                        {attachment.size && <p className="text-xs">{attachment.size}</p>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                            <span>{formatMessageTime(message.timestamp)}</span>
                            {message.senderId === "current-user" && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button variant="outline" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" onClick={handleSendMessage} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No chat group available for this aircraft</p>
        </div>
      )}
    </div>
  )
}

