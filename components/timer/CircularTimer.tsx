interface CircularTimerProps {
  /** 進捗率（0-100） */
  progress: number
  /** 表示する時間テキスト（MM:SS形式） */
  timeText: string
  /** Breakモードかどうか */
  isBreak: boolean
}

export function CircularTimer({ progress, timeText, isBreak }: CircularTimerProps) {
  // サイズと線の太さ（iOSアプリと同じ）
  const size = 280
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // プログレスに応じたstroke-dashoffsetを計算
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        role="timer"
        aria-label={`${timeText} remaining`}
      >
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? 'rgb(34 197 94 / 0.1)' : 'rgb(59 130 246 / 0.1)'}
          strokeWidth={strokeWidth}
          className="transition-colors duration-500"
        />

        {/* プログレスの円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? 'rgb(34 197 94)' : 'rgb(59 130 246)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>

      {/* 中央の時間表示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {timeText}
        </span>
      </div>
    </div>
  )
}
