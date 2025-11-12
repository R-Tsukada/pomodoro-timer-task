import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TimerMode } from '@/types/timer'
import { getModeDuration } from '@/lib/timer-utils'
import { STORAGE_KEYS } from '@/lib/constants'

interface TimerStore {
  // State
  currentMode: TimerMode
  timeRemaining: number
  isRunning: boolean
  completedSessionsInCycle: number
  completedCycles: number

  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  tickMultiple: (seconds: number) => void
  switchMode: (mode: TimerMode, shouldAutoStart?: boolean) => void
  completeSession: () => void

  // Test Helpers
  setTimeRemaining: (time: number) => void
  setCompletedSessions: (count: number) => void
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMode: 'focus',
      timeRemaining: 1500,
      isRunning: false,
      completedSessionsInCycle: 0,
      completedCycles: 0,

      // Actions
      startTimer: () => {
        set({ isRunning: true })
      },

      pauseTimer: () => {
        set({ isRunning: false })
      },

      resetTimer: () => {
        const { currentMode } = get()
        const duration = getModeDuration(currentMode)
        set({ timeRemaining: duration, isRunning: false })
      },

      tick: () => {
        const { timeRemaining, isRunning } = get()

        // タイマーが停止中、または時間が0の場合は何もしない
        if (!isRunning || timeRemaining <= 0) return

        // 時間を1秒減らす
        const newTime = timeRemaining - 1
        set({ timeRemaining: newTime })

        // 時間が0になったらセッション完了
        if (newTime === 0) {
          get().completeSession()
        }
      },

      tickMultiple: (seconds: number) => {
        const { timeRemaining, isRunning } = get()

        // タイマーが停止中、時間が0、または進める秒数が0以下の場合は何もしない
        if (!isRunning || timeRemaining <= 0 || seconds <= 0) return

        let remainingSeconds = seconds
        let currentTime = timeRemaining

        // バックグラウンド時間を処理（複数セッションをまたぐ可能性も考慮）
        while (remainingSeconds > 0 && currentTime > 0) {
          if (remainingSeconds >= currentTime) {
            // 現在のセッションを完了させる
            remainingSeconds -= currentTime
            currentTime = 0

            // セッション完了処理を実行
            get().completeSession()

            // 次のセッションの初期時間を取得
            currentTime = get().timeRemaining

            // タイマーが自動開始されない場合は停止
            if (!get().isRunning) {
              break
            }
          } else {
            // セッション内で完結する場合
            currentTime -= remainingSeconds
            remainingSeconds = 0
            set({ timeRemaining: currentTime })
          }
        }
      },

      switchMode: (mode: TimerMode, shouldAutoStart = false) => {
        const duration = getModeDuration(mode)
        set({
          currentMode: mode,
          timeRemaining: duration,
          isRunning: shouldAutoStart,
        })
      },

      completeSession: () => {
        const { currentMode, completedSessionsInCycle } = get()

        if (currentMode === 'focus') {
          // Focus完了
          const newSessions = completedSessionsInCycle + 1

          if (newSessions % 4 === 0) {
            // 4セッション完了 → Long Break
            set({
              completedSessionsInCycle: newSessions,
              completedCycles: get().completedCycles + 1,
            })
            get().switchMode('longBreak')
          } else {
            // 1-3セッション完了 → Short Break
            set({ completedSessionsInCycle: newSessions })
            get().switchMode('shortBreak')
          }
        } else {
          // Break完了 → Focus
          if (currentMode === 'longBreak') {
            // Long Break後はセッションカウントをリセット
            set({ completedSessionsInCycle: 0 })
          }
          get().switchMode('focus')
        }
      },

      // Test Helpers
      setTimeRemaining: (time: number) => {
        set({ timeRemaining: time })
      },

      setCompletedSessions: (count: number) => {
        set({ completedSessionsInCycle: count })
      },
    }),
    {
      name: STORAGE_KEYS.TIMER_DATA,
    }
  )
)
