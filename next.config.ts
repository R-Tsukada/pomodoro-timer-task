import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // React Compiler サポート（Next.js 16）
  // TODO: Phase 2以降で有効化する場合は babel-plugin-react-compiler をインストール
  // reactCompiler: true,
}

// PWA設定
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

export default pwaConfig(nextConfig)
