import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from '@/components/timer/TimerControls'

describe('TimerControls', () => {
  describe('Rendering', () => {
    it('should render start button when not running', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      // Start button should be visible
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
    })

    it('should render pause button when running', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      // Pause button should be visible
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
    })

    it('should render reset/stop button based on running state', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      const { rerender } = render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      // When not running, should show "Reset"
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()

      rerender(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      // When running, should show "Stop"
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    })
  })

  describe('Button Clicks', () => {
    it('should call onStart when start button is clicked', async () => {
      const user = userEvent.setup()
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      await user.click(startButton)

      expect(mockStart).toHaveBeenCalledTimes(1)
      expect(mockPause).not.toHaveBeenCalled()
    })

    it('should call onPause when pause button is clicked', async () => {
      const user = userEvent.setup()
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const pauseButton = screen.getByRole('button', { name: /pause/i })
      await user.click(pauseButton)

      expect(mockPause).toHaveBeenCalledTimes(1)
      expect(mockStart).not.toHaveBeenCalled()
    })

    it('should call onReset when reset button is clicked', async () => {
      const user = userEvent.setup()
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const resetButton = screen.getByRole('button', { name: /reset/i })
      await user.click(resetButton)

      expect(mockReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling', () => {
    it('should apply correct colors for start and pause buttons', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      const { rerender } = render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      // Start button should have blue background
      expect(startButton).toHaveClass('bg-blue-500')

      rerender(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const pauseButton = screen.getByRole('button', { name: /pause/i })
      // Pause button should have orange background
      expect(pauseButton).toHaveClass('bg-orange-500')
    })

    it('should apply reset button styling', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const resetButton = screen.getByRole('button', { name: /reset/i })
      // Reset button should have gray background
      expect(resetButton).toHaveClass('bg-gray-100')
    })

    it('should apply transition classes to buttons', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      // Should have transition classes
      expect(startButton).toHaveClass('transition-colors')
      expect(resetButton).toHaveClass('transition-colors')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      expect(startButton).toBeInTheDocument()
      expect(resetButton).toBeInTheDocument()
    })

    it('should maintain button roles', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2) // Start + Reset
    })
  })
})
