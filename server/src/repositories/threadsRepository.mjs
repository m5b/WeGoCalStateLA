import connectionPool from '../db/pool.mjs'

export async function getAllThreadIDs() {
    // returns list of all threadIDs
    // will not return deleted threads

    const [row] = await connectionPool.query(
        'SELECT thread_id FROM threads WHERE deleted_at IS NULL'
    )
    return row
}

export async function findByThreadID(threadID) {
    // returns data from given threadID
    // WILL NOT CHECK IF THREAD IS DELETED

    const [row] = await connectionPool.query(
        'SELECT thread_id, display_name AS author, title, content, threads.created_at, threads.updated_at, status FROM threads INNER JOIN users ON threads.user_id = users.user_id WHERE thread_id = ?',
        [threadID]
    )
    return row[0] || null
}

export async function createThreadRecord({userId, title, parent_id, content, threadId,}) {
  const [result] = await connectionPool.query(
        'INSERT into threads (user_id, thread_id, parent_id, title, content) VALUES (?, ?, ?, ?, ?)', [userId, threadId, parentId, title, content]
    )

    return result.insertId

}
