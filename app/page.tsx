'use client'

import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SessionIndicator } from '@/components/timer/SessionIndicator'
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

  // タイマーのtick処理（1秒ごと）
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  // プログレスバーの計算
  const totalTime = getModeDuration(currentMode)
  const progress = calculateProgress(timeRemaining, totalTime)
  const timeText = formatTime(timeRemaining)
  const isBreak = currentMode === 'shortBreak' || currentMode === 'longBreak'

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
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

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 space-y-10">
          {/* 円形タイマー */}
          <div className="relative">
            <CircularTimer progress={progress} timeText={timeText} isBreak={isBreak} />
          </div>

          {/* セッション進捗インジケーター（タイマーのすぐ下に配置） */}
          <SessionIndicator
            completedSessions={completedSessionsInCycle}
            completedCycles={completedCycles}
          />

          {/* コントロールボタン（より大きく、見やすく） */}
          <div className="w-full flex justify-center mt-4">
            <TimerControls
              isRunning={isRunning}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
            />
          </div>
        </div>

        {/* フッター（オプション） */}
        <div className="bg-white/60 backdrop-blur-sm px-6 py-3 text-center">
          <p className="text-xs text-gray-500">Stay focused • Take breaks • Be productive</p>
        </div>
      </div>
    </main>
  )
}
