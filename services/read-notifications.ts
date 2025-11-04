import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function getReadNotifications(session: Session) {
  const userEmail = session.user.email

  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .select("read_notifications")
    .eq("email", userEmail)

  if (error) throw new Error(error.message)
  return { ok: true, readNotifications: data[0].read_notifications }
}

export async function writeReadNotifications(session: Session, req: Request) {
  const userEmail = session.user.email
  const body = await req.json()

  const { error } = await supabase
    .schema("next_auth")
    .from("users")
    .update({read_notifications: body.data})
    .eq("email", userEmail)
  
  if (error) throw new Error(error.message)
  return { ok: true }
}