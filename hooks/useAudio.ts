import { useState, useCallback } from 'react'

/**
 * useAudio - 音声再生を管理するカスタムフック
 *
 * タイマー完了音やクリック音などの効果音を再生するための機能を提供します。
 * 音量調整、ミュート機能も含まれています。
 */
export const useAudio = () => {
  const [volume, setVolumeState] = useState(0.5) // デフォルト音量50%
  const [isMuted, setIsMuted] = useState(false)

  /**
   * 音声ファイルを再生する共通関数
   * @param audioPath - 再生する音声ファイルのパス
   */
  const playSound = useCallback(
    async (audioPath: string) => {
      // ミュート時は再生しない
      if (isMuted) {
        return
      }

      try {
        // 新しいAudioインスタンスを作成（複数音同時再生を可能にする）
        const audio = new Audio(audioPath)
        audio.volume = volume

        // 再生を試みる
        await audio.play()

        // 再生終了後にメモリ解放（オプション）
        audio.addEventListener('ended', () => {
          audio.remove?.()
        })
      } catch (error) {
        // エラーが発生してもアプリをクラッシュさせない
        console.warn('Failed to play audio:', error)
      }
    },
    [volume, isMuted]
  )

  /**
   * タイマー完了時の音を再生
   */
  const playTimerComplete = useCallback(async () => {
    await playSound('/sounds/complete.mp3')
  }, [playSound])

  /**
   * ボタンクリック音を再生（オプション）
   */
  const playClick = useCallback(async () => {
    await playSound('/sounds/click.mp3')
  }, [playSound])

  /**
   * 音量を設定する
   * @param newVolume - 新しい音量（0.0 〜 1.0）
   */
  const setVolume = useCallback((newVolume: number) => {
    // 0〜1の範囲にクランプ
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
  }, [])

  /**
   * ミュート状態を切り替える
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return {
    // 音声再生関数
    playTimerComplete,
    playClick,

    // 音量管理
    volume,
    setVolume,

    // ミュート管理
    isMuted,
    toggleMute,
  }
}
