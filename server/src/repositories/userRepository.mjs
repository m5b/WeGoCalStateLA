import connectionPool from '../db/pool.mjs'

export async function findByUserID(userId) {
    const [row] = await connectionPool.query(
        'select user_id, email, username, display_name, created_at, updated_at from users where user_id = ? and deleted_at is NULL ',
        [userId]
    )
    return row[0] || null
}

export async function findByEmail(email) {
    const [row] = await connectionPool.query(
        'select user_id, email, username, display_name, created_at, updated_at from users where email = ? and deleted_at is NULL',
        [email]
    )

    return row[0] || null
}

export async function findByGoogleId(googleId) {
    const [row] = await connectionPool.query(
        'select user_id, email, username, display_name, created_at, updated_at from users where google_id = ? and deleted_at is NULL',
        [googleId]
    )

    return row[0] || null
}

export async function findByUsername(username) {
    const [row] = await connectionPool.query(
        'select user_id, email, username, display_name, created_at, updated_at from users where username = ? and deleted_at is NULL',
        [username]
    )

    return row[0] || null
}

export async function updateByUserId(userId, sqlQuery, dataList) {
    dataList.push(userId)
    const [result] = await connectionPool.query(
        sqlQuery + 'where user_id = ? and deleted_at is NULL',
        dataList
    )
    return result
}


