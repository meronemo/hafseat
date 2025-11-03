"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftRight, RotateCcw, Save } from "lucide-react"

export function EditControls() {
  return (  
    <div className="flex gap-2 pl-4 border-muted-foreground/20">
      <Button 
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {}}
      >
        <ArrowLeftRight className="w-4 h-4" />
        자리 교환
      </Button>

      <Button 
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {}}
      >
        <RotateCcw className="w-4 h-4" />
        초기화
      </Button>

      <Button 
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {}}
      >
        <Save className="w-4 h-4" />
        저장
      </Button>
    </div>
  )
}