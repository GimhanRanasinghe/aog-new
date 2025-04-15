"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  PenToolIcon as Tool,
  User,
  Download,
  FileIcon,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AircraftAOGHistoryProps {
  aircraft: any
  aogHistory: any[]
}

export function AircraftAOGHistory({ aircraft, aogHistory }: AircraftAOGHistoryProps) {
  const [selectedIncident, setSelectedIncident] = useState(aogHistory.length > 0 ? aogHistory[0].id : null)
  const [activeTab, setActiveTab] = useState("details")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-500">High Impact</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-yellow-500">Low Impact</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown Impact</Badge>
    }
  }

  const selectedAOG = aogHistory.find((incident) => incident.id === selectedIncident)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AOG History</h2>
        <Badge className={aircraft.status === "aog" ? "bg-red-500" : "bg-green-500"}>
          {aircraft.status === "aog" ? "Currently AOG" : "Currently Active"}
        </Badge>
      </div>

      {aogHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">No AOG History</h3>
              <p className="text-muted-foreground max-w-md">
                This aircraft has no recorded AOG incidents. All systems are operating normally.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - AOG Incident List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>AOG Incidents</CardTitle>
                <CardDescription>
                  {aogHistory.length} incident{aogHistory.length !== 1 ? "s" : ""} recorded
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="px-4 py-2">
                    {aogHistory.map((incident) => (
                      <div
                        key={incident.id}
                        className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                          selectedIncident === incident.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedIncident(incident.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">{incident.faultRelation.faultId}</div>
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="text-sm mb-2 line-clamp-2">{incident.faultRelation.description}</p>
                        <div className="flex items-center text-xs gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(incident.date)}</span>
                          <span className="mx-1">•</span>
                          <span>{incident.faultRelation.system}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right content - AOG Incident Details */}
          <div className="md:col-span-2">
            {selectedAOG && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedAOG.faultRelation.faultId}</CardTitle>
                    {getStatusBadge(selectedAOG.status)}
                  </div>
                  <CardDescription>
                    Reported on {formatDate(selectedAOG.date)} • {selectedAOG.faultRelation.system}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="communication">Communication</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Fault Description</h3>
                        <p>{selectedAOG.faultRelation.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">System</h4>
                          <p>{selectedAOG.faultRelation.system}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Subsystem</h4>
                          <p>{selectedAOG.faultRelation.subsystem}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">ATA Chapter</h4>
                          <p>{selectedAOG.faultRelation.ata}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Impact</h4>
                          <div>{getImpactBadge(selectedAOG.faultRelation.impact)}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Resolution Timeline</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium">Fault Reported</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedAOG.date)} at{" "}
                                {selectedAOG.chatHistory?.messages[0]
                                  ? formatTime(selectedAOG.chatHistory.messages[0].timestamp)
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                              <Tool className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                            </div>
                            <div>
                              <p className="font-medium">Maintenance Started</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAOG.chatHistory?.messages[2]
                                  ? formatDate(selectedAOG.chatHistory.messages[2].timestamp) +
                                    " at " +
                                    formatTime(selectedAOG.chatHistory.messages[2].timestamp)
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>

                          {selectedAOG.status === "resolved" && (
                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                <Clock className="h-4 w-4 text-green-600 dark:text-green-300" />
                              </div>
                              <div>
                                <p className="font-medium">Resolved</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedAOG.chatHistory?.messages[selectedAOG.chatHistory.messages.length - 1]
                                    ? formatDate(
                                        selectedAOG.chatHistory.messages[selectedAOG.chatHistory.messages.length - 1]
                                          .timestamp,
                                      ) +
                                      " at " +
                                      formatTime(
                                        selectedAOG.chatHistory.messages[selectedAOG.chatHistory.messages.length - 1]
                                          .timestamp,
                                      )
                                    : "Unknown"}
                                </p>
                                <p className="text-sm mt-1">
                                  Estimated resolution time: {selectedAOG.faultRelation.estimatedResolution}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedAOG.faultRelation.delayCausality && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Delay Causality</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedAOG.faultRelation.delayCausality.map((cause: string, index: number) => (
                              <li key={index}>{cause}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="communication">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Communication History</h3>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {selectedAOG.chatHistory?.messages.map((message: any) => (
                              <div
                                key={message.id}
                                className={`p-4 rounded-lg ${
                                  message.isSystemMessage ? "bg-muted" : "border border-border"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className={`p-1.5 rounded-full ${
                                      message.isSystemMessage
                                        ? "bg-amber-100 dark:bg-amber-900"
                                        : "bg-blue-100 dark:bg-blue-900"
                                    }`}
                                  >
                                    {message.isSystemMessage ? (
                                      <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-300" />
                                    ) : (
                                      <User className="h-3 w-3 text-blue-600 dark:text-blue-300" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {message.senderName}
                                      {message.role && (
                                        <span className="font-normal text-muted-foreground ml-1">({message.role})</span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="ml-auto text-xs text-muted-foreground">
                                    {formatTime(message.timestamp)}
                                  </div>
                                </div>
                                <p className="text-sm">{message.text}</p>
                                {message.hasAttachment && (
                                  <div className="mt-2">
                                    {message.attachment?.type === "image" ? (
                                      <div className="mt-2 rounded-md border bg-background overflow-hidden">
                                        <div className="relative">
                                          <img
                                            src={
                                              message.attachment.thumbnailUrl || "/placeholder.svg?height=200&width=300"
                                            }
                                            alt={message.attachment.name}
                                            className="w-full object-cover max-h-[200px]"
                                          />
                                          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" size="sm" className="gap-1">
                                              <Download className="h-3.5 w-3.5" />
                                              <span className="text-xs">Download</span>
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="p-2 flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-sm">{message.attachment.name}</p>
                                              <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="mt-2 rounded-md border bg-background p-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-sm">
                                                {message.attachment?.name || message.attachmentName}
                                              </p>
                                              {message.attachment?.size && (
                                                <p className="text-xs text-muted-foreground">
                                                  {message.attachment.size}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Download className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="technical">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Technical Details</h3>

                        {selectedAOG.faultRelation.technicalDetails ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Component P/N</h4>
                                <p>{selectedAOG.faultRelation.technicalDetails.componentPN || "N/A"}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Serial Number</h4>
                                <p>{selectedAOG.faultRelation.technicalDetails.serialNumber || "N/A"}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Manufacturer</h4>
                                <p>{selectedAOG.faultRelation.technicalDetails.manufacturer || "N/A"}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Manual Reference</h4>
                                <p>{selectedAOG.faultRelation.technicalDetails.maintenanceManualRef || "N/A"}</p>
                              </div>
                            </div>

                            {selectedAOG.faultRelation.technicalDetails.troubleshootingSteps && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Troubleshooting Steps</h4>
                                <div className="space-y-2">
                                  {selectedAOG.faultRelation.technicalDetails.troubleshootingSteps.map(
                                    (step: any, index: number) => (
                                      <div key={index} className="p-3 border rounded-md">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">{`Step ${step.step}`}</Badge>
                                          <span className="font-medium">{step.description}</span>
                                        </div>
                                        <div className="mt-2 text-sm">
                                          <span className="text-muted-foreground">Status:</span>{" "}
                                          <span
                                            className={
                                              step.status === "Completed"
                                                ? "text-green-500 dark:text-green-400"
                                                : "text-amber-500 dark:text-amber-400"
                                            }
                                          >
                                            {step.status}
                                          </span>
                                        </div>
                                        {step.result && (
                                          <div className="mt-1 text-sm">
                                            <span className="text-muted-foreground">Result:</span> {step.result}
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {selectedAOG.faultRelation.technicalDetails.replacementParts && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Replacement Parts</h4>
                                <div className="space-y-2">
                                  {selectedAOG.faultRelation.technicalDetails.replacementParts.map(
                                    (part: any, index: number) => (
                                      <div key={index} className="p-3 border rounded-md">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">{part.name}</span>
                                          <Badge className={part.available ? "bg-green-500" : "bg-red-500"}>
                                            {part.available ? "In Stock" : "Not Available"}
                                          </Badge>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                          <div>
                                            <span className="text-muted-foreground">Part Number:</span>{" "}
                                            {part.partNumber}
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Quantity:</span> {part.quantity}
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Location:</span> {part.location}
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Condition:</span> {part.condition}
                                          </div>
                                          {part.leadTime && (
                                            <div className="col-span-2">
                                              <span className="text-muted-foreground">Lead Time:</span> {part.leadTime}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {selectedAOG.faultRelation.technicalDetails.faultCodes && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Fault Codes</h4>
                                <div className="space-y-2">
                                  {selectedAOG.faultRelation.technicalDetails.faultCodes.map(
                                    (code: any, index: number) => (
                                      <div key={index} className="p-3 border rounded-md">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium font-mono">{code.code}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(code.timestamp)} {formatTime(code.timestamp)}
                                          </span>
                                        </div>
                                        <p className="mt-1 text-sm">{code.description}</p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {selectedAOG.faultRelation.technicalDetails.dispatchConditions && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Dispatch Conditions</h4>
                                <div className="p-3 border rounded-md">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      className={
                                        selectedAOG.faultRelation.technicalDetails.dispatchConditions
                                          .canDispatchWithFault
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }
                                    >
                                      {selectedAOG.faultRelation.technicalDetails.dispatchConditions
                                        .canDispatchWithFault
                                        ? "Can Dispatch with Fault"
                                        : "Cannot Dispatch with Fault"}
                                    </Badge>
                                  </div>

                                  {selectedAOG.faultRelation.technicalDetails.dispatchConditions.restrictions && (
                                    <div className="mb-2">
                                      <h5 className="text-sm font-medium">Restrictions:</h5>
                                      <ul className="list-disc pl-5 text-sm">
                                        {selectedAOG.faultRelation.technicalDetails.dispatchConditions.restrictions.map(
                                          (restriction: string, i: number) => (
                                            <li key={i}>{restriction}</li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                  {selectedAOG.faultRelation.technicalDetails.dispatchConditions
                                    .additionalRequirements && (
                                    <div>
                                      <h5 className="text-sm font-medium">Additional Requirements:</h5>
                                      <p className="text-sm">
                                        {
                                          selectedAOG.faultRelation.technicalDetails.dispatchConditions
                                            .additionalRequirements
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">No detailed technical information available</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
