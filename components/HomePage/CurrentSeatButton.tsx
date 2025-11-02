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
      onClick={() => router.push("/seat")}
      className="rounded-full px-8 py-4 text-lg"
    >
      <LayoutGrid className="w-5 h-5 mr-2" />
      현재 자리 확인
    </Button>
  )
}
