"use client"

import { Bell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDialog({ open, onOpenChange }: AnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bell className="w-6 h-6" />
            공지사항
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Announcement Item */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Title</h3>
                <p className="text-xs text-muted-foreground">Date</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Content
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
