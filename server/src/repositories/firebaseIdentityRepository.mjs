import { randomUUID } from 'node:crypto'
import { ConflictError } from '../errors/conflictError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

export function createFirebaseIdentityRepo(pool) {
    return { resolveIdentity, getConnection, getPasswordHash, disconnect }

    async function getConnection(userUuid) {
        const [rows] = await pool.execute(
            `SELECT f.user_id IS NOT NULL AS linked, NULLIF(u.password_hash, '') IS NOT NULL AS has_password
             FROM users u LEFT JOIN firebase_identities f ON u.user_id = f.user_id
             WHERE u.user_uuid = UUID_TO_BIN(?) AND u.deleted_at IS NULL`, [userUuid]
        )
        return { linked: Boolean(rows[0]?.linked), canDisconnect: Boolean(rows[0]?.linked && rows[0]?.has_password) }
    }

    async function getPasswordHash(userUuid) {
        const [rows] = await pool.execute(
            'SELECT password_hash FROM users WHERE user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL', [userUuid]
        )
        return rows[0]?.password_hash || null
    }

    async function disconnect(userUuid, passwordHash) {
        // The hash check makes a concurrent password change fail safely.
        const [result] = await pool.execute(
            `DELETE f FROM firebase_identities f JOIN users u ON u.user_id = f.user_id
             WHERE u.user_uuid = UUID_TO_BIN(?) AND u.deleted_at IS NULL
             AND u.password_hash = ? AND NULLIF(u.password_hash, '') IS NOT NULL`, [userUuid, passwordHash]
        )
        return result.affectedRows > 0
    }

    // Account creation and linking commit together; retries handle simultaneous logins.
    async function resolveIdentity({ projectId, uid, emailHash, linkToUserUuid = null }) {
        for (let attempt = 0; attempt < 3; attempt++) {
            const db = await pool.getConnection()
            try {
                await db.beginTransaction()
                const [identities] = await db.execute(
                    `SELECT BIN_TO_UUID(u.user_uuid) AS user_uuid, u.deleted_at
                     FROM firebase_identities f JOIN users u ON u.user_id = f.user_id
                     WHERE f.project_id = ? AND f.firebase_uid = ? FOR UPDATE`, [projectId, uid]
                )
                const identity = identities[0]
                if (identity) {
                    if (identity.deleted_at) throw new UnauthorizedError(null, 'This account is no longer available.')
                    if (linkToUserUuid && identity.user_uuid !== linkToUserUuid) {
                        throw new ConflictError(null, 'This Google account is connected to another WeGo account.')
                    }
                    await db.commit()
                    return identity.user_uuid
                }

                const [owners] = await db.execute(
                    'SELECT BIN_TO_UUID(user_uuid) AS user_uuid FROM users WHERE email_hash = ? FOR UPDATE', [emailHash]
                )
                if (owners[0] && owners[0].user_uuid !== linkToUserUuid) {
                    throw new ConflictError({ linkRequired: true },
                        'Sign in to your existing WeGo account, then connect Google from Your profile.')
                }

                let userId, userUuid
                if (linkToUserUuid) {
                    const [users] = await db.execute(
                        'SELECT user_id, email_hash FROM users WHERE user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL FOR UPDATE',
                        [linkToUserUuid]
                    )
                    const user = users[0]
                    if (!user) throw new UnauthorizedError(null, 'Please sign in again before connecting Google.')
                    if (user.email_hash && user.email_hash !== emailHash) {
                        throw new ConflictError(null, 'Choose the Google account matching your existing WeGo email address.')
                    }
                    const [links] = await db.execute('SELECT 1 FROM firebase_identities WHERE user_id = ? FOR UPDATE', [user.user_id])
                    if (links.length) throw new ConflictError(null, 'Your WeGo account already has a different Google account connected.')
                    await db.execute('UPDATE users SET email_hash = ? WHERE user_id = ? AND email_hash IS NULL', [emailHash, user.user_id])
                    userId = user.user_id
                    userUuid = linkToUserUuid
                } else {
                    userUuid = randomUUID()
                    const username = 'member_' + randomUUID().replaceAll('-', '').slice(0, 16)
                    const [insert] = await db.execute(
                        `INSERT INTO users (user_uuid, username, email_hash, password_hash, is_admin, created_at, updated_at)
                         VALUES (UUID_TO_BIN(?), ?, ?, NULL, 0, NOW(), NOW())`, [userUuid, username, emailHash]
                    )
                    userId = insert.insertId
                }
                await db.execute('INSERT INTO firebase_identities (project_id, firebase_uid, user_id) VALUES (?, ?, ?)',
                    [projectId, uid, userId])
                await db.commit()
                return userUuid
            } catch (error) {
                await db.rollback()
                if (attempt < 2 && ['ER_DUP_ENTRY', 'ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'].includes(error.code)) continue
                if (error.code === 'ER_DUP_ENTRY') throw new ConflictError(null, 'This account is already connected. Please try signing in again.')
                throw error
            } finally {
                db.release()
            }
        }
    }
}
