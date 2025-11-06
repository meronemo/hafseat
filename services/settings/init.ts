import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { defaultSettings, defaultStudents } from "@/types/settings"

export async function initSettings(session: Session, req: Request) {
  const userClassId = session.user.classId
  const body = await req.json()

  if (body.all) {
    // admin only: init all classes
    if (session.user.role !== "admin") {
      throw { status: 403, message: "Forbidden" }
    }

    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({ settings: defaultSettings, students: defaultStudents })
      .not('id', 'is', null)
    
    if (error) throw { status: 500, message: error.message }
  } else {
    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({ settings: defaultSettings, students: defaultStudents })
      .eq("id", userClassId)
    
    if (error) throw { status: 500, message: error.message }
  }

  return { ok: true }
}

// TODO: admin page 만들어서 class all 초기화하는 api call하는 button 만들기