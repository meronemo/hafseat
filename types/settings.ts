export type AvoidUnfavorableSeat = 'none' | 'back' | 'side' | 'both' | 'any'

export interface Settings {
  rows: number
  columns: number
  availableSeat: boolean[][]
  avoidSameSeat: boolean
  avoidSamePartner: boolean
  avoidUnfavorableSeat: AvoidUnfavorableSeat
  changed: boolean
}

export interface Student {
  number: number
  name: string
  isSide: boolean | null // isSide and isBack for new seat randomizing
  isBack: boolean | null 
}

export interface Students {
  data: Student[]
  changed: boolean
}

export const defaultSettings: Settings = {
  rows: 4,
  columns: 8,
  availableSeat: [],
  avoidSameSeat: true,
  avoidSamePartner: true,
  avoidUnfavorableSeat: 'any',
  changed: false
}

export const defaultStudents: Students = {
  data: [],
  changed: false
}