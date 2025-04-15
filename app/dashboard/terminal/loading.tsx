import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terminal View</h1>
          <p className="text-muted-foreground">
            Interactive map of airport terminals and gates with real-time status information.
          </p>
        </div>
      </div>

      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle>Airport Terminal Map</CardTitle>
          <CardDescription>View terminal layouts, gate locations, and aircraft status at each gate.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100vh-250px)]">
          <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4 p-2 bg-gray-100 rounded">
              <Skeleton className="h-8 w-40" />
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
            <Skeleton className="flex-1 rounded-lg" />
            <Skeleton className="h-24 mt-4 rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
