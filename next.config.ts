import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // React Compiler サポート（Next.js 16）
  reactCompiler: true,
  // Turbopack 設定
  turbopack: {
    root: '/Users/ryo-tsukada/Desktop/pomodoro-nextjs',
  },
}

// PWA設定
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

export default pwaConfig(nextConfig)
