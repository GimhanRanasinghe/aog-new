"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Simple chat component for the fleet overview
export function ChatPortal({ aircraftFin, aircraftReg, simplified = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hi team, we have an issue with the APU on this aircraft.",
      time: "10:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "I'll check the maintenance logs. What's the specific symptom?",
      time: "10:32 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "APU won't start. Getting fault code E-32.",
      time: "10:35 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "Sarah Williams",
      content: "That's related to the fuel control unit. I'll dispatch a technician.",
      time: "10:38 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full border rounded-md bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Group avatar" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{aircraftFin} Chat</div>
            <div className="text-xs text-gray-500">{aircraftReg}</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={message.avatar} alt={`${message.sender} avatar`} />
                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline">
                  <div className="font-medium">{message.sender}</div>
                  <div className="ml-2 text-xs text-gray-500">{message.time}</div>
                </div>
                <div className="text-sm mt-1">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Send
        </Button>
      </form>
    </div>
  )
}

