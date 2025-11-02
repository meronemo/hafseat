"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { useRouter } from "@bprogress/next/app"

export function CurrentSeatButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => router.push("/current-seat")}
      className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex gap-2 items-center">
        <LayoutGrid className="w-5 h-5 mr-2" />
        <p>현재 자리 확인</p>
      </div>
    </Button>
  )
}
