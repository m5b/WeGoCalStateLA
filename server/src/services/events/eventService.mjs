import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
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
    async function postByUserId(userId, { title, description, date, time }, imageFile) {
        const startedAt = new Date(`${date} ${time}`)
        const safeStartedAt = Number.isNaN(startedAt.getTime()) ? new Date(date) : startedAt
        const endedAt = new Date(safeStartedAt.getTime() + DEFAULT_DURATION_MS)

        let photoUrl = null
        if (imageFile) {
            // Strip unsafe characters from the original filename before
            // using it in the storage path.
            const safeName = imageFile.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
            photoUrl = await uploadBuffer({
                buffer: imageFile.buffer,
                key: `events/${uuidv4()}-${safeName}`,
            })
        }

        // Creates the linked community post automatically, so the event
        // shows up in both Events and Community under the same author.
        const thread = await threadService.postByUserId(userId, {
            title: `${title} — Event`,
            content: description || title,
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
        })

        return await getByEventUuid(eventUuid)
    }
}