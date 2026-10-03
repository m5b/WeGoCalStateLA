import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import pool from '../src/lib/pool.mjs'

const username = process.env.ADMIN_USERNAME || 'admin'
const password = process.env.ADMIN_PASSWORD

async function main() {
    if (!password) {
        console.error('ADMIN_PASSWORD environment variable is required. Aborting -- nothing was changed.')
        process.exitCode = 1
        return
    }
    if (password.length < 8) {
        console.error('ADMIN_PASSWORD must be at least 8 characters. Aborting -- nothing was changed.')
        process.exitCode = 1
        return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const [existingRows] = await pool.execute(
        'select user_id from users where username = ? and deleted_at is NULL',
        [username]
    )

    if (existingRows.length > 0) {
        await pool.execute(
            'update users set password_hash = ?, is_admin = 1 where username = ?',
            [passwordHash, username]
        )
        console.log(`Updated existing user "${username}": password reset, is_admin set to 1.`)
    } else {
        const userUuid = randomUUID()
        await pool.execute(
            'INSERT INTO users (username, email_hash, password_hash, is_admin, user_uuid, created_at, updated_at) VALUES (?, NULL, ?, 1, UUID_TO_BIN(?), NOW(), NOW())',
            [username, passwordHash, userUuid]
        )
        console.log(`Created new admin user "${username}".`)
    }
}

main()
    .catch((err) => {
        console.error('Failed to seed admin user:', err)
        process.exitCode = 1
    })
    .finally(() => pool.end())