import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  )
}
