import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

// Load .env before tests run
dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts']
    }
  }
})
