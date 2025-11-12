import { PersistedData } from '@/types/app'
import { STORAGE_KEYS } from '@/lib/constants'

/**
 * データをLocalStorageに保存する
 * @param data - 保存するデータ
 */
export function saveToLocalStorage(data: PersistedData): void {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEYS.TIMER_DATA, jsonData)
  } catch (error) {
    // QuotaExceededError やその他のエラーをログ出力
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * LocalStorageからデータを読み込む
 * @returns 保存されたデータ、または null
 */
export function loadFromLocalStorage(): PersistedData | null {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEYS.TIMER_DATA)

    if (!jsonData) {
      return null
    }

    const data = JSON.parse(jsonData) as PersistedData
    return data
  } catch (error) {
    // JSON parse エラーや localStorage アクセスエラーをログ出力
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

/**
 * LocalStorageから全てのポモドーロデータを削除する
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TIMER_DATA)
    localStorage.removeItem(STORAGE_KEYS.TASK_DATA)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.BACKGROUND_TIME)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * バックグラウンド化された時刻を保存する
 * @param timestamp - 保存するタイムスタンプ（ミリ秒）
 */
export function saveBackgroundTime(timestamp: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BACKGROUND_TIME, timestamp.toString())
  } catch (error) {
    console.error('Failed to save background time:', error)
  }
}

/**
 * バックグラウンド化された時刻を取得し、削除する
 * @returns 保存されていたタイムスタンプ（ミリ秒）、または null
 */
export function getAndClearBackgroundTime(): number | null {
  try {
    const savedTime = localStorage.getItem(STORAGE_KEYS.BACKGROUND_TIME)

    if (savedTime) {
      // 取得後に削除
      try {
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND_TIME)
      } catch (removeError) {
        console.error('Failed to remove background time:', removeError)
      }

      // 文字列を数値に変換
      const timestamp = parseInt(savedTime, 10)
      return isNaN(timestamp) ? null : timestamp
    }

    return null
  } catch (error) {
    console.error('Failed to get background time:', error)
    return null
  }
}
