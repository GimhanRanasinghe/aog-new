import { redirect } from "next/navigation"

export default function AircraftPage({ params }: { params: { id: string } }) {
  // Redirect to the history page
  redirect(`/aircraft/${params.id}/history`)
}
