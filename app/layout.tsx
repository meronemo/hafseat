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

export const metadata = {
  title: "HAFSeat",
  description: "공정하고 간편한 자리 배치",
  openGraph: {
    title: "HAFSeat",
    description: "공정하고 간편한 자리 배치",
    url: "https://hafseat.com",
    siteName: "HAFSeat",
    type: "website",
  },
}

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
