"use client"

import { Student } from "@/types/settings"

interface EditSeatGridProps {
  seat: (Student | null)[][]
  cols: number
}

export function EditSeatGrid({ seat, cols }: EditSeatGridProps) {
  return (
    <div className="flex justify-center print-bg">
      <div className="flex flex-col gap-4">
        {seat.map((row, rowIndex) => (
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
              {student ? (
                <>
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {student.number}
                  </div>

                  <p className="text-xl font-bold text-center px-2">
                    {student.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">빈자리</p>
              )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}