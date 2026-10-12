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
}