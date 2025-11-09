'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>Pomodoro Timer</title>
        <meta name="description" content="シンプルなポモドーロタイマー" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
