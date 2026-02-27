export async function createUserRepo(db){
    return {
        findByUserId,
        findByEmailHash,
        findByUsername,
        updateByUserId,
        deleteByUserId,
        deleteByEmailHash,
        insertUser,
    }

    async function findByUserId(userId) {
        const [row] = await db.query(
            'select user_id, email_hash, username, display_name, created_at, updated_at from users where user_id = ? and deleted_at is NULL ',
            [userId]
        )
        return row[0] || null
    }

    async function findByEmailHash(emailHash) {
        const [row] = await db.query(
            'select user_id, email_hash, username, display_name, created_at, updated_at from users where email_hash = ? and deleted_at is NULL',
            [emailHash]
        )

        return row[0] || null
    }

    async function findByUsername(username) {
        const [row] = await db.query(
            'select user_id, email_hash, username, display_name, created_at, updated_at from users where username = ? and deleted_at is NULL',
            [username]
        )

        return row[0] || null
    }

    async function updateByUserId(userId, sqlQuery, dataList) {
        dataList.push(userId)
        const [result] = await db.query(
            sqlQuery + 'where user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}

    }

    //soft delete
    async function deleteByUserId(userId) {
        const [result] = await db.query(
            'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL  where user_id = ? ',
            [userId]
        )
        return result
    }

    async function deleteByEmailHash(emailHash) {
        const [result] = await db.query(
            'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL where email_hash= ? ',
            [emailHash]
        )
        return result.affectedRows > 0
    }

    async function insertUser({ emailHash, username, passwordHash }) {
        const [result] = await db.query(
            'INSERT INTO users (email_hash, username, display_name, password_hash) VALUES (?, ?, ?, ?)',
            [emailHash, username, username, passwordHash]
        )
        return result.insertId
    }
}




