import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Extend with jest-dom-style matchers
declare module 'vitest' {
  interface Assertion<T> {
    toBeInTheDocument(): void
    toHaveTextContent(expected: string): void
    toHaveClass(expected: string): void
  }
}

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined
    return {
      pass,
      message: () => `expected element to be in the document`,
    }
  },
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null
  },
  setItem(key: string, value: string) {
    this.store[key] = value
  },
  removeItem(key: string) {
    delete this.store[key]
  },
  clear() {
    this.store = {}
  },
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
})