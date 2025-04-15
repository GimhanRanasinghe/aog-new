"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { ChatPortal } from "@/components/chat-portal"

interface ChatButtonProps extends ButtonProps {
  groupId?: string
  label?: string
  showIcon?: boolean
  updates?: number
}

export function ChatButton({ groupId, label = "Join Chat", showIcon = true, updates, ...props }: ChatButtonProps) {
  const [chatOpen, setChatOpen] = useState(false)

  const handleOpenChat = () => {
    // Reset any previous state and open the chat with the specified groupId
    setChatOpen(true)
  }

  return (
    <>
      <Button onClick={handleOpenChat} {...props}>
        {showIcon && <MessageSquare className="mr-2 h-4 w-4" />}
        <span>{label}</span>
        {updates !== undefined && updates > 0 && <span className="ml-1">({updates})</span>}
      </Button>
      <ChatPortal open={chatOpen} onOpenChange={setChatOpen} initialGroupId={groupId} />
    </>
  )
}
