import { apiHandler } from "@/lib/apiHandler"
import { writeReadNotifications } from "@/services/read-notifications"

export const POST = apiHandler(async (session, req) => {
  return await writeReadNotifications(session, req)
})
