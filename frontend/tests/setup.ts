import { vi } from 'vitest'

// Nuxt의 auto-imports를 모킹
global.navigateTo = vi.fn()
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
}))
global.useSeoMeta = vi.fn()
global.useHead = vi.fn()
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'http://localhost:8000',
    gaId: '',
  },
}))
