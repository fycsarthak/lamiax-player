import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lamia-X Player",
  description: "AI-powered music player — find the perfect soundtrack for your mood",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0a0a0f]">
      <body className="font-sans antialiased bg-[#0a0a0f]">
        {children}

        {/* Novus.ai — required for hackathon. Paste your install snippet below. */}
        {/* Get it from: https://novus.pendo.io after registering your app */}
        {/* <Script id="novus-ai" strategy="afterInteractive">
          {`
            // PASTE YOUR NOVUS.AI SNIPPET HERE
          `}
        </Script> */}

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
