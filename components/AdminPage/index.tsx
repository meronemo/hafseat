"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { initSettingsAction } from "@/app/actions/settings"

export default function AdminPage() {
  const [isPending, startTransition] = useTransition()

  const handleInitAllSettings = () => {
    if (!confirm("Confirm")) {
      return
    }

    startTransition(async () => {
      const res = await initSettingsAction(true)
  
      if (res.ok) {
        toast.success("모든 학급 설정이 초기화되었습니다.")
      } else {
        toast.error(res.message || "초기화에 실패했습니다.")
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 페이지</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">학급 설정 Initialize</h3>
            <Button
              onClick={handleInitAllSettings}
              disabled={isPending}
              variant="destructive"
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  초기화 중...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  초기화 
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}