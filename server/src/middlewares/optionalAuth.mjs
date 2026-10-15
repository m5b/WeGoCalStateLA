import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hello'
const JWT_ISSUER = process.env.JWT_ISSUER || 'wegoapp'

// Like requireAuth, but never blocks the request. If there's a valid
// session it attaches req.user, same as requireAuth; if there's none (or
// it's invalid/expired), it just proceeds with req.user left undefined, so
// the route can fall back to posting anonymously instead of rejecting.
export function optionalAuth(userService) {
    return async function (req, res, next) {
        const token = req.cookies?.auth_tx
        if (!token) return next()
        try {
            const payload = jwt.verify(token, JWT_SECRET, {
                issuer: JWT_ISSUER,
                audience: 'access',
            })
            req.user = await userService.getByUserUuid(payload.sub)
        } catch {
            // Invalid/expired token -- proceed as anonymous rather than block.
        }
        return next()
    }
}