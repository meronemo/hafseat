"use client"

import { type Dispatch, type SetStateAction } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface GeneralSettingsProps {
  availableSeat: boolean[][]
  avoidSameSeat: boolean
  avoidSamePartner: boolean
  avoidUnfavorableSeat: "none" | "back" | "side" | "both" | "any"
  setAvailableSeat: Dispatch<SetStateAction<boolean[][]>>
  onAvoidSameSeatChange: (value: boolean) => void
  onAvoidSamePartnerChange: (value: boolean) => void
  onAvoidUnfavorableSeatChange: (value: "none" | "back" | "side" | "both" | "any") => void
}

export function GeneralSettings({
  availableSeat,
  avoidSameSeat,
  avoidSamePartner,
  avoidUnfavorableSeat,
  setAvailableSeat,
  onAvoidSameSeatChange,
  onAvoidSamePartnerChange,
  onAvoidUnfavorableSeatChange,
}: GeneralSettingsProps) {
  // handle seat click
  const handleClick = (r: number, c: number) => () => {
    setAvailableSeat(prev => {
      const newSeat = prev.map(row => row.slice())
      newSeat[r][c] = !newSeat[r][c]
      return newSeat
    })
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="border-t pt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">자리 구조</h3>
            <p className="text-sm text-muted-foreground">
              자리를 클릭해 사용 가능(흰색) / 사용 불가(빨간색)로 전환할 수 있고, 사용 가능 자리 수는 학생 수와 같아야 합니다.
            </p>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <div className="flex flex-col items-center w-full">
              {availableSeat.length !== 0 ?
                <>
                  <div className="w-24 h-8 border-2 text-sm text-muted-foreground rounded-xs bg-card mb-2 flex items-center justify-center">
                    교탁
                  </div>

                  <div className="flex flex-col gap-1">
                    {availableSeat.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((isUse, colIndex) => (
                          <Button
                            key={`${rowIndex}-${colIndex}`}
                            id={`${rowIndex}-${colIndex}`}
                            className={`relative w-8 h-8 border-2 rounded-xs m-1 transition-all cursor-pointer
                              ${isUse 
                                ? "bg-card border-primary/30 hover:border-primary/50" 
                                : "bg-destructive border-destructive hover:bg-destructive/80"
                              }
                            `}
                            onClick={handleClick(rowIndex, colIndex)}
                          />
                        ))} 
                      </div>
                    ))}
                  </div>
                </>
              :
                <p className="text-sm text-muted-foreground">학생 수가 20~35명이어야 설정할 수 있습니다.</p>
              }
            </div>
          </div>            
        </div>

        <div className="border-t pt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">자리 배치 규칙</h3>
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
            <Switch id="avoid-same-seat" checked={avoidSameSeat} onCheckedChange={onAvoidSameSeatChange} />
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
            <Switch id="avoid-same-partner" checked={avoidSamePartner} onCheckedChange={onAvoidSamePartnerChange} />
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
              value={avoidUnfavorableSeat}
              onValueChange={(value: string) =>
                onAvoidUnfavorableSeatChange(value as "none" | "back" | "side" | "both" | "any")
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
      </div>
    </div>
  )
}