"use client"

import { useRouter } from "@bprogress/next/app"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/")}
      className="gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      뒤로가기
    </Button>
  )
}
