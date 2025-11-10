import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskStore, selectSelectedTask } from '@/stores/task-store'
import { DEFAULT_TASKS } from '@/lib/constants'

describe('Task Store', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageをクリア
    localStorage.clear()
  })

  afterEach(() => {
    // テスト後もLocalStorageをクリア
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have default tasks on first load when localStorage is empty', () => {
      localStorage.clear()
      const { result } = renderHook(() => useTaskStore())

      // デフォルトタスクが含まれているか確認
      const taskNames = result.current.tasks.map((t) => t.name)
      DEFAULT_TASKS.forEach((name) => {
        expect(taskNames).toContain(name)
      })
    })

    it('should have no selected task initially', () => {
      const { result } = renderHook(() => useTaskStore())

      expect(result.current.selectedTaskId).toBeNull()
      expect(selectSelectedTask(result.current)).toBeNull()
    })

    it('should have all tasks incomplete initially', () => {
      const { result } = renderHook(() => useTaskStore())

      result.current.tasks.forEach((task) => {
        expect(task.isCompleted).toBe(false)
        expect(task.sessionsCompleted).toBe(0)
      })
    })
  })

  describe('addTask', () => {
    it('should add a new task', () => {
      const { result } = renderHook(() => useTaskStore())
      const initialLength = result.current.tasks.length

      act(() => {
        result.current.addTask('New task')
      })

      expect(result.current.tasks).toHaveLength(initialLength + 1)
      const newTask = result.current.tasks[result.current.tasks.length - 1]
      expect(newTask.name).toBe('New task')
      expect(newTask.isCompleted).toBe(false)
      expect(newTask.sessionsCompleted).toBe(0)
    })

    it('should generate unique ID for each task', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
      })

      const ids = result.current.tasks.map((task) => task.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should set createdAt and updatedAt timestamps', () => {
      const { result } = renderHook(() => useTaskStore())
      const beforeTime = Date.now()

      act(() => {
        result.current.addTask('Timestamped task')
      })

      const afterTime = Date.now()
      const newTask = result.current.tasks[result.current.tasks.length - 1]

      expect(newTask.createdAt).toBeDefined()
      expect(newTask.updatedAt).toBeDefined()

      const createdTime = new Date(newTask.createdAt).getTime()
      expect(createdTime).toBeGreaterThanOrEqual(beforeTime)
      expect(createdTime).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task by ID', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id
      const initialLength = result.current.tasks.length

      act(() => {
        result.current.deleteTask(taskId)
      })

      expect(result.current.tasks).toHaveLength(initialLength - 1)
      expect(result.current.tasks.find((t) => t.id === taskId)).toBeUndefined()
    })

    it('should clear selectedTaskId if deleted task was selected', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.selectTask(taskId)
        result.current.deleteTask(taskId)
      })

      expect(result.current.selectedTaskId).toBeNull()
    })

    it('should not change selectedTaskId if deleted task was not selected', () => {
      const { result } = renderHook(() => useTaskStore())
      const selectedId = result.current.tasks[0].id
      const deletedId = result.current.tasks[1].id

      act(() => {
        result.current.selectTask(selectedId)
        result.current.deleteTask(deletedId)
      })

      expect(result.current.selectedTaskId).toBe(selectedId)
    })
  })

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion status', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.toggleTaskCompletion(taskId)
      })

      expect(result.current.tasks[0].isCompleted).toBe(true)

      act(() => {
        result.current.toggleTaskCompletion(taskId)
      })

      expect(result.current.tasks[0].isCompleted).toBe(false)
    })

    it('should update updatedAt timestamp', async () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id
      const originalUpdatedAt = result.current.tasks[0].updatedAt

      // 1ms待つ
      await new Promise((resolve) => setTimeout(resolve, 2))

      act(() => {
        result.current.toggleTaskCompletion(taskId)
      })

      const updatedTask = result.current.tasks.find((t) => t.id === taskId)
      expect(updatedTask?.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  describe('selectTask', () => {
    it('should select a task by ID', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.selectTask(taskId)
      })

      expect(result.current.selectedTaskId).toBe(taskId)
    })

    it('should update selectedTask selector', () => {
      const { result } = renderHook(() => useTaskStore())
      const task = result.current.tasks[0]

      act(() => {
        result.current.selectTask(task.id)
      })

      expect(selectSelectedTask(result.current)).toEqual(task)
    })

    it('should allow deselecting by passing null', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.selectTask(taskId)
        result.current.selectTask(null)
      })

      expect(result.current.selectedTaskId).toBeNull()
      expect(selectSelectedTask(result.current)).toBeNull()
    })
  })

  describe('incrementSessionCount', () => {
    it('should increment session count by 1', () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.incrementSessionCount(taskId)
      })

      expect(result.current.tasks[0].sessionsCompleted).toBe(1)

      act(() => {
        result.current.incrementSessionCount(taskId)
      })

      expect(result.current.tasks[0].sessionsCompleted).toBe(2)
    })

    it('should update updatedAt timestamp', async () => {
      const { result } = renderHook(() => useTaskStore())
      const taskId = result.current.tasks[0].id
      const originalUpdatedAt = result.current.tasks[0].updatedAt

      // 1ms待つ
      await new Promise((resolve) => setTimeout(resolve, 2))

      act(() => {
        result.current.incrementSessionCount(taskId)
      })

      const updatedTask = result.current.tasks.find((t) => t.id === taskId)
      expect(updatedTask?.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  describe('selectedTask selector', () => {
    it('should return null when no task is selected', () => {
      const { result } = renderHook(() => useTaskStore())

      expect(selectSelectedTask(result.current)).toBeNull()
    })

    it('should return the selected task object', () => {
      const { result } = renderHook(() => useTaskStore())
      const task = result.current.tasks[0]

      act(() => {
        result.current.selectTask(task.id)
      })

      expect(selectSelectedTask(result.current)).toEqual(task)
    })

    it('should return null if selected task ID does not exist', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.selectTask('non-existent-id')
      })

      expect(selectSelectedTask(result.current)).toBeNull()
    })
  })

  describe('LocalStorage Persistence', () => {
    // NOTE: Zustand persistのテストは統合テストで実施
    // Vitestのjsdom環境では非同期の永続化が正しく動作しないため
    it.skip('should persist tasks to localStorage', async () => {
      const { result } = renderHook(() => useTaskStore())

      await act(async () => {
        result.current.addTask('Persisted task')
        // Zustandのpersist middlewareは少し遅延があるので待つ
        await new Promise((resolve) => setTimeout(resolve, 100))
      })

      const saved = localStorage.getItem('pomodoro_task_data')
      expect(saved).not.toBeNull()

      if (saved) {
        const data = JSON.parse(saved)
        expect(data.state.tasks).toBeDefined()
        const taskNames = data.state.tasks.map((t: any) => t.name)
        expect(taskNames).toContain('Persisted task')
      }
    })

    it.skip('should restore tasks from localStorage', () => {
      // LocalStorageに事前にデータを設定
      const testTask = {
        id: 'task-1',
        name: 'Restored task',
        isCompleted: true,
        sessionsCompleted: 5,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T01:00:00.000Z',
      }

      localStorage.setItem(
        'pomodoro_task_data',
        JSON.stringify({
          state: {
            tasks: [testTask],
            selectedTaskId: 'task-1',
          },
          version: 0,
        })
      )

      // 新しいフックインスタンスを作成（LocalStorageから復元される）
      const { result } = renderHook(() => useTaskStore())

      // データが復元されてることを確認
      const restoredTask = result.current.tasks.find((t) => t.id === 'task-1')
      expect(restoredTask).toBeDefined()
      expect(restoredTask?.name).toBe('Restored task')
      expect(restoredTask?.isCompleted).toBe(true)
      expect(restoredTask?.sessionsCompleted).toBe(5)
      expect(result.current.selectedTaskId).toBe('task-1')
    })
  })
})
