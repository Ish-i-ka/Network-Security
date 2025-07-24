import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PhishGuard - Advanced Phishing URL Detector",
  description:
    "End-to-end phishing URL detection powered by machine learning. Analyze URLs for security threats with advanced ML algorithms.",
  keywords: "phishing detection, URL security, machine learning, cybersecurity, threat analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
