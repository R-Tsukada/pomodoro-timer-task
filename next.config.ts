import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // React Compiler サポート（Next.js 16）
  // TODO: Phase 2以降で有効化する場合は babel-plugin-react-compiler をインストール
  // reactCompiler: true,

  // Turbopack設定（Next.js 16でデフォルト有効）
  // 空の設定でwebpack設定との競合を解消
  turbopack: {},
}

// PWA設定
// TODO: next-pwaのNext.js 16サポート待ち、Phase 4で対応
// import withPWA from 'next-pwa'
// const pwaConfig = withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// })
// export default pwaConfig(nextConfig)

export default nextConfig
