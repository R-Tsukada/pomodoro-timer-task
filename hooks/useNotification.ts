'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * 通知のオプション
 */
export interface PomodoroNotificationOptions {
  body?: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

/**
 * 通知機能を提供するカスタムフック
 *
 * @example
 * ```tsx
 * const { permission, requestPermission, showNotification, notifyFocusComplete } = useNotification()
 *
 * // 権限リクエスト
 * await requestPermission()
 *
 * // カスタム通知
 * showNotification('タイトル', { body: '本文' })
 *
 * // Focus完了通知
 * notifyFocusComplete()
 * ```
 */
export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  // ブラウザのNotification APIサポートを確認
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  /**
   * 通知権限をリクエスト
   */
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      console.warn('Notification API is not supported in this browser')
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return 'denied'
    }
  }, [isSupported])

  /**
   * 通知を表示
   */
  const showNotification = useCallback(
    (title: string, options?: PomodoroNotificationOptions): Notification | null => {
      if (!isSupported) {
        console.warn('Notification API is not supported')
        return null
      }

      if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return null
      }

      try {
        const notification = new Notification(title, {
          ...options,
          icon: options?.icon ?? '/icons/icon-192.png',
          badge: options?.badge ?? '/icons/icon-192.png',
          tag: options?.tag ?? `pomodoro-${Date.now()}`,
        })

        return notification
      } catch (error) {
        console.error('Failed to show notification:', error)
        return null
      }
    },
    [isSupported, permission]
  )

  /**
   * Focus完了時の通知
   */
  const notifyFocusComplete = useCallback(() => {
    return showNotification('集中時間終了！', {
      body: '25分間お疲れさまでした！休憩を取りましょう。',
      tag: 'pomodoro-focus-complete',
    })
  }, [showNotification])

  /**
   * 短い休憩完了時の通知
   */
  const notifyBreakComplete = useCallback(() => {
    return showNotification('休憩時間終了！', {
      body: 'リフレッシュできましたか？次の集中タイムを始めましょう。',
      tag: 'pomodoro-break-complete',
    })
  }, [showNotification])

  /**
   * 長い休憩完了時の通知
   */
  const notifyLongBreakComplete = useCallback(() => {
    return showNotification('長い休憩終了！', {
      body: 'しっかり休めましたか？新しいサイクルを始めましょう。',
      tag: 'pomodoro-long-break-complete',
    })
  }, [showNotification])

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    notifyFocusComplete,
    notifyBreakComplete,
    notifyLongBreakComplete,
  }
}
