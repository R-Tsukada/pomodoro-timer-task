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

    it('should always render reset button', () => {
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

      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()

      rerender(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
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

  describe('Disabled State', () => {
    it('should disable all buttons when disabled prop is true', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
          disabled={true}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      expect(startButton).toBeDisabled()
      expect(resetButton).toBeDisabled()
    })

    it('should not call callbacks when buttons are disabled', async () => {
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
          disabled={true}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      // Try to click disabled buttons
      await user.click(startButton)
      await user.click(resetButton)

      // Callbacks should not be called
      expect(mockStart).not.toHaveBeenCalled()
      expect(mockReset).not.toHaveBeenCalled()
    })

    it('should enable buttons when disabled prop is false', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
          disabled={false}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      const resetButton = screen.getByRole('button', { name: /reset/i })

      expect(startButton).not.toBeDisabled()
      expect(resetButton).not.toBeDisabled()
    })
  })

  describe('Styling', () => {
    it('should apply indigo background for start and pause buttons', () => {
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
      // Start button should have indigo background
      expect(startButton).toHaveClass('bg-indigo-500')

      rerender(
        <TimerControls
          isRunning={true}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
        />
      )

      const pauseButton = screen.getByRole('button', { name: /pause/i })
      // Pause button should also have indigo background
      expect(pauseButton).toHaveClass('bg-indigo-500')
    })

    it('should apply animation classes to buttons', () => {
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

      // Should have active scale animation
      expect(startButton).toHaveClass('active:scale-[0.98]')
      expect(resetButton).toHaveClass('active:scale-[0.98]')
    })

    it('should apply disabled styles when disabled', () => {
      const mockStart = vi.fn()
      const mockPause = vi.fn()
      const mockReset = vi.fn()

      render(
        <TimerControls
          isRunning={false}
          onStart={mockStart}
          onPause={mockPause}
          onReset={mockReset}
          disabled={true}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })

      // Should have disabled styling
      expect(startButton).toHaveClass('disabled:opacity-50')
      expect(startButton).toHaveClass('disabled:cursor-not-allowed')
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
