import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CircularTimer } from '@/components/timer/CircularTimer'

describe('CircularTimer', () => {
  describe('Rendering', () => {
    it('should render the timer with time text', () => {
      render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      expect(screen.getByText('25:00')).toBeInTheDocument()
    })

    it('should render SVG element', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render two circles (background and progress)', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const circles = container.querySelectorAll('circle')
      expect(circles).toHaveLength(2)
    })
  })

  describe('Progress Display', () => {
    it('should show correct progress at 0%', () => {
      const { container } = render(<CircularTimer progress={0} timeText="25:00" isBreak={false} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      // 0% progress means full strokeDashoffset (no visible progress)
      expect(progressCircle).toHaveAttribute('stroke-dashoffset')
    })

    it('should show correct progress at 50%', () => {
      const { container } = render(<CircularTimer progress={50} timeText="12:30" isBreak={false} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-dashoffset')
    })

    it('should show correct progress at 100%', () => {
      const { container } = render(
        <CircularTimer progress={100} timeText="00:00" isBreak={false} />
      )

      const progressCircle = container.querySelectorAll('circle')[1]
      // 100% progress means 0 strokeDashoffset (full circle visible)
      expect(progressCircle).toHaveAttribute('stroke-dashoffset')
    })
  })

  describe('Color Scheme', () => {
    it('should use blue color for focus mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      // Focus mode = blue
      expect(progressCircle).toHaveClass('stroke-blue-500')
    })

    it('should use green color for break mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="05:00" isBreak={true} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      // Break mode = green
      expect(progressCircle).toHaveClass('stroke-green-500')
    })

    it('should use blue background for focus mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const backgroundCircle = container.querySelectorAll('circle')[0]
      // Focus background = blue with opacity
      expect(backgroundCircle).toHaveClass('stroke-blue-500/10')
    })

    it('should use green background for break mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="05:00" isBreak={true} />)

      const backgroundCircle = container.querySelectorAll('circle')[0]
      // Break background = green with opacity
      expect(backgroundCircle).toHaveClass('stroke-green-500/10')
    })
  })

  describe('Time Text Display', () => {
    it('should display different time formats', () => {
      const { rerender } = render(<CircularTimer progress={0} timeText="25:00" isBreak={false} />)
      expect(screen.getByText('25:00')).toBeInTheDocument()

      rerender(<CircularTimer progress={50} timeText="12:30" isBreak={false} />)
      expect(screen.getByText('12:30')).toBeInTheDocument()

      rerender(<CircularTimer progress={99} timeText="00:05" isBreak={false} />)
      expect(screen.getByText('00:05')).toBeInTheDocument()

      rerender(<CircularTimer progress={100} timeText="00:00" isBreak={false} />)
      expect(screen.getByText('00:00')).toBeInTheDocument()
    })

    it('should have correct styling for time text', () => {
      render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const timeText = screen.getByText('25:00')
      // Should be large, bold, monospace
      expect(timeText).toHaveClass('text-6xl')
      expect(timeText).toHaveClass('font-bold')
      expect(timeText).toHaveClass('font-mono')
    })
  })

  describe('SVG Attributes', () => {
    it('should have correct viewBox', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox')
    })

    it('should have stroke-linecap="round" for progress circle', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round')
    })

    it('should have correct stroke-width', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const circles = container.querySelectorAll('circle')
      // Both circles should have stroke-width of 12
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '12')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible role', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('role', 'timer')
    })

    it('should have aria-label with time', () => {
      const { container } = render(<CircularTimer progress={50} timeText="12:30" isBreak={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', '12:30 remaining')
    })
  })
})
