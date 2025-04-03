"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="w-full bg-sidebar-background text-sidebar-foreground border-t border-sidebar-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D45D4F10-6790-4D43-B083-F5FFBF5C9018_4_5005_c-removebg-preview-gwbCHpXPQCWcINIlPrIAj25y8cc2gS.png"
              alt="Air Canada Logo"
              width={120}
              height={40}
              className="mr-2"
            />
            <span className="text-sm font-medium">AOG Response Portal</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/terms" className="text-xs hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs hover:underline">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-xs hover:underline">
              Contact Support
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-sidebar-foreground/70">
          <p>© {new Date().getFullYear()} Air Canada. All rights reserved.</p>
          <p className="mt-1">AOG Response Portal v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}

