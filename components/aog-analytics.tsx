"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, BarChart3, Clock, AlertCircle, ArrowUpDown, MapPin } from "lucide-react"
import { StationSelector } from "@/components/station-selector"
import { getStationStatistics } from "@/lib/aircraft-data"

// Tableau-inspired pastel color palette
const colors = {
  blue: "#7FB3D5",
  green: "#7DCEA0",
  purple: "#BB8FCE",
  orange: "#F5B041",
  red: "#EC7063",
  yellow: "#F7DC6F",
  teal: "#76D7C4",
  pink: "#F0B27A",
}

export function AOGAnalytics() {
  const [timeRange, setTimeRange] = useState("30days")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedStation, setSelectedStation] = useState("ALL")

  // Get station statistics
  const stationStats = getStationStatistics()

  // Filter station stats based on selection
  const filteredStationStats =
    selectedStation === "ALL" ? stationStats : stationStats.filter((stat) => stat.station === selectedStation)

  // Mock data for charts - in a real app, this would come from an API
  const aogByAircraftType = [
    { type: "Boeing 777-300ER", count: 5, avgResolutionTime: "18h 45m", color: colors.blue },
    { type: "Boeing 787-9", count: 3, avgResolutionTime: "12h 30m", color: colors.green },
    { type: "Airbus A330-300", count: 4, avgResolutionTime: "15h 20m", color: colors.purple },
    { type: "Airbus A320", count: 7, avgResolutionTime: "8h 15m", color: colors.orange },
    { type: "Boeing 737 MAX 8", count: 2, avgResolutionTime: "10h 45m", color: colors.teal },
  ]

  const aogByReason = [
    { reason: "Engine Issues", count: 8, avgResolutionTime: "22h 30m", color: colors.red },
    { reason: "Avionics", count: 4, avgResolutionTime: "12h 15m", color: colors.purple },
    { reason: "Hydraulic Systems", count: 5, avgResolutionTime: "14h 45m", color: colors.blue },
    { reason: "Landing Gear", count: 3, avgResolutionTime: "16h 30m", color: colors.green },
    { reason: "Cabin Systems", count: 1, avgResolutionTime: "6h 20m", color: colors.yellow },
  ]

  const responseTimeMetrics = [
    { metric: "Average Initial Response Time", value: "12 minutes", color: colors.blue },
    { metric: "Average Time to Team Assembly", value: "28 minutes", color: colors.green },
    { metric: "Average Time to Parts Delivery", value: "3 hours 45 minutes", color: colors.purple },
    { metric: "Average Resolution Time", value: "14 hours 30 minutes", color: colors.orange },
    { metric: "Average Return to Service", value: "16 hours 15 minutes", color: colors.teal },
  ]

  const monthlyTrends = [
    { month: "Jan", aogCount: 12, avgResolutionTime: 16.5, color: colors.blue },
    { month: "Feb", aogCount: 10, avgResolutionTime: 15.2, color: colors.green },
    { month: "Mar", aogCount: 14, avgResolutionTime: 17.8, color: colors.purple },
    { month: "Apr", aogCount: 9, avgResolutionTime: 14.3, color: colors.orange },
    { month: "May", aogCount: 11, avgResolutionTime: 15.7, color: colors.red },
    { month: "Jun", aogCount: 13, avgResolutionTime: 16.2, color: colors.yellow },
  ]

  const currentAOGStatus = [
    { status: "Critical", count: 1, color: colors.red },
    { status: "In Progress", count: 2, color: colors.orange },
    { status: "Pending", count: 1, color: colors.blue },
    { status: "Resolved (Last 30 Days)", count: 17, color: colors.green },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal md:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <StationSelector value={selectedStation} onChange={setSelectedStation} includeAll={true} />

          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Station Overview */}
      {selectedStation === "ALL" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Station Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {stationStats.map((station, index) => (
                <Card key={index} className="border-t-4" style={{ borderTopColor: colors.blue }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      {station.stationName} ({station.station})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-lg font-bold">{station.totalAircraft}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">AOG</div>
                        <div className="text-lg font-bold text-red-600">{station.aogCount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Delayed</div>
                        <div className="text-lg font-bold text-amber-600">{station.delayCount}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>AOG Rate</span>
                        <span>{(station.aogPercentage || 0).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${station.aogPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="response-times">Response Times</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {currentAOGStatus.map((status, index) => (
              <Card key={index} className="border-t-4" style={{ borderTopColor: status.color }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{status.status}</CardTitle>
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{
                      backgroundColor:
                        status.status === "Critical"
                          ? colors.red
                          : status.status === "In Progress"
                            ? colors.orange
                            : status.status === "Pending"
                              ? colors.blue
                              : colors.green,
                    }}
                  ></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{status.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>AOG by Aircraft Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aogByAircraftType.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">Avg Resolution: {item.avgResolutionTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 rounded"
                          style={{
                            width: `${item.count * 20}px`,
                            backgroundColor:
                              index === 0
                                ? colors.blue
                                : index === 1
                                  ? colors.green
                                  : index === 2
                                    ? colors.purple
                                    : index === 3
                                      ? colors.orange
                                      : colors.teal,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        ></div>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>AOG by Reason</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aogByReason.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.reason}</p>
                        <p className="text-sm text-muted-foreground">Avg Resolution: {item.avgResolutionTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 rounded"
                          style={{
                            width: `${item.count * 15}px`,
                            backgroundColor:
                              index === 0
                                ? colors.red
                                : index === 1
                                  ? colors.purple
                                  : index === 2
                                    ? colors.blue
                                    : index === 3
                                      ? colors.green
                                      : colors.yellow,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        ></div>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="response-times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Response Time Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {responseTimeMetrics.map((metric, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{metric.metric}</p>
                      <p className="font-bold">{metric.value}</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(index + 1) * 20}%`,
                          backgroundColor:
                            index === 0
                              ? colors.blue
                              : index === 1
                                ? colors.green
                                : index === 2
                                  ? colors.purple
                                  : index === 3
                                    ? colors.orange
                                    : colors.teal,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time to Operation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Average Time to Operation</span>
                    <span className="font-bold">16h 15m</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-muted">
                    <div className="h-4 rounded-full" style={{ width: "75%", backgroundColor: colors.green }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target: 12h</span>
                    <span>Current: 16h 15m</span>
                    <span>Worst: 24h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current AOG Resolution Progress</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>AC123 (C-FGDT)</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full" style={{ width: "75%", backgroundColor: colors.orange }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AC456 (C-GITS)</span>
                      <span>40%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full" style={{ width: "40%", backgroundColor: colors.orange }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AC789 (C-FTJP)</span>
                      <span>90%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full" style={{ width: "90%", backgroundColor: colors.green }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                <span>Monthly AOG Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end justify-between gap-2">
                  {monthlyTrends.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-12 rounded-t"
                        style={{
                          height: `${month.aogCount * 15}px`,
                          backgroundColor:
                            index === 0
                              ? colors.blue
                              : index === 1
                                ? colors.green
                                : index === 2
                                  ? colors.purple
                                  : index === 3
                                    ? colors.orange
                                    : index === 4
                                      ? colors.red
                                      : colors.yellow,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      ></div>
                      <div className="mt-2 text-center">
                        <p className="font-medium">{month.month}</p>
                        <p className="text-xs text-muted-foreground">{month.aogCount} AOGs</p>
                        <p className="text-xs text-muted-foreground">{month.avgResolutionTime}h avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <div className="flex h-full items-end justify-between gap-2">
                  {monthlyTrends.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-12 rounded-t"
                        style={{
                          height: `${month.avgResolutionTime * 8}px`,
                          backgroundColor: colors.blue,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      ></div>
                      <div className="mt-2 text-center">
                        <p className="font-medium">{month.month}</p>
                        <p className="text-xs text-muted-foreground">{month.avgResolutionTime}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStationStats.map((station, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {station.stationName} ({station.station})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {station.aogCount} AOG, {station.delayCount} Delayed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(station.aogPercentage || 0).toFixed(1)}% AOG Rate</p>
                        <p className="text-sm text-muted-foreground">
                          {(station.onTimePercentage || 0).toFixed(1)}% On Time
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${station.aogPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Domestic vs International</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="h-[150px] w-24 rounded-t" style={{ backgroundColor: colors.blue }}></div>
                    <p className="mt-2 font-medium">Domestic</p>
                    <p className="text-sm text-muted-foreground">15 AOGs</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-[100px] w-24 rounded-t" style={{ backgroundColor: colors.orange }}></div>
                    <p className="mt-2 font-medium">International</p>
                    <p className="text-sm text-muted-foreground">10 AOGs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Time by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Domestic Avg</span>
                    <span className="font-bold">12h 30m</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full" style={{ width: "60%", backgroundColor: colors.blue }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">International Avg</span>
                    <span className="font-bold">18h 45m</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full" style={{ width: "80%", backgroundColor: colors.orange }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Avg</span>
                    <span className="font-bold">14h 50m</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full" style={{ width: "70%", backgroundColor: colors.green }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

