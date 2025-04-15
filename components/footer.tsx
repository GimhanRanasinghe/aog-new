"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="w-full bg-sidebar-background text-sidebar-foreground border-t border-sidebar-border mt-auto">
      <div className="container mx-auto px-4 py-3">
        {/* First row: Logo + Portal name on left, links on right */}
        <div className="flex flex-wrap justify-between items-center mb-2">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D45D4F10-6790-4D43-B083-F5FFBF5C9018_4_5005_c-removebg-preview-gwbCHpXPQCWcINIlPrIAj25y8cc2gS.png"
              alt="Air Canada Logo"
              width={100}
              height={35}
              className="mr-2"
            />
            <span className="text-sm font-medium">AOG Response Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-xs hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-xs hover:underline">
              Support
            </Link>
          </div>
        </div>

        {/* Second row: Copyright and version info */}
        <div className="text-center text-xs text-sidebar-foreground/70">
          <p>© {new Date().getFullYear()} Air Canada. All rights reserved. | AOG Response Portal v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}
