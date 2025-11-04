import { apiHandler } from "@/lib/apiHandler"
import { viewSeat } from "@/services/seat/view"

export const GET = apiHandler(async (session) => {
  return await viewSeat(session)
})
