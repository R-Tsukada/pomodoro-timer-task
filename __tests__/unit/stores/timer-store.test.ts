import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimerStore } from '@/stores/timer-store'

describe('useTimerStore', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear()

    // ストアの状態をリセット
    const { result } = renderHook(() => useTimerStore())
    act(() => {
      result.current.switchMode('focus')
      result.current.pauseTimer()
      result.current.setCompletedSessions(0)
      const state = useTimerStore.getState()
      useTimerStore.setState({
        ...state,
        completedCycles: 0,
      })
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useTimerStore())

      expect(result.current.currentMode).toBe('focus')
      expect(result.current.timeRemaining).toBe(1500) // 25 minutes
      expect(result.current.isRunning).toBe(false)
      expect(result.current.completedSessionsInCycle).toBe(0)
      expect(result.current.completedCycles).toBe(0)
    })
  })

  describe('startTimer', () => {
    it('should start the timer', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
      })

      expect(result.current.isRunning).toBe(true)
    })

    it('should not change time remaining when starting', () => {
      const { result } = renderHook(() => useTimerStore())
      const initialTime = result.current.timeRemaining

      act(() => {
        result.current.startTimer()
      })

      expect(result.current.timeRemaining).toBe(initialTime)
    })
  })

  describe('pauseTimer', () => {
    it('should pause the timer', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
        result.current.pauseTimer()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it('should not change time remaining when pausing', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
      })

      const timeBeforePause = result.current.timeRemaining

      act(() => {
        result.current.pauseTimer()
      })

      expect(result.current.timeRemaining).toBe(timeBeforePause)
    })
  })

  describe('resetTimer', () => {
    it('should reset timer to initial duration', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setTimeRemaining(100)
        result.current.resetTimer()
      })

      expect(result.current.timeRemaining).toBe(1500)
    })

    it('should stop the timer when resetting', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
        result.current.resetTimer()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it('should reset to current mode duration', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('shortBreak')
        result.current.setTimeRemaining(100)
        result.current.resetTimer()
      })

      expect(result.current.timeRemaining).toBe(300) // Short break duration
    })
  })

  describe('tick', () => {
    it('should decrement time remaining when running', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
        result.current.tick()
      })

      expect(result.current.timeRemaining).toBe(1499)
    })

    it('should not decrement when paused', () => {
      const { result } = renderHook(() => useTimerStore())
      const initialTime = result.current.timeRemaining

      act(() => {
        result.current.pauseTimer()
        result.current.tick()
      })

      expect(result.current.timeRemaining).toBe(initialTime)
    })

    it('should not go below 0', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setTimeRemaining(0)
        result.current.startTimer()
        result.current.tick()
      })

      expect(result.current.timeRemaining).toBe(0)
    })

    it('should complete session when reaching 0', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setTimeRemaining(1)
        result.current.startTimer()
        result.current.tick()
      })

      // Should switch to short break after completing focus
      expect(result.current.currentMode).toBe('shortBreak')
      expect(result.current.completedSessionsInCycle).toBe(1)
    })
  })

  describe('switchMode', () => {
    it('should switch to focus mode', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('focus')
      })

      expect(result.current.currentMode).toBe('focus')
      expect(result.current.timeRemaining).toBe(1500)
    })

    it('should switch to short break mode', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('shortBreak')
      })

      expect(result.current.currentMode).toBe('shortBreak')
      expect(result.current.timeRemaining).toBe(300)
    })

    it('should switch to long break mode', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('longBreak')
      })

      expect(result.current.currentMode).toBe('longBreak')
      expect(result.current.timeRemaining).toBe(900)
    })

    it('should stop timer by default when switching mode', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.startTimer()
        result.current.switchMode('shortBreak')
      })

      expect(result.current.isRunning).toBe(false)
    })

    it('should auto-start timer when shouldAutoStart is true', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('shortBreak', true)
      })

      expect(result.current.isRunning).toBe(true)
    })
  })

  describe('completeSession', () => {
    it('should switch to short break after first focus session', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(0)
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('shortBreak')
      expect(result.current.completedSessionsInCycle).toBe(1)
    })

    it('should switch to short break after second focus session', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(1)
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('shortBreak')
      expect(result.current.completedSessionsInCycle).toBe(2)
    })

    it('should switch to short break after third focus session', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(2)
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('shortBreak')
      expect(result.current.completedSessionsInCycle).toBe(3)
    })

    it('should switch to long break after fourth focus session', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(3)
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('longBreak')
      expect(result.current.completedSessionsInCycle).toBe(4)
      expect(result.current.completedCycles).toBe(1)
    })

    it('should switch back to focus after short break', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.switchMode('shortBreak')
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('focus')
      expect(result.current.timeRemaining).toBe(1500)
    })

    it('should reset sessions after long break', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(4)
        result.current.switchMode('longBreak')
        result.current.completeSession()
      })

      expect(result.current.currentMode).toBe('focus')
      expect(result.current.completedSessionsInCycle).toBe(0)
    })
  })

  describe('Test Helpers', () => {
    it('should set time remaining using helper', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setTimeRemaining(500)
      })

      expect(result.current.timeRemaining).toBe(500)
    })

    it('should set completed sessions using helper', () => {
      const { result } = renderHook(() => useTimerStore())

      act(() => {
        result.current.setCompletedSessions(2)
      })

      expect(result.current.completedSessionsInCycle).toBe(2)
    })
  })
})
