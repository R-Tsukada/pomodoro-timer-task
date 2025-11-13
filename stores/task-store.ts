import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PomodoroTask } from '@/types/task'
import { TaskTimerState } from '@/types/timer'
import { STORAGE_KEYS, DEFAULT_TASKS } from '@/lib/constants'
import { v4 as uuidv4 } from 'uuid'

interface TaskStore {
  // State
  tasks: PomodoroTask[]
  selectedTaskId: string | null

  // Actions
  addTask: (name: string) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  selectTask: (id: string | null) => void
  incrementSessionCount: (id: string) => void
  saveTimerState: (taskId: string, state: TaskTimerState) => void
  getTimerState: (taskId: string) => TaskTimerState
}

// Selector (outside of store)
export const selectSelectedTask = (state: TaskStore): PomodoroTask | null => {
  if (!state.selectedTaskId) return null
  return state.tasks.find((task) => task.id === state.selectedTaskId) ?? null
}

/**
 * デフォルトタスクを生成
 */
const createDefaultTasks = (): PomodoroTask[] => {
  const now = new Date().toISOString()

  return DEFAULT_TASKS.map((name) => ({
    id: uuidv4(),
    name,
    isCompleted: false,
    sessionsCompleted: 0,
    createdAt: now,
    updatedAt: now,
  }))
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: createDefaultTasks(),
      selectedTaskId: null,

      // Actions
      addTask: (name: string) => {
        const now = new Date().toISOString()
        const newTask: PomodoroTask = {
          id: uuidv4(),
          name,
          isCompleted: false,
          sessionsCompleted: 0,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          // 削除されたタスクが選択中だった場合、選択を解除
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }))
      },

      toggleTaskCompletion: (id: string) => {
        const now = new Date().toISOString()

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isCompleted: !task.isCompleted,
                  updatedAt: now,
                }
              : task
          ),
        }))
      },

      selectTask: (id: string | null) => {
        set({ selectedTaskId: id })
      },

      incrementSessionCount: (id: string) => {
        const now = new Date().toISOString()

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  sessionsCompleted: task.sessionsCompleted + 1,
                  updatedAt: now,
                }
              : task
          ),
        }))
      },

      saveTimerState: (taskId: string, state: TaskTimerState) => {
        const now = new Date().toISOString()

        set((currentState) => ({
          tasks: currentState.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  timerState: state,
                  updatedAt: now,
                }
              : task
          ),
        }))
      },

      getTimerState: (taskId: string): TaskTimerState => {
        const task = get().tasks.find((t) => t.id === taskId)

        // タスクに保存された状態がある場合はそれを返す
        if (task?.timerState) {
          return task.timerState
        }

        // デフォルト状態を返す
        return {
          currentMode: 'focus',
          timeRemaining: 1500, // 25分
          completedSessionsInCycle: 0,
        }
      },
    }),
    {
      name: STORAGE_KEYS.TASK_DATA,
    }
  )
)
