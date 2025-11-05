import { apiHandler } from "@/lib/apiHandler"
import { writeFeedback } from "@/services/feedback"

export const POST = apiHandler(async (session, req) => {
  return await writeFeedback(req)
}, false)
