'use client'

interface CircularTimerProps {
  progress: number
  timeText: string
  isBreak: boolean
}

export function CircularTimer({ progress, timeText, isBreak }: CircularTimerProps) {
  const radius = 120
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      {/* SVG円形プログレスバー - 左回り（反時計回り） */}
      <svg height={radius * 2} width={radius * 2} className="transform rotate-90 scale-x-[-1]">
        {/* 背景の円 */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* プログレスバー */}
        <circle
          className={`transition-all duration-1000 ease-linear ${
            isBreak ? 'stroke-green-500' : 'stroke-blue-500'
          }`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* 時間表示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          {timeText}
        </span>
      </div>
    </div>
  )
}
