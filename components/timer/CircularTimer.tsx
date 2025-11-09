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
      {/* グローエフェクト用の背景レイヤー */}
      <div className="absolute inset-0 bg-white rounded-full shadow-2xl" />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(90deg) scaleX(-1)' }}
        className="relative z-10"
        role="timer"
        aria-label={`${timeText} remaining`}
      >
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? 'rgb(34 197 94 / 0.15)' : 'rgb(59 130 246 / 0.15)'}
          strokeWidth={strokeWidth}
          className="transition-colors duration-500"
        />

        {/* プログレスの円 - グラデーション */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isBreak ? 'url(#gradient-green)' : 'url(#gradient-blue)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 drop-shadow-lg"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />

        {/* グラデーション定義 */}
        <defs>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59 130 246)" />
            <stop offset="100%" stopColor="rgb(147 51 234)" />
          </linearGradient>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(34 197 94)" />
            <stop offset="100%" stopColor="rgb(16 185 129)" />
          </linearGradient>
        </defs>
      </svg>

      {/* 中央の時間表示 */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-7xl font-extrabold tracking-tight text-gray-800">{timeText}</span>
      </div>
    </div>
  )
}
