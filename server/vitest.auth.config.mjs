import { defineConfig } from 'vitest/config'

// Firebase authentication tests; database cases run when MYSQL_AUTH_TESTS=1.
export default defineConfig({
    test: {
        include: ['test/auth/**/*.test.mjs'],
        env: { NODE_ENV: 'test', JWT_SECRET: 'firebase-auth-test-secret', JWT_ISSUER: 'firebase-auth-tests' },
    },
})
