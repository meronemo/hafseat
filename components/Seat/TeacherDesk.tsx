"use client"

interface TeacherDeskProps {
  viewMode?: "student" | "teacher"
}

export function TeacherDesk({ viewMode }: TeacherDeskProps) {
  return (
    <div className={`${viewMode === "student" ? "mb-8" : "mt-8"} text-center`}>
      <div className="inline-block px-12 py-3 bg-primary/10 border-2 border-primary rounded-lg">
        <p className="text-lg font-semibold text-primary">교탁</p>
      </div>
    </div>
  )
}