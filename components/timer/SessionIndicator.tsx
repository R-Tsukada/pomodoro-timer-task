interface SessionIndicatorProps {
  /** 現在のサイクルで完了したセッション数（0-4） */
  completedSessions: number
  /** 完了したサイクル数 */
  completedCycles: number
}

export function SessionIndicator({ completedSessions, completedCycles }: SessionIndicatorProps) {
  // セッションドットのスタイルを決定
  const getDotStyle = (index: number) => {
    if (index < completedSessions) {
      // 完了したセッション
      if (completedSessions === 4) {
        // 4セッション完了時は金色（オレンジ）
        return 'bg-orange-500 border-orange-500'
      } else {
        // 1-3セッション完了時は青
        return 'bg-blue-500 border-blue-500'
      }
    }
    // 未完了セッション
    return 'border-gray-300'
  }

  return (
    <div
      className="text-center mb-6"
      role="status"
      aria-label={`${completedSessions} of 4 sessions completed${
        completedCycles > 0 ? `, ${completedCycles} cycles completed` : ''
      }`}
    >
      <p className="text-sm text-gray-600 mb-2">セッション進捗</p>
      <div className="flex items-center justify-center gap-3">
        {/* ドット表示 */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              data-testid="session-dot"
              className={`w-3 h-3 rounded-full border-2 transition-all ${getDotStyle(i)}`}
            />
          ))}
        </div>

        {/* セッション数 */}
        <span className="text-lg font-semibold text-gray-700">{completedSessions}/4</span>

        {/* サイクル数（1以上のときのみ表示） */}
        {completedCycles > 0 && (
          <span className="text-sm text-gray-500">(Cycle: {completedCycles})</span>
        )}
      </div>
    </div>
  )
}
