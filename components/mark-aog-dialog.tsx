"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { usePermission } from "@/lib/auth"

// Form schema
const formSchema = z.object({
  registration: z.string().min(6, {
    message: "Aircraft registration must be at least 6 characters.",
  }),
  location: z.string().min(3, {
    message: "Airport location must be at least 3 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  emvContinuation: z.boolean().default(false),
  primaryRootCause: z.string({
    required_error: "Please select a primary root cause.",
  }),
  secondaryRootCause: z.string().optional(),
  rootCauseReason: z.string().min(10, {
    message: "Root cause reason must be at least 10 characters.",
  }),
  preventable: z.boolean().default(false),
})

// Root cause options
const rootCauseOptions = [
  { value: "mechanical", label: "Mechanical Issue" },
  { value: "electrical", label: "Electrical System" },
  { value: "hydraulic", label: "Hydraulic System" },
  { value: "avionics", label: "Avionics" },
  { value: "engine", label: "Engine" },
  { value: "landing-gear", label: "Landing Gear" },
  { value: "structural", label: "Structural" },
  { value: "fuel-system", label: "Fuel System" },
  { value: "environmental", label: "Environmental" },
  { value: "other", label: "Other" },
]

export function MarkAOGDialog() {
  const [open, setOpen] = React.useState(false)
  const canCreateAOG = usePermission("create_aog")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emvContinuation: false,
      preventable: false,
      rootCauseReason: "", // Initialize with empty string
    },
  })

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would send the data to your backend
    console.log(values)

    toast({
      title: "Aircraft Marked as AOG",
      description: `Aircraft ${values.registration} has been marked as AOG at ${values.location}.`,
    })

    setOpen(false)
    form.reset()
  }

  if (!canCreateAOG) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Mark Aircraft as AOG</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mark Aircraft as AOG</DialogTitle>
          <DialogDescription>Fill out this form to mark an aircraft as AOG (Aircraft on Ground).</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Registration</FormLabel>
                  <FormControl>
                    <Input placeholder="C-GFZO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airport Location</FormLabel>
                  <FormControl>
                    <Input placeholder="YYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emvContinuation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>L/R EMV Continuation</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryRootCause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Root Cause</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a root cause" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rootCauseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryRootCause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Root Cause</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a secondary root cause (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rootCauseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rootCauseReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Root Cause Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about the root cause..."
                      className="min-h-[100px]"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preventable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Was the AOG Preventable?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
