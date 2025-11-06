import { supabase } from "@/lib/db"

export async function writeFeedback(req: Request) {
  const body = await req.json()

  const { error } = await supabase
    .schema("next_auth")
    .from("feedbacks")
    .insert({
      name: body.userName,
      email: body.email,
      user_email: body.userEmail,
      title: body.title,
      content: body.content
    })
  if (error) throw new Error(error.message)

  const slackWebhookUrl = process.env.SLACK_FEEDBACKS_WEBHOOK_URL
  const text = `
  New Feedback
  name: ${body.userName}
  user email: ${body.userEmail}
  contact email: ${body.email}
  ${body.title}

  ${body.content}
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