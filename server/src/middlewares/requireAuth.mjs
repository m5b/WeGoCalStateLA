import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

const JWT_SECRET = process.env.JWT_SECRET || 'hello'
const JWT_ISSUER = process.env.JWT_ISSUER || 'wegoapp'

export function requireAuth(userService) {
    return async function (req, res, next) {
        const token = req.cookies?.auth_tx
        if (!token) {
            throw new UnauthorizedError(
                { auth: 'Not authorized' },
                'You are not authorized, please try again'
            )
        }
        let payload
        try {
            payload = jwt.verify(token, JWT_SECRET, {
                issuer: JWT_ISSUER,
                audience: 'access',
            })
        } catch (err) {
            throw new UnauthorizedError(
                { auth: 'Not authorized' },
                'You are not authorized, please try again'
            )
        }
        req.user = await userService.getByUserUuid(payload.sub)
        return next()
    }
}