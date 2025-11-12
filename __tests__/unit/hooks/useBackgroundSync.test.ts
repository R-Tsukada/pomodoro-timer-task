import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import * as storage from '@/lib/storage'

// storageモジュールをモック
vi.mock('@/lib/storage', () => ({
  saveBackgroundTime: vi.fn(),
  getAndClearBackgroundTime: vi.fn(),
}))

describe('useBackgroundSync', () => {
  let onResume: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onResume = vi.fn()
    vi.clearAllMocks()

    // documentのvisibilityを初期化
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false,
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('初期マウント時', () => {
    it('should check for saved background time on mount', () => {
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(null)

      renderHook(() => useBackgroundSync(onResume, true))

      // 初回マウント時にgetAndClearBackgroundTimeが呼ばれる
      expect(storage.getAndClearBackgroundTime).toHaveBeenCalledTimes(1)
    })

    it('should call onResume with elapsed time when background time exists', () => {
      const pastTime = Date.now() - 30000 // 30秒前
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(pastTime)

      renderHook(() => useBackgroundSync(onResume, true))

      // onResumeが経過秒数で呼ばれる（約30秒）
      expect(onResume).toHaveBeenCalledTimes(1)
      expect(onResume).toHaveBeenCalledWith(expect.any(Number))

      const elapsedSeconds = onResume.mock.calls[0][0]
      expect(elapsedSeconds).toBeGreaterThanOrEqual(29)
      expect(elapsedSeconds).toBeLessThanOrEqual(31)
    })

    it('should not call onResume when no background time exists', () => {
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(null)

      renderHook(() => useBackgroundSync(onResume, true))

      // 保存された時刻がない場合、onResumeは呼ばれない
      expect(onResume).not.toHaveBeenCalled()
    })

    it('should not call onResume when elapsed time is 0', () => {
      const now = Date.now()
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(now)

      renderHook(() => useBackgroundSync(onResume, true))

      // 経過時間が0秒の場合、onResumeは呼ばれない
      expect(onResume).not.toHaveBeenCalled()
    })
  })

  describe('バックグラウンド移行', () => {
    it('should save background time when timer is running', () => {
      renderHook(() => useBackgroundSync(onResume, true))

      // バックグラウンドに移行
      Object.defineProperty(document, 'hidden', { value: true, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // タイマーが実行中なので時刻が保存される
      expect(storage.saveBackgroundTime).toHaveBeenCalledWith(expect.any(Number))
    })

    it('should not save background time when timer is not running', () => {
      renderHook(() => useBackgroundSync(onResume, false))

      // バックグラウンドに移行
      Object.defineProperty(document, 'hidden', { value: true, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // タイマーが停止中なので時刻は保存されない
      expect(storage.saveBackgroundTime).not.toHaveBeenCalled()
    })
  })

  describe('フォアグラウンド復帰', () => {
    it('should call onResume with elapsed seconds when returning from background', () => {
      const pastTime = Date.now() - 60000 // 60秒前
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(pastTime)

      renderHook(() => useBackgroundSync(onResume, true))
      onResume.mockClear() // 初回マウント時の呼び出しをクリア

      // フォアグラウンドに復帰
      Object.defineProperty(document, 'hidden', { value: false, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // onResumeが経過秒数で呼ばれる（約60秒）
      expect(storage.getAndClearBackgroundTime).toHaveBeenCalled()
      expect(onResume).toHaveBeenCalledTimes(1)

      const elapsedSeconds = onResume.mock.calls[0][0]
      expect(elapsedSeconds).toBeGreaterThanOrEqual(59)
      expect(elapsedSeconds).toBeLessThanOrEqual(61)
    })

    it('should not call onResume when no background time exists', () => {
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(null)

      renderHook(() => useBackgroundSync(onResume, true))
      onResume.mockClear()

      // フォアグラウンドに復帰
      Object.defineProperty(document, 'hidden', { value: false, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // 保存された時刻がないので、onResumeは呼ばれない
      expect(onResume).not.toHaveBeenCalled()
    })

    it('should not call onResume when elapsed time is less than 1 second', () => {
      const recentTime = Date.now() - 500 // 0.5秒前
      vi.mocked(storage.getAndClearBackgroundTime).mockReturnValue(recentTime)

      renderHook(() => useBackgroundSync(onResume, true))
      onResume.mockClear()

      // フォアグラウンドに復帰
      Object.defineProperty(document, 'hidden', { value: false, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // 経過時間が1秒未満なので、onResumeは呼ばれない
      expect(onResume).not.toHaveBeenCalled()
    })
  })

  describe('クリーンアップ', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => useBackgroundSync(onResume, true))
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    })
  })

  describe('タイマー状態の変更', () => {
    it('should respect isRunning state changes', () => {
      const { rerender } = renderHook(({ isRunning }) => useBackgroundSync(onResume, isRunning), {
        initialProps: { isRunning: true },
      })

      // タイマー実行中 → バックグラウンド移行
      Object.defineProperty(document, 'hidden', { value: true, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))
      expect(storage.saveBackgroundTime).toHaveBeenCalledTimes(1)

      // タイマー停止
      rerender({ isRunning: false })
      vi.mocked(storage.saveBackgroundTime).mockClear()

      // バックグラウンド移行（タイマー停止中）
      Object.defineProperty(document, 'hidden', { value: true, writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // タイマー停止中なので時刻は保存されない
      expect(storage.saveBackgroundTime).not.toHaveBeenCalled()
    })
  })
})
