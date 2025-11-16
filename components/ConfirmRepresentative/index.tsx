"use client"

import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "@bprogress/next/app"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { confirmRepresentativeAction } from "@/app/actions/confirm-representative"
import { toast } from "sonner"

interface ConfirmRepresentativeProps {
  userRole: string
  userEmail: string
  userName: string
  userGrade: number
  userClass: number
}

export default function ConfirmRepresentative({
  userRole,
  userEmail,
  userName,
  userGrade,
  userClass,
}: ConfirmRepresentativeProps) {
  const [section, setSection] = useState(userClass === 1 || userClass === 10 ? 'A' : '')
  const [isPending, startTransition] = useTransition()

  // states for teacher grade and class setting
  const [teacherGrade, setTeacherGrade] = useState("1")
  const [teacherClass, setTeacherClass] = useState("1A")

  const router = useRouter()

  const handleConfirm = () => {
    startTransition(async () => {
      let res
      if (userRole === "teacher") {
        res = await confirmRepresentativeAction(parseInt(teacherGrade), teacherClass)
      }
      else {
        res = await confirmRepresentativeAction(userGrade, userClass+section)
      }

      if (res.ok) {
        router.push("/")
      } else {
        toast.error(`문제가 발생했습니다. ${res.message}`)
      }
    })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-2xl space-y-8 justify-center">
        <Card className="w-full max-w-xl overflow-hidden shadow-xs">
          <CardHeader>
            <div className="flex justify-center gap-4">
              <CardTitle className="text-3xl">학급 대표자 확인</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground">계정</h3>
              <div className="text-lg font-medium">{userEmail || "-"}</div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground">이름</h3>
              <div className="text-lg font-medium">{userName || "-"}</div>
            </div>

            { userRole !== "teacher" ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm text-muted-foreground">학급</h3>
                  <div className="text-lg font-bold">{userGrade}학년 {userClass}{section}반</div>
                  {(userClass === 1 || userClass === 10) && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant={section === 'A' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSection('A')}
                      >
                        A반
                      </Button>
                      <Button
                        variant={section === 'B' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSection('B')}
                      >
                        B반
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-md text-muted-foreground">
                  위 학급의 대표자이신가요? 학급당 회장, 부회장 등 대표자 1~3명만이 사이트를 사용할 것이 권장됩니다.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm text-muted-foreground mb-2">학년</h3>
                  <Select value={teacherGrade} onValueChange={setTeacherGrade}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="학년 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-muted-foreground mb-2">반</h3>
                  <Select value={teacherClass} onValueChange={setTeacherClass}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="반 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1A">1A</SelectItem>
                      <SelectItem value="1B">1B</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10A">10A</SelectItem>
                      <SelectItem value="10B">10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-md text-muted-foreground">
                  선생님 계정인 것으로 확인됩니다. 담임 선생님이시면 학년과 반을 정확히 선택하신 후 확인 버튼을 눌러주세요.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-6 py-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => signOut()}>취소</Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={isPending}
              className="px-6"
            >
              {isPending ? "처리중..." : "확인"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
