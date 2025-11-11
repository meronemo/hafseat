import { type Session } from "next-auth"
import { supabase } from "@/lib/db"

export async function getGeneralSettings(session: Session) {
  if (!session) throw new Error("Unauthorized")
  const userClassId = session.user.classId

  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("settings")
    .eq("id", userClassId)

  if (error) throw new Error(error.message)
  return { ok: true, settings: data[0].settings }
}

export async function getStudentsSettings(session: Session) {
  if (!session) throw new Error("Unauthorized")
  const userClassId = session.user.classId

  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("students")
    .eq("id", userClassId)

  if (error) throw new Error(error.message)
  return { ok: true, students: data[0].students.data, changed: data[0].students.changed }
}
