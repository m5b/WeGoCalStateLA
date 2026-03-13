import connectionPool from "../lib/pool.mjs";
  

export async function getAvailableAnonymousName() {
    const [rows] = await connectionPool.query(
        `SELECT id, anonymous_name
         FROM anonymous_name
         WHERE user_id IS NULL
         LIMIT 1
         FOR UPDATE`
    );
    return rows[0] || null;
}

export async function assignAnonymousNameToUser(anonymousId, userId) {
    await connectionPool.query(
        `UPDATE anonymous_name
         SET user_id = ?
         WHERE id = ?`,
        [userId, anonymousId]
    );
}

export async function getAnonymousNameByUserId(userId){
    const anonName = await connectionPool.query(
        `SELECT anonymous_name
        FROM anonymous_name
        WHERE user_id = ?
        `,
        [userId]
    )
    return anonymousName || null;
}