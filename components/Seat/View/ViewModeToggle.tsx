"use client"

import type { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"

interface ViewModeToggleProps {
  mode: "student" | "teacher"
  onChange: Dispatch<SetStateAction<"student" | "teacher">>
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      <Button
        variant={mode === "student" ? "default" : "ghost"}
        onClick={() => onChange("student")}
      >
        학생용
      </Button>
      <Button
        variant={mode === "teacher" ? "default" : "ghost"}
        onClick={() => onChange("teacher")}
      >
        교사용
      </Button>
    </div>
  )
}