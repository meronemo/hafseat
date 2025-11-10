"use client"

import { useEffect, useState } from "react"
import { type Settings, Student } from "@/types/settings"
import { GeneralSettings } from "@/components/Settings/GeneralSettings"
import { StudentsSettings } from "@/components/Settings/StudentsSettings"
import { BackButton } from "@/components/BackButton"
import { makeAvailableSeat } from "@/lib/makeAvailableSeat"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from "@bprogress/next/app"
import { ArrowLeft, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SettingsProps {
  user: {
    email: string
    username: string
    name: string
    grade: number
    class: string
  }
  generalSettings: Settings
  students: Student[]
}

export default function Settings({ user, generalSettings, students }: SettingsProps) {
  const router = useRouter()
  const displayClass = user.grade && user.class ? `${user.grade}학년 ${user.class}반` : "학급 정보 없음"

  // General settings state
  const [rowsState, setRowsState] = useState(generalSettings.rows)
  const [columnsState, setColumnsState] = useState(generalSettings.columns)
  const [availableSeat, setAvailableSeat] = useState<boolean[][]>(generalSettings.availableSeat)
  const [avoidSameSeatState, setAvoidSameSeatState] = useState(generalSettings.avoidSameSeat)
  const [avoidSamePartnerState, setAvoidSamePartnerState] = useState(generalSettings.avoidSamePartner)
  const [avoidUnfavorableSeatState, setAvoidUnfavorableSeatState] = useState(generalSettings.avoidUnfavorableSeat)

  // Students state
  const [studentsState, setStudentsState] = useState(students)

  // Save state
  const [saveLoading, setSaveLoading] = useState(false)
  const [allowBack, setAllowBack] = useState(false)

  useEffect(() => {
    // update rows and availableSeat when students count changes
    const rows = Math.ceil(studentsState.length / columnsState)
    const stuCnt = studentsState.length
    if (stuCnt >= 20 && stuCnt <= 35 && (rows != rowsState || availableSeat.length === 0)) {
      setAvailableSeat(makeAvailableSeat(rows, columnsState))
    } else if (stuCnt < 20 || stuCnt > 35) {
      setAvailableSeat([])
    }

    setRowsState(Math.min(5, Math.max(rows, 3)))
  }, [studentsState.length, rowsState, columnsState])

  const handleSaveAll = async () => {
    if (studentsState.length < 20 || studentsState.length > 35) {
      toast.error("학생 수는 20~35명이어야 합니다.")
      return
    }

    // Count true in availableSeat (number of available seats)
    const trueCount = availableSeat.reduce((acc, row) => acc + row.filter(v => v === true).length, 0)
    if (trueCount !== studentsState.length) {
      toast.error("사용 가능 자리 수는 학생 수와 같아야 합니다. 자리 구조 설정을 확인해 주세요.")
      return
    }

    setSaveLoading(true)
    
    try {
      // Save general settings
      const generalRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: rowsState,
          columns: columnsState,
          availableSeat: availableSeat,
          avoidSameSeat: avoidSameSeatState,
          avoidSamePartner: avoidSamePartnerState,
          avoidUnfavorableSeat: avoidUnfavorableSeatState
        }),
      })

      // Save students
      const studentsRes = await fetch("/api/settings/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: studentsState }),
      })

      if (generalRes.ok && studentsRes.ok) {
        toast.success("모든 설정 변경사항이 저장되었습니다.")
        setAllowBack(true)
        router.refresh()
      } else {
        const generalData = await generalRes.json()
        const studentsData = await studentsRes.json()
        toast.error("설정 저장 중 오류가 발생했습니다.")
        console.log(generalData.error, studentsData.error)
      }
    } catch (error) {
      toast.error("설정 저장 중 오류가 발생했습니다.")
      console.error(error)
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <BackButton allowBack={allowBack} setAllowBack={setAllowBack} showText={false} />
              <CardTitle className="text-2xl">학급 설정</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                  {user.username ? user.username[0] : <User className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="border-t border-border/50 pt-3">
                <div className="text-sm text-muted-foreground mb-1">학급</div>
                <div className="font-semibold">{displayClass}</div>
              </div>
            </div>

            {/* Student Settings Section */}
            <StudentsSettings 
              students={studentsState}
              onStudentsChange={setStudentsState}
            />

            {/* General Settings Section */}
            <GeneralSettings 
              availableSeat={availableSeat}
              avoidSameSeat={avoidSameSeatState}
              avoidSamePartner={avoidSamePartnerState}
              avoidUnfavorableSeat={avoidUnfavorableSeatState}
              setAvailableSeat={setAvailableSeat}
              onAvoidSameSeatChange={setAvoidSameSeatState}
              onAvoidSamePartnerChange={setAvoidSamePartnerState}
              onAvoidUnfavorableSeatChange={setAvoidUnfavorableSeatState}
            />    

            {/* Save Button */}
            <div className="border-t pt-4">
              <Button
                size="lg"
                onClick={handleSaveAll}
                disabled={saveLoading}
                className="w-full"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "모든 변경사항 저장"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
