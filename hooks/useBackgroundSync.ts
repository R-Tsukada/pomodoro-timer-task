import { useEffect } from 'react'
import { saveBackgroundTime, getAndClearBackgroundTime } from '@/lib/storage'

/**
 * useBackgroundSync - バックグラウンド処理の同期を管理するカスタムフック
 *
 * アプリがバックグラウンドに移行した時に時刻を記録し、
 * フォアグラウンドに復帰した時に経過時間を計算してタイマーを同期します。
 *
 * @param onResume - フォアグラウンド復帰時のコールバック（経過秒数を受け取る）
 * @param isRunning - タイマーが実行中かどうか（実行中の場合のみ同期を行う）
 */
export const useBackgroundSync = (
  onResume: (elapsedSeconds: number) => void,
  isRunning: boolean
) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // バックグラウンドに移行
        // タイマーが実行中の場合のみ時刻を記録
        if (isRunning) {
          saveBackgroundTime(Date.now())
        }
      } else {
        // フォアグラウンドに復帰
        const backgroundStartTime = getAndClearBackgroundTime()
        if (backgroundStartTime) {
          const now = Date.now()
          const elapsedMs = now - backgroundStartTime
          const elapsedSeconds = Math.floor(elapsedMs / 1000)

          // 経過時間が1秒以上の場合のみコールバックを実行
          if (elapsedSeconds > 0) {
            onResume(elapsedSeconds)
          }
        }
      }
    }

    // Visibility Change イベントをリスン
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 初回マウント時にもチェック（アプリ再起動時やページリロード時のため）
    const backgroundStartTime = getAndClearBackgroundTime()
    if (backgroundStartTime) {
      const now = Date.now()
      const elapsedMs = now - backgroundStartTime
      const elapsedSeconds = Math.floor(elapsedMs / 1000)

      // 経過時間が1秒以上の場合のみコールバックを実行
      if (elapsedSeconds > 0) {
        onResume(elapsedSeconds)
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onResume, isRunning])
}
