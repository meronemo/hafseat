import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { Announcement } from "@/types/announcement"

export async function getReadAnnouncements(session: Session) {
  const userEmail = session.user.email

  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .select("read_announcements")
    .eq("email", userEmail)

  if (error) throw new Error(error.message)
  return { ok: true, readAnnouncements: data[0].read_announcements }
}

export async function writeReadAnnouncements(session: Session, req: Request) {
  const userEmail = session.user.email
  const body = await req.json()

  const { error } = await supabase
    .schema("next_auth")
    .from("users")
    .update({read_announcements: body.data})
    .eq("email", userEmail)
  
  if (error) throw new Error(error.message)
  return { ok: true }
}

export async function getAnnouncements() {
  const { data, error } = await supabase
    .schema("next_auth")
    .from("announcements")
    .select("title, date, content")
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return { ok: true, announcements: data as Announcement[] }
}

export async function writeAnnouncements(req: Request) {
  const body = await req.json()

  const timeZone = "Asia/Seoul"
  const now = new Date(new Date().toLocaleString("en-US", { timeZone }))
  const dateString = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`

  const { error: e1 } = await supabase
    .schema("next_auth")
    .from("announcements")
    .insert({title: body.title, content: body.content, date: dateString })
  if (e1) throw new Error(e1.message)

  const { error: e2 } = await supabase
    .schema("next_auth")
    .from("users")
    .update({ read_announcements: false })
    .eq('read_announcements', true) // to show new announcement badge to users
  if (e2) throw new Error(e2.message)
    
  return { ok: true }
}