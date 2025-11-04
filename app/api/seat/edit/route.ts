import { apiHandler } from "@/lib/apiHandler"
import { editSeat } from "@/services/seat/edit"

export const POST = apiHandler(async (session, req) => {
  return await editSeat(session, req)
})
