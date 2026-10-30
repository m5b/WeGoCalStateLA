import { ForbiddenError } from '../errors/forbiddenError.mjs'

const sameUser = (a, b) => String(a).toLowerCase() === String(b).toLowerCase()

// An admin can't delete their own account from the admin page, so the site is never left
// with nobody able to manage it. (Another admin can still do it.)
export function assertNotDeletingSelf(admin, targetUserUuid) {
    if (sameUser(admin.userUuid, targetUserUuid)) {
        throw new ForbiddenError(
            { auth: 'Cannot delete your own account' },
            "You can't delete your own account here. Ask another admin."
        )
    }
}

// Same idea for switching off your own admin access.
export function assertNotDemotingSelf(admin, targetUserUuid, payload) {
    if (sameUser(admin.userUuid, targetUserUuid) && payload.isAdmin === false) {
        throw new ForbiddenError(
            { auth: 'Cannot remove your own admin access' },
            "You can't remove your own admin access. Ask another admin."
        )
    }
}