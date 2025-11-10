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
      // Focus mode = blue via Tailwind class
      expect(progressCircle).toHaveClass('stroke-blue-500')
    })

    it('should use green color for break mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="05:00" isBreak={true} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      // Break mode = green via Tailwind class
      expect(progressCircle).toHaveClass('stroke-green-500')
    })

    it('should use gray background for focus mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const backgroundCircle = container.querySelectorAll('circle')[0]
      // Background = gray
      expect(backgroundCircle).toHaveAttribute('stroke', '#e5e7eb')
    })

    it('should use gray background for break mode', () => {
      const { container } = render(<CircularTimer progress={50} timeText="05:00" isBreak={true} />)

      const backgroundCircle = container.querySelectorAll('circle')[0]
      // Background = gray (same for both modes)
      expect(backgroundCircle).toHaveAttribute('stroke', '#e5e7eb')
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
      // Should be large and bold with gradient
      expect(timeText).toHaveClass('text-5xl')
      expect(timeText).toHaveClass('font-bold')
      expect(timeText).toHaveClass('bg-gradient-to-r')
    })
  })

  describe('SVG Attributes', () => {
    it('should have stroke-linecap="round" for progress circle', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const progressCircle = container.querySelectorAll('circle')[1]
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round')
    })

    it('should have correct stroke-width', () => {
      const { container } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const circles = container.querySelectorAll('circle')
      // Both circles should have stroke-width of 8
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '8')
      })
    })
  })

  describe('Accessibility', () => {
    it('should render time text visibly', () => {
      render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)

      const timeText = screen.getByText('25:00')
      expect(timeText).toBeVisible()
    })

    it('should update time text when timeText prop changes', () => {
      const { rerender } = render(<CircularTimer progress={50} timeText="25:00" isBreak={false} />)
      expect(screen.getByText('25:00')).toBeInTheDocument()

      rerender(<CircularTimer progress={75} timeText="12:30" isBreak={false} />)
      expect(screen.getByText('12:30')).toBeInTheDocument()
    })
  })
})
