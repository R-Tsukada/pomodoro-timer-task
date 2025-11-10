import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotification } from '@/hooks/useNotification'

// Notification APIのモック
const mockNotification = vi.fn()
const mockRequestPermission = vi.fn()

describe('useNotification', () => {
  beforeEach(() => {
    // Notification APIのモックをセットアップ
    global.Notification = mockNotification as unknown as typeof Notification
    global.Notification.permission = 'default'
    global.Notification.requestPermission = mockRequestPermission

    // モックをクリア
    mockNotification.mockClear()
    mockRequestPermission.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Permission Management', () => {
    it('should return default permission on mount', () => {
      const { result } = renderHook(() => useNotification())

      expect(result.current.permission).toBe('default')
    })

    it('should request permission when requestPermission is called', async () => {
      mockRequestPermission.mockResolvedValue('granted')

      const { result } = renderHook(() => useNotification())

      await act(async () => {
        await result.current.requestPermission()
      })

      expect(mockRequestPermission).toHaveBeenCalled()
      await waitFor(() => {
        expect(result.current.permission).toBe('granted')
      })
    })

    it('should handle permission denial', async () => {
      mockRequestPermission.mockResolvedValue('denied')

      const { result } = renderHook(() => useNotification())

      await act(async () => {
        await result.current.requestPermission()
      })

      await waitFor(() => {
        expect(result.current.permission).toBe('denied')
      })
    })
  })

  describe('Notification Display', () => {
    beforeEach(() => {
      global.Notification.permission = 'granted'
    })

    it('should show notification when permission is granted', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showNotification('Test Title', {
          body: 'Test body',
        })
      })

      expect(mockNotification).toHaveBeenCalledWith('Test Title', {
        body: 'Test body',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: expect.any(String),
      })
    })

    it('should not show notification when permission is denied', () => {
      global.Notification.permission = 'denied'

      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showNotification('Test Title', {
          body: 'Test body',
        })
      })

      expect(mockNotification).not.toHaveBeenCalled()
    })

    it('should not show notification when permission is default', () => {
      global.Notification.permission = 'default'

      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showNotification('Test Title', {
          body: 'Test body',
        })
      })

      expect(mockNotification).not.toHaveBeenCalled()
    })

    it('should include custom options in notification', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.showNotification('Test Title', {
          body: 'Test body',
          icon: '/custom-icon.png',
          tag: 'custom-tag',
          requireInteraction: true,
        })
      })

      expect(mockNotification).toHaveBeenCalledWith('Test Title', {
        body: 'Test body',
        icon: '/custom-icon.png',
        badge: '/icons/icon-192.png',
        tag: 'custom-tag',
        requireInteraction: true,
      })
    })
  })

  describe('Convenience Methods', () => {
    beforeEach(() => {
      global.Notification.permission = 'granted'
    })

    it('should show focus complete notification', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.notifyFocusComplete()
      })

      expect(mockNotification).toHaveBeenCalledWith('集中時間終了！', {
        body: '25分間お疲れさまでした！休憩を取りましょう。',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'pomodoro-focus-complete',
      })
    })

    it('should show break complete notification', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.notifyBreakComplete()
      })

      expect(mockNotification).toHaveBeenCalledWith('休憩時間終了！', {
        body: 'リフレッシュできましたか？次の集中タイムを始めましょう。',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'pomodoro-break-complete',
      })
    })

    it('should show long break complete notification', () => {
      const { result } = renderHook(() => useNotification())

      act(() => {
        result.current.notifyLongBreakComplete()
      })

      expect(mockNotification).toHaveBeenCalledWith('長い休憩終了！', {
        body: 'しっかり休めましたか？新しいサイクルを始めましょう。',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'pomodoro-long-break-complete',
      })
    })
  })

  describe('Notification Support Detection', () => {
    it('should detect when Notification API is supported', () => {
      const { result } = renderHook(() => useNotification())

      expect(result.current.isSupported).toBe(true)
    })

    it('should detect when Notification API is not supported', () => {
      // @ts-expect-error - テスト用にNotificationを削除
      delete global.Notification

      const { result } = renderHook(() => useNotification())

      expect(result.current.isSupported).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle notification creation failure gracefully', () => {
      global.Notification.permission = 'granted'
      mockNotification.mockImplementation(() => {
        throw new Error('Notification creation failed')
      })

      const { result } = renderHook(() => useNotification())

      // エラーをスローせずに処理されること
      expect(() => {
        act(() => {
          result.current.showNotification('Test', { body: 'Test' })
        })
      }).not.toThrow()
    })

    it('should not request permission in non-browser environment', async () => {
      // @ts-expect-error - テスト用にNotificationを削除
      delete global.Notification

      const { result } = renderHook(() => useNotification())

      await act(async () => {
        await result.current.requestPermission()
      })

      expect(mockRequestPermission).not.toHaveBeenCalled()
    })
  })
})
