import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
  // LocalStorageもクリア
  localStorage.clear()
})

// Mock localStorage with actual storage behavior
beforeAll(() => {
  const storage: Record<string, string> = {}

  const localStorageMock = {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key]
    }),
    clear: vi.fn(() => {
      for (const key in storage) {
        delete storage[key]
      }
    }),
    get length() {
      return Object.keys(storage).length
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(storage)
      return keys[index] || null
    }),
  }

  global.localStorage = localStorageMock as any
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
