import connectionPool from '../db/pool.mjs'

export async function getCommentIDsByThread(threadID) {
    // returns commentIDs directly responding to threadID
    // will not return deleted comments

    const [row] = await connectionPool.query(
        'SELECT comment_id FROM comments WHERE thread_id = ? AND deleted_at IS NULL AND parent_id IS NULL',
        [threadID]
    )
    return row || null
}

export async function getCommentIDsByParent(commentID) {
    // returns commentIDs responding to the given commentID
    // will not return deleted comments

    const [row] = await connectionPool.query(
        'SELECT comment_id FROM comments WHERE parent_id = ? AND deleted_at IS NULL',
        [commentID]
    )
    return row || null
}

export async function findByCommentID(commentID) {
    // returns data from given commentID
    // WILL NOT CHECK IF THREAD IS DELETED

    const [row] = await connectionPool.query(
        'SELECT comment_id, content AS body, display_name AS author FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comment_id = ?',
        [commentID]
    )
    return row[0] || null
}

export async function getCommentsByThreadId(threadId) {
    const [row] = await connectionPool.query(
        'select * from comments INNER JOIN users on users.user_id = comments.user_id where thread_id = ? ',
        [threadId]
    )
    return row
}
