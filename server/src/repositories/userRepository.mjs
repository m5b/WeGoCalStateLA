export function createUserRepo(db){
    return {
        findByUserId,
        findByEmailHash,
        findByUsername,
        findByUuid,
        updateByUserId,
        updateByUserUuid,
        deleteByUserId,
        deleteByEmailHash,
        deleteByUserUuid,
        insertUser,
        getCount,
    }
    async function getCount(){
        const [row] = await db.query(
            'select COUNT(*) as cnt from users where deleted_at is NULL'
        )
        return row[0].cnt
    }
    async function findByUserId(userId) {
        const [row] = await db.query(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  email_hash, username, display_name, created_at, updated_at from users where user_id = ? and deleted_at is NULL ',
            [userId]
        )
        return row[0] || null
    }

    async function findByUuid(userUuid){
        const [row] = await db.query(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, email_hash, username, display_name, created_at, updated_at from users where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL ',
            [userUuid]
        )
        return row[0] || null
    }

    async function findByEmailHash(emailHash) {
        const [row] = await db.query(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, email_hash, username, display_name, created_at, updated_at from users where email_hash = ? and deleted_at is NULL',
            [emailHash]
        )

        return row[0] || null
    }

    async function findByUsername(username) {
        const [row] = await db.query(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, email_hash, username, display_name, created_at, updated_at from users where username = ? and deleted_at is NULL',
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

    async function updateByUserUuid(userUuid, sqlQuery, dataList){
        dataList.push(userUuid)
        const [result] = await db.query(
            sqlQuery + 'where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    //soft delete
    async function deleteByUserId(userId) {
        const [result] = await db.query(
            'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL  where user_id = ? AND deleted_at IS NULL',
            [userId]
        )
        return result.affectedRows > 0
    }

    async function deleteByEmailHash(emailHash) {
        const [result] = await db.query(
            'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL where email_hash= ? AND deleted_at IS NULL',
            [emailHash]
        )
        return result.affectedRows > 0
    }

    async function deleteByUserUuid(userUuid) {
        const [result] = await db.query(
            'Update users set deleted_at = NOW() , email_hash = NULL, password_hash = NULL, username = NULL,  display_name = NULL where user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL',
            [userUuid]
        )
        return result.affectedRows > 0
    }

    async function insertUser({ emailHash, username, passwordHash, userUuid}) {
        const [result] = await db.query(
            'INSERT INTO users (email_hash, username, display_name, password_hash, user_uuid) VALUES (?, ?, ?, ?, UUID_TO_BIN(?))',
            [emailHash, username, username, passwordHash, userUuid]
        )
        return result.insertId
    }
}




