"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Student } from "@/types/settings"
import { ViewSeatGrid } from "./ViewSeatGrid"
import { TeacherDesk } from "../TeacherDesk"
import { BackButton } from "../../BackButton"
import { ViewModeToggle } from "./ViewModeToggle"
import { PrintShareControls } from "./PrintShareControls"
import { Rating } from "./Rating"

interface ViewSeatProps {
  seat: (Student | null)[][]
  reverseSeat: (Student | null)[][]
  grade: number
  cls: string
  date: string
  cols: number
}

export default function ViewSeat({
  seat,
  reverseSeat,
  grade,
  cls,
  date,
  cols
}: ViewSeatProps) {
  const [viewMode, setViewMode] = useState<"student" | "teacher">("student")
  const contentRef = useRef<HTMLDivElement>(null)
  
  return (
    <div className=" bg-background p-8">
      <div className="min-h-screen max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <BackButton allowBack={true} setAllowBack={null} showText={true} />
          </div>
          <div className="flex items-center justify-center gap-4">
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            <PrintShareControls contentRef={contentRef} grade={grade} cls={cls} date={date} />
          </div>
          <div className="flex justify-end">
            <Rating />
          </div>
        </div>

        {/* Seat View Card*/}
        <div ref={contentRef} className="print-content">
          <Card id="seat-view" className="border-2">
            <CardHeader className="text-center border-b pb-4">
              <CardTitle className="text-4xl font-bold">{grade}학년 {cls}반 자리 배치도</CardTitle>
              <p className="text-muted-foreground">
                {date}
              </p>
            </CardHeader>
            
            {viewMode === "student" ? (
              <CardContent className="pt-4 pb-4">
                <TeacherDesk viewMode={viewMode}/>
                <ViewSeatGrid seat={seat} cols={cols} />
              </CardContent>
            ) : (
              <CardContent className="pt-4 pb-4">
                <ViewSeatGrid seat={reverseSeat} cols={cols} />
                <TeacherDesk viewMode={viewMode}/>  
              </CardContent>
            )}

            <div className="text-center mt-6">
              <p className="text-xs font-medium">
                <span className="bg-linear-to-r from-foreground to-secondary-foreground bg-clip-text text-transparent">HAF</span>
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Seat</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
