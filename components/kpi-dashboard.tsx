"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Progress } from "@/components/ui/progress"

// Mock data with station information
const responseTimeDataByStation = {
  ALL: [
    { hour: "00:00", time: 25 },
    { hour: "04:00", time: 30 },
    { hour: "08:00", time: 15 },
    { hour: "12:00", time: 20 },
    { hour: "16:00", time: 25 },
    { hour: "20:00", time: 18 },
  ],
  YYZ: [
    { hour: "00:00", time: 22 },
    { hour: "04:00", time: 28 },
    { hour: "08:00", time: 14 },
    { hour: "12:00", time: 18 },
    { hour: "16:00", time: 23 },
    { hour: "20:00", time: 16 },
  ],
  YUL: [
    { hour: "00:00", time: 27 },
    { hour: "04:00", time: 32 },
    { hour: "08:00", time: 18 },
    { hour: "12:00", time: 22 },
    { hour: "16:00", time: 28 },
    { hour: "20:00", time: 20 },
  ],
  YVR: [
    { hour: "00:00", time: 26 },
    { hour: "04:00", time: 29 },
    { hour: "08:00", time: 13 },
    { hour: "12:00", time: 19 },
    { hour: "16:00", time: 24 },
    { hour: "20:00", time: 17 },
  ],
}

const costImpactDataByStation = {
  ALL: [
    { month: "Jan", planned: 120000, unplanned: 180000 },
    { month: "Feb", planned: 150000, unplanned: 160000 },
    { month: "Mar", planned: 180000, unplanned: 190000 },
    { month: "Apr", planned: 170000, unplanned: 140000 },
    { month: "May", planned: 160000, unplanned: 150000 },
    { month: "Jun", planned: 190000, unplanned: 170000 },
  ],
  YYZ: [
    { month: "Jan", planned: 50000, unplanned: 80000 },
    { month: "Feb", planned: 60000, unplanned: 70000 },
    { month: "Mar", planned: 75000, unplanned: 85000 },
    { month: "Apr", planned: 70000, unplanned: 60000 },
    { month: "May", planned: 65000, unplanned: 65000 },
    { month: "Jun", planned: 80000, unplanned: 75000 },
  ],
  YUL: [
    { month: "Jan", planned: 35000, unplanned: 55000 },
    { month: "Feb", planned: 45000, unplanned: 50000 },
    { month: "Mar", planned: 55000, unplanned: 60000 },
    { month: "Apr", planned: 50000, unplanned: 40000 },
    { month: "May", planned: 45000, unplanned: 45000 },
    { month: "Jun", planned: 55000, unplanned: 50000 },
  ],
  YVR: [
    { month: "Jan", planned: 35000, unplanned: 45000 },
    { month: "Feb", planned: 45000, unplanned: 40000 },
    { month: "Mar", planned: 50000, unplanned: 45000 },
    { month: "Apr", planned: 50000, unplanned: 40000 },
    { month: "May", planned: 50000, unplanned: 40000 },
    { month: "Jun", planned: 55000, unplanned: 45000 },
  ],
}

// Station-specific KPI data
const stationKPIData = {
  ALL: {
    activeAOG: { total: 12, critical: 4, high: 5, medium: 3 },
    partsAvailability: { overall: 89.2, critical: 95, regular: 85, consumables: 92 },
    resolutionTime: { current: 4.2, target: 6, difference: -1.8, percentFaster: 30 },
    returnToService: { current: 92.8, target: 95, difference: -2.2 },
  },
  YYZ: {
    activeAOG: { total: 5, critical: 2, high: 2, medium: 1 },
    partsAvailability: { overall: 91.5, critical: 97, regular: 88, consumables: 94 },
    resolutionTime: { current: 3.8, target: 6, difference: -2.2, percentFaster: 37 },
    returnToService: { current: 94.2, target: 95, difference: -0.8 },
  },
  YUL: {
    activeAOG: { total: 4, critical: 1, high: 2, medium: 1 },
    partsAvailability: { overall: 87.8, critical: 93, regular: 83, consumables: 90 },
    resolutionTime: { current: 4.5, target: 6, difference: -1.5, percentFaster: 25 },
    returnToService: { current: 91.5, target: 95, difference: -3.5 },
  },
  YVR: {
    activeAOG: { total: 3, critical: 1, high: 1, medium: 1 },
    partsAvailability: { overall: 88.4, critical: 94, regular: 84, consumables: 91 },
    resolutionTime: { current: 4.3, target: 6, difference: -1.7, percentFaster: 28 },
    returnToService: { current: 92.6, target: 95, difference: -2.4 },
  },
}

interface KPIDashboardProps {
  station?: string
}

export function KPIDashboard({ station = "ALL" }: KPIDashboardProps) {
  // Get the data for the selected station
  const responseTimeData =
    responseTimeDataByStation[station as keyof typeof responseTimeDataByStation] || responseTimeDataByStation.ALL
  const costImpactData =
    costImpactDataByStation[station as keyof typeof costImpactDataByStation] || costImpactDataByStation.ALL
  const kpiData = stationKPIData[station as keyof typeof stationKPIData] || stationKPIData.ALL

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Active AOG Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active AOG Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-3xl font-bold">{kpiData.activeAOG.total}</div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">By Priority:</div>
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="text-sm">Critical ({kpiData.activeAOG.critical})</div>
                  <Progress
                    value={(kpiData.activeAOG.critical / kpiData.activeAOG.total) * 100}
                    className="h-2 bg-red-100"
                    indicatorClassName="bg-red-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="text-sm">High ({kpiData.activeAOG.high})</div>
                  <Progress
                    value={(kpiData.activeAOG.high / kpiData.activeAOG.total) * 100}
                    className="h-2 bg-yellow-100"
                    indicatorClassName="bg-yellow-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="text-sm">Medium ({kpiData.activeAOG.medium})</div>
                  <Progress
                    value={(kpiData.activeAOG.medium / kpiData.activeAOG.total) * 100}
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Response Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Average Response Time (mins)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Parts Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Parts Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-3xl font-bold">{kpiData.partsAvailability.overall}%</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Critical Parts</div>
                <div className="font-medium">{kpiData.partsAvailability.critical}%</div>
              </div>
              <Progress value={kpiData.partsAvailability.critical} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <div>Regular Parts</div>
                <div className="font-medium">{kpiData.partsAvailability.regular}%</div>
              </div>
              <Progress value={kpiData.partsAvailability.regular} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <div>Consumables</div>
                <div className="font-medium">{kpiData.partsAvailability.consumables}%</div>
              </div>
              <Progress value={kpiData.partsAvailability.consumables} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AOG Resolution Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">AOG Resolution Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-3xl font-bold">{kpiData.resolutionTime.current} hrs</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Target: {kpiData.resolutionTime.target} hrs</div>
                <div className="text-green-500 font-medium">{kpiData.resolutionTime.difference} hrs</div>
              </div>
              <Progress value={70} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {kpiData.resolutionTime.percentFaster}% faster than target
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return to Service Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Return to Service Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-3xl font-bold">{kpiData.returnToService.current}%</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Target: {kpiData.returnToService.target}%</div>
                <div className="text-yellow-500 font-medium">{kpiData.returnToService.difference}%</div>
              </div>
              <Progress value={kpiData.returnToService.current} className="h-2" />
              <div className="text-sm text-muted-foreground">Monthly average</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cost Impact (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costImpactData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="hsl(var(--primary))" />
                <Bar dataKey="unplanned" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
