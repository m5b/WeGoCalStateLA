import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFirebaseGoogleService } from '../../src/services/auth/firebaseGoogleService.mjs'

let claims, auth, identityRepo, voprfService, service
beforeEach(() => {
    claims = { uid: 'google-user', email: 'Person@Example.test', email_verified: true,
        auth_time: Math.floor(Date.now() / 1000), firebase: { sign_in_provider: 'google.com' } }
    auth = { app: { options: { projectId: 'wego-test' } }, verifyIdToken: vi.fn().mockImplementation(async () => claims) }
    identityRepo = { resolveIdentity: vi.fn().mockResolvedValue('wego-user-uuid'), isLinked: vi.fn() }
    voprfService = { handleServerVOPRF: vi.fn().mockResolvedValue('private-email-hash') }
    service = createFirebaseGoogleService({ identityRepo, voprfService, getAuth: () => auth })
})

describe('Firebase Google proof verification', () => {
    it('verifies revocation and maps a Google identity without trusting client user IDs', async () => {
        expect(await service.authenticate('signed-id-token')).toBe('wego-user-uuid')
        expect(auth.verifyIdToken).toHaveBeenCalledWith('signed-id-token', true)
        expect(voprfService.handleServerVOPRF).toHaveBeenCalledWith('person@example.test')
        expect(identityRepo.resolveIdentity).toHaveBeenCalledWith({
            projectId: 'wego-test', uid: 'google-user', emailHash: 'private-email-hash', linkToUserUuid: null,
        })
    })

    it.each([
        { firebase: { sign_in_provider: 'password' } },
        { email_verified: false }, { email: null }, { uid: '' },
        { auth_time: 0 }, { auth_time: Math.floor(Date.now() / 1000) + 300 },
    ])('rejects unverified, non-Google or stale claims: %j', async (changes) => {
        Object.assign(claims, changes)
        await expect(service.authenticate('token')).rejects.toMatchObject({ statusCode: 401 })
        expect(identityRepo.resolveIdentity).not.toHaveBeenCalled()
        expect(voprfService.handleServerVOPRF).not.toHaveBeenCalled()
    })

    it.each(['auth/invalid-id-token', 'auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled'])
    ('rejects %s without writing an identity', async (code) => {
        auth.verifyIdToken.mockRejectedValue({ code })
        await expect(service.authenticate('bad-token')).rejects.toMatchObject({ statusCode: 401 })
        expect(identityRepo.resolveIdentity).not.toHaveBeenCalled()
    })

    it('reports unavailable configuration and Firebase outages without leaking credential errors', async () => {
        const unconfigured = createFirebaseGoogleService({ identityRepo, voprfService, getAuth: () => { throw new Error('private configuration') } })
        await expect(unconfigured.authenticate('token')).rejects.toMatchObject({ statusCode: 503 })
        auth.verifyIdToken.mockRejectedValue(new Error('upstream details'))
        await expect(service.authenticate('token')).rejects.toMatchObject({ statusCode: 503 })
        expect(identityRepo.resolveIdentity).not.toHaveBeenCalled()
    })

    it('passes only the authenticated account as an explicit link target', async () => {
        await service.authenticate('token', 'existing-wego-user')
        expect(identityRepo.resolveIdentity).toHaveBeenCalledWith(expect.objectContaining({ linkToUserUuid: 'existing-wego-user' }))
    })
})

describe('disconnecting Google', () => {
    it('requires a verified WeGo password and preserves the connection on failure', async () => {
        const repo = { getPasswordHash: vi.fn().mockResolvedValue('stored-hash'), disconnect: vi.fn().mockResolvedValue(true) }
        const passwordService = { comparePassword: vi.fn().mockResolvedValue(false) }
        const google = createFirebaseGoogleService({ identityRepo: repo, passwordService })
        await expect(google.disconnect('current-user', 'wrong-password')).rejects.toMatchObject({ statusCode: 401 })
        expect(repo.disconnect).not.toHaveBeenCalled()
        passwordService.comparePassword.mockResolvedValue(true)
        expect(await google.disconnect('current-user', 'correct-password')).toEqual({ linked: false, canDisconnect: false })
        expect(repo.disconnect).toHaveBeenCalledWith('current-user', 'stored-hash')
    })

    it('does not remove the only login method or ignore a concurrent account change', async () => {
        const repo = { getPasswordHash: vi.fn().mockResolvedValue(null), disconnect: vi.fn() }
        const passwordService = { comparePassword: vi.fn().mockResolvedValue(true) }
        const google = createFirebaseGoogleService({ identityRepo: repo, passwordService })
        await expect(google.disconnect('google-only-user', 'password')).rejects.toMatchObject({ statusCode: 409 })
        expect(repo.disconnect).not.toHaveBeenCalled()
        repo.getPasswordHash.mockResolvedValue('stored-hash')
        repo.disconnect.mockResolvedValue(false)
        await expect(google.disconnect('current-user', 'password')).rejects.toMatchObject({ statusCode: 409 })
    })
})
