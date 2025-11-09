interface SessionIndicatorProps {
  /** 現在のサイクルで完了したセッション数（0-4） */
  completedSessions: number
  /** 完了したサイクル数 */
  completedCycles: number
}

export function SessionIndicator({ completedSessions, completedCycles }: SessionIndicatorProps) {
  // セッションドットのスタイルを決定（モダンデザイン）
  const getDotStyle = (index: number) => {
    if (index < completedSessions) {
      // 完了したセッション - グラデーション付き
      if (completedSessions === 4) {
        // 4セッション完了時はゴールドグラデーション
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50 border-orange-500'
      } else {
        // 1-3セッション完了時は青紫グラデーション
        return 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 border-blue-500'
      }
    }
    // 未完了セッション - グレー、影なし
    return 'bg-gray-200 border-gray-300'
  }

  return (
    <div
      className="text-center"
      role="status"
      aria-label={`${completedSessions} of 4 sessions completed${
        completedCycles > 0 ? `, ${completedCycles} cycles completed` : ''
      }`}
    >
      <p className="text-sm text-gray-500 mb-3 font-medium">Session Progress</p>
      <div className="flex items-center justify-center gap-4">
        {/* ドット表示 - モダンスタイル */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              data-testid="session-dot"
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${getDotStyle(i)}`}
            />
          ))}
        </div>

        {/* セッション数 */}
        <span className="text-xl font-bold text-gray-700 min-w-[3rem]">{completedSessions}/4</span>

        {/* サイクル数（1以上のときのみ表示） */}
        {completedCycles > 0 && (
          <span className="text-sm text-gray-400 font-medium">Cycle {completedCycles}</span>
        )}
      </div>
    </div>
  )
}
