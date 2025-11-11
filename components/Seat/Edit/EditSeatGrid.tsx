"use client"

import { useState, useEffect } from "react"
import { Dispatch, SetStateAction } from "react"
import { type Student } from "@/types/settings"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"

interface StudentSelectProps {
  editedSeat: (Student | null)[][]
  onChange: (row: number, col: number, studentNumber: number) => void
  row: number
  col: number
  studentsOption: ({value: string; label: string; num: number;})[]
}

function StudentSelect({ editedSeat, onChange, row, col, studentsOption }: StudentSelectProps) {
  const thisStudent = editedSeat[row][col]
  const thisStudentDisplay = thisStudent ? `${thisStudent.number}. ${thisStudent.name}` : "빈자리"
  
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(thisStudentDisplay)

  useEffect(() => {
    setValue(thisStudentDisplay)
  }, [thisStudentDisplay])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? studentsOption.find((student) => student.value === value)?.label
            : "선택"
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="학생 검색" />
          <CommandList>
            <CommandEmpty>검색 결과 없음</CommandEmpty>
            <CommandGroup>
              {studentsOption.map((student) => (
                <CommandItem
                  key={student.value}
                  value={student.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    onChange(row, col, student.num)
                    setOpen(false)
                  }}
                >
                  {student.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface EditSeatGridProps {
  editedSeat: (Student | null)[][]
  setEditedSeat: Dispatch<SetStateAction<(Student | null)[][]>>
  students: Student[]
  cols: number
}

export function EditSeatGrid({ editedSeat, setEditedSeat, students, cols }: EditSeatGridProps) {
  const studentsOption = [{ value: "빈자리", label: "빈자리", num: 0 }]
  students.map((student) => {
    const display = `${student.number}. ${student.name}`
    studentsOption.push({ value: display, label: display, num: student.number })
  })

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
                  studentsOption={studentsOption}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}