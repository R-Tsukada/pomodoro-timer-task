import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  saveBackgroundTime,
  getAndClearBackgroundTime,
} from '@/lib/storage'
import { STORAGE_KEYS } from '@/lib/constants'
import { PersistedData } from '@/types/app'

describe('LocalStorage operations', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('saveToLocalStorage', () => {
    it('should save data to localStorage', () => {
      const mockData: PersistedData = {
        version: 1,
        timer: {
          currentMode: 'focus',
          timeRemaining: 1500,
          isRunning: false,
          completedSessionsInCycle: 0,
          completedCycles: 0,
        },
        tasks: [],
        selectedTaskId: null,
        settings: {
          duration: {
            focus: 1500,
            shortBreak: 300,
            longBreak: 900,
          },
          autoStart: true,
          soundEnabled: true,
          notificationEnabled: true,
        },
        savedAt: '2024-01-01T00:00:00.000Z',
      }

      saveToLocalStorage(mockData)

      const saved = localStorage.getItem(STORAGE_KEYS.TIMER_DATA)
      expect(saved).not.toBeNull()

      const parsed = JSON.parse(saved!)
      expect(parsed).toEqual(mockData)
    })

    it('should handle localStorage quota exceeded error', () => {
      const mockData: PersistedData = {
        version: 1,
        timer: {
          currentMode: 'focus',
          timeRemaining: 1500,
          isRunning: false,
          completedSessionsInCycle: 0,
          completedCycles: 0,
        },
        tasks: [],
        selectedTaskId: null,
        settings: {
          duration: {
            focus: 1500,
            shortBreak: 300,
            longBreak: 900,
          },
          autoStart: true,
          soundEnabled: true,
          notificationEnabled: true,
        },
        savedAt: '2024-01-01T00:00:00.000Z',
      }

      // setItemがエラーをスローするようにモック
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      // エラーをスローせずに処理されることを確認
      expect(() => saveToLocalStorage(mockData)).not.toThrow()

      // 元に戻す
      localStorage.setItem = originalSetItem
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should load data from localStorage', () => {
      const mockData: PersistedData = {
        version: 1,
        timer: {
          currentMode: 'focus',
          timeRemaining: 1200,
          isRunning: true,
          completedSessionsInCycle: 2,
          completedCycles: 1,
        },
        tasks: [
          {
            id: '1',
            name: 'Test task',
            isCompleted: false,
            sessionsCompleted: 3,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        selectedTaskId: '1',
        settings: {
          duration: {
            focus: 1500,
            shortBreak: 300,
            longBreak: 900,
          },
          autoStart: true,
          soundEnabled: true,
          notificationEnabled: true,
        },
        savedAt: '2024-01-01T00:00:00.000Z',
      }

      localStorage.setItem(STORAGE_KEYS.TIMER_DATA, JSON.stringify(mockData))

      const loaded = loadFromLocalStorage()
      expect(loaded).toEqual(mockData)
    })

    it('should return null when no data exists', () => {
      const loaded = loadFromLocalStorage()
      expect(loaded).toBeNull()
    })

    it('should return null when data is invalid JSON', () => {
      localStorage.setItem(STORAGE_KEYS.TIMER_DATA, 'invalid json')

      const loaded = loadFromLocalStorage()
      expect(loaded).toBeNull()
    })

    it('should handle localStorage access error', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('Access denied')
      })

      const loaded = loadFromLocalStorage()
      expect(loaded).toBeNull()

      // 元に戻す
      localStorage.getItem = originalGetItem
    })
  })

  describe('clearLocalStorage', () => {
    it('should clear all pomodoro data from localStorage', () => {
      // 各キーにデータを設定
      localStorage.setItem(STORAGE_KEYS.TIMER_DATA, '{"test": "timer"}')
      localStorage.setItem(STORAGE_KEYS.TASK_DATA, '{"test": "task"}')
      localStorage.setItem(STORAGE_KEYS.SETTINGS, '{"test": "settings"}')
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_TIME, '2024-01-01T00:00:00.000Z')
      localStorage.setItem('other_key', 'should remain')

      clearLocalStorage()

      // ポモドーロ関連のキーが削除されていることを確認
      expect(localStorage.getItem(STORAGE_KEYS.TIMER_DATA)).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.TASK_DATA)).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.SETTINGS)).toBeNull()
      expect(localStorage.getItem(STORAGE_KEYS.BACKGROUND_TIME)).toBeNull()

      // 他のキーは残っていることを確認
      expect(localStorage.getItem('other_key')).toBe('should remain')
    })

    it('should handle localStorage access error', () => {
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Access denied')
      })

      // エラーをスローせずに処理されることを確認
      expect(() => clearLocalStorage()).not.toThrow()

      // 元に戻す
      localStorage.removeItem = originalRemoveItem
    })
  })

  describe('saveBackgroundTime', () => {
    it('should save current time to localStorage', () => {
      const beforeTime = new Date().toISOString()

      saveBackgroundTime()

      const saved = localStorage.getItem(STORAGE_KEYS.BACKGROUND_TIME)
      expect(saved).not.toBeNull()

      const afterTime = new Date().toISOString()

      // 保存された時刻が現在時刻の範囲内であることを確認
      expect(saved!).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(saved! >= beforeTime).toBe(true)
      expect(saved! <= afterTime).toBe(true)
    })

    it('should overwrite existing background time', () => {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_TIME, '2020-01-01T00:00:00.000Z')

      saveBackgroundTime()

      const saved = localStorage.getItem(STORAGE_KEYS.BACKGROUND_TIME)
      expect(saved).not.toBe('2020-01-01T00:00:00.000Z')
    })

    it('should handle localStorage quota exceeded error', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      // エラーをスローせずに処理されることを確認
      expect(() => saveBackgroundTime()).not.toThrow()

      // 元に戻す
      localStorage.setItem = originalSetItem
    })
  })

  describe('getAndClearBackgroundTime', () => {
    it('should get and clear background time', () => {
      const testTime = '2024-01-01T12:00:00.000Z'
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_TIME, testTime)

      const result = getAndClearBackgroundTime()

      expect(result).toBe(testTime)
      expect(localStorage.getItem(STORAGE_KEYS.BACKGROUND_TIME)).toBeNull()
    })

    it('should return null when no background time exists', () => {
      const result = getAndClearBackgroundTime()

      expect(result).toBeNull()
    })

    it('should handle localStorage access error', () => {
      // getItemが失敗するようにモック（元の実装を一時的に置き換え）
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('Access denied')
      })

      const result = getAndClearBackgroundTime()
      expect(result).toBeNull()

      // 元に戻す
      localStorage.getItem = originalGetItem
    })

    it('should still clear even if there is an error', () => {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_TIME, '2024-01-01T12:00:00.000Z')

      // getItemは成功するが、removeItemが失敗するケース
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Access denied')
      })

      // エラーをスローせずに処理されることを確認
      expect(() => getAndClearBackgroundTime()).not.toThrow()

      // 元に戻す
      localStorage.removeItem = originalRemoveItem
    })
  })
})
