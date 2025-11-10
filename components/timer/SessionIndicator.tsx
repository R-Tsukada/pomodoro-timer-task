'use client'

interface SessionIndicatorProps {
  completedSessions: number
  completedCycles: number
}

export function SessionIndicator({ completedSessions, completedCycles }: SessionIndicatorProps) {
  const totalSessions = 4 // ポモドーロサイクルは通常4セッション

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ドットインジケーター */}
      <div className="flex items-center gap-3">
        {Array.from({ length: totalSessions }).map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index < completedSessions
                ? 'w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 scale-110'
                : 'w-2.5 h-2.5 rounded-full bg-gray-300'
            }`}
            aria-label={`Session ${index + 1} ${index < completedSessions ? 'completed' : 'pending'}`}
          />
        ))}
      </div>

      {/* テキスト情報 */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">
          Session {completedSessions} of {totalSessions}
        </p>
        {completedCycles > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {completedCycles} cycle{completedCycles !== 1 ? 's' : ''} completed
          </p>
        )}
      </div>
    </div>
  )
}
