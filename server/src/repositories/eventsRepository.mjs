// Joins each event with its author (username + public alias) and linked
// community thread. No address join -- events don't store a location.
const BASE_SELECT = `
    SELECT
        e.event_id,
        BIN_TO_UUID(e.event_uuid) as event_uuid,
        e.event_title,
        e.event_description,
        e.started_at,
        e.ended_at,
        e.photo_url,
        e.created_at,
        e.updated_at,
        e.created_by_user_id,
        e.thread_id,
        u.username as author_username,
        u.alias as author_alias,
        BIN_TO_UUID(u.user_uuid) as author_uuid,
        BIN_TO_UUID(t.thread_uuid) as thread_uuid
    FROM events e
    LEFT JOIN users u ON u.user_id = e.created_by_user_id
    LEFT JOIN threads t ON t.thread_id = e.thread_id
    WHERE e.deleted_at IS NULL
`

export function createEventsRepo(db) {
    return {
        findAll,
        findByEventUuid,
        findByUserId,
        insertEvent,
        updateByEventUuid,
    }

    async function findAll() {
        const [rows] = await db.query(BASE_SELECT + ' ORDER BY e.started_at ASC')
        return rows
    }

    async function findByEventUuid(eventUuid) {
        const [rows] = await db.execute(
            BASE_SELECT + ' AND e.event_uuid = UUID_TO_BIN(?)',
            [eventUuid]
        )
        return rows[0] || null
    }

    async function findByUserId(userId) {
        const [rows] = await db.execute(
            BASE_SELECT + ' AND e.created_by_user_id = ? ORDER BY e.started_at ASC',
            [userId]
        )
        return rows
    }

    async function insertEvent({eventUuid, title, description, startedAt, endedAt, createdByUserId, threadId, photoUrl}) {
        const [result] = await db.execute(
            `INSERT INTO events
                (event_uuid, event_title, event_description, started_at, ended_at, created_by_user_id, thread_id, photo_url, created_at, updated_at)
             VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [eventUuid, title, description, startedAt, endedAt, createdByUserId, threadId, photoUrl]
        )
        return result.insertId
    }

    // fields uses db column names; only the event's creator can update it.
    async function updateByEventUuid({eventUuid, userId, fields}) {
        const columns = Object.keys(fields)
        if (columns.length === 0) return true
        const setClause = columns.map((column) => `${column} = ?`).join(', ')
        const [result] = await db.execute(
            `UPDATE events SET ${setClause}, updated_at = NOW()
             WHERE event_uuid = UUID_TO_BIN(?) AND created_by_user_id = ? AND deleted_at IS NULL`,
            [...columns.map((column) => fields[column]), eventUuid, userId]
        )
        return result.affectedRows > 0
    }
}
