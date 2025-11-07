"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2 } from "lucide-react"
import { Student } from "@/types/settings"

interface StudentsSettingsProps {
  students: Student[]
  onStudentsChange: (students: Student[]) => void
}

export function StudentsSettings({ students, onStudentsChange }: StudentsSettingsProps) {
  const [newStudentNumber, setNewStudentNumber] = useState("")
  const [newStudentName, setNewStudentName] = useState("")
  const [validationError, setValidationError] = useState("")
  const numberInputRef = useRef<HTMLInputElement>(null)

  const addStudent = () => {
    if (!newStudentNumber || !newStudentName) return

    const studentNumber = parseInt(newStudentNumber)
    if (isNaN(studentNumber)) return

    if (studentNumber < 1 || studentNumber > 65) {
      setValidationError("번호는 1과 65 사이여야 합니다.")
      return
    }

    if (students.some(s => s.number === studentNumber)) {
      setValidationError("이미 존재하는 번호입니다.")
      return
    }

    setValidationError("")

    const newStudent: Student = {
      number: studentNumber,
      name: newStudentName.trim(),
      isSide: null,
      isBack: null
    }

    onStudentsChange([...students, newStudent].sort((a, b) => a.number - b.number))
    setNewStudentNumber("")
    setNewStudentName("")
  }

  const deleteStudent = (number: number) => {
    onStudentsChange(students.filter(s => s.number !== number))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addStudent()
      numberInputRef.current?.focus()
    }
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">학생 설정</h3>
        <p className="text-sm text-muted-foreground">학급의 학생 정보를 설정합니다.</p>
      </div>
      {/* Add Student Form */}
      <div className="rounded-lg p-4 space-y-3 border">
        <h3 className="text-sm font-semibold">학생 추가</h3>
        <div className="flex gap-2">
          <Input
            ref={numberInputRef}
            type="number"
            placeholder="번호"
            value={newStudentNumber}
            onChange={(e) => setNewStudentNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-18 shadow-xs"
            min="1"
            max="35"
          />
          <Input
            type="text"
            placeholder="이름"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 shadow-xs"
          />
          <Button
            onClick={addStudent}
            size="sm"
            className="rounded-full px-4 w-24"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            추가
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{validationError}</p>
      </div>

      {/* Students List */}
      <div className="space-y-2">
        <div className="space-y-3 p-4 rounded-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">학생 목록 ({students.length}명)</h3>
          </div>
          
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">등록된 학생이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ScrollArea className="h-72">
                {students.map((student) => (
                  <div
                    key={student.number}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {student.number}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStudent(student.number)}
                      className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}