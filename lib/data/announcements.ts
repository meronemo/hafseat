import { type Session } from "next-auth"
import { type Announcement } from "@/types/announcement"
import { supabase } from "@/lib/db"

export async function getReadAnnouncements(session: Session) {
  if (!session) throw new Error("Unauthorized")
  const userEmail = session.user.email

  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .select("read_announcements")
    .eq("email", userEmail)
  if (error) throw new Error(error.message)

  return { ok: true, readAnnouncements: data[0].read_announcements }
}

export async function getAnnouncements() { // session.user not required
  const { data, error } = await supabase
    .schema("next_auth")
    .from("announcements")
    .select("title, date, content")
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return { ok: true, announcements: data as Announcement[] }
}
