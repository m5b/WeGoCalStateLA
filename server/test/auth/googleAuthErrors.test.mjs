import { describe, expect, it } from 'vitest'
import { normalizeGoogleError } from '../../../client/services/googleAuthErrors.js'

describe('Google sign-in messages', () => {
    it.each(['auth/user-cancelled', 'auth/redirect-cancelled-by-user', 'auth/popup-closed-by-user',
        'auth/cancelled-popup-request', 'access_denied'])('silently handles cancellation: %s', (code) => {
        expect(normalizeGoogleError({ code, message: 'Firebase: internal SDK details' })).toBeNull()
    })

    it('recognizes cancellation codes embedded in SDK messages', () => {
        expect(normalizeGoogleError(new Error('Firebase: Error (auth/user-cancelled).'))).toBeNull()
    })

    it.each(['auth/internal-error', 'auth/invalid-api-key', 'auth/configuration-not-found', 'auth/popup-blocked',
        'auth/network-request-failed', 'auth/operation-not-allowed'])('hides SDK details for %s', (code) => {
        const error = normalizeGoogleError({ code, message: 'Firebase: private configuration detail' })
        expect(error.message).not.toMatch(/firebase|auth\/|private configuration/i)
        expect(error.message.length).toBeGreaterThan(20)
    })

    it('keeps actionable account-linking errors and replaces network jargon', () => {
        const conflict = Object.assign(new Error('Sign in to your existing WeGo account first.'), { status: 409 })
        expect(normalizeGoogleError(conflict)).toBe(conflict)
        expect(normalizeGoogleError(new TypeError('Failed to fetch')).message).toContain('Could not reach WeGo')
        expect(normalizeGoogleError(Object.assign(new Error('Firebase: Error (auth/internal-error).'), { status: 500 })).message)
            .not.toMatch(/firebase|auth\//i)
        expect(normalizeGoogleError(Object.assign(new Error('Database internal details'), { status: 500 })).message)
            .not.toContain('Database internal details')
    })
})
