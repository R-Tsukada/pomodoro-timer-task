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
// Service Workerは public/sw.js で手動実装
// app/register-sw.tsx でクライアントサイドから登録
export default nextConfig
