import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
<<<<<<< HEAD
=======
import { getCurrentUser } from '../services/userService.mjs'
>>>>>>> abcb6e26 (message)

export function requireCookie(cookieName, verifyFn, option = {}) {
    //default for option
    const {
        signed = false,
        attachTo = cookieName,
        clearCookie = false,
    } = option
<<<<<<< HEAD

=======
>>>>>>> abcb6e26 (message)
    return async function (req, res, next) {
        //retrieve the cookies
        const cookies = signed ? req.signedCookies : req.cookies
        const token = cookies[cookieName]
<<<<<<< HEAD
        if(!token){
            throw new UnauthorizedError({ [cookieName]: "cookie does not exist" }, "Cookie does not exist"  )
        }
=======
>>>>>>> abcb6e26 (message)
        const result = await verifyFn(token)
        if (clearCookie) {
            res.clearCookie(cookieName)
        }
        req[attachTo] = result
        next()
    }
}

export const requireJWTAuth = requireCookie(
<<<<<<< HEAD
    'auth_tx',
=======
    'auth_token',
>>>>>>> abcb6e26 (message)
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
<<<<<<< HEAD
            throw new UnauthorizedError({["auth_tx"]: "Invalid Cookie"}, "Session ended")
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError({["auth_tx"]: "Invalid Cookie"}, "Session ended")
        }
        return sub
    },
    { signed: false, attachTo: 'userUuid' }
=======
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
>>>>>>> abcb6e26 (message)
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

<<<<<<< HEAD
export const requireOTPToken = requireCookie(
    'otp_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { ["otp_tx"]: 'Invalid Cookie' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { ["otp_tx"]: 'Invalid Cookie' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'otpToken', clearCookie: false}
)


export const requireSignupToken = requireCookie(
    'signup_tx',
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { ["signup_tx"]: 'Invalid Cookie' },
                'Sign up session expired. Please try again'
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { ["signup_tx"]: 'Invalid Cookie' },
                'Sign up session expired. Please try again'
            )
        }
        return sub
    },
    { signed: false, attachTo: 'signupToken', clearCookie: true }
)

export const requireLoginToken= requireCookie(
    'login_tx',
=======
export const requireOTPId = requireCookie(
    'opt_tx',
>>>>>>> abcb6e26 (message)
    async function (token) {
        //perform jwt check
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt' },
<<<<<<< HEAD
                'Login session expired. Please try again'
=======
                'Sign up session expired. Please try again'
>>>>>>> abcb6e26 (message)
            )
        }
        const { sub } = decoded
        if (!sub) {
            throw new UnauthorizedError(
                { error: 'invalid_jwt_format' },
<<<<<<< HEAD
                'Login session expired. Please try again'
=======
                'Sign up session expired. Please try again'
>>>>>>> abcb6e26 (message)
            )
        }
        return sub
    },
<<<<<<< HEAD
    { signed: false, attachTo: 'loginToken', clearCookie: true }
=======
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
>>>>>>> abcb6e26 (message)
)


