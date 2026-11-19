import { Router } from 'express'
import { z } from 'zod'
import { cookieConfig } from '../../config/cookieConfig.mjs'
import { requireAuth } from '../../middlewares/requireAuth.mjs'
import { ForbiddenError } from '../../errors/forbiddenError.mjs'
import { BadRequestError } from '../../errors/badRequestError.mjs'
import UserDto from '../../dtos/userDto.mjs'
import { jsend } from '../../util/jSend.mjs'

const tokenSchema = z.object({ idToken: z.string().min(1).max(10000) }).strict()
const disconnectSchema = z.object({ password: z.string().min(1).max(128) }).strict()

export function createGoogleAuthRouter({ googleAuthService, userService, jwtTokenService, allowedOrigins = [] }) {
    const router = Router()

    function requireTrustedRequest(req, res, next) {
        const origin = req.get('origin')
        const sameOrigin = `${req.protocol}://${req.get('host')}`
        if (origin && origin !== sameOrigin && !allowedOrigins.includes(origin)) {
            throw new ForbiddenError(null, 'This website is not authorized to sign in.')
        }
        if (!req.is('application/json')) throw new BadRequestError(null, 'Send a JSON sign-in request.')
        res.set('Cache-Control', 'no-store')
        next()
    }

    async function exchange(req, res, userUuid = null) {
        const { idToken } = tokenSchema.parse(req.body)
        const uuid = await googleAuthService.authenticate(idToken, userUuid)
        const user = await userService.getByUserUuid(uuid)
        res.cookie('auth_tx', jwtTokenService.issueAccessToken(uuid), cookieConfig)
        res.json(jsend.success({ user: new UserDto(user, { scope: 'public' }) }))
    }

    router.post('/google', requireTrustedRequest, (req, res) => exchange(req, res))
    router.post('/google/link', requireTrustedRequest, requireAuth(userService),
        (req, res) => exchange(req, res, req.user.userUuid))
    router.get('/google', requireAuth(userService), async (req, res) => {
        res.set('Cache-Control', 'no-store')
        res.json(jsend.success(await googleAuthService.getConnection(req.user.userUuid)))
    })
    router.delete('/google', requireTrustedRequest, requireAuth(userService), async (req, res) => {
        const { password } = disconnectSchema.parse(req.body)
        res.json(jsend.success(await googleAuthService.disconnect(req.user.userUuid, password)))
    })
    return router
}
