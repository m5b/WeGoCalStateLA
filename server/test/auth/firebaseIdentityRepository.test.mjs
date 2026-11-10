import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import mysql from 'mysql2/promise'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createFirebaseIdentityRepo } from '../../src/repositories/firebaseIdentityRepository.mjs'

// Creates and drops only its own isolated schema; never resets the application DB.
describe.runIf(process.env.MYSQL_AUTH_TESTS === '1')('Firebase identity transactions (MySQL)', () => {
    const database = 'wego_auth_test_' + randomUUID().replaceAll('-', '')
    const connection = { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD }
    let admin, pool, repo
    beforeAll(async () => {
        admin = await mysql.createConnection(connection)
        await admin.query(`CREATE DATABASE \`${database}\``)
        pool = mysql.createPool({ ...connection, database, connectionLimit: 8 })
        for (const filename of ['20251014001319_create_users_table.sql', '20260926000000_alter_users_add_credentials.sql',
            '20261110000000_create_firebase_identities.sql']) {
            const sql = (await readFile(new URL('../../db/migrations/' + filename, import.meta.url), 'utf8')).split('-- migrate:down')[0]
            await pool.query(sql)
        }
        repo = createFirebaseIdentityRepo(pool)
    })
    beforeEach(async () => {
        await pool.query('DELETE FROM firebase_identities')
        await pool.query('DELETE FROM users')
    })
    afterAll(async () => {
        if (pool) await pool.end()
        if (admin) {
            await admin.query(`DROP DATABASE \`${database}\``)
            await admin.end()
        }
    })

    const proof = (overrides = {}) => ({ projectId: 'wego-test', uid: 'google-uid', emailHash: 'email-hash', ...overrides })
    async function existingUser(emailHash = 'email-hash') {
        const userUuid = randomUUID()
        await pool.execute(`INSERT INTO users (user_uuid, username, email_hash, password_hash, created_at, updated_at)
            VALUES (UUID_TO_BIN(?), ?, ?, 'existing-password-hash', NOW(), NOW())`, [userUuid, 'member_' + userUuid, emailHash])
        return userUuid
    }
    async function count(table) {
        const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${table}`)
        return Number(rows[0].total)
    }

    it('creates one pseudonymous non-admin user and reuses it on later sign-ins', async () => {
        const uuid = await repo.resolveIdentity(proof())
        expect(await repo.resolveIdentity(proof())).toBe(uuid)
        expect(await repo.getConnection(uuid)).toEqual({ linked: true, canDisconnect: false })
        expect(await count('users')).toBe(1)
        const [users] = await pool.query('SELECT username, password_hash, is_admin, email_hash FROM users')
        expect(users[0]).toMatchObject({ password_hash: null, is_admin: 0, email_hash: 'email-hash' })
        expect(users[0].username).toMatch(/^member_[a-f0-9]{16}$/)
    })

    it('requires explicit linking instead of taking over an existing email/password account', async () => {
        const uuid = await existingUser()
        await expect(repo.resolveIdentity(proof())).rejects.toMatchObject({ statusCode: 409, data: { linkRequired: true } })
        expect(await count('firebase_identities')).toBe(0)
        expect(await count('users')).toBe(1)
        expect(await repo.resolveIdentity(proof({ linkToUserUuid: uuid }))).toBe(uuid)
        const [users] = await pool.query('SELECT password_hash FROM users')
        expect(users[0].password_hash).toBe('existing-password-hash')
    })

    it('can explicitly connect a username-only account while reserving its verified email', async () => {
        const uuid = await existingUser(null)
        expect(await repo.resolveIdentity(proof({ linkToUserUuid: uuid }))).toBe(uuid)
        const [users] = await pool.query('SELECT email_hash FROM users')
        expect(users[0].email_hash).toBe('email-hash')
    })

    it('does not move identities between accounts or replace an existing connection', async () => {
        const first = await repo.resolveIdentity(proof())
        const second = await existingUser('other-email-hash')
        await expect(repo.resolveIdentity(proof({ linkToUserUuid: second }))).rejects.toMatchObject({ statusCode: 409 })
        await expect(repo.resolveIdentity(proof({ uid: 'another-google-uid', linkToUserUuid: first })))
            .rejects.toMatchObject({ statusCode: 409 })
        expect(await count('firebase_identities')).toBe(1)
    })

    it('rejects mismatched existing email addresses and soft-deleted identities', async () => {
        const uuid = await existingUser('different-email')
        await expect(repo.resolveIdentity(proof({ linkToUserUuid: uuid }))).rejects.toMatchObject({ statusCode: 409 })
        const googleUuid = await repo.resolveIdentity(proof())
        await pool.execute('UPDATE users SET deleted_at = NOW() WHERE user_uuid = UUID_TO_BIN(?)', [googleUuid])
        await expect(repo.resolveIdentity(proof())).rejects.toMatchObject({ statusCode: 401 })
        expect(await repo.getConnection(googleUuid)).toEqual({ linked: false, canDisconnect: false })
    })

    it('keeps Firebase projects separate and never links them by email automatically', async () => {
        const first = await repo.resolveIdentity(proof())
        const second = await repo.resolveIdentity(proof({ projectId: 'another-project', emailHash: 'other-email' }))
        expect(second).not.toBe(first)
        expect(await count('firebase_identities')).toBe(2)
    })

    it('rolls back races so concurrent sign-ins never create orphan or duplicate accounts', async () => {
        const results = await Promise.all([repo.resolveIdentity(proof()), repo.resolveIdentity(proof())])
        expect(results[0]).toBe(results[1])
        expect(await count('users')).toBe(1)
        expect(await count('firebase_identities')).toBe(1)
    })

    it('disconnects a password account without deleting its profile or password', async () => {
        const uuid = await existingUser()
        await repo.resolveIdentity(proof({ linkToUserUuid: uuid }))
        expect(await repo.getConnection(uuid)).toEqual({ linked: true, canDisconnect: true })
        expect(await repo.getPasswordHash(uuid)).toBe('existing-password-hash')
        expect(await repo.disconnect(uuid, 'stale-password-hash')).toBe(false)
        expect(await count('firebase_identities')).toBe(1)
        expect(await repo.disconnect(uuid, 'existing-password-hash')).toBe(true)
        expect(await repo.getConnection(uuid)).toEqual({ linked: false, canDisconnect: false })
        expect(await count('users')).toBe(1)
        expect(await repo.getPasswordHash(uuid)).toBe('existing-password-hash')
        await expect(repo.resolveIdentity(proof())).rejects.toMatchObject({ statusCode: 409 })
    })

    it('does not disconnect a Google-only account even when called directly', async () => {
        const uuid = await repo.resolveIdentity(proof())
        expect(await repo.getPasswordHash(uuid)).toBeNull()
        expect(await repo.disconnect(uuid, null)).toBe(false)
        expect(await count('firebase_identities')).toBe(1)
    })
})
