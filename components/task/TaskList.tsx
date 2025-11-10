'use client'

import { useTasks } from '@/hooks/useTasks'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'

export default function TaskList() {
  const {
    tasks,
    activeTasks,
    completedTasks,
    selectedTaskId,
    taskCount,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    selectTask,
  } = useTasks()

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* タスク追加フォーム */}
      <TaskForm onAddTask={addTask} />

      {/* タスク数表示 */}
      {taskCount > 0 && (
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-medium text-gray-600">
            {taskCount === 1 ? '1 task' : `${taskCount} tasks`}
          </h2>
        </div>
      )}

      {/* 空状態 */}
      {taskCount === 0 && (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-sm text-gray-500">Add your first task above to get started</p>
        </div>
      )}

      {/* アクティブなタスクリスト */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              onToggleComplete={toggleTaskCompletion}
              onSelect={selectTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* 完了したタスクリスト */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 mt-8">
          <div className="flex items-center gap-2 px-2">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={selectedTaskId === task.id}
                onToggleComplete={toggleTaskCompletion}
                onSelect={selectTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
