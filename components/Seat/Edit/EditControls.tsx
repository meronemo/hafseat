"use client"

import { Dispatch, SetStateAction } from "react"
import { Student } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { RotateCcw, Save } from "lucide-react"
import { toast } from "sonner"
import { useProgress } from "@bprogress/next"

interface EditControlsProps {
  seat: (Student | null)[][]
  editedSeat: (Student | null)[][]
  setEditedSeat: Dispatch<SetStateAction<(Student | null)[][]>>
}

export function EditControls({seat, editedSeat, setEditedSeat}: EditControlsProps) {
  const { start, stop } = useProgress()

  const handleSave = async () => {
    start()

    // check duplicate students
    const studentNumbers = new Set<number>()
    for (let row of editedSeat) {
      for (let student of row) {
        if (student !== null) {
          if (studentNumbers.has(student.number)) {
            console.log(studentNumbers, student.number)
            toast.error("중복되는 학생이 있어 저장되지 않았습니다.")
            stop()
            return
          }
          studentNumbers.add(student.number)
        }
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