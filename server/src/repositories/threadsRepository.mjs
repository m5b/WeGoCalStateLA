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
        updateAnyByThreadUuid,
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
                t.user_id AS user_id,
                CASE
                    WHEN t.deleted_at IS NULL THEN t.title
                    ELSE NULL
                    END AS title,
                    t.category AS category,
                    -- top-level replies that are still visible, so the feed can show the count without loading them
                (SELECT COUNT(*) FROM comments c
                    WHERE c.thread_id = t.thread_id AND c.parent_comment_id IS NULL
                      AND c.deleted_at IS NULL) AS reply_count,
                CASE
                    WHEN t.deleted_at IS NULL THEN t.content
                    ELSE NULL 
                    END AS content,
                CASE
                    WHEN t.user_id IS NOT NULL AND u.deleted_at IS NULL
                        AND t.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                    ELSE NULL
                    END AS user_uuid,
                CASE
                    WHEN t.deleted_at IS NOT NULL THEN NULL
                    WHEN t.user_id IS NULL THEN 'Anonymous'
                    WHEN u.deleted_at IS NOT NULL THEN NULL
                    ELSE u.username
                    END AS username
            FROM
                threads t
                    LEFT JOIN users u ON t.user_id = u.user_id
        `
    }
    async function findAll() {
        // Deleted threads are left out of the feed entirely -- see
        // deleteByThreadUuid below, which soft-deletes by setting
        // deleted_at rather than removing the row.
        const [row] = await db.query(
            getPublicSelect() + ' WHERE t.deleted_at IS NULL'
        )
        return row
    }
    async function findByThreadId(threadId) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
            WHERE
              t.thread_id = ?
              AND t.deleted_at IS NULL
            `,
            [threadId]
        )
        return row[0] || null
    }

    async function findByThreadUuid(threadUuid){
        const [row] = await db.execute(
            getPublicSelect() +
            `
            WHERE
              t.thread_uuid = UUID_TO_BIN(?)
              AND t.deleted_at IS NULL`,
            [threadUuid]
        )
        return row[0] || null
    }

    async function findByUserId(userId) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
            WHERE
                t.user_id = ? and t.deleted_at IS NULL`,
            [userId]
        )
        return row
    }
    async function findByUserUuid(userUuid) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
            WHERE 
                u.user_uuid = UUID_TO_BIN(?) and t.deleted_at IS NULL`,
                [userUuid]
        )
        return row
    }

    async function insertThread({ userId, threadUuid, title, content, category = 'general' }) {
        const [result] = await db.execute(
            'INSERT into threads (user_id, thread_uuid, title, content, category) VALUES (?,UUID_TO_BIN(?), ?, ?, ?)',
            [userId, threadUuid, title, content, category]
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

    // No user_id check: lets anyone edit any (non-deleted) thread.
    async function updateAnyByThreadUuid({threadUuid, sqlQuery, dataList}) {
        dataList.push(threadUuid)
        const [result] = await db.query(
            sqlQuery + ' where thread_uuid = UUID_TO_BIN(?) and deleted_at is NULL',
            dataList
        )
        return result.affectedRows > 0
    }

    async function deleteByThreadId({threadId, userId}) {
        const [result] = await db.execute(
            "Update threads set deleted_at = NOW() , title = null , content = null, status = 'deleted' where thread_id = ? AND user_id = ? AND deleted_at IS NULL",
            [threadId, userId]
        )
        return result.affectedRows > 0
    }

    async function deleteByThreadUuid({threadUuid, userId}) {
        const [result] = await db.execute(
            "Update threads set deleted_at = NOW() , title = null , content = null, status = 'deleted' where thread_uuid = UUID_TO_BIN(?) AND user_id = ? AND deleted_at IS NULL",
            [threadUuid, userId]
        )
        return result.affectedRows > 0
    }
}