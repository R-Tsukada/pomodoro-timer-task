import { describe, it, expect } from 'vitest'
import { formatTime, getModeDuration, calculateProgress, getNextMode } from '@/lib/timer-utils'

describe('formatTime', () => {
  it('should format 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('should format seconds only (less than 1 minute)', () => {
    expect(formatTime(30)).toBe('00:30')
    expect(formatTime(59)).toBe('00:59')
  })

  it('should format minutes and seconds', () => {
    expect(formatTime(60)).toBe('01:00')
    expect(formatTime(90)).toBe('01:30')
    expect(formatTime(125)).toBe('02:05')
  })

  it('should format typical Pomodoro durations', () => {
    expect(formatTime(1500)).toBe('25:00') // 25分 (Focus)
    expect(formatTime(300)).toBe('05:00') // 5分 (Short Break)
    expect(formatTime(900)).toBe('15:00') // 15分 (Long Break)
  })

  it('should handle large numbers (over 1 hour)', () => {
    expect(formatTime(3600)).toBe('60:00') // 1時間
    expect(formatTime(3665)).toBe('61:05') // 1時間1分5秒
  })

  it('should pad single digit seconds with zero', () => {
    expect(formatTime(61)).toBe('01:01')
    expect(formatTime(605)).toBe('10:05')
  })
})

describe('getModeDuration', () => {
  it('should return 1500 seconds for focus mode', () => {
    expect(getModeDuration('focus')).toBe(1500)
  })

  it('should return 300 seconds for short break mode', () => {
    expect(getModeDuration('shortBreak')).toBe(300)
  })

  it('should return 900 seconds for long break mode', () => {
    expect(getModeDuration('longBreak')).toBe(900)
  })
})

describe('calculateProgress', () => {
  it('should return 0% when time remaining equals total', () => {
    expect(calculateProgress(1500, 1500)).toBe(0)
  })

  it('should return 100% when time remaining is 0', () => {
    expect(calculateProgress(0, 1500)).toBe(100)
  })

  it('should return 50% when half time has elapsed', () => {
    expect(calculateProgress(750, 1500)).toBe(50)
  })

  it('should return correct percentage for various values', () => {
    expect(calculateProgress(1200, 1500)).toBe(20) // 20% elapsed
    expect(calculateProgress(375, 1500)).toBe(75) // 75% elapsed
    expect(calculateProgress(1, 1500)).toBeCloseTo(99.93, 1) // almost done
  })

  it('should handle edge case when total is 0', () => {
    expect(calculateProgress(0, 0)).toBe(0)
  })

  it('should not exceed 100%', () => {
    expect(calculateProgress(0, 1500)).toBe(100)
  })

  it('should not go below 0%', () => {
    expect(calculateProgress(1500, 1500)).toBe(0)
  })
})

describe('getNextMode', () => {
  it('should return shortBreak after first focus session', () => {
    expect(getNextMode('focus', 1)).toBe('shortBreak')
  })

  it('should return shortBreak after second focus session', () => {
    expect(getNextMode('focus', 2)).toBe('shortBreak')
  })

  it('should return shortBreak after third focus session', () => {
    expect(getNextMode('focus', 3)).toBe('shortBreak')
  })

  it('should return longBreak after fourth focus session', () => {
    expect(getNextMode('focus', 4)).toBe('longBreak')
  })

  it('should return focus after short break', () => {
    expect(getNextMode('shortBreak', 1)).toBe('focus')
    expect(getNextMode('shortBreak', 2)).toBe('focus')
    expect(getNextMode('shortBreak', 3)).toBe('focus')
  })

  it('should return focus after long break', () => {
    expect(getNextMode('longBreak', 4)).toBe('focus')
  })

  it('should handle sessions count of 0', () => {
    expect(getNextMode('focus', 0)).toBe('shortBreak')
  })

  it('should handle sessions count greater than 4 (after cycle reset)', () => {
    expect(getNextMode('focus', 5)).toBe('shortBreak')
    expect(getNextMode('focus', 8)).toBe('longBreak')
  })
})
