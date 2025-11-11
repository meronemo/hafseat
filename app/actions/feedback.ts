"use server"

import { getServerSideSession } from "@/lib/session"
import { supabase } from "@/lib/db"

export async function writeFeedbackAction(email: string, title: string, content: string) { // session.user not required
  try {
    const session = await getServerSideSession()
    const userName = session?.user.name
    const userEmail = session?.user.email

    // write to db
    const { error } = await supabase
    .schema("next_auth")
    .from("feedbacks")
    .insert({
      name: userName,
      email,
      user_email: userEmail,
      title,
      content
    })
    if (error) throw new Error(error.message)

    // send slack webhook
    const slackWebhookUrl = process.env.SLACK_FEEDBACKS_WEBHOOK_URL
    const text = `
    New Feedback
    name: ${userName}
    user email: ${userEmail}
    contact email: ${email}
    ${title}

    ${content}
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
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function ratingAction(star: number) {
  const session = await getServerSideSession()
  if (!session) return { ok: false, message: "Unauthorized" }
  try {
    const name = session.user.name

    // write to db
    const { error } = await supabase
      .schema("next_auth")
      .from("rating")
      .insert({ name, star })
    if (error) throw new Error(error.message)

    const slackWebhookUrl = process.env.SLACK_FEEDBACKS_WEBHOOK_URL
    const text = `
    New Rating
    name: ${name}
    star: ${star}
    `

    // send slack webhook
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
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}