"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface MigrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MigrationDialog({ open, onOpenChange }: MigrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl">서비스 이전 안내</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-foreground leading-relaxed">
          <p>
            HAFSeat 서비스가 <span className="font-semibold">Seatrus</span>로 이전되었습니다.
          </p>
          <p>
            더 이상 이 서비스는 유지·관리되지 않습니다. 기존에 사용하시던 모든 기능은
            새로운 서비스인 <span className="font-semibold">Seatrus</span>에서 계속 이용하실 수 있습니다.
          </p>
          <p>
            기존의 학급 데이터(학생 목록, 자리 배치, 설정 등)도 모두 <span className="font-semibold">Seatrus</span>로 이전되었으니 그대로 사용하실 수 있습니다.
          </p>
          <p>
            Seatrus로 이동하여 기존에 이용하시던 계정으로 로그인해주세요.
          </p>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => window.open("https://seatrus.app", "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Seatrus로 이동하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
