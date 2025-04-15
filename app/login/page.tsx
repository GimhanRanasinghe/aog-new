"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import { useAuth, ROLE_CREDENTIALS } from "@/lib/auth"
import { InfoIcon, ShieldAlert, ShieldCheck, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Login attempt with:", email, password)

      // Call login function with provided credentials
      const success = await login(email, password)

      if (success) {
        setTimeout(() => {
          console.log("Login successful, redirecting to dashboard")
          router.push("/dashboard")
        }, 1000)
        return true
      } else {
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
        return false
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
      setIsLoading(false)
      return false
    }
  }

  // Helper function to get badge color for role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive"
      case "admin":
        return "destructive"
      case "operations_manager":
      case "manager":
        return "default"
      case "senior_engineer":
      case "engineer":
        return "secondary"
      case "maintenance_staff":
      case "logistics_staff":
      case "quality_control":
        return "outline"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  // Format role name for display
  const formatRoleName = (role: string): string => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Group credentials by role type
  const adminRoles = ROLE_CREDENTIALS.filter((cred) => cred.role === "admin" || cred.role === "super_admin")

  const managementRoles = ROLE_CREDENTIALS.filter(
    (cred) => cred.role === "manager" || cred.role === "operations_manager",
  )

  const engineeringRoles = ROLE_CREDENTIALS.filter(
    (cred) => cred.role === "engineer" || cred.role === "senior_engineer",
  )

  const specializedRoles = ROLE_CREDENTIALS.filter(
    (cred) =>
      cred.role === "maintenance_staff" ||
      cred.role === "logistics_staff" ||
      cred.role === "quality_control" ||
      cred.role === "viewer",
  )

  // Function to set credentials for quick login
  const setCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-ac-dark text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D45D4F10-6790-4D43-B083-F5FFBF5C9018_4_5005_c-removebg-preview-gwbCHpXPQCWcINIlPrIAj25y8cc2gS.png"
              alt="Air Canada"
              width={204}
              height={41}
              priority
            />
            <h1 className="sr-only">Air Canada AOG Response Portal</h1>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access the AOG Response Portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@aircanada.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="admin">
                  <ShieldAlert className="mr-1 h-3 w-3" /> Admin
                </TabsTrigger>
                <TabsTrigger value="management">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Management
                </TabsTrigger>
                <TabsTrigger value="engineering">
                  <User className="mr-1 h-3 w-3" /> Engineering
                </TabsTrigger>
                <TabsTrigger value="specialized">
                  <InfoIcon className="mr-1 h-3 w-3" /> Other
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Admin role credentials:</p>
                  {adminRoles.map((cred) => (
                    <div
                      key={cred.email}
                      className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => setCredentials(cred.email, cred.password)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(cred.role)}>{formatRoleName(cred.role)}</Badge>
                          <span className="text-sm font-medium">{cred.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {cred.email} / {cred.password}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="management" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Management role credentials:</p>
                  {managementRoles.map((cred) => (
                    <div
                      key={cred.email}
                      className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => setCredentials(cred.email, cred.password)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(cred.role)}>{formatRoleName(cred.role)}</Badge>
                          <span className="text-sm font-medium">{cred.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {cred.email} / {cred.password}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="engineering" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Engineering role credentials:</p>
                  {engineeringRoles.map((cred) => (
                    <div
                      key={cred.email}
                      className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => setCredentials(cred.email, cred.password)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(cred.role)}>{formatRoleName(cred.role)}</Badge>
                          <span className="text-sm font-medium">{cred.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {cred.email} / {cred.password}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specialized" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Specialized role credentials:</p>
                  {specializedRoles.map((cred) => (
                    <div
                      key={cred.email}
                      className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => setCredentials(cred.email, cred.password)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(cred.role)}>{formatRoleName(cred.role)}</Badge>
                          <span className="text-sm font-medium">{cred.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {cred.email} / {cred.password}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="info">
                <AccordionTrigger className="text-sm">Role Access Information</AccordionTrigger>
                <AccordionContent>
                  <div className="text-xs space-y-2 text-muted-foreground">
                    <p>
                      <strong>Admin Roles:</strong> Full system access including user management and configuration.
                    </p>
                    <p>
                      <strong>Management Roles:</strong> Operational oversight, staff assignment, and reporting
                      capabilities.
                    </p>
                    <p>
                      <strong>Engineering Roles:</strong> Technical assessment, AOG creation and updates.
                    </p>
                    <p>
                      <strong>Specialized Roles:</strong> Limited access based on specific job functions.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
