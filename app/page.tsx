'use client'

import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { useTasks } from '@/hooks/useTasks'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SessionIndicator } from '@/components/timer/SessionIndicator'
import TaskList from '@/components/task/TaskList'
import { formatTime, calculateProgress, getModeDuration } from '@/lib/timer-utils'

export default function HomePage() {
  const {
    currentMode,
    timeRemaining,
    isRunning,
    completedSessionsInCycle,
    completedCycles,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
  } = useTimerStore()

  const { selectedTask, incrementSessionCount } = useTasks()
  const prevTimeRef = useRef(timeRemaining)
  const prevModeRef = useRef(currentMode)

  // タイマーのtick処理（1秒ごと）
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  // Focusセッション完了時に選択中のタスクのセッション数をインクリメント
  useEffect(() => {
    // 前回がfocusモードで、時間が1→0になった場合
    if (
      prevModeRef.current === 'focus' &&
      prevTimeRef.current === 1 &&
      timeRemaining === 0 &&
      selectedTask
    ) {
      incrementSessionCount(selectedTask.id)
    }

    // 現在の値を保存
    prevTimeRef.current = timeRemaining
    prevModeRef.current = currentMode
  }, [timeRemaining, currentMode, selectedTask, incrementSessionCount])

  // プログレスバーの計算
  const totalTime = getModeDuration(currentMode)
  const progress = calculateProgress(timeRemaining, totalTime)
  const timeText = formatTime(timeRemaining)
  const isBreak = currentMode === 'shortBreak' || currentMode === 'longBreak'

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pomodoro Timer
        </h1>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            isBreak
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
          }`}
        >
          {currentMode === 'focus'
            ? 'Focus Time'
            : currentMode === 'shortBreak'
              ? 'Short Break'
              : 'Long Break'}
        </span>
      </div>

      {/* メインコンテンツ：2カラムレイアウト */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* 左側：タイマーエリア */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 space-y-10">
            {/* 選択中のタスク表示 */}
            {selectedTask ? (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Working on</p>
                <h2 className="text-2xl font-bold text-gray-800">{selectedTask.name}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{selectedTask.sessionsCompleted} sessions completed</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400 font-medium">No task selected</p>
                <p className="text-xs text-gray-400">Select a task from the list to start</p>
              </div>
            )}

            {/* 円形タイマー */}
            <div className="relative">
              <CircularTimer progress={progress} timeText={timeText} isBreak={isBreak} />
            </div>

            {/* セッション進捗インジケーター */}
            <SessionIndicator
              completedSessions={completedSessionsInCycle}
              completedCycles={completedCycles}
            />

            {/* コントロールボタン */}
            <div className="w-full flex justify-center mt-4">
              <TimerControls
                isRunning={isRunning}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
              />
            </div>
          </div>

          {/* フッター */}
          <div className="bg-white/60 backdrop-blur-sm px-6 py-3 text-center lg:hidden">
            <p className="text-xs text-gray-500">Stay focused • Take breaks • Be productive</p>
          </div>
        </div>

        {/* 右側：タスクリストサイドバー */}
        <div className="w-full lg:w-96 bg-white/90 backdrop-blur-sm shadow-lg border-l border-gray-200 flex flex-col">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <TaskList />
          </div>
          {/* デスクトップ用フッター */}
          <div className="hidden lg:block bg-white/60 backdrop-blur-sm px-6 py-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">Stay focused • Take breaks • Be productive</p>
          </div>
        </div>
      </div>
    </main>
  )
}
