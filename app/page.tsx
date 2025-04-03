"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-ac-dark text-white">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D45D4F10-6790-4D43-B083-F5FFBF5C9018_4_5005_c-removebg-preview-gwbCHpXPQCWcINIlPrIAj25y8cc2gS.png"
              alt="Air Canada"
              width={198}
              height={40}
              priority
              className="object-contain"
            />
            <h1 className="sr-only">Air Canada AOG Response Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-ac-red hover:bg-red-700 text-white" onClick={() => router.push("/login")}>
              Login
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter text-ac-dark md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Aircraft On Ground Response System
            </h1>
            <p className="max-w-[750px] text-lg text-ac-gray sm:text-xl">
              Streamlined communication for engineering staff to handle AOG situations efficiently. Automatically
              creates response groups based on NETLINE feed data.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="bg-ac-red hover:bg-red-700 text-white" size="lg" onClick={() => router.push("/login")}>
                Access Dashboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-ac-red text-ac-red hover:bg-ac-red/10"
                onClick={() => router.push("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 bg-ac-light md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-ac-gray">
            &copy; {new Date().getFullYear()} Air Canada Engineering Department. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

