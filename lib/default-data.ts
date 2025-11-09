import { PomodoroTask } from '@/types/task'
import { PersistedData } from '@/types/app'
import { DEFAULT_TASKS, CURRENT_DATA_VERSION, TIMER_DURATIONS } from '@/lib/constants'

/**
 * デフォルトタスクを生成する
 * @returns デフォルトタスクの配列
 */
export function createDefaultTasks(): PomodoroTask[] {
  const now = new Date().toISOString()

  return DEFAULT_TASKS.map((taskName) => ({
    id: crypto.randomUUID(),
    name: taskName,
    isCompleted: false,
    sessionsCompleted: 0,
    createdAt: now,
    updatedAt: now,
  }))
}

/**
 * アプリケーションのデフォルトデータを生成する
 * @returns デフォルトの永続化データ
 */
export function getDefaultData(): PersistedData {
  const tasks = createDefaultTasks()
  const now = new Date().toISOString()

  return {
    version: CURRENT_DATA_VERSION,
    timer: {
      currentMode: 'focus',
      timeRemaining: TIMER_DURATIONS.focus,
      isRunning: false,
      completedSessionsInCycle: 0,
      completedCycles: 0,
    },
    tasks,
    selectedTaskId: tasks[0]?.id || null,
    settings: {
      duration: {
        focus: TIMER_DURATIONS.focus,
        shortBreak: TIMER_DURATIONS.shortBreak,
        longBreak: TIMER_DURATIONS.longBreak,
      },
      autoStart: true,
      soundEnabled: true,
      notificationEnabled: true,
    },
    savedAt: now,
  }
}
