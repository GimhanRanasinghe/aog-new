import { Skeleton } from "@/components/ui/skeleton"

export default function DelayImpactLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-[calc(100vh-200px)] w-full" />
      </div>
    </div>
  )
}

