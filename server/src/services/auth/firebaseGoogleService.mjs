import { getFirebaseAdminAuth } from '../../lib/firebaseAdmin.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'
import { ConflictError } from '../../errors/conflictError.mjs'

const invalidTokenCodes = new Set([
    'auth/argument-error', 'auth/invalid-argument', 'auth/invalid-id-token',
    'auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled', 'auth/user-not-found',
])

export function createFirebaseGoogleService({ identityRepo, voprfService, passwordService, getAuth = getFirebaseAdminAuth }) {
    return { authenticate, getConnection: identityRepo.getConnection, disconnect }

    async function disconnect(userUuid, password) {
        const passwordHash = await identityRepo.getPasswordHash(userUuid)
        if (!passwordHash) {
            throw new ConflictError(null, 'Google is your only sign-in method. Keep it connected to retain access to this account.')
        }
        if (!await passwordService.comparePassword(password, passwordHash)) {
            throw new UnauthorizedError(null, 'Your WeGo password is incorrect. Google is still connected.')
        }
        if (!await identityRepo.disconnect(userUuid, passwordHash)) {
            throw new ConflictError(null, 'Your Google connection changed. Refresh your profile and try again.')
        }
        return { linked: false, canDisconnect: false }
    }

    async function authenticate(idToken, linkToUserUuid = null) {
        let auth
        try {
            auth = getAuth()
        } catch {
            throw new ServiceUnavailable(null, 'Google sign-in is not configured on this server.')
        }
        let claims
        try {
            // Admin verifies signature, issuer, audience, expiry, revocation and disabled users.
            claims = await auth.verifyIdToken(idToken, true)
        } catch (error) {
            if (invalidTokenCodes.has(error.code)) throw new UnauthorizedError(null, 'Google sign-in expired or is invalid. Please try again.')
            throw new ServiceUnavailable(null, 'Google sign-in is temporarily unavailable. Please try again.')
        }
        const now = Math.floor(Date.now() / 1000)
        if (claims.firebase?.sign_in_provider !== 'google.com' || claims.email_verified !== true ||
            typeof claims.email !== 'string' || !claims.email.includes('@') ||
            typeof claims.uid !== 'string' || !claims.uid || claims.uid.length > 128 ||
            !Number.isFinite(claims.auth_time) || now - claims.auth_time > 300 || claims.auth_time > now + 30) {
            throw new UnauthorizedError(null, 'Choose a verified Google account and sign in again.')
        }
        const emailHash = await voprfService.handleServerVOPRF(claims.email.trim().toLowerCase())
        return identityRepo.resolveIdentity({
            projectId: auth.app.options.projectId,
            uid: claims.uid,
            emailHash,
            linkToUserUuid,
        })
    }
}
