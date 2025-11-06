import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function rating(session: Session, req: Request) {
  const body = await req.json()
  const name = session.user.name

  const { error } = await supabase
    .schema("next_auth")
    .from("rating")
    .insert({
      name: name,
      star: body.star
    })
  if (error) throw new Error(error.message)

  const slackWebhookUrl = process.env.SLACK_FEEDBACKS_WEBHOOK_URL
  const text = `
  New Rating
  name: ${name}
  star: ${body.star}
  `

  if (slackWebhookUrl) {
    try {
      const res = await fetch(slackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error("Error while sending feedback webhook")
    } catch (error) {
      console.error(error)
    }
  }

  return { ok: true }
}