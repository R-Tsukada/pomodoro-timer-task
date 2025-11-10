import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionIndicator } from '@/components/timer/SessionIndicator'

describe('SessionIndicator', () => {
  describe('Rendering', () => {
    it('should render session dots', () => {
      const { container } = render(<SessionIndicator completedSessions={0} completedCycles={0} />)

      // Should render 4 dots (for 4 sessions) - using div elements with aria-label
      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      expect(dots).toHaveLength(4)
    })

    it('should render session count text', () => {
      render(<SessionIndicator completedSessions={2} completedCycles={0} />)

      expect(screen.getByText('Session 2 of 4')).toBeInTheDocument()
    })

    it('should render cycle count when cycles > 0', () => {
      render(<SessionIndicator completedSessions={0} completedCycles={2} />)

      expect(screen.getByText(/2 cycles completed/i)).toBeInTheDocument()
    })

    it('should not render cycle count when cycles = 0', () => {
      render(<SessionIndicator completedSessions={0} completedCycles={0} />)

      expect(screen.queryByText(/cycle.*completed/i)).not.toBeInTheDocument()
    })
  })

  describe('Session Dots State', () => {
    it('should show no filled dots when completedSessions = 0', () => {
      const { container } = render(<SessionIndicator completedSessions={0} completedCycles={0} />)

      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      dots.forEach((dot) => {
        // Empty dots should have gray background
        expect(dot).toHaveClass('bg-gray-300')
      })
    })

    it('should fill dots progressively for sessions 1-3', () => {
      const { container, rerender } = render(
        <SessionIndicator completedSessions={1} completedCycles={0} />
      )

      let dots = container.querySelectorAll('div[aria-label*="Session"]')
      // First dot should be filled with gradient
      expect(dots[0]).toHaveClass('bg-gradient-to-r')
      expect(dots[0]).toHaveClass('from-blue-500')
      // Others should be empty
      expect(dots[1]).toHaveClass('bg-gray-300')
      expect(dots[2]).toHaveClass('bg-gray-300')
      expect(dots[3]).toHaveClass('bg-gray-300')

      rerender(<SessionIndicator completedSessions={2} completedCycles={0} />)
      dots = container.querySelectorAll('div[aria-label*="Session"]')
      expect(dots[0]).toHaveClass('bg-gradient-to-r')
      expect(dots[1]).toHaveClass('bg-gradient-to-r')
      expect(dots[2]).toHaveClass('bg-gray-300')

      rerender(<SessionIndicator completedSessions={3} completedCycles={0} />)
      dots = container.querySelectorAll('div[aria-label*="Session"]')
      expect(dots[0]).toHaveClass('bg-gradient-to-r')
      expect(dots[1]).toHaveClass('bg-gradient-to-r')
      expect(dots[2]).toHaveClass('bg-gradient-to-r')
      expect(dots[3]).toHaveClass('bg-gray-300')
    })

    it('should fill all dots when completedSessions = 4', () => {
      const { container } = render(<SessionIndicator completedSessions={4} completedCycles={1} />)

      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      dots.forEach((dot) => {
        // All dots should be gradient for completed cycle
        expect(dot).toHaveClass('bg-gradient-to-r')
      })
    })
  })

  describe('Session Count Display', () => {
    it('should display correct session count for different values', () => {
      const { rerender } = render(<SessionIndicator completedSessions={0} completedCycles={0} />)
      expect(screen.getByText('Session 0 of 4')).toBeInTheDocument()

      rerender(<SessionIndicator completedSessions={1} completedCycles={0} />)
      expect(screen.getByText('Session 1 of 4')).toBeInTheDocument()

      rerender(<SessionIndicator completedSessions={2} completedCycles={0} />)
      expect(screen.getByText('Session 2 of 4')).toBeInTheDocument()

      rerender(<SessionIndicator completedSessions={3} completedCycles={0} />)
      expect(screen.getByText('Session 3 of 4')).toBeInTheDocument()

      rerender(<SessionIndicator completedSessions={4} completedCycles={1} />)
      expect(screen.getByText('Session 4 of 4')).toBeInTheDocument()
    })

    it('should have correct styling for session count', () => {
      render(<SessionIndicator completedSessions={2} completedCycles={0} />)

      const sessionCount = screen.getByText('Session 2 of 4')
      expect(sessionCount).toHaveClass('text-sm')
      expect(sessionCount).toHaveClass('font-medium')
    })
  })

  describe('Cycle Count Display', () => {
    it('should display correct cycle count for different values', () => {
      const { rerender } = render(<SessionIndicator completedSessions={0} completedCycles={1} />)
      expect(screen.getByText(/1 cycle completed/i)).toBeInTheDocument()

      rerender(<SessionIndicator completedSessions={0} completedCycles={5} />)
      expect(screen.getByText(/5 cycles completed/i)).toBeInTheDocument()
    })

    it('should have correct styling for cycle count', () => {
      render(<SessionIndicator completedSessions={0} completedCycles={2} />)

      const cycleText = screen.getByText(/2 cycles completed/i)
      expect(cycleText).toHaveClass('text-xs')
      expect(cycleText).toHaveClass('text-gray-500')
    })
  })

  describe('Animation Classes', () => {
    it('should apply transition classes to dots', () => {
      const { container } = render(<SessionIndicator completedSessions={2} completedCycles={0} />)

      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      dots.forEach((dot) => {
        expect(dot).toHaveClass('transition-all')
      })
    })
  })

  describe('Layout', () => {
    it('should have proper container structure', () => {
      const { container } = render(<SessionIndicator completedSessions={2} completedCycles={1} />)

      // Should have dots container
      const dotsContainer = container.querySelector('.flex.gap-3')
      expect(dotsContainer).toBeInTheDocument()
    })

    it('should display elements in correct order', () => {
      render(<SessionIndicator completedSessions={2} completedCycles={1} />)

      const container = screen.getByText('Session 2 of 4').closest('div')
      expect(container).toBeInTheDocument()

      // Should contain both session count and cycle count
      expect(screen.getByText('Session 2 of 4')).toBeInTheDocument()
      expect(screen.getByText(/1 cycle completed/i)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle completedSessions > 4', () => {
      const { container } = render(<SessionIndicator completedSessions={5} completedCycles={1} />)

      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      expect(dots).toHaveLength(4) // Still only 4 dots
    })

    it('should handle negative values gracefully', () => {
      render(<SessionIndicator completedSessions={-1} completedCycles={0} />)

      // Should still render without errors
      expect(screen.getByText('Session -1 of 4')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have descriptive aria-labels on dots', () => {
      const { container } = render(<SessionIndicator completedSessions={2} completedCycles={1} />)

      const dots = container.querySelectorAll('div[aria-label*="Session"]')
      dots.forEach((dot) => {
        expect(dot).toHaveAttribute('aria-label')
      })
    })
  })
})
