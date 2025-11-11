import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTimerStore } from '@/stores/timer-store'
import HomePage from '@/app/page'

describe('Timer Page Integration', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear()

    // ストアの状態をリセット
    const { result } = { result: { current: useTimerStore.getState() } }
    act(() => {
      useTimerStore.getState().switchMode('focus')
      useTimerStore.getState().pauseTimer()
      useTimerStore.getState().setCompletedSessions(0)
      useTimerStore.setState({
        ...useTimerStore.getState(),
        completedCycles: 0,
      })
    })
  })

  describe('Component Rendering', () => {
    it('should render all timer components', () => {
      render(<HomePage />)

      // ヘッダー
      expect(screen.getByText(/Pomodoro Timer/i)).toBeInTheDocument()

      // タイマー表示（時間）- テスト用2分
      expect(screen.getByText('25:00')).toBeInTheDocument()

      // コントロールボタン
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()

      // セッションインジケーター
      expect(screen.getByText('Session 0 of 4')).toBeInTheDocument()
    })

    it('should render circular timer', () => {
      const { container } = render(<HomePage />)

      // SVGが存在することを確認
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render session indicator', () => {
      render(<HomePage />)

      // セッション進捗テキストが存在することを確認
      expect(screen.getByText('Session 0 of 4')).toBeInTheDocument()
    })

    it('should render timer controls', () => {
      render(<HomePage />)

      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })
  })

  describe('Timer Functionality', () => {
    it('should start timer when start button is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      const startButton = screen.getByRole('button', { name: /start/i })
      await user.click(startButton)

      // Pause buttonに変わることを確認
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })

    it('should pause timer when pause button is clicked', async () => {
      const user = userEvent.setup()
      render(<HomePage />)

      // Start
      const startButton = screen.getByRole('button', { name: /start/i })
      await user.click(startButton)

      // Pause
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      await user.click(pauseButton)

      // Start buttonに戻ることを確認
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('should reset timer when reset button is clicked', async () => {
      const user = userEvent.setup()

      render(<HomePage />)

      // タイマーを変更
      act(() => {
        useTimerStore.getState().setTimeRemaining(100)
      })

      // Reset
      const resetButton = screen.getByRole('button', { name: /reset/i })
      await user.click(resetButton)

      // 25:00に戻ることを確認
      expect(screen.getByText('25:00')).toBeInTheDocument()
    })
  })

  describe('Mode Display', () => {
    it('should display Focus mode badge', () => {
      render(<HomePage />)

      expect(screen.getByText('Focus Time')).toBeInTheDocument()
    })

    it('should display Short Break mode badge when in short break', () => {
      act(() => {
        useTimerStore.getState().switchMode('shortBreak')
      })

      render(<HomePage />)

      expect(screen.getByText('Short Break')).toBeInTheDocument()
    })

    it('should display Long Break mode badge when in long break', () => {
      act(() => {
        useTimerStore.getState().switchMode('longBreak')
      })

      render(<HomePage />)

      expect(screen.getByText('Long Break')).toBeInTheDocument()
    })

    it('should apply correct colors for focus mode', () => {
      render(<HomePage />)

      const badge = screen.getByText('Focus Time').closest('span')
      expect(badge).toHaveClass('bg-gradient-to-r')
      expect(badge).toHaveClass('text-white')
    })

    it('should apply correct colors for break mode', () => {
      act(() => {
        useTimerStore.getState().switchMode('shortBreak')
      })

      render(<HomePage />)

      const badge = screen.getByText('Short Break').closest('span')
      expect(badge).toHaveClass('bg-gradient-to-r')
      expect(badge).toHaveClass('text-white')
    })
  })

  describe('Session Progress', () => {
    it('should display correct session count', () => {
      render(<HomePage />)
      expect(screen.getByText('Session 0 of 4')).toBeInTheDocument()

      act(() => {
        useTimerStore.getState().setCompletedSessions(2)
      })

      expect(screen.getByText('Session 2 of 4')).toBeInTheDocument()
    })

    it('should display cycle count when cycles > 0', () => {
      act(() => {
        useTimerStore.setState({
          ...useTimerStore.getState(),
          completedCycles: 2,
        })
      })

      render(<HomePage />)

      expect(screen.getByText(/2 cycles completed/i)).toBeInTheDocument()
    })

    it('should not display cycle count when cycles = 0', () => {
      render(<HomePage />)

      expect(screen.queryByText(/cycle.*completed/i)).not.toBeInTheDocument()
    })
  })

  describe('Timer State Integration', () => {
    it('should update UI when timer ticks', () => {
      vi.useFakeTimers()

      render(<HomePage />)

      // Start timer
      act(() => {
        useTimerStore.getState().startTimer()
      })

      // 初期状態: 25:00
      expect(screen.getByText('25:00')).toBeInTheDocument()

      // 1秒経過
      act(() => {
        useTimerStore.getState().tick()
      })

      // 24:59になることを確認
      expect(screen.getByText('24:59')).toBeInTheDocument()

      vi.useRealTimers()
    })

    it('should show correct time for different modes', () => {
      const { rerender } = render(<HomePage />)

      // Focus mode: 25:00
      expect(screen.getByText('25:00')).toBeInTheDocument()

      // Short break: 05:00
      act(() => {
        useTimerStore.getState().switchMode('shortBreak')
      })
      rerender(<HomePage />)
      expect(screen.getByText('05:00')).toBeInTheDocument()

      // Long break: 15:00
      act(() => {
        useTimerStore.getState().switchMode('longBreak')
      })
      rerender(<HomePage />)
      expect(screen.getByText('15:00')).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should have proper container structure', () => {
      const { container } = render(<HomePage />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('min-h-screen')
    })

    it('should have gradient background', () => {
      const { container } = render(<HomePage />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('bg-gradient-to-br')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<HomePage />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/Pomodoro Timer/i)
    })

    it('should have timer display with visible time', () => {
      render(<HomePage />)

      // タイマーの時間テキストが表示されていることを確認
      expect(screen.getByText('25:00')).toBeVisible()
    })

    it('should have session progress information', () => {
      render(<HomePage />)

      // セッション進捗情報が表示されていることを確認
      expect(screen.getByText('Session 0 of 4')).toBeInTheDocument()
    })
  })
})
