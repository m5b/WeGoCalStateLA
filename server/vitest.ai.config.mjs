import { defineConfig } from 'vitest/config'

// Fake Gemini responses and a fake user repository; no databases or API quota.
export default defineConfig({
    test: {
        include: ['test/ai/**/*.test.mjs'],
        env: { NODE_ENV: 'test' },
    },
})
