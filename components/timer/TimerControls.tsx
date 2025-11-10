'use client'

import React from 'react'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function TimerControls({ isRunning, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4 w-full max-w-sm">
      {/* Start/Pause ボタン */}
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className={`flex-1 px-6 py-3 rounded-xl font-medium text-white transition-colors duration-200 ${
          isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>

      {/* Reset/Stop ボタン */}
      <button
        type="button"
        onClick={onReset}
        className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
      >
        {isRunning ? 'Stop' : 'Reset'}
      </button>
    </div>
  )
}
