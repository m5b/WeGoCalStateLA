import connectionPool from '../db/pool.mjs'

export async function findByThreadID(threadID){
    const [row] = await connectionPool.query(
        'select * from threads wehere thread_id = ?',
        [threadID]
    )
    return row[0] || null
}