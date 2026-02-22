import connectionPool from '../lib/pool.mjs'

export async function findAuthUserByEmail(emailHash){
    const[row] = await connectionPool.query(
        'select user_id, password_hash from users where email_hash = ? and deleted_at is NULL',
        [emailHash]
    )
    return row[0] || null;
}

export async function findAuthUserByUsername(username){
    const[row] = await connectionPool.query(
        'select user_id, password_hash from users where username = ? and deleted_at is NULL',
        [username]
    )
    return row[0] || null;
}

export async function insertUser({emailHash, username, passwordHash }) {
    const [result] = await connectionPool.query(
        'INSERT INTO users (email_hash, username, display_name, password_hash) VALUES (?, ?, ?, ?)',
        [emailHash, username, username, passwordHash]
    )
    return result.insertId
}

//soft delete
export async function deleteUserByUserId(userId) {
    const [result] = await connectionPool.query(
        'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL  where user_id = ? ',
        [userId]
    )
}

export async function deleteUserByEmailHash(emailHash) {
    const [result] = await connectionPool.query(
        'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL where email_hash= ? ',
        [emailHash]
    )
}

