import { useMemo } from 'react'
import { useTaskStore, selectSelectedTask } from '@/stores/task-store'

/**
 * タスク管理のための便利なフック
 * Task storeの操作をラップし、計算プロパティを提供する
 */
export function useTasks() {
  // Store state
  const tasks = useTaskStore((state) => state.tasks)
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId)

  // Store actions
  const addTask = useTaskStore((state) => state.addTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion)
  const selectTask = useTaskStore((state) => state.selectTask)
  const incrementSessionCount = useTaskStore((state) => state.incrementSessionCount)

  // Computed: 選択中のタスク
  const selectedTask = useTaskStore(selectSelectedTask)

  // Computed: アクティブなタスク（未完了）
  const activeTasks = useMemo(() => {
    return tasks.filter((task) => !task.isCompleted)
  }, [tasks])

  // Computed: 完了したタスク
  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.isCompleted)
  }, [tasks])

  // Computed: 総セッション数
  const totalSessions = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.sessionsCompleted, 0)
  }, [tasks])

  // Computed: タスクが選択されているか
  const hasSelectedTask = useMemo(() => {
    return selectedTask !== null
  }, [selectedTask])

  // Computed: タスク総数
  const taskCount = useMemo(() => {
    return tasks.length
  }, [tasks])

  return {
    // State
    tasks,
    selectedTask,
    selectedTaskId,

    // Actions
    addTask,
    deleteTask,
    toggleTaskCompletion,
    selectTask,
    incrementSessionCount,

    // Computed properties
    activeTasks,
    completedTasks,
    totalSessions,
    hasSelectedTask,
    taskCount,
  }
}
