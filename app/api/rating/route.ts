import { apiHandler } from "@/lib/apiHandler"
import { rating } from "@/services/rating"

export const POST = apiHandler(async (session, req) => {
  return await rating(session, req)
})
