import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function editSeat(session: Session, req: Request) {
  const userClassId = session.user.classId
  let body = await req.json()

  const { error } = await supabase
    .schema("next_auth")
    .from("classes")
    .update({ seat: body.seat })
    .eq("id", userClassId)
  if (error) throw new Error(error.message)
  
  return { ok: true }
}