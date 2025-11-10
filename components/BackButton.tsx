"use client"

import { Dispatch, SetStateAction } from "react"
import { useRouter } from "@bprogress/next/app"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface BackButtonProps {
  allowBack: boolean
  setAllowBack: Dispatch<SetStateAction<boolean>> | null
  showText: boolean
}

export function BackButton({allowBack, setAllowBack, showText}: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (allowBack) {
          router.push("/")
        } else {
          toast.error("변경사항이 저장되지 않았습니다. 그래도 뒤로가기를 원하면 버튼을 한 번 더 눌러주세요.")
          if (setAllowBack) {
            setAllowBack(true)
          }
        }
      }}
      className="gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      {showText && <p>뒤로가기</p>}
    </Button>
  )
}
