"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type NavigationStyle = "tabs" | "sidebar"

// Define the menu items that can be toggled
export const MENU_ITEMS = [
  "dashboard",
  "fleet-overview",
  "analytics",
  "aog-history",
  "active-chats",
  "staff-directory",
  "admin-panel",
  "terminal-view",
]

export type MenuVisibility = {
  [key in (typeof MENU_ITEMS)[number]]: boolean
}

interface UserPreferences {
  navigationStyle: NavigationStyle
  menuVisibility: MenuVisibility
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  updateNavigationStyle: (style: NavigationStyle) => void
  updateMenuVisibility: (menuItem: string, isVisible: boolean) => void
}

const defaultMenuVisibility: MenuVisibility = {
  dashboard: true,
  "fleet-overview": true,
  analytics: true,
  "aog-history": false, // Disabled by default
  "active-chats": true,
  "staff-directory": false, // Disabled by default
  "admin-panel": false, // Disabled by default
  "terminal-view": true, // Enabled by default
}

const defaultPreferences: UserPreferences = {
  navigationStyle: "sidebar",
  menuVisibility: defaultMenuVisibility,
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem("userPreferences")
    if (storedPreferences) {
      try {
        const parsedPreferences = JSON.parse(storedPreferences)
        // Ensure all menu items exist in the loaded preferences
        if (!parsedPreferences.menuVisibility) {
          parsedPreferences.menuVisibility = defaultMenuVisibility
        } else {
          // Add any missing menu items with default value from defaultMenuVisibility
          MENU_ITEMS.forEach((item) => {
            if (parsedPreferences.menuVisibility[item] === undefined) {
              parsedPreferences.menuVisibility[item] = defaultMenuVisibility[item]
            }
          })
        }
        setPreferences(parsedPreferences)
      } catch (error) {
        console.error("Failed to parse stored preferences:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("userPreferences", JSON.stringify(preferences))
    }
  }, [preferences, isLoaded])

  const updateNavigationStyle = (style: NavigationStyle) => {
    setPreferences((prev) => ({ ...prev, navigationStyle: style }))
  }

  const updateMenuVisibility = (menuItem: string, isVisible: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      menuVisibility: {
        ...prev.menuVisibility,
        [menuItem]: isVisible,
      },
    }))
  }

  return (
    <UserPreferencesContext.Provider value={{ preferences, updateNavigationStyle, updateMenuVisibility }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}

