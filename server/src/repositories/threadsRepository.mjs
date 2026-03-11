export function createThreadRepo(db){
    return {
        findAll,
        findByThreadId,
        findByThreadUuid,
        findByUserId,
        findByUserUuid,
        insertThread,
        updateByThreadId,
        updateByThreadUuid,
        deleteByThreadId,
        deleteByThreadUuid
    }
    function getPublicSelect(){
        return`
            SELECT
                t.thread_id AS thread_id,
                BIN_TO_UUID(t.thread_uuid) AS thread_uuid,
                t.created_at AS created_at,
                t.updated_at AS updated_at,
                t.deleted_at AS deleted_at,
                t.status AS status,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND t.deleted_at IS NULL THEN u.user_id
                    ELSE NULL
                    END AS user_id,
                CASE
                    WHEN t.deleted_at IS NULL THEN t.title
                    ELSE '[deleted]'
                    END AS title,
                CASE
                    WHEN t.deleted_at IS NULL THEN t.content
                    ELSE '[deleted]'
                    END AS content,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                    ELSE '[deleted]'
                    END AS user_uuid,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND t.deleted_at IS NULL THEN u.username
                    ELSE '[deleted]'
                    END AS username,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND t.deleted_at IS NULL THEN u.display_name
                    ELSE '[deleted]'
                    END AS display_name
            FROM
                threads t
                    JOIN users u ON t.user_id = u.user_id
        `
    }
    async function findAll() {
        const [row] = await db.query(
            getPublicSelect()
        )
        return row
    }
    async function findByThreadId(threadId) {
        const [row] = await db.query(
            getPublicSelect() +
            `
            WHERE
              t.thread_id = ?
            `,
            [threadId]
        )
        return row[0] || null
    }

    async function findByThreadUuid(threadUuid){
        const [row] = await db.query(
            getPublicSelect() +
            `
            WHERE
              t.thread_uuid = UUID_TO_BIN(?)`,
            [threadUuid]
        )
        return row[0] || null
    }

    async function findByUserId(userId) {
        const [row] = await db.query(
            getPublicSelect() +
            `
            WHERE
                t.user_id = ?`,
            [userId]
        )
        return row
    }
    async function findByUserUuid(userUuid) {
        const [row] = await db.query(
            getPublicSelect() +
            `
            WHERE 
                u.user_uuid = UUID_TO_BIN(?)`,
                [userUuid]
        )
        return row
    }

    async function insertThread({ userId, threadUuid, title, content }) {
        const [result] = await db.query(
            'INSERT into threads (user_id, thread_uuid, title, content) VALUES (?,UUID_TO_BIN(?), ?, ?)',
            [userId, threadUuid, title, content]
        )

        return result.insertId
    }

    async function updateByThreadId({threadId, userId, sqlQuery, dataList}) {
        dataList.push(threadId)
        dataList.push(userId)
        const [result] = await db.query(
            sqlQuery + ' where thread_id = ? and user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    async function updateByThreadUuid({threadUuid, userId, sqlQuery, dataList}) {
        dataList.push(threadUuid)
        dataList.push(userId)
        const [result] = await db.query(
            sqlQuery + ' where thread_uuid = UUID_TO_BIN(?) and user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}

    }


    async function deleteByThreadId({threadId, userId}) {
        const [result] = await db.query(
            "Update threads set deleted_at = NOW() , title = null , content = null, status = 'delete' where thread_id = ? AND user_id = ? AND deleted_at IS NULL",
            [threadId, userId]
        )
        return result.affectedRows > 0
    }

    async function deleteByThreadUuid({threadUuid, userId}) {
        const [result] = await db.query(
            "Update threads set deleted_at = NOW() , title = null , content = null, status = 'delete' where thread_uuid = UUID_TO_BIN(?) AND user_id = ? AND deleted_at IS NULL",
            [threadUuid, userId]
        )
        return result.affectedRows > 0
    }
}