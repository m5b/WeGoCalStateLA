import connectionPool from '../db/pool.mjs'

export async function findAuthUserByEmail(email){
    const[row] = await connectionPool.query(
        'select user_id, password_hash from users where email = ? and deleted_at is NULL',
        [email]
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

export async function insertUser({ email, username, passwordHash }) {
    const [result] = await connectionPool.query(
        'INSERT INTO users (email, username, display_name, password_hash) VALUES (?, ?, ?, ?)',
        [email, username, username, passwordHash]
    )
    return result.insertId
}

//soft delete
export async function deleteUser(userId) {
    const [result] = await connectionPool.query(
        'Update users set deleted_at = NOW() , email = NULL, password_hash = NULL, username = NULL,  display_name = NULL, google_id = NULL where user_id = ? ',
        [userId]
    )
}

//google
export async function updateUserGoogleId({ userId, googleId }) {
    const [result] = await connectionPool.query(
        'update users set google_id = ? where user_id = ? and deleted_at is NULL',
        [googleId, userId]
    )
    return result
}

export async function insertGoogleUser({ username, email, googleId }) {
    const [result] = await connectionPool.query(
        'INSERT INTO users (username, email, display_name, google_id) VALUES (?,?, ?, ?)',
        [username, email, username, googleId]
    )
    return result.insertId
}

