import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { supabase } from "@/lib/db"
import PostHogClient from "./posthog"

const isProd = process.env.NODE_ENV === "production"

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: {
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          ...(isProd ? { hd: "hafs.hs.kr" } : {}),
        },
      },
    }),
  ],
  logger: {
    error(code: string, metadata?: unknown) { console.error(code, metadata) }
  },
  callbacks: {
    async signIn({ user }) {
      // in production: block if not student (email format must be 6 digits only)
      if (isProd && user.email) {
        const emailUsername = user.email.split('@')[0]
        const isStudent = /^\d{6}$/.test(emailUsername)
        if (!isStudent) {
          const slackWebhookUrl = process.env.SLACK_USER_WEBHOOK_URL
          const text = `Teacher login attempted ${user.email} | ${user.name}`
      
          if (slackWebhookUrl) {
            await fetch(slackWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text })
            }).catch(error => console.error("Slack webhook error:", error))
          }
          return '/auth/error?error=TeacherNotAllowed'
        }
      }

      try {
        // Check if new user
        const { data } = await supabase
          .schema("next_auth")
          .from("users")
          .select()
          .eq("email", user.email)
          .single()
        
        if (!data) {
          // Send new user notification
          const slackWebhookUrl = process.env.SLACK_USER_WEBHOOK_URL
          const text = `New User ${user.email} | ${user.name}`
      
          if (slackWebhookUrl) {
            await fetch(slackWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text })
            }).catch(error => console.error("Slack webhook error:", error))
          }
        }

        // log posthog event
        const posthog = PostHogClient()
        if (user.email) {
          posthog.capture({
            distinctId: user.email,
            event: "signed_in"
          })
        }
      } catch (e) {
        console.error("signIn callback error:", e)
      }
      return true
    },
    async session({ session }) {
      try {
        if (session?.user?.email) {
          const { data, error } = await supabase
          .schema("next_auth")
          .from("users")
          .select("id, classId, grade, class, name, role")
          .eq("email", session.user.email)
          .single()
          
          if (!error && data) {
            session.user.id = data.id
            session.user.name = data.name
            session.user.username = String(session.user.name).replace(/\d+/g, '')
            session.user.studentId = String(String(session.user.name).match(/\d+/g))
            session.user.classId = data.classId
            session.user.grade = data.grade
            session.user.class = data.class
            session.user.role = data.role
          }
        }
      } catch (e) {
        console.error("session callback error:", e)
      }
      return session
    }
  }
}