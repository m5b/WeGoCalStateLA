import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { Configuration } from 'openid-client'
import { createOIDCService } from '../../src/services/auth/oidc/oidcService.mjs'
import { createGoogleAuthService } from '../../src/services/auth/oidc/googleAuthServices.mjs'
import { createGoogleAuthRouter } from '../../src/routes/auth/googleAuth.mjs'
import errorHandler from '../../src/middlewares/errorHandler.mjs'

const discovery = vi.hoisted(() => vi.fn())
vi.mock('openid-client', async (importOriginal) => ({
    ...await importOriginal(),
    discovery,
}))

beforeEach(() => {
    vi.resetModules()
    discovery.mockReset()
    vi.stubEnv('GOOGLE_CLIENT_ID', '')
    vi.stubEnv('GOOGLE_CLIENT_SECRET', '')
    vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
})

describe('optional legacy Google OAuth', () => {
    it.each([
        ['', ''],
        ['client-id', ''],
        ['', 'client-secret'],
        ['   ', 'client-secret'],
    ])('imports without discovery when credentials are incomplete (%j, %j)', async (id, secret) => {
        vi.stubEnv('GOOGLE_CLIENT_ID', id)
        vi.stubEnv('GOOGLE_CLIENT_SECRET', secret)
        const { openIdClient } = await import('../../src/lib/openIdClient.mjs')
        expect(openIdClient.googleClient).toBeNull()
        expect(discovery).not.toHaveBeenCalled()
    })

    it('returns 503 without creating a signup session when Google is unconfigured', async () => {
        const { openIdClient } = await import('../../src/lib/openIdClient.mjs')
        const oidcStore = { save: vi.fn(), consume: vi.fn() }
        const oidcService = createOIDCService({ oidcStore, openIdClient: openIdClient.googleClient })
        const app = express()
        app.use('/api/auth', createGoogleAuthRouter({
            googleAuthService: createGoogleAuthService(oidcService),
        }))
        app.use(errorHandler)

        const res = await request(app).get('/api/auth/google')
        expect(res.status).toBe(503)
        expect(res.body.message).toBe('Google sign-in is not configured on this server.')
        expect(res.headers['set-cookie']).toBeUndefined()
        expect(oidcStore.save).not.toHaveBeenCalled()
        await expect(oidcService.completeOIDCSignup('transaction', new URL('https://example.test')))
            .rejects.toMatchObject({ statusCode: 503 })
        expect(oidcStore.consume).not.toHaveBeenCalled()
    })

    it('preserves the Google authorization redirect when credentials are configured', async () => {
        vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id')
        vi.stubEnv('GOOGLE_CLIENT_SECRET', 'client-secret')
        vi.stubEnv('SERVER_URL', 'http://localhost:3000/api')
        vi.stubEnv('GOOGLE_CALLBACK_URL', '/auth/google/callback')
        const configuration = new Configuration({
            issuer: 'https://accounts.google.com',
            authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        }, 'client-id', 'client-secret')
        discovery.mockResolvedValue(configuration)
        const { openIdClient } = await import('../../src/lib/openIdClient.mjs')
        const { openIdConfig } = await import('../../src/config/openIdConfig.mjs')
        const save = vi.fn().mockResolvedValue(undefined)
        const oidcService = createOIDCService({
            oidcStore: { save },
            jwtTokenService: { issueOIDCToken: () => 'test-transaction-token' },
            openIdClient: openIdClient.googleClient,
            openIdConfig,
            provider: 'google',
        })
        const { redirectURL } = await oidcService.startOIDCSignup()
        expect(discovery).toHaveBeenCalledWith(new URL('https://accounts.google.com'), 'client-id', 'client-secret')
        expect(redirectURL.origin).toBe('https://accounts.google.com')
        expect(redirectURL.searchParams.get('client_id')).toBe('client-id')
        expect(redirectURL.searchParams.get('redirect_uri')).toBe('http://localhost:3000/api/auth/google/callback')
        expect(redirectURL.searchParams.get('code_challenge_method')).toBe('S256')
        expect(save).toHaveBeenCalledOnce()
    })
})
