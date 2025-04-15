import { Skeleton } from "@/components/ui/skeleton"

export default function DefectsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid gap-4">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
        </div>
      </div>
    </div>
  )
}
