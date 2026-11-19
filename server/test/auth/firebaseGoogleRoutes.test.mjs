import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createGoogleAuthRouter } from '../../src/routes/auth/googleAuth.mjs'
import { createLoginRouter } from '../../src/routes/auth/login.mjs'
import { createJWTTokenService } from '../../src/services/auth/jwt/jwtTokenService.mjs'
import { requireAuth } from '../../src/middlewares/requireAuth.mjs'
import errorHandler from '../../src/middlewares/errorHandler.mjs'
import { UnauthorizedError } from '../../src/errors/unauthorizedError.mjs'
import { ConflictError } from '../../src/errors/conflictError.mjs'

const user = { userUuid: '00000000-0000-4000-8000-000000000001', username: 'community-member', isAdmin: false }
const tokenService = createJWTTokenService()
let app, googleAuthService, userService
beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    googleAuthService = { authenticate: vi.fn().mockResolvedValue(user.userUuid),
        getConnection: vi.fn().mockResolvedValue({ linked: true, canDisconnect: true }),
        disconnect: vi.fn().mockResolvedValue({ linked: false, canDisconnect: false }) }
    userService = { getByUserUuid: vi.fn().mockResolvedValue(user) }
    app = express()
    app.use(express.json(), cookieParser())
    app.use('/api/auth', createGoogleAuthRouter({ googleAuthService, userService, jwtTokenService: tokenService,
        allowedOrigins: ['http://localhost:8081'] }))
    app.use('/api/auth', createLoginRouter({}))
    app.get('/api/user/me', requireAuth(userService), (req, res) => res.json(req.user))
    app.use(errorHandler)
})
afterEach(() => vi.restoreAllMocks())

describe('Google token exchange and WeGo sessions', () => {
    it('issues the existing HTTP-only session, restores it, and clears it on logout', async () => {
        const agent = request.agent(app)
        const res = await agent.post('/api/auth/google').set('Origin', 'http://localhost:8081').send({ idToken: 'google-proof' })
        expect(res.status).toBe(200)
        expect(res.body.data.user.userUuid).toBe(user.userUuid)
        expect(res.headers['cache-control']).toBe('no-store')
        const cookie = res.headers['set-cookie'][0]
        expect(cookie).toContain('HttpOnly')
        expect(cookie).toContain('SameSite=Lax')
        const payload = jwt.verify(cookie.match(/^auth_tx=([^;]+)/)[1], process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER, audience: 'access',
        })
        expect(payload.sub).toBe(user.userUuid)
        await agent.get('/api/user/me').expect(200)
        await agent.post('/api/auth/logout').send({}).expect(200)
        await agent.get('/api/user/me').expect(401)
    })

    it.each([{}, { idToken: '' }, { idToken: 'token', userUuid: 'victim' }, { idToken: 'x'.repeat(10001) }])
    ('rejects malformed or client-supplied identity fields', async (body) => {
        const res = await request(app).post('/api/auth/google').send(body)
        expect(res.status).toBe(400)
        expect(googleAuthService.authenticate).not.toHaveBeenCalled()
        expect(res.headers['set-cookie']).toBeUndefined()
    })

    it('rejects cross-site and form submissions before authentication', async () => {
        await request(app).post('/api/auth/google').set('Origin', 'https://attacker.test').send({ idToken: 'token' }).expect(403)
        await request(app).post('/api/auth/google').type('form').send({ idToken: 'token' }).expect(400)
        expect(googleAuthService.authenticate).not.toHaveBeenCalled()
    })

    it.each([new UnauthorizedError(null, 'Invalid Google proof'), new ConflictError({ linkRequired: true }, 'Link your existing account')])
    ('does not issue a cookie when proof or account resolution fails', async (error) => {
        googleAuthService.authenticate.mockRejectedValue(error)
        const res = await request(app).post('/api/auth/google').send({ idToken: 'token' })
        expect(res.status).toBe(error.statusCode)
        expect(res.headers['set-cookie']).toBeUndefined()
    })

    it('requires a current WeGo session for explicit linking', async () => {
        await request(app).post('/api/auth/google/link').send({ idToken: 'token' }).expect(401)
        expect(googleAuthService.authenticate).not.toHaveBeenCalled()
        const cookie = 'auth_tx=' + tokenService.issueAccessToken(user.userUuid)
        await request(app).post('/api/auth/google/link').set('Cookie', cookie).send({ idToken: 'token' }).expect(200)
        expect(googleAuthService.authenticate).toHaveBeenCalledWith('token', user.userUuid)
        await request(app).get('/api/auth/google').set('Cookie', cookie).expect(200, { status: 'success', data: { linked: true, canDisconnect: true } })
        await request(app).get('/api/auth/google').expect(401)
    })

    it('requires session, trusted origin and password confirmation to disconnect', async () => {
        const cookie = 'auth_tx=' + tokenService.issueAccessToken(user.userUuid)
        await request(app).delete('/api/auth/google').send({ password: 'secret' }).expect(401)
        await request(app).delete('/api/auth/google').set('Cookie', cookie).send({}).expect(400)
        await request(app).delete('/api/auth/google').set('Cookie', cookie).set('Origin', 'https://attacker.test')
            .send({ password: 'secret' }).expect(403)
        expect(googleAuthService.disconnect).not.toHaveBeenCalled()
        await request(app).delete('/api/auth/google').set('Cookie', cookie).send({ password: 'secret' })
            .expect(200, { status: 'success', data: { linked: false, canDisconnect: false } })
        expect(googleAuthService.disconnect).toHaveBeenCalledWith(user.userUuid, 'secret')
    })
})
