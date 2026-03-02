export function createThreadRepo(db){
    return {
        findAll,
        findByThreadId,
        findByUserId,
        insertThread,
        updateByThreadId,
        deleteByThreadId
    }
    async function findAll() {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                WHEN u.deleted_at IS NULL THEN u.user_id
                ELSE NULL
              END AS user_id,
              CASE
                WHEN u.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                ELSE '[deleted]'
              END AS user_uuid,
              CASE
                WHEN u.deleted_at IS NULL THEN u.username
                ELSE '[deleted]'
              END AS username,
              CASE
                WHEN u.deleted_at IS NULL THEN u.display_name
                ELSE '[deleted]'
              END AS display_name
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
            `
        )
        return row
    }
    async function findByThreadId(threadId) {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                WHEN u.deleted_at IS NULL THEN u.user_id
                ELSE NULL
              END AS user_id,
              CASE
                WHEN u.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                ELSE '[deleted]'
              END AS user_uuid,
              CASE
                WHEN u.deleted_at IS NULL THEN u.username
                ELSE '[deleted]'
              END AS username,
              CASE
                WHEN u.deleted_at IS NULL THEN u.display_name
                ELSE '[deleted]'
              END AS display_name
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
            WHERE
              t.thread_id = ?`,
            [threadId]
        )
        return row[0] || null
    }

    async function findByUserId(userId) {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                WHEN u.deleted_at IS NULL THEN u.user_id
                ELSE NULL
              END AS user_id,
              CASE
                WHEN u.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                ELSE '[deleted]'
              END AS user_uuid,
              CASE
                WHEN u.deleted_at IS NULL THEN u.username
                ELSE '[deleted]'
              END AS username,
              CASE
                WHEN u.deleted_at IS NULL THEN u.display_name
                ELSE '[deleted]'
              END AS display_name
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
            WHERE
              t.userId = ?`
            [userId]
        )
        return row
    }

    async function insertThread({ userId, threadUuid, title, content }) {
        const [result] = await db.query(
            'INSERT into threads (user_id, thread_uuid, title, content) VALUES (?,?,  ?, ?)',
            [userId, threadUuid, title, content]
        )

        return result.insertId
    }

    async function updateByThreadId(threadId, sqlQuery, dataList) {
        dataList.push(threadId)
        const [result] = await db.query(
            sqlQuery + 'where thread_id = ? and deleted_at is NULL',
            dataList
        )
        return result
    }

    async function deleteByThreadId(threadId) {
        const [result] = await db.query(
            "Update threads set deleted_at = NOW() , title = '[Deleted]', content = '[Deleted]', status = 'delete' where thread_id = ? ",
            [threadId]
        )
        return result
    }
}