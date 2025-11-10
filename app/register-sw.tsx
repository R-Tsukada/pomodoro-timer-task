'use client'

import { useEffect } from 'react'

/**
 * Service Worker登録コンポーネント
 * PWAのオフライン機能を有効化するため、Service Workerを登録します
 */
export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)

          // 更新チェック
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 新しいService Workerが利用可能
                  console.log('New Service Worker available')
                  // ユーザーに更新を促すUIを表示することも可能
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}
