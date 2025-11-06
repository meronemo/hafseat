"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const errorMessages: Record<string, { title: string; description: string }> = {
    TeacherNotAllowed: {
      title: "선생님은 사용할 수 없어요",
      description: "HAFSeat는 학생 계정으로 로그인해야 사용할 수 있습니다. 오류라고 생각되면 오른쪽 하단 오류 제보를 통해 지금 로그인한 계정 이메일 주소와 함께 알려주세요."
    },
    Default: {
      title: "로그인 오류",
      description: "로그인 중 문제가 발생했습니다. 다시 시도해주세요."
    }
  }

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {errorInfo.description}
          </p>
          <Button 
            onClick={() => router.push('/')} 
            className="w-full"
          >
            홈으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  )
}
