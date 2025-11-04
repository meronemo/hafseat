"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Student } from "@/types/settings"
import { EditSeatGrid } from "./EditSeatGrid"
import { TeacherDesk } from "../TeacherDesk"
import { BackButton } from "../BackButton"
import { EditControls } from "./EditControls"

interface EditSeatProps {
  seat: (Student | null)[][]
  students: Student[]
  grade: number
  cls: string
  cols: number
}

export default function EditSeat({
  seat,
  students,
  grade,
  cls,
  cols
}: EditSeatProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [editedSeat, setEditedSeat] = useState<(Student | null)[][]>(seat)
  
  return (
    <div className=" bg-background p-8">
      <div className="min-h-screen max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-4">
            <EditControls seat={seat} editedSeat={editedSeat} setEditedSeat={setEditedSeat} />
          </div>
          <div className="w-24"></div>
        </div>

        {/* Seat View Card*/}
        <div ref={contentRef} className="print-content">
          <Card id="seat-view" className="border-2">
            <CardHeader className="text-center border-b pb-4">
              <CardTitle className="text-4xl font-bold">{grade}학년 {cls}반 자리 배치 수정</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4 pb-4">
              <TeacherDesk viewMode="student"/>
              <EditSeatGrid editedSeat={editedSeat} setEditedSeat={setEditedSeat} students={students} cols={cols} />
            </CardContent>

            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                HAFSSeat.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
