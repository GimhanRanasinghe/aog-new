import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, Download } from "lucide-react"

interface ChatMessageProps {
  message: any
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex ${message.isSystemMessage ? "justify-center" : "justify-start"}`}>
      {!message.isSystemMessage && (
        <Avatar className="mr-2 mt-1 h-8 w-8">
          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
          <AvatarFallback>
            {message.senderName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          message.isSystemMessage ? "bg-muted text-xs text-muted-foreground" : "bg-secondary"
        }`}
      >
        {!message.isSystemMessage && (
          <div className="mb-1 flex items-center gap-2">
            <p className="text-xs font-medium">{message.senderName}</p>
            {message.role && (
              <Badge variant="outline" className="text-[10px] py-0 h-4">
                {message.role}
              </Badge>
            )}
          </div>
        )}
        <p>{message.text}</p>

        {/* Attachment Display */}
        {message.hasAttachment && (
          <div className="mt-2">
            {message.attachment?.type === "image" ? (
              <div className="mt-2 rounded-md border bg-background overflow-hidden">
                <div className="relative">
                  <img
                    src={message.attachment.thumbnailUrl || "/placeholder.svg?height=200&width=300"}
                    alt={message.attachment.name}
                    className="w-full object-cover max-h-[200px]"
                  />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{message.attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 rounded-md border bg-background p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{message.attachment?.name || message.attachmentName}</p>
                      {message.attachment?.size && (
                        <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>{formatMessageTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
