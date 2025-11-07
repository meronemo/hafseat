import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { Student } from "@/types/settings"

export async function getLastSeatRun(session: Session) {
  const userClassId = session.user.classId
  
  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("date, run_by")
    .eq("id", userClassId)
  if (error) throw new Error(error.message)

  return { ok: true, date: data[0].date, runBy: data[0].run_by }
}