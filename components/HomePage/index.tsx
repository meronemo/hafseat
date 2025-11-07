"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@bprogress/next/app"
import { UserArea } from "@/components/HomePage/UserArea"
import { RunButton } from "@/components/HomePage/RunButton"
import { AnnouncementDialog } from "@/components/HomePage/AnnouncementDialog"
import { FeedbackDialog } from "@/components/HomePage/FeedbackDialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, Bell, MessageCircle, ShieldUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Session } from "next-auth"
import { josa } from "es-hangul"

export interface HomeProps {
  sessionData: Session | null
  data?: {
    isAdmin: boolean
    seatCount: number
    studentCount: number
    isSeatNull: boolean
    settingsChanged: boolean
    readAnnouncements: boolean
    lastSeatDate: string | null
    lastSeatBy: string | null
  }
}

export default function HomePage({ sessionData, data }: HomeProps) {
  const { isAdmin=false, seatCount=0, studentCount=0, isSeatNull=true, settingsChanged=false, readAnnouncements: readAnnouncements=true, lastSeatDate, lastSeatBy } = data || {}
  
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [isReadAnnouncements, setIsReadAnnouncements] = useState(readAnnouncements)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const lastSeatDisplay = (lastSeatDate && lastSeatBy) ? `마지막 자리 배치: ${lastSeatDate}에 ${josa(lastSeatBy, "이/가")} 실행함` : null
  
  const router = useRouter()
  useEffect(() => {
    // detect browser page back/forward
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        router.refresh()
      }
    }

    window.addEventListener("pageshow", handlePageShow)

    return () => {
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [router])

  return (
    <main className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-foreground to-secondary-foreground bg-clip-text text-transparent">HAF</span>
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Seat</span>
              </h1>
              <span className="absolute -top-2 -right-12 md:-right-14 text-xs font-semibold px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                Beta
              </span>
            </div>
            <p className=" text-muted-foreground">공정하고 간편한 자리 배치</p>

            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                className="group relative hover:bg-accent"
                onClick={() => {
                  setIsAnnouncementOpen(true)
                  setIsReadAnnouncements(true)
                  fetch("/api/announcements/read", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "data": true })
                  })
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                공지사항
                {!isReadAnnouncements && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
                )}
              </Button>

              <Button
                variant="outline"
                className="group relative hover:bg-accent"
                onClick={() => { setIsFeedbackOpen(true) }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                의견 보내기
              </Button>

              {isAdmin && (
                <Button
                variant="outline"
                className="group relative hover:bg-accent"
                onClick={() => { router.push("/admin") }}
              >
                <ShieldUser className="w-4 h-4 mr-2" />
                관리자
              </Button>
              )}
            </div>
          </div>
  
          <div className="text-center space-y-8 w-full">
            {sessionData ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <UserArea session={sessionData} lastSeatDisplay={lastSeatDisplay} />
                </div>

                {/* alerts for wrong settings */}
                {seatCount < studentCount ? (
                  <Alert className="w-fit mx-auto" variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      자리 수({seatCount})보다 학생 수({studentCount})가 더 많아 배치가 불가합니다.
                    </AlertTitle>
                    <AlertDescription>
                      학급 설정을 변경해주세요.
                    </AlertDescription>
                  </Alert>
                ) : !studentCount ? (
                  <Alert className="w-fit mx-auto" variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      학급에 학생이 등록되지 않았습니다.
                    </AlertTitle>
                    <AlertDescription>
                      학급 설정에서 학생 정보를 입력해주세요.
                    </AlertDescription>
                  </Alert>
                ) : isSeatNull ? (
                  <Alert className="w-fit mx-auto">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      첫 자리배치 시에는 규칙이 적용되지 않습니다.
                    </AlertTitle>
                    <AlertDescription>
                      현재 자리 수정을 통해 자리 배치를 직접 입력하여 규칙을 적용할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                ) : settingsChanged ? (
                  <Alert className="w-fit mx-auto">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      자리 구조 또는 학생 설정이 변경되어 다음 자리배치 시 규칙이 적용되지 않습니다.
                    </AlertTitle>
                    <AlertDescription>
                      현재 자리 수정을 통해 변경된 설정에 맞는 자리 배치를 직접 입력하여 규칙을 적용할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                ) : null}

                <div className="text-center">
                  <RunButton session={sessionData} disabled={(seatCount < studentCount || !studentCount)}/>
                </div>
              </div>
            ) : (
              <UserArea session={null} lastSeatDisplay={null} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6">
        <p className="text-sm text-muted-foreground">
          Made by <span className="font-medium text-foreground">10630최시원</span>
        </p>
        <p className="text-xs text-muted-foreground">021325@hafs.hs.kr</p>
      </footer>

      <AnnouncementDialog 
        isAdmin={isAdmin}
        open={isAnnouncementOpen} 
        onOpenChange={setIsAnnouncementOpen} 
      />

      <FeedbackDialog 
        userName={sessionData?.user.name}
        userEmail={sessionData?.user.email}
        open={isFeedbackOpen}
        onOpenChange={setIsFeedbackOpen} 
      />
    </main>
  )
}
