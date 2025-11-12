import { type Session } from "next-auth"
import { getServerSideSession } from "./session"
import { NextResponse } from "next/server"

type ApiHandlerContext = {
  session: Session | null
  req: Request
  headers: Headers
}

export function apiHandler(
  handler: (context: ApiHandlerContext) => Promise<unknown>,
  authorize: boolean = true
) {
  return async (req: Request) => {
    try {
      const headers = req.headers
      
      if (authorize) {
        const session = await getServerSideSession()
        if (!session) throw { status: 401, message: "Unauthorized" }
        
        const result = await handler({ session, req, headers })
        return NextResponse.json(result, { status: 200 })
      } else {
        const result = await handler({ session: null, req, headers })
        return NextResponse.json(result, { status: 200 })
      }
    } catch (err) {
      const status = (err as { status?: number }).status || 500
      const message = (err as { message?: string }).message || "Internal Server Error"
      console.error("API error:", err)
      return new Response(JSON.stringify({ error: message }), { status })
    }
  }
}