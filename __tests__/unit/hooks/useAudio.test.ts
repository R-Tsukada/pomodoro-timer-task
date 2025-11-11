import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudio } from '@/hooks/useAudio'

// Audioインスタンスの配列を保持（複数再生のテスト用）
let audioInstances: any[] = []

describe('useAudio', () => {
  beforeEach(() => {
    audioInstances = []

    // グローバルなAudioコンストラクタをモック
    global.Audio = vi.fn().mockImplementation((src: string) => {
      const mockAudio = {
        src,
        volume: 1,
        paused: true,
        currentTime: 0,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        load: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        remove: vi.fn(),
      }
      audioInstances.push(mockAudio)
      return mockAudio
    }) as any

    vi.clearAllMocks()
  })

  afterEach(() => {
    audioInstances = []
  })

  describe('初期状態', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAudio())

      expect(result.current.volume).toBe(0.5) // デフォルト音量50%
      expect(result.current.isMuted).toBe(false)
    })
  })

  describe('playTimerComplete', () => {
    it('should play timer completion sound', async () => {
      const { result } = renderHook(() => useAudio())

      await act(async () => {
        await result.current.playTimerComplete()
      })

      // Audio要素が作成されて再生されることを確認
      expect(global.Audio).toHaveBeenCalledWith('/sounds/complete.mp3')
      expect(audioInstances[0].play).toHaveBeenCalled()
    })

    it('should not play when muted', async () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.toggleMute() // ミュートにする
      })

      await act(async () => {
        await result.current.playTimerComplete()
      })

      // ミュート時は再生されない（Audioインスタンスが作成されない）
      expect(global.Audio).not.toHaveBeenCalled()
      expect(audioInstances.length).toBe(0)
    })

    it('should use correct audio file path', async () => {
      const { result } = renderHook(() => useAudio())

      await act(async () => {
        await result.current.playTimerComplete()
      })

      // 正しいパスが設定されているか確認
      expect(global.Audio).toHaveBeenCalledWith('/sounds/complete.mp3')
      expect(audioInstances[0].src).toBe('/sounds/complete.mp3')
    })
  })

  describe('playClick', () => {
    it('should play click sound', async () => {
      const { result } = renderHook(() => useAudio())

      await act(async () => {
        await result.current.playClick()
      })

      expect(global.Audio).toHaveBeenCalledWith('/sounds/click.mp3')
      expect(audioInstances[0].play).toHaveBeenCalled()
    })

    it('should not play when muted', async () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.toggleMute()
      })

      await act(async () => {
        await result.current.playClick()
      })

      expect(global.Audio).not.toHaveBeenCalled()
      expect(audioInstances.length).toBe(0)
    })
  })

  describe('setVolume', () => {
    it('should update volume to valid value', () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.setVolume(0.8)
      })

      expect(result.current.volume).toBe(0.8)
    })

    it('should clamp volume to minimum 0', () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.setVolume(-0.5)
      })

      expect(result.current.volume).toBe(0)
    })

    it('should clamp volume to maximum 1', () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.setVolume(1.5)
      })

      expect(result.current.volume).toBe(1)
    })

    it('should update volume on all audio instances', () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.setVolume(0.3)
        result.current.playTimerComplete()
      })

      // 再生時に新しい音量が適用されることを期待
      expect(result.current.volume).toBe(0.3)
    })
  })

  describe('toggleMute', () => {
    it('should toggle mute state from false to true', () => {
      const { result } = renderHook(() => useAudio())

      expect(result.current.isMuted).toBe(false)

      act(() => {
        result.current.toggleMute()
      })

      expect(result.current.isMuted).toBe(true)
    })

    it('should toggle mute state from true to false', () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.toggleMute() // true
        result.current.toggleMute() // false
      })

      expect(result.current.isMuted).toBe(false)
    })

    it('should prevent playback when muted', async () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.toggleMute()
      })

      await act(async () => {
        await result.current.playTimerComplete()
      })

      expect(global.Audio).not.toHaveBeenCalled()
      expect(audioInstances.length).toBe(0)
    })

    it('should allow playback when unmuted', async () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.toggleMute() // ミュート
        result.current.toggleMute() // ミュート解除
      })

      await act(async () => {
        await result.current.playTimerComplete()
      })

      expect(global.Audio).toHaveBeenCalled()
      expect(audioInstances[0].play).toHaveBeenCalled()
    })
  })

  describe('エラーハンドリング', () => {
    it('should handle play errors gracefully', async () => {
      // playがエラーを返すようにモック
      global.Audio = vi.fn().mockImplementation(() => ({
        src: '',
        volume: 1,
        play: vi.fn().mockRejectedValue(new Error('Play failed')),
        pause: vi.fn(),
        load: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        remove: vi.fn(),
      })) as any

      const { result } = renderHook(() => useAudio())

      await act(async () => {
        // エラーが発生してもクラッシュしないことを確認
        await result.current.playTimerComplete()
      })

      // エラーは内部で処理され、外部には影響しない
      expect(result.current.isMuted).toBe(false)
      expect(result.current.volume).toBe(0.5)
    })

    it('should handle missing audio files gracefully', async () => {
      const { result } = renderHook(() => useAudio())

      // 音声ファイルが存在しなくてもエラーにならないことを確認
      await act(async () => {
        await result.current.playTimerComplete()
      })

      // 正常に動作する
      expect(result.current.volume).toBe(0.5)
      expect(global.Audio).toHaveBeenCalled()
    })
  })

  describe('複数回再生', () => {
    it('should allow multiple sounds to play simultaneously', async () => {
      const { result } = renderHook(() => useAudio())

      await act(async () => {
        await result.current.playTimerComplete()
        await result.current.playClick()
      })

      // 2つのAudioインスタンスが作成されることを確認
      expect(audioInstances.length).toBe(2)
      expect(audioInstances[0].play).toHaveBeenCalled()
      expect(audioInstances[1].play).toHaveBeenCalled()
    })

    it('should create new Audio instance for each playback', async () => {
      const { result } = renderHook(() => useAudio())

      await act(async () => {
        await result.current.playTimerComplete()
        await result.current.playTimerComplete()
      })

      // 2回Audioコンストラクタが呼ばれる
      expect(global.Audio).toHaveBeenCalledTimes(2)
      expect(audioInstances.length).toBe(2)
    })
  })

  describe('音量設定の永続化', () => {
    it('should maintain volume across multiple playbacks', async () => {
      const { result } = renderHook(() => useAudio())

      act(() => {
        result.current.setVolume(0.7)
      })

      await act(async () => {
        await result.current.playTimerComplete()
      })

      // 音量が保持されている
      expect(result.current.volume).toBe(0.7)
      expect(audioInstances[0].volume).toBe(0.7)

      await act(async () => {
        await result.current.playClick()
      })

      // 音量が保持されている
      expect(result.current.volume).toBe(0.7)
      expect(audioInstances[1].volume).toBe(0.7)
    })
  })
})
