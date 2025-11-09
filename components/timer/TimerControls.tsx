interface TimerControlsProps {
  /** タイマーが実行中かどうか */
  isRunning: boolean
  /** 開始ボタンクリック時のコールバック */
  onStart: () => void
  /** 一時停止ボタンクリック時のコールバック */
  onPause: () => void
  /** リセットボタンクリック時のコールバック */
  onReset: () => void
  /** ボタンを無効化するかどうか（タスク未選択時など） */
  disabled?: boolean
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  disabled = false,
}: TimerControlsProps) {
  // ボタンの色（現在のモードに応じて変更したい場合は、propsで受け取る）
  const primaryColor = 'bg-blue-500'

  return (
    <div className="flex justify-center gap-4 pt-3">
      {/* Start/Pauseボタン（円形） */}
      <button
        onClick={isRunning ? onPause : onStart}
        disabled={disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${primaryColor} shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="6" y="4" width="4" height="16" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Resetボタン（円形、アウトライン） */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 bg-white text-gray-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reset"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      </button>
    </div>
  )
}
