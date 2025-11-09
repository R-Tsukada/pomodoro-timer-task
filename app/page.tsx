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
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-end">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              isBreak ? 'bg-green-500/15 text-green-600' : 'bg-blue-500/15 text-blue-600'
            }`}
          >
            {currentMode === 'focus'
              ? 'Focus'
              : currentMode === 'shortBreak'
                ? 'Short Break'
                : 'Long Break'}
          </span>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 space-y-6">
          {/* 円形タイマー */}
          <CircularTimer progress={progress} timeText={timeText} isBreak={isBreak} />

          {/* セッション情報 */}
          <SessionIndicator
            completedSessions={completedSessionsInCycle}
            completedCycles={completedCycles}
          />

          {/* コントロールボタン */}
          <TimerControls
            isRunning={isRunning}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
          />
        </div>
      </div>
    </main>
  )
}
