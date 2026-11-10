import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { disconnectGoogle, initiateGoogleLogin, signOut } from '../../../client/services/authService.js'
import { apiJson } from '../../../client/services/api.js'
import { getGoogleIdToken, clearFirebaseSession } from '../../../client/services/firebase.js'

vi.mock('../../../client/services/api.js', () => ({ apiJson: vi.fn(), apiGet: vi.fn() }))
vi.mock('../../../client/services/firebase.js', () => ({ getGoogleIdToken: vi.fn(), clearFirebaseSession: vi.fn() }))

beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    getGoogleIdToken.mockResolvedValue('google-id-token')
    clearFirebaseSession.mockResolvedValue(undefined)
})
afterEach(() => vi.restoreAllMocks())

describe('frontend Google session exchange', () => {
    it.each([false, true])('exchanges proof for the requested session action (link=%s)', async (link) => {
        const response = { data: { user: { userUuid: 'wego-user' } } }
        apiJson.mockResolvedValue(response)
        expect(await initiateGoogleLogin({ link })).toBe(response)
        expect(apiJson).toHaveBeenCalledWith(link ? '/api/auth/google/link' : '/api/auth/google', 'POST', { idToken: 'google-id-token' })
        expect(clearFirebaseSession).toHaveBeenCalledOnce()
    })

    it('cancels without calling the backend or leaving a Firebase session', async () => {
        getGoogleIdToken.mockResolvedValue(null)
        expect(await initiateGoogleLogin()).toBeNull()
        expect(apiJson).not.toHaveBeenCalled()
        expect(clearFirebaseSession).toHaveBeenCalledOnce()
    })

    it('clears Firebase state and preserves account-linking errors from the backend', async () => {
        const conflict = Object.assign(new Error('Link your existing account'), { status: 409 })
        apiJson.mockRejectedValue(conflict)
        await expect(initiateGoogleLogin()).rejects.toBe(conflict)
        expect(clearFirebaseSession).toHaveBeenCalledOnce()
    })

    it('clears Firebase state when the popup fails', async () => {
        getGoogleIdToken.mockRejectedValue(new Error('Popup blocked'))
        await expect(initiateGoogleLogin()).rejects.toThrow('Google sign-in did not finish')
        expect(apiJson).not.toHaveBeenCalled()
        expect(clearFirebaseSession).toHaveBeenCalledOnce()
    })

    it('signs out of the WeGo session and clears any Firebase state', async () => {
        await signOut()
        expect(apiJson).toHaveBeenCalledWith('/api/auth/logout', 'POST', {})
        expect(clearFirebaseSession).toHaveBeenCalledOnce()
    })

    it('keeps cancellation quiet even if Firebase cleanup also fails', async () => {
        getGoogleIdToken.mockRejectedValue({ code: 'auth/user-cancelled', message: 'Firebase: cancelled' })
        clearFirebaseSession.mockRejectedValue(new Error('Firebase: cleanup error'))
        expect(await initiateGoogleLogin()).toBeNull()
        expect(apiJson).not.toHaveBeenCalled()
    })

    it('does not turn a successful backend login into an error when cleanup fails', async () => {
        const response = { data: { user: { userUuid: 'wego-user' } } }
        apiJson.mockResolvedValue(response)
        clearFirebaseSession.mockRejectedValue(new Error('Firebase: cleanup error'))
        expect(await initiateGoogleLogin()).toBe(response)
    })

    it('disconnects only through the authenticated password-confirmation endpoint', async () => {
        apiJson.mockResolvedValue({ data: { linked: false, canDisconnect: false } })
        expect(await disconnectGoogle('current-password')).toEqual({ linked: false, canDisconnect: false })
        expect(apiJson).toHaveBeenCalledWith('/api/auth/google', 'DELETE', { password: 'current-password' })
        expect(getGoogleIdToken).not.toHaveBeenCalled()
    })
})
