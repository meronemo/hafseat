import { apiHandler } from "@/lib/apiHandler"
import { randomizeSeat } from "@/services/seat/randomize"

export const POST = apiHandler(async (session) => {
  return await randomizeSeat(session)
})
