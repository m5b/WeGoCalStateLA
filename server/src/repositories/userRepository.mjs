export function createUserRepo(db){
    return {
        findByUserId,
        findByUsername,
        findByUserUuid,
        updateByUserId,
        updateByUserUuid,
        deleteByUserId,
        deleteByUserUuid,
        insertUser,
        getCount,
        checkUserExistsByUserUuid,
        findAll,
        countAll,
        getAdminStats,
        findPublicProfile,
        findRecentThreads,
        findRecentEvents,
    }

    // The admin list's search and role filter, shared by the list and its count. What is typed in the
    // search box goes in as a value (never into the SQL text), and LIKE's own symbols are escaped so a
    // search for "50%" means 50%.
    function userFilter({ search, role } = {}) {
        const where = ['deleted_at is NULL']
        const params = []
        if (role === 'admin') where.push('is_admin = 1')
        if (role === 'member') where.push('is_admin = 0')
        const text = (search ?? '').trim()
        if (text) {
            const like = `%${text.replace(/[\\%_]/g, '\\$&')}%`
            where.push('(username LIKE ? OR alias LIKE ?)')
            params.push(like, like)
        }
        return { where: where.join(' and '), params }
    }

    // Newest first. user_id breaks ties, so people who joined in the same second stay in a steady order
    // from one page to the next.
    async function findAll({ limit = 100, offset = 0, search, role } = {}) {
        const filter = userFilter({ search, role })
        const [rows] = await db.query(
            `select user_id, BIN_TO_UUID(user_uuid) as user_uuid, username, alias, relationship, interests, is_admin, email_hash IS NOT NULL as has_email, created_at, updated_at from users where ${filter.where} order by created_at desc, user_id desc limit ? offset ?`,
            [...filter.params, limit, offset]
        )
        return rows
    }

    async function countAll({ search, role } = {}) {
        const filter = userFilter({ search, role })
        const [rows] = await db.query(`select COUNT(*) as cnt from users where ${filter.where}`, filter.params)
        return rows[0].cnt
    }

    // Totals for the admin page. Counts only, never anyone's content.
    async function getAdminStats() {
        const [rows] = await db.query(
            `select
                (select COUNT(*) from users where deleted_at is NULL) as members,
                (select COUNT(*) from users where deleted_at is NULL and is_admin = 1) as admins,
                (select COUNT(*) from users where deleted_at is NULL and created_at >= NOW() - INTERVAL 7 DAY) as new_members,
                (select COUNT(*) from threads where deleted_at is NULL and category = 'general') as posts,
                (select COUNT(*) from comments where deleted_at is NULL) as replies,
                (select COUNT(*) from events where deleted_at is NULL) as events,
                (select COUNT(*) from message_reports where resolved_at is NULL) as open_reports`
        )
        return rows[0]
    }
    // Who someone is plus how much they have contributed. For anyone but the person themselves the counts
    // only include what everyone may see: public posts, replies on public posts, and public events.
    // (The visibility text added to the queries is fixed in this file, never typed by a person.)
    async function findPublicProfile(userUuid, { includePrivate = false } = {}) {
        const onlyPublic = includePrivate ? '' : 'and t.is_public = 1'
        const [rows] = await db.query(
            `select u.user_id, BIN_TO_UUID(u.user_uuid) as user_uuid, u.username, u.alias, u.relationship, u.interests, u.is_admin, u.created_at,
                (select COUNT(*) from threads t where t.user_id = u.user_id and t.deleted_at is NULL and t.category = 'general' ${onlyPublic}) as post_count,
                (select COUNT(*) from comments c join threads t on t.thread_id = c.thread_id where c.user_id = u.user_id and c.deleted_at is NULL and t.deleted_at is NULL ${onlyPublic}) as reply_count,
                (select COUNT(*) from events e where e.created_by_user_id = u.user_id and e.deleted_at is NULL ${includePrivate ? '' : 'and e.is_public = 1'}) as event_count
             from users u where u.user_uuid = UUID_TO_BIN(?) and u.deleted_at is NULL`,
            [userUuid]
        )
        return rows[0] ?? null
    }

    async function findRecentThreads(userId, { includePrivate = false, limit = 5 } = {}) {
        const [rows] = await db.query(
            `select BIN_TO_UUID(thread_uuid) as thread_uuid, title, content, is_public, created_at from threads
             where user_id = ? and deleted_at is NULL and category = 'general' ${includePrivate ? '' : 'and is_public = 1'}
             order by created_at desc limit ?`,
            [userId, limit]
        )
        return rows
    }

    async function findRecentEvents(userId, { includePrivate = false, limit = 5 } = {}) {
        const [rows] = await db.query(
            `select BIN_TO_UUID(event_uuid) as event_uuid, event_title, started_at, is_public from events
             where created_by_user_id = ? and deleted_at is NULL ${includePrivate ? '' : 'and is_public = 1'}
             order by started_at desc limit ?`,
            [userId, limit]
        )
        return rows
    }

    async function getCount(){
        const [row] = await db.query(
            'select COUNT(*) as cnt from users where deleted_at is NULL'
        )
        return row[0].cnt
    }
    async function findByUserId(userId) {
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, username, alias, relationship, interests, is_admin, created_at, updated_at from users where user_id = ? and deleted_at is NULL ',
            [userId]
        )
        return row[0] || null
    }

    async function findByUserUuid(userUuid){
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  username, alias, relationship, interests, is_admin, created_at, updated_at from users where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL ',
            [userUuid]
        )
        return row[0] || null
    }

    async function checkUserExistsByUserUuid(userUuid){
        const [rows] = await db.execute(
            `SELECT EXISTS(SELECT 1 FROM users WHERE user_uuid = UUID_TO_BIN(?)) AS user_exists`,
            [userUuid]
        )
        return rows[0].user_exists === 1
    }

    async function findByUsername(username) {
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  username, alias, relationship, interests, is_admin, created_at, updated_at from users where username = ? and deleted_at is NULL',
            [username]
        )

        return row[0] || null
    }

    async function updateByUserId(userId, sqlQuery, dataList) {
        dataList.push(userId)
        const [result] = await db.query(
            sqlQuery + ' where user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}

    }

    async function updateByUserUuid(userUuid, sqlQuery, dataList){
        dataList.push(userUuid)
        const [result] = await db.execute(
            sqlQuery + ' where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    //soft delete
    async function deleteByUserId(userId) {
        const [result] = await db.execute(
            'Update users set deleted_at = NOW(), username = NULL where user_id = ? AND deleted_at IS NULL',
            [userId]
        )
        return result.affectedRows > 0
    }


    async function deleteByUserUuid(userUuid) {
        const [result] = await db.execute(
            'Update users set deleted_at = NOW(), username = NULL where user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL',
            [userUuid]
        )
        return result.affectedRows > 0
    }

    async function insertUser({username, userUuid, createdAt, emailHash = null, passwordHash = null, isAdmin = false}) {
        const [result] = await db.execute(
            'INSERT INTO users (username, email_hash, password_hash, is_admin, user_uuid, created_at, updated_at) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)',
            [username, emailHash, passwordHash, isAdmin, userUuid, createdAt, createdAt]
      )
        return result.insertId
    }
}