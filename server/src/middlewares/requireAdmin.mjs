import { ForbiddenError } from '../errors/forbiddenError.mjs'

export function requireAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        throw new ForbiddenError(
            { auth: 'Admin access required' },
            'You do not have permission to do that.'
        )
    }
    next()
}