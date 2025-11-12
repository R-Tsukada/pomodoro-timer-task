'use client'

import { useEffect, useRef, useState } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { useTasks } from '@/hooks/useTasks'
import { useNotification } from '@/hooks/useNotification'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SessionIndicator } from '@/components/timer/SessionIndicator'
import TaskList from '@/components/task/TaskList'
import Toast from '@/components/ui/Toast'
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
  const {
    permission,
    requestPermission,
    notifyFocusComplete,
    notifyBreakComplete,
    notifyLongBreakComplete,
  } = useNotification()

  const prevCompletedSessionsRef = useRef(completedSessionsInCycle)
  const prevSelectedTaskIdRef = useRef(selectedTask?.id)
  const prevModeRef = useRef(currentMode)
  const sessionTaskIdRef = useRef<string | null>(null) // セッション開始時のタスクIDを記録
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{
    title: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
  } | null>(null)

  // タイマーのtick処理（1秒ごと）
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  // Focusセッション完了時に、セッション開始時のタスクのセッション数をインクリメント
  useEffect(() => {
    // completedSessionsInCycleが増加した場合、focusセッションが完了したと判断
    if (completedSessionsInCycle > prevCompletedSessionsRef.current) {
      const taskIdToIncrement = sessionTaskIdRef.current
      if (taskIdToIncrement) {
        incrementSessionCount(taskIdToIncrement)
        sessionTaskIdRef.current = null // セッション完了後にリセット
      }
    }

    // 現在の値を保存
    prevCompletedSessionsRef.current = completedSessionsInCycle
  }, [completedSessionsInCycle, incrementSessionCount])

  // タスク切り替え時にタイマーをリセット
  useEffect(() => {
    const currentTaskId = selectedTask?.id
    const prevTaskId = prevSelectedTaskIdRef.current

    // タスクが切り替わった場合（nullから選択、または別のタスクに変更）
    if (currentTaskId !== prevTaskId) {
      if (isRunning) {
        // タイマー実行中の場合、強制的に停止してリセット
        pauseTimer()
        resetTimer()
        sessionTaskIdRef.current = null // セッションタスクIDもリセット
      } else {
        // タイマー停止中の場合もリセット
        resetTimer()
      }
    }

    // 現在のタスクIDを保存
    prevSelectedTaskIdRef.current = currentTaskId
  }, [selectedTask?.id, isRunning, pauseTimer, resetTimer])

  // セッション完了時の通知
  useEffect(() => {
    const prevMode = prevModeRef.current

    // モードが変わった時に通知を表示
    if (prevMode !== currentMode) {
      // Focus → Break の遷移: Focus完了通知
      if (prevMode === 'focus' && (currentMode === 'shortBreak' || currentMode === 'longBreak')) {
        notifyFocusComplete()
        setToast({
          title: '集中時間終了！',
          message: 'お疲れさまでした！休憩を取りましょう。',
          type: 'success',
        })
      }
      // Short Break → Focus の遷移: Break完了通知
      else if (prevMode === 'shortBreak' && currentMode === 'focus') {
        notifyBreakComplete()
        setToast({
          title: '休憩時間終了！',
          message: 'リフレッシュできましたか？次の集中タイムを始めましょう。',
          type: 'info',
        })
      }
      // Long Break → Focus の遷移: Long Break完了通知
      else if (prevMode === 'longBreak' && currentMode === 'focus') {
        notifyLongBreakComplete()
        setToast({
          title: '長い休憩終了！',
          message: 'しっかり休めましたか？新しいサイクルを始めましょう。',
          type: 'info',
        })
      }
    }

    // 現在のモードを保存
    prevModeRef.current = currentMode
  }, [currentMode, notifyFocusComplete, notifyBreakComplete, notifyLongBreakComplete])

  // 初回訪問時に通知権限をリクエスト
  useEffect(() => {
    if (permission === 'default') {
      // 少し遅延させて、ユーザー体験を向上
      const timer = setTimeout(() => {
        requestPermission()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [permission, requestPermission])

  // タイマー開始時のハンドラ（セッション開始タスクを記録）
  const handleStartTimer = () => {
    // セッション開始時に現在選択されているタスクのIDを記録
    if (selectedTask) {
      sessionTaskIdRef.current = selectedTask.id
    }
    startTimer()
  }

  // プログレスバーの計算
  const totalTime = getModeDuration(currentMode)
  const progress = calculateProgress(timeRemaining, totalTime)
  const timeText = formatTime(timeRemaining)
  const isBreak = currentMode === 'shortBreak' || currentMode === 'longBreak'

  return (
    <>
      {/* トースト通知 */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* ヘッダー */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* サイドバートグルボタン */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pomodoro Timer
            </h1>
          </div>

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
        <div className="relative lg:flex lg:flex-row min-h-[calc(100vh-73px)]">
          {/* モバイル用背景オーバーレイ */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* 左側：タスクリストサイドバー */}
          <div
            className={`fixed lg:relative inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg flex flex-col transition-all duration-300 overflow-hidden ${
              isSidebarOpen
                ? 'translate-x-0 w-80 lg:w-96 border-r border-gray-200'
                : '-translate-x-full w-80 lg:translate-x-0 lg:w-0 lg:border-r-0'
            }`}
          >
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
                {/* モバイル用閉じるボタン */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close sidebar"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TaskList />
            </div>
            {/* デスクトップ用フッター */}
            <div className="hidden lg:block bg-white/60 backdrop-blur-sm px-6 py-3 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500">Stay focused • Take breaks • Be productive</p>
            </div>
          </div>

          {/* 右側：タイマーエリア */}
          <div className="flex-1 flex flex-col min-h-[calc(100vh-73px)]">
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
                  onStart={handleStartTimer}
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
        </div>
      </main>
    </>
  )
}
