"use client"

import { ActiveChats } from "@/components/active-chats"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChatsPage() {
  return (
    <ProtectedRoute requiredPermission="join_chat">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Active Chats</h1>
        <ActiveChats />
      </div>
    </ProtectedRoute>
  )
}
