"use client"

import { useState } from "react"
import { Settings } from "@/types/settings"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function GeneralSettings({
  rows,
  columns,
  avoidSameSeat,
  avoidSamePartner,
  avoidUnfavorableSeat,
}: Settings) {
  const [rowsState, setRows] = useState(rows)
  const [columnsState, setColumns] = useState(columns)
  const [avoidSameSeatState, setAvoidSameSeat] = useState(avoidSameSeat)
  const [avoidSamePartnerState, setAvoidSamePartner] = useState(avoidSamePartner)
  const [avoidUnfavorableSeatState, setAvoidUnfavorableSeat] = useState(avoidUnfavorableSeat)
  const [saveLoading, setSaveLoading] = useState(false)

  const handleSave = async () => {
    setSaveLoading(true)
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: rowsState,
        columns: columnsState,
        avoidSameSeat: avoidSameSeatState,
        avoidSamePartner: avoidSamePartnerState,
        avoidUnfavorableSeat: avoidUnfavorableSeatState
      }),
    })
    setSaveLoading(false)

    if (res.ok) {
      toast.success("설정이 저장되었습니다.")
    } else {
      const data = await res.json()
      console.log(data.error)
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium mb-1">자리 배치</h3>
            <p className="text-sm text-muted-foreground">교실의 자리 구조를 설정합니다.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="rows" className="text-sm text-muted-foreground whitespace-nowrap">
                행 (가로)
              </label>
              <Select value={String(rowsState)} onValueChange={(value) => setRows(Number(value))}>
                <SelectTrigger className="shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
              {/* 
              <Input
                id="rows"
                type="number"
                defaultValue={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="w-14"
              />
              */}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="cols" className="text-sm text-muted-foreground whitespace-nowrap">
                열 (세로)
              </label>
              <Input
                id="cols"
                type="number"
                defaultValue={columns}
                onChange={undefined} // (e) => setColumns(Number(e.target.value))
                className="w-14"
                disabled={true}
              />
            </div>
          </div>
        </div>
  
        <div className="border-t pt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-1">자리 배치 규칙</h3>
            <p className="text-sm text-muted-foreground">자리 배치 시 적용할 규칙을 선택합니다.</p>
          </div>
  
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-same-seat" className="font-medium cursor-pointer">
                같은 자리 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 앉았던 자리에 다시 앉지 않도록 합니다.
              </p>
            </div>
            <Switch id="avoid-same-seat" checked={avoidSameSeatState} onCheckedChange={setAvoidSameSeat} />
          </div>
  
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-same-partner" className="font-medium cursor-pointer">
                같은 짝 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 짝이었던 학생과 다시 짝이 되지 않도록 합니다.
              </p>
            </div>
            <Switch id="avoid-same-partner" checked={avoidSamePartnerState} onCheckedChange={setAvoidSamePartner} />
          </div>

          <div className="items-center justify-between p-4 space-y-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-unfavorable-seat" className="font-medium cursor-pointer">
                불리한 자리 재배치 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 불리한 자리에 앉았던 학생이 다시 불리한 자리에 배치되지 않도록 합니다.
              </p>
            </div>
            <Select
              value={avoidUnfavorableSeatState}
              onValueChange={(value: string) =>
                setAvoidUnfavorableSeat(value as "none" | "back" | "side" | "both" | "any")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">설정 안함</SelectItem>
                <SelectItem value="back">
                  맨뒤
                  <p className="text-sm text-muted-foreground">맨뒤 → 맨뒤 방지</p>
                </SelectItem>
                <SelectItem value="side">
                  양끝
                  <p className="text-sm text-muted-foreground">양끝(첫번째, 마지막 열) → 양끝 방지</p>
                </SelectItem>
                <SelectItem value="both">
                  맨뒤와 양끝 각각
                  <p className="text-sm text-muted-foreground">맨뒤 → 맨뒤 그리고 양끝 → 양끝 방지</p>
                </SelectItem>
                <SelectItem value="any">
                  맨뒤와 양끝 모두
                  <p className="text-sm text-muted-foreground">맨뒤 또는 양끝 → 맨뒤 또는 양끝 방지</p>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saveLoading}
            className="px-6"
          >
            {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "저장"}
          </Button>
        </div>
      </div>
    </div>
  )
}