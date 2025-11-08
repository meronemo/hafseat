"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2 } from "lucide-react"
import { Student } from "@/types/settings"
import * as xlsx from "xlsx"

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = xlsx.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = xlsx.utils.sheet_to_json<Record<string, any>>(sheet)
      const headers = json.length > 0 ? Object.keys(json[0]) : []

      // validation
      if (!headers.includes("번호") || !headers.includes("이름")) {
        setValidationError("엑셀 파일에 번호, 이름 열이 필요합니다. 템플릿에 맞추어서 작성해주세요.")
        return
      }

      const numCount = new Array(66).fill(0)
      for (let i=0; i<json.length; i++) {
        const row = json[i]
        const numberData = row["번호"]
        const nameData = row["이름"]
        const numberStr = String(numberData).trim()
        const num = Number(numberStr)

        
        if (numberData === undefined || numberData === null || String(numberData).trim() === "") {
          setValidationError(`엑셀 파일의 ${i+1}번째 행에 번호 값이 없습니다.`)
          return
        }
        
        if (nameData === undefined || nameData === null || String(nameData).trim() === "") {
          setValidationError(`엑셀 파일의 ${i+1}번째 행에 이름 값이 없습니다.`)
        }

        if (!/^\d+$/.test(numberStr)) {
          setValidationError(`엑셀 파일의 ${i+1}번째 행의 번호가 정수가 아닙니다.`)
          return
        }
        
        if (isNaN(num) || num < 1 || num > 65) {
          setValidationError(`엑셀 파일의 ${i+1}번째 행의 번호가 1과 65 사이가 아닙니다.`)
          return
        }
        
        if (numCount[num] !== 0) {
          setValidationError("중복되는 번호가 있습니다.")
          return
        }
        numCount[num]++
      }
      setValidationError("")

      // set state
      const newStudents: Student[] = []
      for (const row of json) {
        const newStudent: Student = {
          number: row["번호"],
          name: row["이름"],
          isSide: null,
          isBack: null
        }
        newStudents.push(newStudent)
      }
      newStudents.sort((a, b) => a.number - b.number)
      onStudentsChange(newStudents)
    }
    reader.readAsArrayBuffer(file)
    ;(e.target as HTMLInputElement).value = ""
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">학생 설정</h3>
        <p className="text-sm text-muted-foreground">학급의 학생 정보를 설정합니다.</p>
      </div>

      {/* Excel Upload Area */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm font-medium">엑셀 파일로 설정</span>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 border"
          onClick={() => {
        const wb = xlsx.utils.book_new()
        const data = [
          ["번호", "이름"],
          [1, "김합스"],
          [2, "박합스"]
        ]
        const ws = xlsx.utils.aoa_to_sheet(data)
        xlsx.utils.book_append_sheet(wb, ws, "students")
        const sheetFile = xlsx.write(wb, { bookType: "xlsx", type: "array" })
        const blob = new Blob([sheetFile])
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "students-template.xlsx"
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
          }}
        >
          템플릿 다운로드
        </Button>

        <input
          id="students-file"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 border"
          onClick={() => {
            ;(document.getElementById("students-file") as HTMLInputElement | null)?.click()
          }}
        >
          파일 업로드
        </Button>
      </div>

      {/* Add Student Form */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm font-medium">학생 추가</span>
        <Input
          ref={numberInputRef}
          type="number"
          placeholder="번호"
          value={newStudentNumber}
          onChange={(e) => setNewStudentNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 shadow-xs"
          min="1"
          max="35"
        />
        <Input
          type="text"
          placeholder="이름"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-2 shadow-xs"
        />
        <Button
          onClick={addStudent}
          size="sm"
          className="rounded-full px-4 flex-1"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          추가
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{validationError}</p>

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