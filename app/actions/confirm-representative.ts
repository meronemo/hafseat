"use server"

import { getServerSideSession } from "@/lib/session"
import { supabase } from "@/lib/db"

export async function confirmRepresentativeAction(grade: number, cls: string) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userEmail = session.user.email

    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("id")
      .eq("grade", grade)
      .eq("class", cls)
    if (e1) throw new Error(e1.message)
    
    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ classId: data[0].id, grade, class: cls, read_announcements: false })
      .eq("email", userEmail)
      .single()
    if (e2) throw new Error(e2.message)

    return { ok: true, classId: data[0].id }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}
