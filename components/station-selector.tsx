"use client"

import { stations } from "@/lib/aircraft-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StationSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function StationSelector({ value, onChange, className }: StationSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="Select Station" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Stations</SelectItem>
        {stations.map((station) => (
          <SelectItem key={station.code} value={station.code}>
            {station.name} ({station.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
