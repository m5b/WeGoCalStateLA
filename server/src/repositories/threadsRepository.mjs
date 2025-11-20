import connectionPool from '../db/pool.mjs'


export async  function findAllThread(){
    const [row] = await connectionPool.query(
        'SELECT t.thread_id AS thread_id,\n' +
        ' t.title AS title, \n' +
        ' t.content AS content, \n' +
        ' t.created_at AS created_at, \n' +
        ' t.updated_at As updated_at, \n' +
        ' t.deleted_at As deleted_at, \n' +
        ' t.status As status,  \n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.user_id\n' +
        '    else null\n' +
        'end as user_id,\n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.username\n' +
        '    else null\n' +
        'end as username,\n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.display_name\n' +
        '    else null\n' +
        'end as display_name\n' +
        'FROM threads t \n' +
        'JOIN users u ON t.user_id = u.user_id \n'
    )
    return row
}
export async function findByThreadId(threadId) {
    const [row] = await connectionPool.query(
        'SELECT t.thread_id AS thread_id,\n' +
        ' t.title AS title, \n' +
        ' t.content AS content, \n' +
        ' t.created_at AS created_at, \n' +
        ' t.updated_at As updated_at, \n' +
        ' t.deleted_at As deleted_at, \n' +
        ' t.status As status,  \n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.user_id\n' +
        '    else null\n' +
        'end as user_id,\n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.username\n' +
        '    else null\n' +
        'end as username,\n' +
        'Case\n' +
        '\twhen t.deleted_at is NULL Then u.display_name\n' +
        '    else null\n' +
        'end as display_name\n' +
        'FROM threads t \n' +
        'JOIN users u ON t.user_id = u.user_id \n' +
        'WHERE t.thread_id = ?',
        [threadId]
    )
    return row[0] || null
}

export async function findByUserId(userId) {
    const [row] = await connectionPool.query(
        'SELECT t.thread_id  AS thread_id,\n' +
        '       u.user_id    AS user_id,\n' +
        '       u.username   AS username,\n' +
        '       t.title      AS title,\n' +
        '       t.content    AS content,\n' +
        '       t.created_at AS created_at,\n' +
        '       t.updated_at AS updated_at\n' +

        'FROM   threads t\n' +
        '       JOIN users u\n' +
        '         ON t.user_id = u.user_id\n' +
        'WHERE  u.user_id = ?\n' +
        '       AND t.deleted_at IS NULL;  ',
        [userId]
    )
    return row
}

export async function insertThread({userId, title, content}) {
    const [result] = await connectionPool.query(
        'INSERT into threads (user_id, title, content) VALUES (?, ?, ?)', [userId , title, content]
    )

    return result.insertId
}

export async function updateByThreadId(threadId, sqlQuery, dataList) {
    dataList.push(threadId)
    const [result] = await connectionPool.query(
        sqlQuery + 'where thread_id = ? and deleted_at is NULL',
        dataList
    )
    return result.insertId
}


export async function deleteByThreadId(threadId) {
    const [result] = await connectionPool.query(
        "Update threads set deleted_at = NOW() , title = '[Deleted]', content = '[Deleted]', status = 'delete' where thread_id = ? ",
        [threadId]
    )
    return;
}