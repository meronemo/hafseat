import { apiHandler } from "@/lib/apiHandler"
import { getAnnouncements, writeAnnouncements } from "@/services/announcements"

export const GET = apiHandler(async (session, req) => {
  return await getAnnouncements()
}, false) // authorize = false

export const POST = apiHandler(async (session, req) => {
  if (session.user.role !== "admin") throw { status: 403, message: "Forbidden" }
  return await writeAnnouncements(req)
})
