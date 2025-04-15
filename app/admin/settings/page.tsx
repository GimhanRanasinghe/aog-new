"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Save, RefreshCw, Database, Bell, Shield, Mail, ArrowLeft } from "lucide-react"

export default function SystemSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Air Canada AOG Response Portal",
    siteDescription: "Streamlined communication for engineering staff to handle AOG situations efficiently.",
    timezone: "America/Toronto",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyOnNewAOG: true,
    notifyOnStatusChange: true,
    notifyOnChatMessage: true,
    notifyOnAssignment: true,
    dailyDigest: false,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    netlineApiKey: "sk_netline_123456789",
    netlineApiUrl: "https://api.netline.com/v1",
    netlinePollingInterval: "5",
    slackWebhookUrl: "",
    emailSmtpServer: "smtp.aircanada.com",
    emailSmtpPort: "587",
    emailUsername: "aog-notifications@aircanada.com",
    emailPassword: "••••••••••••",
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordExpiry: "90",
    requireMfa: true,
    allowedIpRanges: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
    auditLogging: true,
  })

  const handleSaveGeneral = () => {
    // In a real app, this would call an API
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    })
  }

  const handleSaveNotifications = () => {
    // In a real app, this would call an API
    toast({
      title: "Settings Saved",
      description: "Notification settings have been updated successfully.",
    })
  }

  const handleSaveIntegrations = () => {
    // In a real app, this would call an API
    toast({
      title: "Settings Saved",
      description: "Integration settings have been updated successfully.",
    })
  }

  const handleSaveSecurity = () => {
    // In a real app, this would call an API
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    })
  }

  return (
    <ProtectedRoute requiredPermission="system_config">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure global system settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Toronto">America/Toronto</SelectItem>
                        <SelectItem value="America/Vancouver">America/Vancouver</SelectItem>
                        <SelectItem value="America/Montreal">America/Montreal</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={generalSettings.timeFormat}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timeFormat: value })}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (13:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneral}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Events</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnNewAOG">New AOG</Label>
                      <Switch
                        id="notifyOnNewAOG"
                        checked={notificationSettings.notifyOnNewAOG}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnNewAOG: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnStatusChange">Status Changes</Label>
                      <Switch
                        id="notifyOnStatusChange"
                        checked={notificationSettings.notifyOnStatusChange}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnStatusChange: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnChatMessage">Chat Messages</Label>
                      <Switch
                        id="notifyOnChatMessage"
                        checked={notificationSettings.notifyOnChatMessage}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnChatMessage: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnAssignment">Staff Assignments</Label>
                      <Switch
                        id="notifyOnAssignment"
                        checked={notificationSettings.notifyOnAssignment}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnAssignment: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dailyDigest">Daily Digest</Label>
                      <Switch
                        id="dailyDigest"
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, dailyDigest: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  NETLINE Integration
                </CardTitle>
                <CardDescription>Configure connection to the NETLINE system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="netlineApiKey">API Key</Label>
                    <Input
                      id="netlineApiKey"
                      value={integrationSettings.netlineApiKey}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, netlineApiKey: e.target.value })
                      }
                      type="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="netlineApiUrl">API URL</Label>
                    <Input
                      id="netlineApiUrl"
                      value={integrationSettings.netlineApiUrl}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, netlineApiUrl: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netlinePollingInterval">Polling Interval (minutes)</Label>
                  <Input
                    id="netlinePollingInterval"
                    value={integrationSettings.netlinePollingInterval}
                    onChange={(e) =>
                      setIntegrationSettings({ ...integrationSettings, netlinePollingInterval: e.target.value })
                    }
                    type="number"
                    min="1"
                    max="60"
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Test Connection
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveIntegrations}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>Configure email server settings for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailSmtpServer">SMTP Server</Label>
                    <Input
                      id="emailSmtpServer"
                      value={integrationSettings.emailSmtpServer}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, emailSmtpServer: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSmtpPort">SMTP Port</Label>
                    <Input
                      id="emailSmtpPort"
                      value={integrationSettings.emailSmtpPort}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, emailSmtpPort: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailUsername">Username</Label>
                    <Input
                      id="emailUsername"
                      value={integrationSettings.emailUsername}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, emailUsername: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPassword">Password</Label>
                    <Input
                      id="emailPassword"
                      value={integrationSettings.emailPassword}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, emailPassword: e.target.value })
                      }
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" /> Send Test Email
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveIntegrations}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                      type="number"
                      min="5"
                      max="240"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                      type="number"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                      type="number"
                      min="0"
                      max="365"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireMfa">Require MFA</Label>
                      <Switch
                        id="requireMfa"
                        checked={securitySettings.requireMfa}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireMfa: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowedIpRanges">Allowed IP Ranges</Label>
                  <Textarea
                    id="allowedIpRanges"
                    value={securitySettings.allowedIpRanges}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, allowedIpRanges: e.target.value })}
                    placeholder="Enter IP ranges separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auditLogging">Enable Audit Logging</Label>
                    <Switch
                      id="auditLogging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSecurity}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
