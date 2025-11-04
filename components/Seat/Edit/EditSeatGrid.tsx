"use client"

import { Dispatch, SetStateAction } from "react"
import { Student } from "@/types/settings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StudentSelectProps {
  editedSeat: (Student | null)[][]
  onChange: (row: number, col: number, studentNumber: number) => void
  row: number
  col: number
  students: Student[]
}

function StudentSelect({ editedSeat, onChange, row, col, students }: StudentSelectProps) {
  const thisStudent = editedSeat[row][col]
  return (
    <Select
      value={thisStudent ? String(thisStudent.number) : "0"}
      onValueChange={(value) => onChange(row, col, Number(value))}
    >
      <SelectTrigger className="shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0" key="0">빈자리</SelectItem>
        {students.map((student) => (
          <SelectItem value={String(student.number)} key={student.number}>
            {student.number}. {student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface EditSeatGridProps {
  editedSeat: (Student | null)[][]
  setEditedSeat: Dispatch<SetStateAction<(Student | null)[][]>>
  students: Student[]
  cols: number
}

export function EditSeatGrid({ editedSeat, setEditedSeat, students, cols }: EditSeatGridProps) {
  const handleChange = (row: number, col: number, studentNumber: number) => {
    setEditedSeat(prevSeat => {
      const newSeat = [...prevSeat]
      const newRow = [...newSeat[row]]
      if (studentNumber === 0) {
        newRow[col] = null
      } else {
        newRow[col] = students.find(s => s.number === studentNumber) || null
      }
      newSeat[row] = newRow
      return newSeat
    })
  }

  return (
    <div className="flex justify-center print-bg">
      <div className="flex flex-col gap-4">
        {editedSeat.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((student, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative w-32 h-20 rounded-lg border-2 
                  flex flex-col items-center justify-center
                  transition-all print:break-inside-avoid print-bg
                  ${
                    student
                      ? "bg-card border-primary/30"
                      : "bg-muted/20 border-dashed border-muted-foreground/20"
                  }
                  ${colIndex % 2 === 1 && colIndex < cols - 1 ? "mr-8" : "mr-2"}
                `}
              >
                <StudentSelect
                  editedSeat={editedSeat}
                  onChange={handleChange}
                  row={rowIndex}
                  col={colIndex}
                  students={students}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}