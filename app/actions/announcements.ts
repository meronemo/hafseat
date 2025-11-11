"use server"

import { getServerSideSession } from "@/lib/session"
import { supabase } from "@/lib/db"

export async function updateReadAnnouncementsAction(data: boolean) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userEmail = session.user.email

    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .update({read_announcements: data})
      .eq("email", userEmail)
    if (error) throw new Error(error.message)
    
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function writeAnnouncementAction(title: string, content: string) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  if (session.user.role !== "admin") return { status: 403, message: "Forbidden" }
  try {
    const timeZone = "Asia/Seoul"
    const now = new Date(new Date().toLocaleString("en-US", { timeZone }))
    const dateString = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`

    const { error: e1 } = await supabase
      .schema("next_auth")
      .from("announcements")
      .insert({title, content, date: dateString })
    if (e1) throw new Error(e1.message)

    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ read_announcements: false })
      .eq('read_announcements', true) // to show new announcement badge to users
    if (e2) throw new Error(e2.message)
      
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}
