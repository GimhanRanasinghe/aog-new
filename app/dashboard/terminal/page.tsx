"use client"

import { useEffect, useState } from "react"
import MapComponent from "@/components/map-component"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TerminalPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Check if we're coming from fleet overview with a gate parameter
  useEffect(() => {
    setIsClient(true)
    // This would handle any navigation from fleet overview to terminal view
    // with specific gate information
    const handleGateHighlight = () => {
      // Implementation would depend on how you want to handle this direction
      // of navigation (fleet → terminal)
    }

    handleGateHighlight()
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Terminal Map</h1>
        <p className="text-muted-foreground">Loading terminal map...</p>
        <div className="h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Terminal Map</h1>
      <p className="text-muted-foreground">
        Interactive map of terminal gates and aircraft positions. Click on a gate to view details and navigate to the
        corresponding aircraft in the fleet overview.
      </p>
      <div className="h-[calc(100vh-200px)]">
        <MapComponent />
      </div>
    </div>
  )
}

