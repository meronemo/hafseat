"use client"

import { useState } from "react"
import { type Settings, Student } from "@/types/settings"
import { GeneralSettings } from "@/components/Settings/GeneralSettings"
import { StudentsSettings } from "@/components/Settings/StudentsSettings"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { useRouter } from "@bprogress/next/app"
import { ArrowLeft, User, Info, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface SettingsProps {
  user: {
    email: string
    name: string
    grade: number
    class: string
  }
  generalSettings: Settings
  students: Student[]
}

export default function Settings({ user, generalSettings, students }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("general")
  const router = useRouter()
  const displayClass = user.grade && user.class ? `${user.grade}학년 ${user.class}반` : "학급 정보 없음"

  // General settings state
  const [rowsState, setRowsState] = useState(generalSettings.rows)
  const [columnsState, setColumnsState] = useState(generalSettings.columns)
  const [avoidSameSeatState, setAvoidSameSeatState] = useState(generalSettings.avoidSameSeat)
  const [avoidSamePartnerState, setAvoidSamePartnerState] = useState(generalSettings.avoidSamePartner)
  const [avoidUnfavorableSeatState, setAvoidUnfavorableSeatState] = useState(generalSettings.avoidUnfavorableSeat)

  // Students state
  const [studentsState, setStudentsState] = useState(students)

  // Save loading state
  const [saveLoading, setSaveLoading] = useState(false)

  const handleSaveAll = async () => {
    setSaveLoading(true)
    
    try {
      // Save general settings
      const generalRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: rowsState,
          columns: columnsState,
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

  const tabs = [
    { id: "general", label: "일반", icon: Info },
    { id: "students", label: "학생", icon: User },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push("/")
                  router.refresh()
                }}
                className="rounded-full -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">학급 설정</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                  {user.name ? user.name[0] : <User className="w-6 h-6" />}
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

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="py-4 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <GeneralSettings 
                      rows={rowsState}
                      columns={columnsState}
                      avoidSameSeat={avoidSameSeatState}
                      avoidSamePartner={avoidSamePartnerState}
                      avoidUnfavorableSeat={avoidUnfavorableSeatState}
                      onRowsChange={setRowsState}
                      onColumnsChange={setColumnsState}
                      onAvoidSameSeatChange={setAvoidSameSeatState}
                      onAvoidSamePartnerChange={setAvoidSamePartnerState}
                      onAvoidUnfavorableSeatChange={setAvoidUnfavorableSeatState}
                    />
                  </motion.div>
                )}
                
                {activeTab === "students" && (
                  <motion.div
                    key="students"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <StudentsSettings 
                      students={studentsState}
                      onStudentsChange={setStudentsState}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save Button - Fixed at bottom */}
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
