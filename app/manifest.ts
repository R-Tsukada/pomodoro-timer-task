import { MetadataRoute } from 'next'

/**
 * PWA Manifest
 * Next.js 16のApp Routerで自動的に /manifest.webmanifest として提供されます
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pomodoro Timer - シンプルなポモドーロタイマー',
    short_name: 'Pomodoro',
    description:
      'タスク管理機能付きのシンプルなポモドーロタイマー。集中して作業し、適切な休憩を取りましょう。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981', // emerald-500
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'utilities'],
    shortcuts: [
      {
        name: 'タイマー開始',
        short_name: 'Start',
        description: 'ポモドーロタイマーを開始',
        url: '/?action=start',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
  }
}
