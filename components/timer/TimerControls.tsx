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
  return (
    <div className="flex justify-center gap-6 pt-8">
      {/* Start/Pauseボタン - 塗りつぶしスタイル */}
      <button
        onClick={isRunning ? onPause : onStart}
        disabled={disabled}
        className="w-40 py-4 px-8 rounded-xl text-white text-lg font-semibold bg-indigo-500 transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>

      {/* Resetボタン - アウトラインスタイル */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="w-40 py-4 px-8 rounded-xl text-indigo-400 text-lg font-semibold bg-slate-700/50 transition-all duration-200 hover:bg-slate-700/70 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reset"
      >
        Reset
      </button>
    </div>
  )
}
