// Database access for direct messages, blocks, and reports. Rows come back as the database gives
// them (snake_case); dtos/messageDto.mjs shapes them for the API.

// The login-less account that owns the FAQs; nobody can message it.
const TEAM_USERNAME = 'WeGo Community Team'

export function createMessagesRepo(db) {
    async function findUserByUuid(userUuid) {
        const [rows] = await db.execute(
            `SELECT user_id, BIN_TO_UUID(user_uuid) AS user_uuid, username, alias
             FROM users WHERE user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL AND username <> ?`,
            [userUuid, TEAM_USERNAME]
        )
        return rows[0] ?? null
    }

    async function searchUsers({ query, excludeUserId, limit }) {
        // Escape LIKE's own symbols so a search for "50%" means 50%.
        const like = `%${query.replace(/[\\%_]/g, '\\$&')}%`
        const [rows] = await db.query(
            `SELECT BIN_TO_UUID(user_uuid) AS user_uuid, username, alias
             FROM users
             WHERE deleted_at IS NULL AND user_id <> ? AND username <> ? AND (username LIKE ? OR alias LIKE ?)
             ORDER BY username LIMIT ${Number(limit)}`,
            [excludeUserId, TEAM_USERNAME, like, like]
        )
        return rows
    }

    // One row per person you have talked to: their latest message, how many of theirs you haven't read,
    // and whether you blocked them. Newest conversation first.
    async function listConversations(userId) {
        const [rows] = await db.execute(
            `WITH mine AS (
                 SELECT m.message_id, m.sender_id, m.recipient_id, m.content, m.photo_key, m.created_at, m.read_at,
                        CASE WHEN m.sender_id = ? THEN m.recipient_id ELSE m.sender_id END AS other_id
                 FROM direct_messages m
                 WHERE (m.sender_id = ? OR m.recipient_id = ?) AND m.deleted_at IS NULL
             ),
             ranked AS (
                 SELECT mine.*,
                        ROW_NUMBER() OVER (PARTITION BY other_id ORDER BY created_at DESC, message_id DESC) AS rn,
                        SUM(CASE WHEN recipient_id = ? AND read_at IS NULL THEN 1 ELSE 0 END)
                            OVER (PARTITION BY other_id) AS unread_count
                 FROM mine
             )
             SELECT BIN_TO_UUID(u.user_uuid) AS user_uuid, u.username, u.alias,
                    r.content, r.photo_key, r.created_at, (r.sender_id = ?) AS last_from_me, r.unread_count,
                    EXISTS (SELECT 1 FROM user_blocks b WHERE b.blocker_id = ? AND b.blocked_id = r.other_id) AS blocked_by_me
             FROM ranked r JOIN users u ON u.user_id = r.other_id
             LEFT JOIN conversation_closures cc ON cc.user_id = ? AND cc.other_id = r.other_id
             WHERE r.rn = 1 AND u.deleted_at IS NULL
                AND (cc.closed_at IS NULL OR r.created_at > cc.closed_at)
             ORDER BY r.created_at DESC, r.message_id DESC`,
            [userId, userId, userId, userId, userId, userId, userId]
        )
        return rows
    }

    // The latest messages between two people, newest first (the service puts them in reading order).
    async function listMessages({ userId, otherId, limit }) {
        const [rows] = await db.query(
            `SELECT BIN_TO_UUID(m.message_uuid) AS message_uuid, (m.sender_id = ?) AS from_me,
                    m.content, m.photo_key, m.created_at, m.read_at
             FROM direct_messages m
             WHERE ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))
               AND m.deleted_at IS NULL
             ORDER BY m.message_id DESC LIMIT ${Number(limit)}`,
            [userId, userId, otherId, otherId, userId]
        )
        return rows
    }

    async function markRead({ recipientId, senderId }) {
        const [result] = await db.execute(
            `UPDATE direct_messages SET read_at = NOW()
             WHERE recipient_id = ? AND sender_id = ? AND read_at IS NULL AND deleted_at IS NULL`,
            [recipientId, senderId]
        )
        return result.affectedRows
    }

    async function insertMessage({ messageUuid, senderId, recipientId, content, photoKey }) {
        const [result] = await db.execute(
            `INSERT INTO direct_messages (message_uuid, sender_id, recipient_id, content, photo_key)
             VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
            [messageUuid, senderId, recipientId, content, photoKey]
        )
        return result.insertId
    }

    const MESSAGE_COLUMNS = `m.message_id, BIN_TO_UUID(m.message_uuid) AS message_uuid, m.sender_id, m.recipient_id,
                             m.content, m.photo_key, m.created_at, m.read_at`

    async function findMessageById(messageId) {
        const [rows] = await db.execute(
            `SELECT ${MESSAGE_COLUMNS} FROM direct_messages m WHERE m.message_id = ? AND m.deleted_at IS NULL`,
            [messageId]
        )
        return rows[0] ?? null
    }

    async function findMessageByUuid(messageUuid) {
        const [rows] = await db.execute(
            `SELECT ${MESSAGE_COLUMNS} FROM direct_messages m
             WHERE m.message_uuid = UUID_TO_BIN(?) AND m.deleted_at IS NULL`,
            [messageUuid]
        )
        return rows[0] ?? null
    }

    // Only the sender can delete a message.
    async function softDeleteOwn({ messageUuid, senderId }) {
        const [result] = await db.execute(
            `UPDATE direct_messages SET deleted_at = NOW()
             WHERE message_uuid = UUID_TO_BIN(?) AND sender_id = ? AND deleted_at IS NULL`,
            [messageUuid, senderId]
        )
        return result.affectedRows > 0
    }

    // Messages waiting for you, not counting people you blocked.
    async function countUnread(userId) {
        const [rows] = await db.execute(
            `SELECT COUNT(*) AS n FROM direct_messages m
             WHERE m.recipient_id = ? AND m.read_at IS NULL AND m.deleted_at IS NULL
               AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE b.blocker_id = m.recipient_id AND b.blocked_id = m.sender_id)`,
            [userId]
        )
        return Number(rows[0].n)
    }

    async function findBlock({ me, other }) {
        const [rows] = await db.execute(
            `SELECT (SELECT COUNT(*) FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?) AS blocked_by_me,
                    (SELECT COUNT(*) FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?) AS blocked_me`,
            [me, other, other, me]
        )
        return { blockedByMe: Number(rows[0].blocked_by_me) > 0, blockedMe: Number(rows[0].blocked_me) > 0 }
    }

    async function addBlock({ blockerId, blockedId }) {
        await db.execute('INSERT IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)', [blockerId, blockedId])
    }

    async function removeBlock({ blockerId, blockedId }) {
        await db.execute('DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?', [blockerId, blockedId])
    }

    // One report per person per message (a repeat is ignored).
    async function insertReport({ reportUuid, messageId, reporterId, reportedUserId, reason, messageContent, messagePhotoKey }) {
        const [result] = await db.execute(
            `INSERT IGNORE INTO message_reports
                 (report_uuid, message_id, reporter_id, reported_user_id, reason, message_content, message_photo_key)
             VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
            [reportUuid, messageId, reporterId, reportedUserId, reason, messageContent, messagePhotoKey]
        )
        return result.affectedRows > 0
    }

    async function listReports({ includeResolved }) {
        const [rows] = await db.query(
            `SELECT BIN_TO_UUID(r.report_uuid) AS report_uuid, r.reason, r.message_content, r.message_photo_key,
                    r.created_at, r.resolved_at,
                    ru.username AS reporter_username, ru.alias AS reporter_alias,
                    tu.username AS reported_username, tu.alias AS reported_alias, BIN_TO_UUID(tu.user_uuid) AS reported_user_uuid
             FROM message_reports r
             JOIN users ru ON ru.user_id = r.reporter_id
             JOIN users tu ON tu.user_id = r.reported_user_id
             WHERE (? OR r.resolved_at IS NULL)
             ORDER BY r.created_at DESC LIMIT 200`,
            [includeResolved ? 1 : 0]
        )
        return rows
    }

    async function resolveReport({ reportUuid, adminId }) {
        const [result] = await db.execute(
            `UPDATE message_reports SET resolved_at = NOW(), resolved_by_user_id = ?
             WHERE report_uuid = UUID_TO_BIN(?) AND resolved_at IS NULL`,
            [adminId, reportUuid]
        )
        return result.affectedRows > 0
    }

    async function findReportPhotoKey(reportUuid) {
        const [rows] = await db.execute(
            'SELECT message_photo_key FROM message_reports WHERE report_uuid = UUID_TO_BIN(?)',
            [reportUuid]
        )
        return rows[0]?.message_photo_key ?? null
    }

    // Closing hides a conversation from your list (the messages stay); opening it again brings it back.
    // listConversations leaves out a closed conversation until a newer message arrives.
    async function closeConversation({ userId, otherId }) {
        await db.execute(
            `INSERT INTO conversation_closures (user_id, other_id, closed_at) VALUES (?, ?, NOW())
             ON DUPLICATE KEY UPDATE closed_at = NOW()`,
            [userId, otherId]
        )
    }
    async function reopenConversation({ userId, otherId }) {
        await db.execute('DELETE FROM conversation_closures WHERE user_id = ? AND other_id = ?', [userId, otherId])
    }

    return {
        findUserByUuid, searchUsers, listConversations, listMessages, markRead, insertMessage,
        findMessageById, findMessageByUuid, softDeleteOwn, countUnread, findBlock, addBlock, removeBlock,
        insertReport, listReports, resolveReport, findReportPhotoKey,
        closeConversation, reopenConversation
    }
}