import { type Settings, type Student } from "@/types/settings"

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export async function seatRandomizer(
  settings: Settings,
  students: Student[],
  seat: (Student | null)[][] | null,
  applyRules: boolean
) {
  const studentsCount = students.length
  const rows = settings.rows
  const cols = settings.columns
  const availableSeat = settings.availableSeat
  const avoidUnfavorableSeat = settings.avoidUnfavorableSeat

  const newSeat: (Student | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  )

  // configure seatPool
  let seatPool: [number, number][] = []
  for (let r=0; r<rows; r++) {
    for (let c=0; c<cols; c++) {
      if (availableSeat[r][c]) {
        seatPool.push([r, c])
      }
    }
  }
  seatPool = shuffle(seatPool)

  // configure studentsPool
  let studentsPool: Student[] = []
  if (!seat || !applyRules) {
    studentsPool = students
  } else {
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        const thisStudent = seat[r][c]
        if (!thisStudent) continue
        thisStudent.isBack = (r == rows-1 || (r == rows-2 && !seat[r+1][c]))
        thisStudent.isSide = (c == 0 || c == cols-1)
        studentsPool.push(thisStudent)
      }
    }
  }
  
  // prioritize students by previous seat: both isBack && isSide first, then either, then none
  const both: Student[] = []
  const either: Student[] = []
  const none: Student[] = []
  for (const s of studentsPool) {
    const isBack = !!s.isBack
    const isSide = !!s.isSide
    if (isBack && isSide) both.push(s)
    else if (isBack || isSide) either.push(s)
    else none.push(s)
  }
  studentsPool = [...both, ...either, ...none]

  // arrange new seat
  for (let i=0; i<studentsCount; i++) {
    if (!applyRules) {
      const thisRow = seatPool[i][0]
      const thisCol = seatPool[i][1]
      newSeat[thisRow][thisCol] = studentsPool[i]
    } else {
      const thisStudent = studentsPool[i]

      // find suitable seat with rules applied
      let idx = 0

      if (avoidUnfavorableSeat == "any" && (thisStudent?.isBack || thisStudent?.isSide)) {
        while (seatPool[idx][0] == rows-1 || seatPool[idx][1] == 0 || seatPool[idx][1] == cols-1) {
          idx++
        }
      } else {
        if (avoidUnfavorableSeat == "both") {
          if (thisStudent?.isBack) {
            while (seatPool[idx][0] == rows-1) {
              idx++
            }    
          }
          if (thisStudent?.isSide) {
            while (seatPool[idx][1] == 0 || seatPool[idx][1] == cols-1) {
              idx++
            }
          }
        } else if (avoidUnfavorableSeat == "back" && thisStudent?.isBack) {
          while (seatPool[idx][0] == rows-1) {
            idx++
          }
        } else if (avoidUnfavorableSeat == "side" && thisStudent?.isSide) {
          while (seatPool[idx][1] == 0 || seatPool[idx][1] == cols-1) {
            idx++
          }
        }
      }
        
      const thisRow = seatPool[idx][0]
      const thisCol = seatPool[idx][1]
      seatPool.splice(idx, 1) // remove selected seat from pool

      newSeat[thisRow][thisCol] = thisStudent
    }
  }

  return newSeat
}