"use server"

import { getServerSideSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/db"
import { type Settings, type Student, defaultSettings, defaultStudents } from "@/types/settings"
import { isEqual } from "lodash"

export async function initSettingsAction(all: boolean) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userClassId = session.user.classId
    if (all) {
      // admin only: init all classes settings
      if (session.user.role !== "admin") return { status: 403, message: "Forbidden" }
  
      const { error } = await supabase
        .schema("next_auth")
        .from("classes")
        .update({ settings: defaultSettings, students: defaultStudents })
        .not('id', 'is', null)
      
      if (error) throw new Error(error.message)
    } else {
      // init user class settings
      const { error } = await supabase
        .schema("next_auth")
        .from("classes")
        .update({ settings: defaultSettings, students: defaultStudents })
        .eq("id", userClassId)
      
      if (error) throw new Error(error.message)
    }
  
    revalidatePath("/")
    revalidatePath("/settings")
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateGeneralSettingsAction(newSettings: Settings) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userClassId = session.user.classId

    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("settings")
      .eq("id", userClassId)
    if (e1) throw new Error(e1.message)

    // set changed=true if rows or columns is changed
    const currentSettings = data[0].settings
    if (newSettings.rows !== currentSettings.rows || newSettings.columns !== currentSettings.columns || currentSettings.changed) {
      newSettings.changed = true
    }

    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({settings: newSettings})
      .eq("id", userClassId)
    if (e2) throw new Error(e2.message)
    
    revalidatePath("/")
    revalidatePath("/settings")
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateStudentsSettingsAction(newSettings: Student[]) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const userClassId = session.user.classId
    let changed = false
    
    const { data: data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("students")
      .eq("id", userClassId)
    if (e1) throw new Error(e1.message)
      
    // set changed=true if students changed
    const currentStudentsData = data[0].students.data
    if (!isEqual(newSettings, currentStudentsData) || data[0].students.changed) {
      changed = true
    }
  
    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({students: {
        data: newSettings,
        changed: changed
      }})
      .eq("id", userClassId)
    if (e2) throw new Error(e2.message)
  
    revalidatePath("/")
    revalidatePath("/settings")
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}
