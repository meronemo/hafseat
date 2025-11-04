import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function editSeat(session: Session, req: Request) {
  const userClassId = session.user.classId
  let body = await req.json()

  const timeZone = "Asia/Seoul"
  const now = new Date(new Date().toLocaleString("en-US", { timeZone }))
  const dateString = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}.`

  const { error } = await supabase
    .schema("next_auth")
    .from("classes")
    .update({ seat: body.seat, date: dateString })
    .eq("id", userClassId)
  if (error) throw new Error(error.message)
  
  return { ok: true }
}