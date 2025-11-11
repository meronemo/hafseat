"use client"

import { useState } from "react"
import { Bell, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type Announcement } from "@/types/announcement"
import { CreateAnnouncementDialog } from "./CreateAnnouncementDialog"

interface AnnouncementDialogProps {
  isAdmin: boolean
  announcements: Announcement[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDialog({ isAdmin, announcements, open, onOpenChange }: AnnouncementDialogProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Bell className="w-6 h-6" />
                공지사항
              </DialogTitle>
              
              {isAdmin && (
                <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4" />
                  새 공지 작성
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {announcements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                공지사항이 없습니다.
              </p>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-xs text-muted-foreground">{announcement.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{announcement.content}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateAnnouncementDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  )
}
