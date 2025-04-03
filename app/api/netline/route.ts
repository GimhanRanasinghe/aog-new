import { NextResponse } from "next/server"

// Mock NETLINE feed data - in a real app, this would connect to the actual NETLINE system
const netlineData = [
  {
    flight: "AC123",
    registration: "C-FGDT",
    type: "Boeing 777-300ER",
    location: "Toronto Pearson (YYZ), Gate 53",
    status: "AOG",
    issue: "Engine failure",
    timeReported: "2023-05-15T08:30:00Z",
    estimatedRepair: "2023-05-16T14:00:00Z",
  },
  {
    flight: "AC456",
    registration: "C-GITS",
    type: "Airbus A330-300",
    location: "Montreal (YUL), Gate 12",
    status: "AOG",
    issue: "Hydraulic system leak",
    timeReported: "2023-05-15T10:15:00Z",
    estimatedRepair: "2023-05-15T18:00:00Z",
  },
  {
    flight: "AC789",
    registration: "C-FTJP",
    type: "Boeing 787-9",
    location: "Vancouver (YVR), Maintenance Hangar 3",
    status: "AOG",
    issue: "Avionics system fault",
    timeReported: "2023-05-15T09:45:00Z",
    estimatedRepair: "2023-05-15T20:30:00Z",
  },
  {
    flight: "AC890",
    registration: "C-GHPQ",
    type: "Airbus A320",
    location: "Calgary (YYC), Remote Stand 42",
    status: "AOG",
    issue: "Landing gear sensor malfunction",
    timeReported: "2023-05-15T11:20:00Z",
    estimatedRepair: "2023-05-15T16:45:00Z",
  },
]

export async function GET() {
  // In a real application, this would fetch data from the NETLINE system
  // For this example, we're returning mock data
  return NextResponse.json({ aircraft: netlineData })
}

// This would be a webhook endpoint that NETLINE could call when an aircraft status changes
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Process the incoming data
    // In a real application, this would:
    // 1. Validate the incoming data
    // 2. Check if the aircraft is marked as AOG
    // 3. Create a new chat group if needed
    // 4. Notify relevant staff

    console.log("Received NETLINE update:", data)

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "AOG notification received and processed",
    })
  } catch (error) {
    console.error("Error processing NETLINE webhook:", error)
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 })
  }
}

