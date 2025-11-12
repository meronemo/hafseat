import { apiHandler } from "@/lib/apiHandler"
import PostHogClient from "@/lib/posthog"

export const POST = apiHandler(async ({ session, req, headers }) => {
  const body = await req.json()
  const authHeader = headers.get('authorization')
  const authKey = authHeader?.replace('KakaoAK ', '')
  if (!authHeader || !authHeader?.startsWith('KakaoAK ') || authKey !== process.env.KAKAO_SERVICE_APP_ADMIN_KEY) {
    throw { status: 401, message: "Unauthorized" }
  }
  
  const posthog = PostHogClient()
  posthog.capture({
    distinctId: body.user_email,
    event: 'seat_shared',
    properties: {
      class_id: body.class_id,
      chat_type: body.CHAT_TYPE,
      chat_id: body.HASH_CHAT_ID
    }
  })

  const slackWebhookUrl = process.env.SLACK_SEAT_WEBHOOK_URL
  const text = `
    Seat Shared
    user: ${body.user_email}
    chat_type: ${body.CHAT_TYPE}
    chat_id: ${body.HASH_CHAT_ID}
  `
  if (slackWebhookUrl) {
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
  }

  return { status: 200 }
}, false)