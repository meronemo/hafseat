"use client"

import { useTransition } from "react"
import { type Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { Shuffle, Loader2 } from "lucide-react"
import { useRouter } from "@bprogress/next/app"
import posthog from "posthog-js"
import { randomizeSeatAction } from "@/app/actions/seat"
import { toast } from "sonner"

interface RunButtonProps {
  session: Session | null
  disabled?: boolean
}

export function RunButton({ session, disabled = false }: RunButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!session) return null

  const handleRun = () => {
    startTransition(async () => {
      const res = await randomizeSeatAction()
      if (res.ok) {
        posthog.capture('seat_randomized', {
          class_id: session.user.classId
        })
        router.push("/seat")
      } else {
        console.error(res.message)
        toast.error(`자리 배치 중 문제가 발생했습니다. ${res.message}`)
      }
    })
  }

  return (
    <Button
      size="lg"
      onClick={handleRun}
      disabled={isPending || disabled}
      className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
    >
      {isPending ? (
        <div className="flex gap-2 items-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>자리 배치 실행 중</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Shuffle className="w-5 h-5 mr-2" />
          <p>자리 배치 실행</p>
        </div>
      )}
    </Button>
  )
}
