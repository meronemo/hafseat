import { type Settings, type Student } from "@/types/settings"

export function seatValidator(
  settings: Settings,
  oldSeat: (Student | null)[][] | null,
  newSeat: (Student | null)[][],
  applyRules: boolean
): boolean {
  if (oldSeat === null || !applyRules) return true

  const rows = settings.rows
  const cols = settings.columns
  const avoidSameSeat = settings.avoidSameSeat
  const avoidSamePartner = settings.avoidSamePartner

  // Check avoidSameSeat rule
  if (avoidSameSeat) {
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        if (oldSeat[r][c] && newSeat[r][c]) {
          if (oldSeat[r][c]?.number === newSeat[r][c]?.number) {
            return false
          }
        }
      }
    }
  }

  // Check avoidSamePartner rule
  if (avoidSamePartner) {
    const oldPairs: Set<string> = new Set()
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols-1; c+=2) {
        const student1 = oldSeat[r][c]
        const student2 = oldSeat[r][c+1]
        if (student1 && student2) {
          const pair = [student1.number, student2.number].sort((a, b) => a - b).join('-')
          oldPairs.add(pair)
        }
      }
    }

    // Check if any new partner pairs match old pairs
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols-1; c+=2) {
        const student1 = newSeat[r][c]
        const student2 = newSeat[r][c+1]
        if (student1 && student2) {
          const pair = [student1.number, student2.number].sort((a, b) => a - b).join('-')
          if (oldPairs.has(pair)) {
            return false
          }
        }
      }
    }
  }

  return true
}