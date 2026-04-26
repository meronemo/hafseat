"use client"

import { useState } from "react"
import { MigrationDialog } from "@/components/HomePage/MigrationDialog"
import { type Session } from "next-auth"
import { type Announcement } from "@/types/announcement"

export interface HomeProps {
  sessionData: Session | null
  announcements: Announcement[]
  data?: {
    isAdmin: boolean
    studentCount: number
    isSeatNull: boolean
    settingsChanged: boolean
    readAnnouncements: boolean
    lastSeatDate: string | null
    lastSeatBy: string | null
  }
}

export default function HomePage({ sessionData, announcements, data }: HomeProps) {
  const [isMigrationOpen, setIsMigrationOpen] = useState(true)

  return (
    <main className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-foreground to-secondary-foreground bg-clip-text text-transparent">HAF</span>
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Seat</span>
              </h1>
            </div>
            <p className="text-muted-foreground">공정하고 간편한 자리 배치</p>
          </div>
        </div>
      </div>

      <MigrationDialog open={isMigrationOpen} onOpenChange={setIsMigrationOpen} />
    </main>
  )
}
