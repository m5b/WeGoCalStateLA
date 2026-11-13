import { v4 as uuidv4 } from 'uuid'
import { BadRequestError } from '../../errors/badRequestError.mjs'
import { ForbiddenError } from '../../errors/forbiddenError.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { TooManyRequestsError } from '../../errors/tooManyRequestsError.mjs'
import { IMAGE_EXTENSIONS } from '../../lib/imageTypes.mjs'
import { MAX_MESSAGE_LENGTH } from '../../lib/messageLimits.mjs'
import { toPersonDto, toMessageDto, toConversationDto, toReportDto } from '../../dtos/messageDto.mjs'

const MESSAGES_SHOWN = 200
const SENDS_PER_MINUTE = 20

// The rules for direct messages. savePrivate stores a picture where the public uploads route can't
// serve it and returns its path; privatePath turns a stored path back into a file to send (or null).
export function createMessagesService({ messagesRepo, savePrivate, privatePath, now = Date.now }) {
    // Who sent how many messages in the last minute, so one person can't flood another.
    const recentSends = new Map()

    function checkSendRate(userId) {
        const cutoff = now() - 60_000
        const recent = (recentSends.get(userId) ?? []).filter((time) => time > cutoff)
        if (recent.length >= SENDS_PER_MINUTE) {
            throw new TooManyRequestsError(null, 'You are sending messages too fast. Please wait a moment and try again.')
        }
        recent.push(now())
        recentSends.set(userId, recent)
    }

    async function personOrThrow(userUuid) {
        const person = await messagesRepo.findUserByUuid(userUuid)
        if (!person) throw new NotFoundError({ user: 'Not Found' }, 'Person not found.')
        return person
    }

    async function searchPeople({ userId, query }) {
        const rows = await messagesRepo.searchUsers({ query, excludeUserId: userId, limit: 10 })
        return rows.map((row) => toPersonDto(row))
    }

    async function listConversations(userId) {
        const rows = await messagesRepo.listConversations(userId)
        return rows.map(toConversationDto)
    }

    // Opens a conversation: the latest messages in reading order, and everything they sent you is
    // marked as read. Works for someone you haven't talked to yet (no messages).
    async function getConversation({ userId, otherUuid }) {
        const person = await personOrThrow(otherUuid)
        if (person.user_id === userId) throw new BadRequestError(null, "You can't message yourself.")
        const rows = await messagesRepo.listMessages({ userId, otherId: person.user_id, limit: MESSAGES_SHOWN })
        await messagesRepo.markRead({ recipientId: userId, senderId: person.user_id })
        const { blockedByMe } = await messagesRepo.findBlock({ me: userId, other: person.user_id })
        // Whether they blocked you is deliberately not shown.
        return { person: toPersonDto(person, { blockedByMe }), messages: rows.reverse().map(toMessageDto) }
    }

    async function send({ senderId, recipientUuid, content, imageFile }) {
        const text = (content ?? '').trim()
        if (text.length > MAX_MESSAGE_LENGTH) {
            throw new BadRequestError({ content: `Messages can be up to ${MAX_MESSAGE_LENGTH} characters.` }, `Messages can be up to ${MAX_MESSAGE_LENGTH} characters.`)
        }
        if (!text && !imageFile) {
            throw new BadRequestError({ content: 'Write a message or attach a picture.' }, 'Write a message or attach a picture.')
        }
        const person = await personOrThrow(recipientUuid)
        if (person.user_id === senderId) throw new BadRequestError(null, "You can't message yourself.")
        const { blockedByMe, blockedMe } = await messagesRepo.findBlock({ me: senderId, other: person.user_id })
        if (blockedByMe) throw new ForbiddenError(null, 'You blocked this person. Unblock them to send a message.')
        if (blockedMe) throw new ForbiddenError(null, "You can't send messages to this person.")
        checkSendRate(senderId)

        let photoKey = null
        if (imageFile) {
            // Name the file from its type, never from the uploaded file name.
            const ext = IMAGE_EXTENSIONS[imageFile.mimetype] ?? 'jpg'
            photoKey = await savePrivate({ buffer: imageFile.buffer, key: `messages/${uuidv4()}.${ext}` })
        }
        const messageId = await messagesRepo.insertMessage({
            messageUuid: uuidv4(), senderId, recipientId: person.user_id, content: text, photoKey,
        })
        const row = await messagesRepo.findMessageById(messageId)
        return toMessageDto({ ...row, from_me: true })
    }

    async function deleteMessage({ userId, messageUuid }) {
        const deleted = await messagesRepo.softDeleteOwn({ messageUuid, senderId: userId })
        if (!deleted) throw new NotFoundError({ message: 'Not Found' }, 'Message not found.')
    }

    function unreadCount(userId) {
        return messagesRepo.countUnread(userId)
    }

    async function block({ userId, personUuid }) {
        const person = await personOrThrow(personUuid)
        if (person.user_id === userId) throw new BadRequestError(null, "You can't block yourself.")
        await messagesRepo.addBlock({ blockerId: userId, blockedId: person.user_id })
    }

    async function unblock({ userId, personUuid }) {
        const person = await personOrThrow(personUuid)
        await messagesRepo.removeBlock({ blockerId: userId, blockedId: person.user_id })
    }

    // A message's picture, only for the two people in the conversation. Anyone else (or a deleted
    // message) is told it doesn't exist, so nobody can probe for other people's pictures.
    async function getPhotoFile({ userId, messageUuid }) {
        const message = await messagesRepo.findMessageByUuid(messageUuid)
        const involved = message && (message.sender_id === userId || message.recipient_id === userId)
        const file = involved && message.photo_key ? privatePath(message.photo_key) : null
        if (!file) throw new NotFoundError({ photo: 'Not Found' }, 'Picture not found.')
        return file
    }

    // Reports a message you received. The admins get a copy of that one message and your reason.
    async function report({ userId, messageUuid, reason }) {
        const message = await messagesRepo.findMessageByUuid(messageUuid)
        if (!message || message.recipient_id !== userId) {
            throw new NotFoundError({ message: 'Not Found' }, 'Message not found.')
        }
        await messagesRepo.insertReport({
            reportUuid: uuidv4(), messageId: message.message_id, reporterId: userId,
            reportedUserId: message.sender_id, reason, messageContent: message.content, messagePhotoKey: message.photo_key,
        })
        // Reporting the same message twice is fine; it just stays one report.
    }

    async function listReports({ includeResolved }) {
        const rows = await messagesRepo.listReports({ includeResolved })
        return rows.map(toReportDto)
    }

    async function resolveReport({ adminId, reportUuid }) {
        const resolved = await messagesRepo.resolveReport({ reportUuid, adminId })
        if (!resolved) throw new NotFoundError({ report: 'Not Found' }, 'Report not found (or already resolved).')
    }

    async function getReportPhotoFile(reportUuid) {
        const key = await messagesRepo.findReportPhotoKey(reportUuid)
        const file = key ? privatePath(key) : null
        if (!file) throw new NotFoundError({ photo: 'Not Found' }, 'Picture not found.')
        return file
    }

    // Closing a conversation takes it off your list; every message is kept, and opening it again (or a new
    // message in it) brings it back.
    async function closeConversation({ userId, personUuid }) {
        const person = await personOrThrow(personUuid)
        if (person.user_id === userId) throw new BadRequestError(null, "You can't close a conversation with yourself.")
        await messagesRepo.closeConversation({ userId, otherId: person.user_id })
    }
    async function openConversation({ userId, personUuid }) {
        const person = await personOrThrow(personUuid)
        await messagesRepo.reopenConversation({ userId, otherId: person.user_id })
    }

    return {
        searchPeople, listConversations, getConversation, send, deleteMessage, unreadCount, block, unblock,
        closeConversation, openConversation,
        getPhotoFile, report, listReports, resolveReport, getReportPhotoFile,
    }
}