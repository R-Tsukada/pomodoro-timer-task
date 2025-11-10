import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RegisterServiceWorker from './register-sw'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10b981', // emerald-500
}

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description:
    'タスク管理機能付きのシンプルなポモドーロタイマー。集中して作業し、適切な休憩を取りましょう。',
  applicationName: 'Pomodoro Timer',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pomodoro',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  )
}
