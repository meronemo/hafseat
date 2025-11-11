"use server"

import { getServerSideSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/db"
import { PostgrestError } from "@supabase/supabase-js"
import { type Student } from "@/types/settings"
import { seatRandomizer } from "@/lib/seat/randomizer"
import { seatValidator } from "@/lib/seat/validator"
  
export async function editSeatAction(editedSeat: (Student | null)[][]) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userClassId = session.user.classId
    
    // make dateString with specified timezone
    const timeZone = "Asia/Seoul"
    const now = new Date(new Date().toLocaleString("en-US", { timeZone }))
    const dateString = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}.`

    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({ seat: editedSeat, date: dateString })
      .eq("id", userClassId)
    if (error) throw new Error(error.message)

    revalidatePath("/seat")
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function randomizeSeatAction() {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const classId = session.user.classId

    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("settings, students, seat")
      .eq("id", classId)
    if (!data) throw new Error("Class settings, students data is null")
    if (e1) throw new Error((e1 as PostgrestError).message)
    
    const settings = data[0].settings
    const students = data[0].students.data
    const studentsChanged = data[0].students.changed
    const seat = data[0].seat

    const applyRules = !(!seat || settings.changed || studentsChanged) // true if current seat is not blank or setting is not changed or students is not changed

    // randomize seat until vaildation pass
    let newSeat: (Student | null)[][] = []
    let attempts = 0
    const maxAttempts = 1000

    do {
      newSeat = await seatRandomizer(settings, students, seat, applyRules)
      attempts++
      if (attempts >= maxAttempts) {
        console.warn(`Failed to generate valid seat after ${maxAttempts} attempts`)
        break
      }
    } while (!seatValidator(settings, seat, newSeat, applyRules))
    
    // make dateString with specified timezone
    const timeZone = "Asia/Seoul"
    const now = new Date(new Date().toLocaleString("en-US", { timeZone }))
    const dateString = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}.`
    
    // reset changed flags
    const updatedSettings = { ...data[0].settings, changed: false }
    const updatedStudents = { ...data[0].students, changed: false }
    
    // write to db
    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({ 
        seat: newSeat, 
        date: dateString,
        run_by: session.user.name,
        settings: updatedSettings,
        students: updatedStudents
      })
      .eq("id", classId)
    if (e2) throw new Error(e2.message)
    
    // send slack webhook
    const slackWebhookUrl = process.env.SLACK_SEAT_WEBHOOK_URL
    const text = `Seat Run by ${session.user.name} at ${dateString}`

    if (slackWebhookUrl) {
      try {
        const res = await fetch(slackWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        })
        if (!res.ok) throw new Error("Error while sending seat webhook")
      } catch (error) {
        console.error(error)
      }
    }

    revalidatePath("/seat")
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}
