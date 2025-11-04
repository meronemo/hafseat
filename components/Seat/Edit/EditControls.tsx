"use client"

import { Dispatch, SetStateAction } from "react"
import { Student } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { RotateCcw, Save } from "lucide-react"
import { toast } from "sonner"
import { useProgress } from "@bprogress/next"

interface EditControlsProps {
  students: Student[]
  seat: (Student | null)[][]
  editedSeat: (Student | null)[][]
  setEditedSeat: Dispatch<SetStateAction<(Student | null)[][]>>
}

export function EditControls({students, seat, editedSeat, setEditedSeat}: EditControlsProps) {
  const { start, stop } = useProgress()

  const handleSave = async () => {
    start()

    // check duplicate students
    const editedSeatStudentNumbers = new Set<number>()

    for (let row of editedSeat) {
      for (let student of row) {
        if (student !== null) {
          if (editedSeatStudentNumbers.has(student.number)) {
            console.log(editedSeatStudentNumbers, student.number)
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
    for (let student of students) {
      studentNumbers.add(student.number)
    }
    for (let studentNumber of studentNumbers) {
      if (!editedSeatStudentNumbers.has(studentNumber)) {
        toast.error("누락된 학생이 있어 저장되지 않았습니다.")
        stop()
        return
      }
    }

    const res = await fetch("/api/seat/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seat: editedSeat
      })
    })
    
    if (res.ok) {
      toast.success("변경된 자리 배치가 저장되었습니다.")
      stop()
    } else {
      const data = await res.json()
      console.log(data.error)
      stop()
    }
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