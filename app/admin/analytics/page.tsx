"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, AlertCircle, Users, PlaneTakeoff, MessageSquare } from "lucide-react"
import { useState } from "react"

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

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30days")
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <ProtectedRoute requiredPermission="view_analytics">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Analytics</h1>
            <p className="text-muted-foreground">View system usage and performance metrics</p>
          </div>
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

            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-t-4" style={{ borderTopColor: colors.purple }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
          <Card className="border-t-4" style={{ borderTopColor: colors.red }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active AOG</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            </CardContent>
          </Card>
          <Card className="border-t-4" style={{ borderTopColor: colors.blue }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Aircraft</CardTitle>
              <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">No change</p>
            </CardContent>
          </Card>
          <Card className="border-t-4" style={{ borderTopColor: colors.green }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="aog">AOG Metrics</TabsTrigger>
            <TabsTrigger value="performance">System Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Logins</CardTitle>
                <CardDescription>Number of user logins over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-end justify-between gap-2">
                  {Array.from({ length: 7 })
                    .map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-12 rounded-t"
                          style={{
                            height: `${Math.floor(Math.random() * 150) + 50}px`,
                            backgroundColor: i % 2 === 0 ? colors.purple : colors.blue,
                          }}
                        ></div>
                        <div className="mt-2 text-center">
                          <p className="font-medium">{format(new Date(Date.now() - i * 86400000), "EEE")}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - i * 86400000), "MMM d")}
                          </p>
                        </div>
                      </div>
                    ))
                    .reverse()}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Roles Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-[150px] w-16 rounded-t" style={{ backgroundColor: colors.red }}></div>
                        <p className="mt-2 font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">3 users</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-[100px] w-16 rounded-t" style={{ backgroundColor: colors.blue }}></div>
                        <p className="mt-2 font-medium">Manager</p>
                        <p className="text-xs text-muted-foreground">5 users</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-[200px] w-16 rounded-t" style={{ backgroundColor: colors.green }}></div>
                        <p className="mt-2 font-medium">Engineer</p>
                        <p className="text-xs text-muted-foreground">12 users</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-[50px] w-16 rounded-t" style={{ backgroundColor: colors.yellow }}></div>
                        <p className="mt-2 font-medium">Viewer</p>
                        <p className="text-xs text-muted-foreground">4 users</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Users by Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex h-full items-end justify-between gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-6 rounded-t"
                          style={{
                            height: `${Math.floor(Math.random() * 150) + 20}px`,
                            backgroundColor:
                              i % 4 === 0
                                ? colors.teal
                                : i % 4 === 1
                                  ? colors.blue
                                  : i % 4 === 2
                                    ? colors.purple
                                    : colors.green,
                          }}
                        ></div>
                        <div className="mt-2 text-center">
                          <p className="text-xs">{`${(i * 2).toString().padStart(2, "0")}:00`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aog" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AOG Incidents Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-end justify-between gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-12 rounded-t"
                        style={{
                          height: `${Math.floor(Math.random() * 150) + 30}px`,
                          backgroundColor:
                            i % 4 === 0
                              ? colors.red
                              : i % 4 === 1
                                ? colors.orange
                                : i % 4 === 2
                                  ? colors.pink
                                  : colors.purple,
                        }}
                      ></div>
                      <div className="mt-2 text-center">
                        <p className="font-medium">{format(new Date(2023, i, 1), "MMM")}</p>
                        <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 10) + 2} AOGs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AOG by Aircraft Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Boeing 777-300ER</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `120px`, backgroundColor: colors.blue }}></div>
                        <span className="font-bold">12</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Airbus A330-300</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `90px`, backgroundColor: colors.green }}></div>
                        <span className="font-bold">9</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Boeing 787-9</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `80px`, backgroundColor: colors.purple }}></div>
                        <span className="font-bold">8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Airbus A320</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `70px`, backgroundColor: colors.orange }}></div>
                        <span className="font-bold">7</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Boeing 737 MAX 8</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `60px`, backgroundColor: colors.teal }}></div>
                        <span className="font-bold">6</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Resolution Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Engine Issues</p>
                        <p className="font-bold">22h 30m</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full" style={{ width: `85%`, backgroundColor: colors.red }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Hydraulic Systems</p>
                        <p className="font-bold">14h 45m</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full" style={{ width: `60%`, backgroundColor: colors.blue }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Avionics</p>
                        <p className="font-bold">12h 15m</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `50%`, backgroundColor: colors.purple }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Landing Gear</p>
                        <p className="font-bold">16h 30m</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full" style={{ width: `65%`, backgroundColor: colors.green }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Response Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-end justify-between gap-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-4 rounded-t"
                        style={{
                          height: `${Math.floor(Math.random() * 100) + 50}px`,
                          backgroundColor:
                            i % 4 === 0
                              ? colors.blue
                              : i % 4 === 1
                                ? colors.teal
                                : i % 4 === 2
                                  ? colors.purple
                                  : colors.green,
                        }}
                      ></div>
                      <div className="mt-2 text-center">
                        <p className="text-xs">{i}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>API Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">GET /api/aircraft</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `120px`, backgroundColor: colors.blue }}></div>
                        <span className="font-bold">1,245</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">GET /api/aog</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `100px`, backgroundColor: colors.green }}></div>
                        <span className="font-bold">987</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">POST /api/chat</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `80px`, backgroundColor: colors.purple }}></div>
                        <span className="font-bold">756</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">GET /api/users</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 rounded" style={{ width: `60px`, backgroundColor: colors.orange }}></div>
                        <span className="font-bold">543</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Server Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">CPU Usage</p>
                        <p className="font-bold">42%</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full" style={{ width: `42%`, backgroundColor: colors.green }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Memory Usage</p>
                        <p className="font-bold">68%</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `68%`, backgroundColor: colors.orange }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Disk Usage</p>
                        <p className="font-bold">35%</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full" style={{ width: `35%`, backgroundColor: colors.green }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Network Bandwidth</p>
                        <p className="font-bold">56%</p>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `56%`, backgroundColor: colors.orange }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
