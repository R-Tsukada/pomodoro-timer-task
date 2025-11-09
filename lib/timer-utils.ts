import { TimerMode } from '@/types/timer'
import { TIMER_DURATIONS, POMODORO_CONFIG } from '@/lib/constants'

/**
 * 秒を MM:SS 形式にフォーマットする
 * @param seconds - 秒数
 * @returns フォーマットされた時間文字列 (例: "25:00", "05:30")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0')

  return `${paddedMinutes}:${paddedSeconds}`
}

/**
 * タイマーモードに応じたデフォルト時間を取得
 * @param mode - タイマーモード
 * @returns 時間（秒）
 */
export function getModeDuration(mode: TimerMode): number {
  return TIMER_DURATIONS[mode]
}

/**
 * タイマーの進捗率を計算
 * @param remaining - 残り時間（秒）
 * @param total - 合計時間（秒）
 * @returns 進捗率（0-100）
 */
export function calculateProgress(remaining: number, total: number): number {
  if (total === 0) return 0

  const elapsed = total - remaining
  const progress = (elapsed / total) * 100

  // 0-100の範囲に制限
  return Math.max(0, Math.min(100, progress))
}

/**
 * 次のタイマーモードを取得
 * @param current - 現在のモード
 * @param sessions - 完了したセッション数
 * @returns 次のモード
 */
export function getNextMode(current: TimerMode, sessions: number): TimerMode {
  if (current === 'focus') {
    // 4セッション完了後は Long Break（ただし0セッションの場合は除く）
    if (sessions > 0 && sessions % POMODORO_CONFIG.SESSIONS_BEFORE_LONG_BREAK === 0) {
      return 'longBreak'
    }
    // それ以外は Short Break
    return 'shortBreak'
  }

  // Break後は常に Focus に戻る
  return 'focus'
}
