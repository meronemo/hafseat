"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useRouter } from "@bprogress/next/app"

export function EditSeatButton() {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push("/seat/edit")}
      className="rounded-full px-2.5 py-1.5 h-auto"
    >
      <Pencil className="w-4 h-4 mr-1.5" />
      <span className="text-sm">현재 자리 수정</span>
    </Button>
  )
}
