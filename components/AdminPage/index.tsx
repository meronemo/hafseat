"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleInitAllSettings = async () => {
    if (!confirm("Confirm")) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/settings/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      })

      if (res.ok) {
        toast.success("모든 학급 설정이 초기화되었습니다.")
      } else {
        const data = await res.json()
        toast.error(data.error || "초기화에 실패했습니다.")
      }
    } catch (error) {
      console.error(error)
      toast.error("초기화 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
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
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              {isLoading ? (
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