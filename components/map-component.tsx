"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Map, Plane } from "lucide-react"
import { GateStatusPanel } from "./gate-status-panel"
import { useTheme } from "@/components/theme-provider"
import { aircraftData } from "@/lib/aircraft-data"

// Define status colors to match fleet overview
const statusColors = {
  active: "#4CAF50", // Green
  scheduled: "#2196F3", // Blue
  delayed: "#FF9800", // Orange
  cancelled: "#F44336", // Red
  maintenance: "#9C27B0", // Purple
  aog: "#FF5252", // Bright Red
  unknown: "#757575", // Gray
}

interface Gate {
  id: string
  x: number
  y: number
  color: string
  label: string
  // direction: "inbound" | "outbound"
  assignedFlight?: {
    aircraftId: string
    flightNumber: string
    status: string
    departureTime?: string
    arrivalTime?: string
  }
}

interface Terminal {
  id: string
  label: string
  x: number
  y: number
  scale: number
  gates: Gate[]
}

interface MapData {
  id: string
  label: string
  svgPathLight: string
  svgPathDark: string
  width: number
  height: number
  terminals: Terminal[]
}

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  startTransformX: number
  startTransformY: number
}

// Function to map aircraft to gates based on location and gate
const mapAircraftToGates = (maps: MapData[]): MapData[] => {
  const updatedMaps = [...maps]

  // Loop through all aircraft
  aircraftData.forEach((aircraft) => {
    if (aircraft.location && aircraft.gate) {
      // Find the map for this location
      const mapIndex = updatedMaps.findIndex((map) => map.label === aircraft.location)
      if (mapIndex >= 0) {
        // Loop through terminals to find the gate
        updatedMaps[mapIndex].terminals.forEach((terminal) => {
          const gateIndex = terminal.gates.findIndex((gate) => gate.label === `Gate ${aircraft.gate}`)
          if (gateIndex >= 0) {
            // Assign flight to gate
            terminal.gates[gateIndex].assignedFlight = {
              aircraftId: aircraft.id,
              flightNumber: aircraft.nextFlight?.flightNumber || "",
              status: aircraft.status,
              departureTime: aircraft.nextFlight?.departureTime,
              arrivalTime: aircraft.nextFlight?.arrivalTime,
            }
          }
        })
      }
    }
  })

  return updatedMaps
}

