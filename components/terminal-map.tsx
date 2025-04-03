"use client"

import { useState } from "react"
import { AircraftStatusTable } from "@/components/aircraft-status-table"

// Enhanced mock data for aircraft positions and statuses
const aircraftData = [
  // F Gates (International - Hammerhead) - Departing
  {
    id: "AC101",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    gate: "F73",
    position: { x: 0.85, y: 0.2 },
    status: "on-time", // green
    destination: "London (LHR)",
    departureTime: "14:25",
    flightPhase: "departing",
  },
  {
    id: "AC202",
    registration: "C-GHPQ",
    type: "Airbus A320",
    gate: "F75",
    position: { x: 0.9, y: 0.3 },
    status: "probable-delay", // yellow
    destination: "Vancouver (YVR)",
    departureTime: "15:10",
    delayReason: "Crew scheduling",
    estimatedDelay: 25,
    flightPhase: "departing",
  },
  {
    id: "AC303",
    registration: "C-FJWE",
    type: "Boeing 787-9",
    gate: "F65",
    position: { x: 0.75, y: 0.1 },
    status: "imminent-delay", // amber
    destination: "Tokyo (HND)",
    departureTime: "16:45",
    delayReason: "Maintenance check",
    estimatedDelay: 45,
    flightPhase: "departing",
  },

  // D Gates (Domestic/Transborder - Left Wing) - Mix of arriving and departing
  {
    id: "AC404",
    registration: "C-FMWY",
    type: "Airbus A330-300",
    gate: "D42",
    position: { x: 0.2, y: 0.4 },
    status: "aog", // red
    destination: "Paris (CDG)",
    departureTime: "17:30",
    delayReason: "Hydraulic system fault",
    estimatedDelay: 180,
    flightPhase: "departing",
  },
  {
    id: "AC505",
    registration: "C-GKTS",
    type: "Boeing 737 MAX 8",
    gate: "D22",
    position: { x: 0.1, y: 0.5 },
    status: "on-time", // green
    destination: "Calgary (YYC)",
    departureTime: "18:15",
    flightPhase: "departing",
  },

  // E Gates (International - Right Wing) - Arriving
  {
    id: "AC606",
    registration: "C-FPCA",
    type: "Airbus A220-300",
    gate: "E77",
    position: { x: 0.9, y: 0.8 },
    status: "probable-delay", // yellow
    destination: "Toronto (YYZ)",
    origin: "New York (JFK)",
    arrivalTime: "19:00",
    delayReason: "Weather at origin",
    estimatedDelay: 35,
    flightPhase: "arriving",
  },
  {
    id: "AC707",
    registration: "C-GITU",
    type: "Boeing 787-8",
    gate: "E82",
    position: { x: 0.8, y: 0.9 },
    status: "imminent-delay", // amber
    destination: "Toronto (YYZ)",
    origin: "Frankfurt (FRA)",
    arrivalTime: "20:30",
    delayReason: "Late departure",
    estimatedDelay: 60,
    flightPhase: "arriving",
  },

  // Central Terminal Area - Arrived
  {
    id: "AC808",
    registration: "C-FNND",
    type: "Airbus A321",
    gate: "C25",
    position: { x: 0.5, y: 0.5 },
    status: "aog", // red
    destination: "Toronto (YYZ)",
    origin: "Los Angeles (LAX)",
    arrivalTime: "21:15",
    delayReason: "Engine starter issue",
    estimatedDelay: 150,
    flightPhase: "arrived",
  },
]

export function TerminalMap() {
  const [selectedAircraft, setSelectedAircraft] = useState(null)

  const handleSelectAircraft = (aircraft) => {
    setSelectedAircraft(aircraft)
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-3/5">
        <div className="relative h-[600px] bg-gray-100 rounded-md">
          {/* Aircraft markers would go here in a real implementation */}
          {/* This is just a placeholder */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
            Terminal Map Placeholder
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/5 p-4">
        <AircraftStatusTable aircraftData={aircraftData} onSelectAircraft={handleSelectAircraft} />
      </div>
    </div>
  )
}

