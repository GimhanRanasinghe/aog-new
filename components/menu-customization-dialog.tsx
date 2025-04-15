"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUserPreferences, MENU_ITEMS } from "@/lib/user-preferences"
import { usePermission } from "@/lib/auth"
import {
  AlertCircle,
  BarChart,
  History,
  MessageSquare,
  Users,
  PlaneTakeoff,
  Home,
  Plane,
  Shield,
  Map,
} from "lucide-react"

// Map menu items to their display names and icons
const MENU_ITEM_INFO = {
  dashboard: { name: "Dashboard", icon: Home },
  "aog-aircraft": { name: "AOG Aircraft", icon: AlertCircle },
  "my-aircraft": { name: "My Aircraft", icon: PlaneTakeoff },
  "fleet-overview": { name: "Fleet Overview", icon: Plane },
  analytics: { name: "Analytics", icon: BarChart },
  "aog-history": { name: "AOG History", icon: History },
  "active-chats": { name: "Active Chats", icon: MessageSquare },
  "staff-directory": { name: "Staff Directory", icon: Users },
  "admin-panel": { name: "Admin Panel", icon: Shield },
  "terminal-view": { name: "Terminal View", icon: Map },
}

interface MenuCustomizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuCustomizationDialog({ open, onOpenChange }: MenuCustomizationDialogProps) {
  const { preferences, updateMenuVisibility } = useUserPreferences()
  const [localVisibility, setLocalVisibility] = useState({ ...preferences.menuVisibility })
  const canAccessAdmin = usePermission("manage_users")

  // Count how many items are currently visible
  const visibleCount = Object.values(localVisibility).filter(Boolean).length

  const handleCheckboxChange = (menuItem: string, checked: boolean) => {
    // Prevent disabling all menu items
    if (!checked && visibleCount <= 1) {
      return
    }

    setLocalVisibility((prev) => ({
      ...prev,
      [menuItem]: checked,
    }))
  }

  const handleSave = () => {
    // Update all menu visibility settings at once
    Object.entries(localVisibility).forEach(([menuItem, isVisible]) => {
      updateMenuVisibility(menuItem, isVisible)
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset local state to match current preferences
    setLocalVisibility({ ...preferences.menuVisibility })
    onOpenChange(false)
  }

  // Filter menu items - only show Admin Panel if user has permission
  const filteredMenuItems = MENU_ITEMS.filter((item) => item !== "admin-panel" || canAccessAdmin)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Menu</DialogTitle>
          <DialogDescription>Select which menu items to show in the navigation.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {filteredMenuItems.map((menuItem) => {
            const { name, icon: Icon } = MENU_ITEM_INFO[menuItem as keyof typeof MENU_ITEM_INFO]
            return (
              <div key={menuItem} className="flex items-center space-x-2">
                <Checkbox
                  id={`menu-item-${menuItem}`}
                  checked={localVisibility[menuItem as keyof typeof localVisibility]}
                  onCheckedChange={(checked) => handleCheckboxChange(menuItem, checked === true)}
                  disabled={localVisibility[menuItem as keyof typeof localVisibility] && visibleCount <= 1}
                />
                <Label htmlFor={`menu-item-${menuItem}`} className="flex items-center cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{name}</span>
                </Label>
              </div>
            )
          })}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
