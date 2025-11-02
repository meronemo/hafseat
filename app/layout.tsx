import localFont from "next/font/local"
import { SessionProviderClient } from "./providers/SessionProviderClient"
import { PageTransition } from "./providers/PageTransition"
import ProgressbarProvider from "./providers/ProgressbarProvider"
import { Toaster } from "sonner"
import KakaoScript from "@/lib/KakaoScript"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} antialiased`}
      >
        <ProgressbarProvider>
          <SessionProviderClient>
            <PageTransition>{children}</PageTransition>
            <Toaster />
          </SessionProviderClient>
        </ProgressbarProvider>
        <Analytics />
        <SpeedInsights />
      </body>
      <KakaoScript />
    </html>
  )
}
