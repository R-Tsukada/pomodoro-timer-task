'use client'

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TaskFormProps {
  onAddTask: (name: string) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskName, setTaskName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTask()
  }

  const addTask = () => {
    const trimmedName = taskName.trim()

    if (trimmedName === '') {
      return
    }

    onAddTask(trimmedName)
    setTaskName('')

    // フォーカスを維持
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTask()
    }
  }

  const isButtonDisabled = taskName.trim() === ''

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        {/* 入力フィールド */}
        <input
          ref={inputRef}
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          aria-label="New task name"
          className={cn(
            'flex-1 px-4 py-2.5 text-sm',
            'border border-gray-300 rounded-lg',
            'bg-white text-gray-900 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all'
          )}
        />

        {/* 追加ボタン */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          aria-label="Add task"
          className={cn(
            'px-5 py-2.5 rounded-lg font-medium text-sm',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isButtonDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          )}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add</span>
          </div>
        </button>
      </div>
    </form>
  )
}
