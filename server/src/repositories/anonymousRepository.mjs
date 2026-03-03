import connectionPool from "../lib/pool.mjs";

export async function totalFreeProfiles(params) {
    
    let total = 0;

    return total ;// total numbers not taken
}

export async function findByUserID(userId) {
    const [row] = await connectionPool.query(
        'select user_id from anonymous_name where user_id = ? ',
        [userId]
    )
    return row[0] || null
}
