import connectionPool from '../db/pool.mjs'

export async function findByCommentId(commentId) {
    // returns data from given commentID
    // WILL NOT CHECK IF THREAD IS DELETED

    const [row] = await connectionPool.query(
        " SELECT c.comment_id AS comment_id,\n" +
        "       c.content    AS content,\n" +
        "       c.created_at AS created_at,\n" +
        "       c.updated_at AS updated_at,\n" +
        "       c.deleted_at AS deleted_at,\n" +
        "       c.status     AS status,\n" +
        "       c.thread_id  AS thread_id,\n" +
        "       c.parent_id  AS parent_id,\n" +
        "       CASE\n" +
        "              WHEN c.deleted_at IS NULL THEN u.user_id\n" +
        "              ELSE NULL\n" +
        "       END AS user_id,\n" +
        "       CASE\n" +
        "              WHEN c.deleted_at IS NULL THEN u.username\n" +
        "              ELSE NULL\n" +
        "       END AS username\n" +
        "FROM   comments c\n" +
        "JOIN   users u\n" +
        "ON     c.user_id = u.user_id\n" +
        "WHERE  c.comment_id = ?\n",
        [commentId]
    )
    return row[0] || null
}

export async function findByUserId(userId){
    const [row] = await connectionPool.query(
        " SELECT c.comment_id AS comment_id,\n" +
        "       c.parent_id  AS parent_id,\n" +
        "       c.content    AS content,\n" +
        "       c.created_at AS created_at,\n" +
        "       c.updated_at AS updated_at,\n" +
        "       c.status     AS status,\n" +
        "       c.thread_id  AS thread_id,\n" +
        "       c.user_id    AS user_id\n" +
        "FROM   comments c\n" +
        "JOIN   users u\n" +
        "ON     c.user_id = u.user_id\n" +
        "WHERE  c.user_id = ?" +
        " AND c.deleted_at IS NULL\n" +
        "ORDER BY c.created_at DESC",
        [userId]
    )
    return row
}
export async function findByThreadId(threadId) {
    const [row] = await connectionPool.query(
        " SELECT c.comment_id AS comment_id,\n" +
        "       c.content    AS content,\n" +
        "       c.created_at AS created_at,\n" +
        "       c.updated_at AS updated_at,\n" +
        "       c.deleted_at AS deleted_at,\n" +
        "       c.status     AS status,\n" +
        "       c.thread_id  AS thread_id,\n" +
        "       CASE\n" +
        "              WHEN c.deleted_at IS NULL THEN u.user_id\n" +
        "              ELSE NULL\n" +
        "       END AS user_id,\n" +
        "       CASE\n" +
        "              WHEN c.deleted_at IS NULL THEN u.username\n" +
        "              ELSE NULL\n" +
        "       END AS username\n" +
        "FROM   comments c\n" +
        "JOIN   users u\n" +
        "ON     c.user_id = u.user_id\n" +
        "WHERE  c.thread_id = ? ",
        [threadId]
    )
    return row
}

export async function insertComment({userId, threadId, content, parentId}) {
    const [result] = await connectionPool.query(
        'INSERT into comments (user_id, thread_id, parent_id , content) VALUES (?, ?, ?, ?)', [userId, threadId, parentId, content]
    )

    return result.insertId
}

export async function updateByCommentId(commentId, sqlQuery, dataList) {
    dataList.push(commentId)
    const [result] = await connectionPool.query(
        sqlQuery + 'where comment_id = ? and deleted_at is NULL',
        dataList
    )
    return result.insertId
}

export async function deleteByCommentId(commentId) {
    const [result] = await connectionPool.query(
        "Update comments set deleted_at = NOW()  , content = '[Deleted]', status = 'delete' where comment_id = ? ",
        [commentId]
    )
    return;
}
