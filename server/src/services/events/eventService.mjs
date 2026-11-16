import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { v4 as uuidv4 } from 'uuid'
import EventDto from '../../dtos/eventDto.mjs'

// Default event length, since the form only collects a start time but the
// database requires an end time after it.
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000

// The form only collects a single free-text location, but addresses require
// a full structured address -- the typed text becomes the street line, the
// rest defaults to Cal State LA's own address.
const DEFAULT_ADDRESS = {
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90032',
    country: 'USA',
}

export function createEventService({eventRepo, threadService, uploadBuffer}) {
    return {
        getAll,
        getByEventUuid,
        getByUserId,
        postByUserId,
        patchByEventUuid,
        deleteByEventUuid,
    }

    function toStartEnd(date, time) {
        const startedAt = new Date(`${date} ${time}`)
        const safeStartedAt = Number.isNaN(startedAt.getTime()) ? new Date(date) : startedAt
        const endedAt = new Date(safeStartedAt.getTime() + DEFAULT_DURATION_MS)
        return { startedAt: safeStartedAt, endedAt }
    }

    async function savePhoto(imageFile) {
        // Strip unsafe characters from the original filename before
        // using it in the storage path.
        const safeName = imageFile.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        return uploadBuffer({
            buffer: imageFile.buffer,
            key: `events/${uuidv4()}-${safeName}`,
        })
    }

    async function getAll() {
        const rows = await eventRepo.findAll()
        return rows.map((row) => new EventDto(dbMapper.fromDb(row)))
    }

    async function getByEventUuid(eventUuid) {
        const row = await eventRepo.findByEventUuid(eventUuid)
        if (!row) {
            throw new NotFoundError({ event: 'Not Found' }, 'Event not found.')
        }
        return new EventDto(dbMapper.fromDb(row))
    }

    async function getByUserId(userId) {
        const rows = await eventRepo.findByUserId(userId)
        return rows.map((row) => new EventDto(dbMapper.fromDb(row)))
    }

    // imageFile is multer's req.file (undefined if no image was sent).
    async function postByUserId(userId, { title, description, date, time, isPublic = false }, imageFile) {
        const { startedAt: safeStartedAt, endedAt } = toStartEnd(date, time)
        const photoUrl = imageFile ? await savePhoto(imageFile) : null

        // Creates the linked community post automatically, so the event
        // shows up in both Events and Community under the same author.
        const thread = await threadService.postByUserId(userId, {
            title: `${title} — Event`,
            content: description || title,
            category: 'events',
            isPublic,
        })

        const eventUuid = uuidv4()
        await eventRepo.insertEvent({
            eventUuid,
            title,
            description,
            startedAt: safeStartedAt,
            endedAt,
            createdByUserId: userId,
            threadId: thread.threadId,
            photoUrl,
            isPublic,
        })

        return await getByEventUuid(eventUuid)
    }

    // Only the event's creator (or an admin) can edit it. A new image (if sent) replaces
    // the old one. Title/description/visibility changes are mirrored onto the
    // linked community post so the two stay in sync.
    async function patchByEventUuid(userId, eventUuid, { title, description, date, time, isPublic }, imageFile, { isAdmin = false } = {}) {
        const existing = await eventRepo.findByEventUuid(eventUuid)
        if (!existing) {
            throw new NotFoundError({ event: 'Not Found' }, 'Event not found.')
        }
        if (!isAdmin && String(existing.created_by_user_id) !== String(userId)) {
            throw new UnauthorizedError(null, 'You do not have permission to change this event')
        }

        const fields = {}
        if (title !== undefined) fields.event_title = title
        if (description !== undefined) fields.event_description = description
        if (date !== undefined && time !== undefined) {
            const { startedAt, endedAt } = toStartEnd(date, time)
            fields.started_at = startedAt
            fields.ended_at = endedAt
        }
        if (imageFile) fields.photo_url = await savePhoto(imageFile)
        if (isPublic !== undefined) fields.is_public = isPublic

        await eventRepo.updateByEventUuid({ eventUuid, userId, fields, isAdmin })

        if (existing.thread_id && (title !== undefined || description !== undefined || isPublic !== undefined)) {
            const newTitle = title ?? existing.event_title
            const newDescription = description ?? existing.event_description
            const threadPayload = {
                title: `${newTitle} — Event`,
                content: newDescription || newTitle,
            }
            if (isPublic !== undefined) threadPayload.isPublic = isPublic
            try {
                // The linked post belongs to the event's creator, so edit it as them (this is
                // also what lets an admin's edit reach the post).
                await threadService.patchByThreadId({
                    userId: existing.created_by_user_id,
                    threadId: existing.thread_id,
                    payload: threadPayload,
                })
            } catch (err) {
                // The linked community post was deleted -- the event edit
                // itself should still save. Anything else is a real error.
                if (!(err instanceof UnauthorizedError)) throw err
            }
        }

        return await getByEventUuid(eventUuid)
    }

        // Deletes an event and its linked community post. Only the event's creator or an admin.
    async function deleteByEventUuid(userId, eventUuid, { isAdmin = false } = {}) {
        const existing = await eventRepo.findByEventUuid(eventUuid)
        if (!existing) {
            throw new NotFoundError({ event: 'Not Found' }, 'Event not found.')
        }
        if (!isAdmin && String(existing.created_by_user_id) !== String(userId)) {
            throw new UnauthorizedError(null, 'You do not have permission to delete this event')
        }

        await eventRepo.deleteByEventUuid({ eventUuid, userId, isAdmin })

        if (existing.thread_id) {
            try {
                await threadService.deleteByThreadId({
                    threadId: existing.thread_id,
                    userId: existing.created_by_user_id,
                })
            } catch (err) {
                // The linked post was already deleted -- the event is gone either way.
                if (!(err instanceof UnauthorizedError)) throw err
            }
        }
    }
}