export default function MapComponent() {
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use useEffect to handle theme detection after initial render
  useEffect(() => {
    setMounted(true)
    const isDark =
      theme === "dark" ||
      (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setIsDarkMode(isDark)
  }, [theme])

  // Define available maps with their terminals and gates
  const [availableMaps, setAvailableMaps] = useState<MapData[]>([
    {
      id: "yyc_map1",
      label: "YYZ",
      svgPathLight: "/YYZ-airport-light-nbg.svg",
      svgPathDark: "/YYZ-airport-dark-nbg.svg",
      width: 2000,
      height: 1200,
      terminals: [
        {
          id: "terminal_1",
          label: "Terminal 1",
          x: 1150,
          y: 450,
          scale: 1.7, // Adjusted scale
          gates: [
            {
              id: "gate_D36",
              x: 1103,
              y: 530,
              color: "#FF5252",
              label: "Gate D36",
            },
            {
              id: "gate_D45",
              x: 1103,
              y: 549,
              color: "#FF9800",
              label: "Gate D45",
            },
            {
              id: "gate_D31",
              x: 1059,
              y: 464,
              color: "#2196F3",
              label: "Gate D31",
            },
            {
              id: "gate_F65",
              x: 1208,
              y: 448,
              color: "#2196F3",
              label: "Gate F65",
            },
          ],
        },
        {
          id: "terminal_3",
          label: "Terminal 3",
          x: 800,
          y: 470,
          scale: 2.2,
          gates: [
            {
              id: "gate_B23",
              x: 805,
              y: 447,
              color: "#4CAF50",
              label: "Gate B23",
            },
            {
              id: "gate_B19",
              x: 797,
              y: 508,
              color: "#4CAF50",
              label: "Gate B19",
            },
            {
              id: "gate_B29",
              x: 891,
              y: 490,
              color: "#4CAF50",
              label: "Gate B29",
            },
          ],
        },
      ],
    },
    // Adjust YVR (Vancouver) terminal and gate coordinates
    {
      id: "yyc_map2",
      label: "YVR",
      svgPathLight: "/YVR-airport-light-nbg.svg",
      svgPathDark: "/YVR-airport-dark-nbg.svg",
      width: 2000,
      height: 1200,
      terminals: [
        {
          id: "terminal_a",
          label: "Terminal A",
          x: 1000,
          y: 600,
          scale: 1.3,
          gates: [
            {
              id: "gate_E22",
              x: 950,
              y: 550,
              color: "#FF5252",
              label: "Gate E22",
            },
            {
              id: "gate_D45",
              x: 1050,
              y: 650,
              color: "#FF9800",
              label: "Gate D45",
            },
          ],
        },
        {
          id: "terminal_b",
          label: "Terminal B",
          x: 1200,
          y: 500,
          scale: 1.4,
          gates: [
            {
              id: "gate_F12",
              x: 1150,
              y: 450,
              color: "#2196F3",
              label: "Gate F12",
            },
            {
              id: "gate_D73",
              x: 1250,
              y: 550,
              color: "#4CAF50",
              label: "Gate D73",
            },
          ],
        },
      ],
    },
    // Adjust YYC (Calgary) terminal and gate coordinates
    {
      id: "yyc_map3",
      label: "YYC",
      svgPathLight: "/YYC-airport-light-nbg.svg",
      svgPathDark: "/YYC-airport-dark-nbg.svg",
      width: 2000,
      height: 1200,
      terminals: [
        {
          id: "terminal_domestic",
          label: "Domestic Terminal",
          x: 1000,
          y: 600,
          scale: 1.5,
          gates: [
            {
              id: "gate_A1",
              x: 950,
              y: 550,
              color: "#FF5252",
              label: "Gate A1",
            },
            {
              id: "gate_A5",
              x: 1050,
              y: 580,
              color: "#FF9800",
              label: "Gate A5",
            },
            {
              id: "gate_B12",
              x: 1150,
              y: 650,
              color: "#2196F3",
              label: "Gate B12",
            },
          ],
        },
        {
          id: "terminal_international",
          label: "International Terminal",
          x: 1200,
          y: 600,
          scale: 1.5,
          gates: [
            {
              id: "gate_D1",
              x: 1150,
              y: 550,
              color: "#4CAF50",
              label: "Gate D1",
            },
            {
              id: "gate_D5",
              x: 1250,
              y: 600,
              color: "#9C27B0",
              label: "Gate D5",
            },
            {
              id: "gate_E3",
              x: 1350,
              y: 650,
              color: "#FF5722",
              label: "Gate E3",
            },
          ],
        },
      ],
    },
  ])

  const [selectedMapId, setSelectedMapId] = useState<string>(availableMaps[0].id)
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>("")
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null)
  const [hoveredGateId, setHoveredGateId] = useState<string | null>(null)

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startTransformX: 0,
    startTransformY: 0,
  })

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const mapWrapperRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Get the currently selected map
  const selectedMap = availableMaps.find((map) => map.id === selectedMapId) || availableMaps[0]

  // Get the appropriate SVG path based on the current theme
  const currentMapSvgPath = isDarkMode ? selectedMap.svgPathDark : selectedMap.svgPathLight

  // Get available terminals for the selected map
  const availableTerminals = selectedMap.terminals

  // Get the currently selected terminal
  const selectedTerminal = selectedTerminalId
    ? availableTerminals.find((terminal) => terminal.id === selectedTerminalId)
    : null

  // Get available gates for the selected terminal
  const availableGates = selectedTerminal?.gates || []

  // Get all gates from the selected map (for rendering)
  const allGates = selectedMap.terminals.flatMap((terminal) => terminal.gates)

  // Get the currently selected gate
  const selectedGate = selectedGateId ? allGates.find((gate) => gate.id === selectedGateId) : null

  // Helper function to get the status color for a gate
  const getGateStatusColor = (gate: Gate): string => {
    if (!gate.assignedFlight) return gate.color

    if (gate.assignedFlight.status === "aog") {
      return statusColors.aog
    }

    return statusColors[gate.assignedFlight.status as keyof typeof statusColors] || gate.color
  }

  // Initialize with default terminal when map changes
  useEffect(() => {
    if (availableTerminals.length > 0) {
      setSelectedTerminalId(availableTerminals[0].id)
      setSelectedGateId(null) // Clear gate selection when map changes

      // Reset transform when map changes to ensure proper positioning
      setTransform({ x: 0, y: 0, scale: 1 })
    }
  }, [selectedMapId])

  // Initialize with first terminal
  useEffect(() => {
    if (mapContainerRef.current && availableTerminals.length > 0) {
      // Wait a bit for the container to be properly sized
      setTimeout(() => {
        const terminal = availableTerminals[0]
        if (terminal) {
          zoomToTerminal(terminal)
          setSelectedTerminalId(terminal.id)
        }
      }, 300)
    }
  }, [dimensions, selectedMapId])

  useEffect(() => {
    if (svgRef.current && mapContainerRef.current) {
      const updateDimensions = () => {
        const containerRect = mapContainerRef.current?.getBoundingClientRect()
        if (containerRect) {
          setDimensions({
            width: containerRect.width,
            height: containerRect.height,
          })
        }
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => {
        window.removeEventListener("resize", updateDimensions)
      }
    }
  }, [])

  // Add event listeners for drag operations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault()
        const deltaX = e.clientX - dragState.startX
        const deltaY = e.clientY - dragState.startY

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          setTransform({
            ...transform,
            x: dragState.startTransformX + deltaX,
            y: dragState.startTransformY + deltaY,
          })
        })
      }
    }

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        setDragState({
          ...dragState,
          isDragging: false,
        })
      }
    }

    // Add event listeners to window to capture mouse events outside the component
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dragState, transform])

  // Clear gate selection when terminal changes
  useEffect(() => {
    setSelectedGateId(null)
  }, [selectedTerminalId])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if not clicking on a gate
    if (
      e.target === mapWrapperRef.current ||
      e.target === svgRef.current ||
      (e.target as HTMLElement).tagName === "image"
    ) {
      e.preventDefault()
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startTransformX: transform.x,
        startTransformY: transform.y,
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start dragging if not touching a gate
    if (
      e.target === mapWrapperRef.current ||
      e.target === svgRef.current ||
      (e.target as HTMLElement).tagName === "image"
    ) {
      const touch = e.touches[0]
      setDragState({
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        startTransformX: transform.x,
        startTransformY: transform.y,
      })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (dragState.isDragging) {
      e.preventDefault() // Prevent scrolling while dragging
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragState.startX
      const deltaY = touch.clientY - dragState.startY

      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        setTransform({
          ...transform,
          x: dragState.startTransformX + deltaX,
          y: dragState.startTransformY + deltaY,
        })
      })
    }
  }

  const handleTouchEnd = () => {
    if (dragState.isDragging) {
      setDragState({
        ...dragState,
        isDragging: false,
      })
    }
  }

  // Update the transform calculation in the zoomToGate function to better center the gate
  const zoomToGate = (gateId: string) => {
    const gate = allGates.find((g) => g.id === gateId)
    if (!gate || !mapContainerRef.current) return

    // Find which terminal this gate belongs to
    const parentTerminal = selectedMap.terminals.find((terminal) => terminal.gates.some((g) => g.id === gateId))

    if (parentTerminal && parentTerminal.id !== selectedTerminalId) {
      // If the gate belongs to a different terminal than currently selected,
      // update the terminal selection
      setSelectedTerminalId(parentTerminal.id)
    }

    // Calculate the scale factor
    const newScale = 3.5

    // Calculate the translation needed to center the gate
    // We need to move the gate position to the center of the viewport
    const newX = dimensions.width / 2 - gate.x * newScale
    const newY = dimensions.height / 2 - gate.y * newScale

    setTransform({ x: newX, y: newY, scale: newScale })
    setIsZoomed(true)
    setSelectedGateId(gateId)
  }

  // Update the zoomToTerminal function to better center the terminal
  const zoomToTerminal = (terminal: Terminal) => {
    if (!mapContainerRef.current) return

    // Calculate the scale factor
    const newScale = terminal.scale

    // Calculate the translation needed to center the terminal
    // Ensure we're centering on the terminal's coordinates
    const newX = dimensions.width / 2 - terminal.x * newScale
    const newY = dimensions.height / 2 - terminal.y * newScale

    // Apply the transformation with a slight delay to ensure it's processed
    setTimeout(() => {
      setTransform({ x: newX, y: newY, scale: newScale })
      setIsZoomed(true)
    }, 50)

    setSelectedGateId(null) // Clear gate selection when zooming to a terminal
  }

  const handleGateClick = (gate: Gate, e: React.MouseEvent) => {
    e.stopPropagation()
    // Toggle selection
    if (selectedGateId === gate.id) {
      setSelectedGateId(null)

      // If a terminal is selected, zoom to that terminal
      if (selectedTerminalId) {
        const terminal = availableTerminals.find((t) => t.id === selectedTerminalId)
        if (terminal) {
          zoomToTerminal(terminal)
        }
      } else {
        // Reset zoom if no terminal is selected
        resetZoom()
      }
    } else {
      zoomToGate(gate.id)
    }
  }

  const handleGateHover = (gate: Gate | null) => {
    setHoveredGateId(gate ? gate.id : null)
  }

  const handleMapDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mapId = e.target.value
    setSelectedMapId(mapId)
    // Terminal and gate selections will be reset by the useEffect that watches selectedMapId
  }

  // Improve the terminal selection handler
  const handleTerminalDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const terminalId = e.target.value

    if (terminalId === "") {
      // Reset view if "Select a terminal" is chosen
      resetZoom()
      setSelectedTerminalId("")
      setSelectedGateId(null)
      return
    }

    // Find the selected terminal
    const terminal = availableTerminals.find((t) => t.id === terminalId)
    if (!terminal) return

    // Set the selected terminal ID
    setSelectedTerminalId(terminalId)

    // Ensure we zoom to the terminal after state is updated
    setTimeout(() => {
      zoomToTerminal(terminal)
    }, 50)
  }

  const handleGateDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gateId = e.target.value

    if (gateId === "") {
      // If a terminal is selected, zoom to that terminal
      if (selectedTerminalId) {
        const terminal = availableTerminals.find((t) => t.id === selectedTerminalId)
        if (terminal) {
          zoomToTerminal(terminal)
          setSelectedGateId(null)
        }
      } else {
        // Reset view if no terminal is selected
        resetZoom()
      }
      return
    }

    zoomToGate(gateId)
  }

  const handleMapClick = (e: React.MouseEvent) => {
    // Only handle if we're zoomed in, not dragging, and clicking directly on the map (not a gate)
    if (
      isZoomed &&
      !dragState.isDragging &&
      (e.target === mapContainerRef.current ||
        e.target === svgRef.current ||
        (e.target as HTMLElement).tagName === "image")
    ) {
      // If a gate is selected and a terminal is selected
      if (selectedGateId && selectedTerminalId) {
        // Deselect the gate and zoom to the terminal
        const terminal = availableTerminals.find((t) => t.id === selectedTerminalId)
        if (terminal) {
          zoomToTerminal(terminal)
          setSelectedGateId(null)
          return
        }
      }

      // If no terminal is selected, reset the view
      if (!selectedTerminalId) {
        resetZoom()
      }
    }
  }

  const resetZoom = () => {
    setTransform({ x: 0, y: 0, scale: 1 })
    setIsZoomed(false)
    setSelectedGateId(null)
    setSelectedTerminalId("")
  }

  const zoomIn = () => {
    setTransform((prev) => {
      // Calculate new scale
      const newScale = prev.scale * 1.2

      // Keep the center point of the view fixed when zooming
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      // Calculate the point in the map coordinates that is currently at the center of the view
      const mapCenterX = (centerX - prev.x) / prev.scale
      const mapCenterY = (centerY - prev.y) / prev.scale

      // Calculate new translation to keep the same map point at the center
      const newX = centerX - mapCenterX * newScale
      const newY = centerY - mapCenterY * newScale

      return {
        scale: newScale,
        x: newX,
        y: newY,
      }
    })
    setIsZoomed(true)
  }

  const zoomOut = () => {
    setTransform((prev) => {
      // Calculate new scale, but don't go below 0.5
      const newScale = Math.max(0.5, prev.scale / 1.2)

      // Keep the center point of the view fixed when zooming
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      // Calculate the point in the map coordinates that is currently at the center of the view
      const mapCenterX = (centerX - prev.x) / prev.scale
      const mapCenterY = (centerY - prev.y) / prev.scale

      // Calculate new translation to keep the same map point at the center
      const newX = centerX - mapCenterX * newScale
      const newY = centerY - mapCenterY * newScale

      return {
        scale: newScale,
        x: newX,
        y: newY,
      }
    })

    // Only set isZoomed to false if we're at the minimum zoom level
    setTransform((prev) => {
      if (prev.scale / 1.2 <= 1) {
        setIsZoomed(false)
      }
      return prev
    })
  }

  // Find which terminal a gate belongs to
  const getTerminalForGate = (gateId: string): Terminal | undefined => {
    return selectedMap.terminals.find((terminal) => terminal.gates.some((gate) => gate.id === gateId))
  }

  // Add this after other useEffects - Fixed the syntax error here
  useEffect(() => {
    // Update gate assignments when component mounts
    const updatedMaps = mapAircraftToGates(availableMaps)
    setAvailableMaps(updatedMaps)

    // Set up a refresh interval (optional)
    const intervalId = setInterval(() => {
      const refreshedMaps = mapAircraftToGates(availableMaps)
      setAvailableMaps(refreshedMaps)
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, []) // Empty dependency array means this runs once on mount

  // Update the initial transform to center the map
  useEffect(() => {
    if (mapContainerRef.current) {
      const containerRect = mapContainerRef.current.getBoundingClientRect()
      if (containerRect) {
        // Center the map initially
        const initialX = (containerRect.width - selectedMap.width) / 2
        const initialY = (containerRect.height - selectedMap.height) / 2
        setTransform({ x: initialX, y: initialY, scale: 1 })
      }
    }
  }, [selectedMapId, dimensions])

  const handleGatePanelClose = () => {
    setSelectedGateId(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 flex flex-row justify-between items-center gap-2 p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-ac-red" />
          <h2 className="text-sm font-bold">Terminal View</h2>
        </div>
        <div className="flex flex-row gap-1 items-center">
          {/* Map Dropdown */}
          <div className="relative w-32">
            <select
              value={selectedMapId}
              onChange={handleMapDropdownChange}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 text-xs focus:outline-none focus:ring-1 focus:ring-ac-red"
              aria-label="Select a map"
            >
              {availableMaps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
              size={12}
            />
          </div>

          {/* Terminal Dropdown */}
          <div className="relative w-36">
            <select
              value={selectedTerminalId}
              onChange={handleTerminalDropdownChange}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 text-xs focus:outline-none focus:ring-1 focus:ring-ac-red"
              aria-label="Select a terminal"
            >
              <option value="">Select terminal</option>
              {availableTerminals.map((terminal) => (
                <option key={terminal.id} value={terminal.id}>
                  {terminal.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
              size={12}
            />
          </div>

          {/* Gate Dropdown */}
          <div className="relative w-32">
            <select
              value={selectedGateId || ""}
              onChange={handleGateDropdownChange}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 text-xs focus:outline-none focus:ring-1 focus:ring-ac-red"
              aria-label="Select a gate"
              disabled={!selectedTerminalId}
            >
              <option value="">Select gate</option>
              {availableGates.map((gate) => (
                <option key={gate.id} value={gate.id}>
                  {gate.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
              size={12}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex gap-1">
            {isZoomed && (
              <button
                onClick={resetZoom}
                className="px-2 py-1 bg-ac-red text-white text-xs rounded hover:bg-ac-red/90 transition-colors"
              >
                Reset
              </button>
            )}
            <button
              onClick={zoomIn}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={zoomOut}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
              aria-label="Zoom out"
            >
              -
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        <div
          ref={mapContainerRef}
          className="relative w-full h-full overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg"
          onClick={handleMapClick}
        >
          <div
            ref={mapWrapperRef}
            className={`absolute inset-0 ${
              !dragState.isDragging ? "transition-transform duration-300 ease-in-out" : ""
            } cursor-grab active:cursor-grabbing`}
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "0 0",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <svg
              ref={svgRef}
              width={selectedMap.width}
              height={selectedMap.height}
              viewBox={`0 0 ${selectedMap.width} ${selectedMap.height}`}
              aria-label="Interactive map with gates"
            >
              <image href={currentMapSvgPath} x="0" y="0" width={selectedMap.width} height={selectedMap.height} />
              {allGates.map((gate) => {
                const isActive = selectedGateId === gate.id || hoveredGateId === gate.id
                const hasAssignedFlight = !!gate.assignedFlight
                const statusColor = hasAssignedFlight ? getGateStatusColor(gate) : gate.color

                return (
                  <g
                    key={gate.id}
                    onClick={(e) => handleGateClick(gate, e)}
                    onMouseEnter={() => handleGateHover(gate)}
                    onMouseLeave={() => handleGateHover(null)}
                    className="cursor-pointer"
                    style={{
                      filter: isActive ? "drop-shadow(0px 0px 4px rgba(0,0,0,0.5))" : "none",
                    }}
                  >
                    <circle
                      cx={gate.x}
                      cy={gate.y}
                      r={isActive ? "8" : "6"}
                      fill={hasAssignedFlight ? "white" : "white"}
                      stroke={hasAssignedFlight ? statusColor : "transparent"}
                      strokeWidth={isActive || hasAssignedFlight ? "1.5" : "3"}
                    />
                    {hasAssignedFlight && (
                      <g transform={`translate(${gate.x - (isActive ? 6 : 5)}, ${gate.y - (isActive ? 6 : 5)})`}>
                        <Plane size={isActive ? 12 : 10} strokeWidth={0} color={statusColor} fill={statusColor} />
                      </g>
                    )}

                    {/* Show label for selected or hovered gate */}
                    {isActive && gate.label && (
                      <g>
                        <rect
                          x={gate.x + 15}
                          y={gate.y - 10}
                          width={gate.label.length * 8 + (gate.assignedFlight ? 150 : 10)}
                          height={gate.assignedFlight ? "40" : "20"}
                          fill="white"
                          stroke={hasAssignedFlight ? statusColor : "transparent"}
                          strokeWidth="1.5"
                          rx="4"
                          filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))"
                        />
                        <text
                          x={gate.x + 20}
                          y={gate.y + 5}
                          fill="black"
                          fontSize="12"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {gate.label}
                        </text>
                        {gate.assignedFlight && (
                          <text
                            x={gate.x + 20}
                            y={gate.y + 25}
                            fill="black"
                            fontSize="11"
                            className="pointer-events-none"
                          >
                            {gate.assignedFlight.flightNumber} • {gate.assignedFlight.aircraftId}
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
      {/* Gate Status Panel is now positioned absolutely */}
      {selectedGateId && selectedGate && (
        <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 overflow-auto">
          <GateStatusPanel selectedGateId={selectedGateId} selectedGate={selectedGate} onClose={handleGatePanelClose} />
        </div>
      )}
      <div className="mt-1 py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.active }}></div>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.scheduled }}></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.delayed }}></div>
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.cancelled }}></div>
          <span>Cancelled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.maintenance }}></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.aog }}></div>
          <span>AOG</span>
        </div>
      </div>
    </div>
  )
}
