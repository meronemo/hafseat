"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { useRouter } from "@bprogress/next/app"
import { useProgress } from "@bprogress/next"
import { toast } from "sonner"

export function ViewSeatButton() {
  const router = useRouter()
  const { start, stop } = useProgress()

  const handleClick = async () => {
    start()
    const res = await fetch("/api/seat/view")
    if (res.ok) {
      const data = await res.json()
      if (data.seat) {
        router.push("/seat")
      } else {
        toast.error("현재 자리 정보가 존재하지 않습니다.")
      }
    }
    stop()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="rounded-full px-2.5 py-1.5 h-auto"  
    >
      <LayoutGrid className="w-4 h-4 mr-1.5" />
      <span className="text-sm">자리 보기</span>
    </Button>
  )
}
