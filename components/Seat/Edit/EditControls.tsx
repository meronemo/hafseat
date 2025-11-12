"use client"

import { Dispatch, SetStateAction } from "react"
import { type Student } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { RotateCcw, Save } from "lucide-react"
import { toast } from "sonner"
import { useProgress } from "@bprogress/next"
import { editSeatAction } from "@/app/actions/seat"
import posthog from "posthog-js"

interface EditControlsProps {
  classId: string
  students: Student[]
  seat: (Student | null)[][]
  editedSeat: (Student | null)[][]
  setEditedSeat: Dispatch<SetStateAction<(Student | null)[][]>>
  setAllowBack: Dispatch<SetStateAction<boolean>>
}

export function EditControls({classId, students, seat, editedSeat, setEditedSeat, setAllowBack}: EditControlsProps) {
  const { start, stop } = useProgress()

  const handleSave = async () => {
    start()

    // check duplicate students
    const editedSeatStudentNumbers = new Set<number>()

    for (const row of editedSeat) {
      for (const student of row) {
        if (student !== null) {
          if (editedSeatStudentNumbers.has(student.number)) {
            toast.error("중복되는 학생이 있어 저장되지 않았습니다.")
            stop()
            return
          }
          editedSeatStudentNumbers.add(student.number)
        }
      }
    }

    // check missing students
    const studentNumbers = new Set<number>()
    for (const student of students) {
      studentNumbers.add(student.number)
    }
    for (const studentNumber of studentNumbers) {
      if (!editedSeatStudentNumbers.has(studentNumber)) {
        toast.error("누락된 학생이 있어 저장되지 않았습니다.")
        stop()
        return
      }
    }

    const res = await editSeatAction(editedSeat)
    if (res.ok) {
      posthog.capture('seat_edited', {
        class_id: classId
      })
      toast.success("변경된 자리 배치가 저장되었습니다.")
      setAllowBack(true)
    } else {
      toast.error(`자리 배치 저장에 실패했습니다. ${res.message}`)
    }
    stop()
  }

  return (  
    <div className="flex gap-2 pl-4 border-muted-foreground/20">
      <Button 
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {setEditedSeat(seat)}}
      >
        <RotateCcw className="w-4 h-4" />
        초기화
      </Button>

      <Button 
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {handleSave()}}
      >
        <Save className="w-4 h-4" />
        저장
      </Button>
    </div>
  )
}