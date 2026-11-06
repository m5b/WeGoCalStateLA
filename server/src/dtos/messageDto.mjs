// Shapes rows from messagesRepository for the API. Pictures are never given as a public file address:
// they are fetched through /api/messages/photo/..., which checks who is asking.

const displayName = (alias, username) => (alias && alias.trim()) || username

export function toPersonDto(row, extra = {}) {
    return {
        userUuid: row.user_uuid,
        username: row.username,
        alias: row.alias ?? null,
        displayName: displayName(row.alias, row.username),
        ...extra,
    }
}

export function toMessageDto(row) {
    return {
        messageUuid: row.message_uuid,
        fromMe: Boolean(row.from_me),
        content: row.content,
        photoUrl: row.photo_key ? `/api/messages/photo/${row.message_uuid}` : null,
        createdAt: row.created_at,
        readAt: row.read_at ?? null,
    }
}

export function toConversationDto(row) {
    return {
        ...toPersonDto(row),
        lastMessage: {
            text: row.content,
            hasPhoto: Boolean(row.photo_key),
            fromMe: Boolean(row.last_from_me),
            createdAt: row.created_at,
        },
        unreadCount: Number(row.unread_count ?? 0),
        blockedByMe: Boolean(row.blocked_by_me),
    }
}

export function toReportDto(row) {
    return {
        reportUuid: row.report_uuid,
        reason: row.reason,
        messageText: row.message_content,
        photoUrl: row.message_photo_key ? `/api/messages/reports/${row.report_uuid}/photo` : null,
        createdAt: row.created_at,
        resolvedAt: row.resolved_at ?? null,
        reporter: { username: row.reporter_username, displayName: displayName(row.reporter_alias, row.reporter_username) },
        reported: {
            userUuid: row.reported_user_uuid,
            username: row.reported_username,
            displayName: displayName(row.reported_alias, row.reported_username),
        },
    }
}