import connectionPool from '../db/pool.mjs'

async function findByUserID(userId) {
    const [row] = await connectionPool.query(
        'select * from users where user_id = ?',
        [userId]
    )
    return row[0] || null
}

async function findByEmail(email) {
    const [row] = await connectionPool.query(
        'select * from users where email = ?',
        [email]
    )

    return row[0] || null
}

async function findByGoogleId(googleId) {
    const [row] = await connectionPool.query(
        'select * from users where google_id = ?',
        [googleId]
    )

    return row[0] || null
}

async function findByUsername(username) {
    const [row] = await connectionPool.query(
        'select * from users where username = ?',
        [username]
    )

    return row[0] || null
}

async function createUser(email, displayName) {
    const [result] = await connectionPool.query(
        'INSERT INTO users (email, display_name) VALUES (?, ?)',
        [email, displayName]
    )
    return result.insertId
}

//google
async function updateUserGoogleId(userId, googleId) {
    const [result] = await connectionPool.query(
        'update users set google_id = ? where user_id = ?',
        [googleId, userId]
    )
    return result
}

async function insertGoogleUser({ username, email, googleId }) {
    const [result] = await connectionPool.query(
        'INSERT INTO users (username, email, display_name, google_id) VALUES (?,?, ?, ?)',
        [username, email, username, googleId]
    )
    return result.insertId
}

export {
    findByEmail,
    findByUserID,
    createUser,
    findByGoogleId,
    updateUserGoogleId,
    insertGoogleUser,
    findByUsername,
}
