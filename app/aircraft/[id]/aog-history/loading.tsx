import { Skeleton } from "@/components/ui/skeleton"

export default function AircraftAOGHistoryLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}

