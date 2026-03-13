import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import { getCurrentUser } from '../services/userService.mjs'

export function requireCookie(cookieName, verifyFn, option = {}) {
    //default for option
    const {
        signed = false,
        attachTo = cookieName,
        clearCookie = false,
    } = option
    return async function (req, res, next) {
        //retrieve the cookies
        const cookies = signed ? req.signedCookies : req.cookies
        const token = cookies[cookieName]
        const result = await verifyFn(token)
        if (clearCookie) {
            res.clearCookie(cookieName)
        }
        req[attachTo] = result
        next()
    }
}

export const requireJWTAuth = requireCookie(
    'auth_token',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError({ auth: err.message })
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError({ auth: 'Invalid JWT token' })
        }
        const user = await getCurrentUser(sub)
        if (!user) {
            throw new UnauthorizedError({ auth: 'User not found' })
        }
        return user
    },
    { signed: false, attachTo: 'user' }
)



export const requireOIDCId = requireCookie(
    'oidc_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt_format' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'oidc', clearCookie: true }
)

export const requireOTPId = requireCookie(
    'opt_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt_format' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'otpId', clearCookie: true }
)


export const requireVerifiedId = requireCookie(
    'verified_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt_format' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'verifiedId', clearCookie: true }
)


