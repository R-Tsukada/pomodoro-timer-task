'use client'

import type { PomodoroTask } from '@/types/task'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: PomodoroTask
  isSelected: boolean
  onToggleComplete: (id: string) => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({
  task,
  isSelected,
  onToggleComplete,
  onSelect,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-lg border bg-white p-3 transition-all',
        'hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        task.isCompleted && 'opacity-60'
      )}
    >
      {/* チェックボックス */}
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => {
            e.stopPropagation()
            onToggleComplete(task.id)
          }}
          aria-label={`Mark "${task.name}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          className={cn(
            'h-5 w-5 rounded border-2 cursor-pointer transition-colors',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            task.isCompleted
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-300 hover:border-blue-400'
          )}
        />
      </div>

      {/* タスク内容 */}
      <div className="flex-1 cursor-pointer min-w-0" onClick={() => onSelect(task.id)}>
        <h3
          className={cn(
            'text-sm font-medium text-gray-900 truncate',
            task.isCompleted && 'line-through text-gray-500'
          )}
        >
          {task.name}
        </h3>
      </div>

      {/* セッション数 */}
      <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium">{task.sessionsCompleted}</span>
      </div>

      {/* 削除ボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        aria-label={`Delete task "${task.name}"`}
        className={cn(
          'flex-shrink-0 p-1 rounded text-gray-400 hover:text-red-600',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'focus:opacity-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
        )}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
