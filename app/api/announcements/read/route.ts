import { apiHandler } from "@/lib/apiHandler"
import { writeReadAnnouncements } from "@/services/announcements"

export const POST = apiHandler(async (session, req) => {
  return await writeReadAnnouncements(session, req)
})
