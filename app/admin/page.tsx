"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth"
import { Users, Clock, ArrowUpRight, ArrowDownRight, UserCog, Shield, Activity, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { users } = useAuth()

  // Count admin users
  const adminUsers = users.filter((user) => user.role === "admin").length

  return (
    <ProtectedRoute requiredPermission="manage_users">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of system status and user management</p>
        </div>

        {/* Summary Cards with colored top borders */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <CardDescription>System-wide user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{users.length}</div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  12% increase
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <CardDescription>Users with admin privileges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{adminUsers}</div>
                <UserCog className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-blue-500 flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  No change
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <CardDescription>System role configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">4</div>
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />1 new
                </span>{" "}
                custom role added
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Features</CardTitle>
              <CardDescription>Enabled system features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-4 w-4" />2 features
                </span>{" "}
                disabled this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="system">System Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>New user accounts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Jan", value: 12 },
                    { name: "Feb", value: 18 },
                    { name: "Mar", value: 15 },
                    { name: "Apr", value: 22 },
                    { name: "May", value: 28 },
                    { name: "Jun", value: 32 },
                  ]}
                  xField="name"
                  yField="value"
                  height={300}
                  colors={["#D80000"]}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Roles Distribution</CardTitle>
                  <CardDescription>Breakdown by role type</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Admin", value: adminUsers },
                      { name: "Manager", value: users.filter((user) => user.role === "manager").length },
                      { name: "Engineer", value: users.filter((user) => user.role === "engineer").length },
                      { name: "Viewer", value: users.filter((user) => user.role === "viewer").length },
                    ]}
                    xField="name"
                    yField="value"
                    height={300}
                    colors={["#D80000"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Activity</CardTitle>
                  <CardDescription>User logins per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={[
                      { name: "Mon", value: 45 },
                      { name: "Tue", value: 52 },
                      { name: "Wed", value: 49 },
                      { name: "Thu", value: 63 },
                      { name: "Fri", value: 58 },
                      { name: "Sat", value: 15 },
                      { name: "Sun", value: 12 },
                    ]}
                    xField="name"
                    yField="value"
                    height={300}
                    colors={["#0284c7"]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Response time and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "00:00", value: 120 },
                    { name: "04:00", value: 90 },
                    { name: "08:00", value: 150 },
                    { name: "12:00", value: 210 },
                    { name: "16:00", value: 180 },
                    { name: "20:00", value: 110 },
                  ]}
                  xField="name"
                  yField="value"
                  height={300}
                  colors={["#0284c7"]}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most used system features</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Chat", value: 78 },
                      { name: "AOG Mgmt", value: 65 },
                      { name: "Analytics", value: 42 },
                      { name: "Staff Dir", value: 38 },
                    ]}
                    xField="name"
                    yField="value"
                    height={300}
                    colors={["#D80000"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Rate</CardTitle>
                  <CardDescription>System errors per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={[
                      { name: "Mon", value: 3 },
                      { name: "Tue", value: 2 },
                      { name: "Wed", value: 5 },
                      { name: "Thu", value: 1 },
                      { name: "Fri", value: 0 },
                      { name: "Sat", value: 0 },
                      { name: "Sun", value: 1 },
                    ]}
                    xField="name"
                    yField="value"
                    height={300}
                    colors={["#D80000"]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
