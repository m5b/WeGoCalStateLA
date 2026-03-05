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
    async function findAll() {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              BIN_TO_UUID(t.thread_uuid) as thread_uuid,
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
              BIN_TO_UUID(t.thread_uuid) AS thread_uuid,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.user_id
                  ELSE NULL
                  END AS user_id,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                  ELSE '[deleted]'
                  END AS user_uuid,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.username
                  ELSE '[deleted]'
                  END AS username,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.display_name
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

    async function findByThreadUuid(threadUuid){
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              BIN_TO_UUID(t.thread_uuid) as thread_uuid,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.user_id
                  ELSE NULL
                  END AS user_id,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                  ELSE '[deleted]'
                  END AS user_uuid,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.username
                  ELSE '[deleted]'
                  END AS username,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.display_name
                  ELSE '[deleted]'
                  END AS display_name 
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
            WHERE
              t.thread_uuid = UUID_TO_BIN(?)`,
            [threadUuid]
        )
        return row[0] || null
    }

    async function findByUserId(userId) {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              BIN_TO_UUID(t.thread_uuid) as thread_uuid,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.user_id
                ELSE NULL
              END AS user_id,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                ELSE '[deleted]'
              END AS user_uuid,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.username
                ELSE '[deleted]'
              END AS username,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.display_name
                ELSE '[deleted]'
              END AS display_name
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
            WHERE
              t.user_id = ?`,
            [userId]
        )
        return row
    }
    async function findByUserUuid(userUuid) {
        const [row] = await db.query(
            `SELECT
              t.thread_id AS thread_id,
              BIN_TO_UUID(t.thread_uuid) as thread_uuid,
              t.title AS title,
              t.content AS content,
              t.created_at AS created_at,
              t.updated_at AS updated_at,
              t.deleted_at AS deleted_at,
              t.status AS status,
              CASE
                WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.user_id
                ELSE NULL
              END AS user_id,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                ELSE '[deleted]'
              END AS user_uuid,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.username
                ELSE '[deleted]'
              END AS username,
              CASE
                  WHEN u.deleted_at IS NULL AND t.deleted_at IS NULL THEN u.display_name
                ELSE '[deleted]'
              END AS display_name
            FROM
              threads t
              JOIN users u ON t.user_id = u.user_id
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

    async function updateByThreadId(threadId, sqlQuery, dataList) {
        dataList.push(threadId)
        const [result] = await db.query(
            sqlQuery + 'where thread_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    async function updateByThreadUuid(threadUuid, sqlQuery, dataList) {
        dataList.push(threadUuid)
        const [result] = await db.query(
            sqlQuery + 'where thread_uuid = UUID_TO_BIN(?) and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}

    }


    async function deleteByThreadId(threadId) {
        const [result] = await db.query(
            "Update threads set deleted_at = NOW() , title = '[Deleted]', content = '[Deleted]', status = 'delete' where thread_id = ? ",
            [threadId]
        )
        return result.affectedRows > 0
    }

    async function deleteByThreadUuid(threadUuid) {
        const [result] = await db.query(
            "Update threads set deleted_at = NOW() , title = '[Deleted]', content = '[Deleted]', status = 'delete' where thread_uuid = UUID_TO_BIN(?) ",
            [threadUuid]
        )
        return result.affectedRows > 0
    }
}