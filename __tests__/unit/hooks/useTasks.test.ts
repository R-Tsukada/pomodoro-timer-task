import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from '@/hooks/useTasks'
import { useTaskStore } from '@/stores/task-store'

describe('useTasks Hook', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageをクリア
    localStorage.clear()

    // ストアをリセット
    const { result } = renderHook(() => useTaskStore())
    act(() => {
      // 全タスクを削除
      result.current.tasks.forEach((task) => {
        result.current.deleteTask(task.id)
      })
    })
  })

  describe('Basic Properties', () => {
    it('should provide tasks from store', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toBeDefined()
      expect(Array.isArray(result.current.tasks)).toBe(true)
    })

    it('should provide selectedTask from store', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.selectedTask).toBeNull()
    })

    it('should provide selectedTaskId from store', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.selectedTaskId).toBeNull()
    })
  })

  describe('Actions', () => {
    it('should provide addTask action', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.addTask).toBeDefined()
      expect(typeof result.current.addTask).toBe('function')

      act(() => {
        result.current.addTask('Test task')
      })

      expect(result.current.tasks.length).toBeGreaterThan(0)
      expect(result.current.tasks[0].name).toBe('Test task')
    })

    it('should provide deleteTask action', () => {
      const { result } = renderHook(() => useTasks())

      // まずタスクを追加
      act(() => {
        result.current.addTask('Task to delete')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.deleteTask(taskId)
      })

      expect(result.current.tasks).toHaveLength(0)
    })

    it('should provide toggleTaskCompletion action', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task to toggle')
      })

      const taskId = result.current.tasks[0].id
      expect(result.current.tasks[0].isCompleted).toBe(false)

      act(() => {
        result.current.toggleTaskCompletion(taskId)
      })

      expect(result.current.tasks[0].isCompleted).toBe(true)
    })

    it('should provide selectTask action', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task to select')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.selectTask(taskId)
      })

      expect(result.current.selectedTaskId).toBe(taskId)
      expect(result.current.selectedTask?.id).toBe(taskId)
    })

    it('should provide incrementSessionCount action', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task with sessions')
      })

      const taskId = result.current.tasks[0].id
      expect(result.current.tasks[0].sessionsCompleted).toBe(0)

      act(() => {
        result.current.incrementSessionCount(taskId)
      })

      expect(result.current.tasks[0].sessionsCompleted).toBe(1)
    })
  })

  describe('Computed Properties', () => {
    it('should provide activeTasks (incomplete tasks)', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Active task 1')
        result.current.addTask('Active task 2')
        result.current.addTask('Completed task')
      })

      // 1つを完了にする
      const taskId = result.current.tasks[2].id
      act(() => {
        result.current.toggleTaskCompletion(taskId)
      })

      expect(result.current.activeTasks).toHaveLength(2)
      expect(result.current.activeTasks[0].name).toBe('Active task 1')
      expect(result.current.activeTasks[1].name).toBe('Active task 2')
    })

    it('should provide completedTasks', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
      })

      // 両方完了にする
      act(() => {
        result.current.toggleTaskCompletion(result.current.tasks[0].id)
        result.current.toggleTaskCompletion(result.current.tasks[1].id)
      })

      expect(result.current.completedTasks).toHaveLength(2)
    })

    it('should provide totalSessions (sum of all sessions)', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
      })

      // セッション数を増やす
      act(() => {
        result.current.incrementSessionCount(result.current.tasks[0].id)
        result.current.incrementSessionCount(result.current.tasks[0].id)
        result.current.incrementSessionCount(result.current.tasks[1].id)
      })

      expect(result.current.totalSessions).toBe(3)
    })

    it('should provide hasSelectedTask (boolean)', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.hasSelectedTask).toBe(false)

      act(() => {
        result.current.addTask('Task to select')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.selectTask(taskId)
      })

      expect(result.current.hasSelectedTask).toBe(true)
    })

    it('should provide taskCount (total number of tasks)', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.taskCount).toBe(0)

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
        result.current.addTask('Task 3')
      })

      expect(result.current.taskCount).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty tasks list', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toHaveLength(0)
      expect(result.current.activeTasks).toHaveLength(0)
      expect(result.current.completedTasks).toHaveLength(0)
      expect(result.current.totalSessions).toBe(0)
      expect(result.current.taskCount).toBe(0)
    })

    it('should handle selecting non-existent task', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.selectTask('non-existent-id')
      })

      expect(result.current.selectedTask).toBeNull()
      expect(result.current.hasSelectedTask).toBe(false)
    })
  })
})
