"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { useRouter } from "@bprogress/next/app"

export function ViewSeatButton() {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push("/seat")}
      className="rounded-full px-2.5 py-1.5 h-auto"  
    >
      <LayoutGrid className="w-4 h-4 mr-1.5" />
      <span className="text-sm">자리 보기</span>
    </Button>
  )
}
