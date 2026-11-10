import { defineConfig } from 'vitest/config'

// Authentication configuration regression tests without external services.
export default defineConfig({
    test: {
        include: ['test/auth/**/*.test.mjs'],
        env: { NODE_ENV: 'test' },
    },
})
