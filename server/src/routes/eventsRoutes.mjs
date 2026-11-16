import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { optionalAuth } from '../middlewares/optionalAuth.mjs'
import { eventForViewer } from '../util/visibility.mjs'
import { eventPatchSchema, eventPostSchema } from '../validators/eventsValidators.mjs'
import { uuidSchema } from '../validators/authValidators.mjs'
import { jsend } from '../util/jSend.mjs'

// Holds the uploaded file in memory (req.file.buffer) so eventService can
// write it to disk itself. 8MB cap guards against oversized uploads.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
})

export function createEventsRouter({userService, eventService}) {
    const router = Router()

    // Public event feed. Private events come back locked for signed-out
    // visitors.
    router.get('/', optionalAuth(userService), async (req, res) => {
        const events = await eventService.getAll()
        res.json(jsend.success({ events: events.map((event) => eventForViewer(event, req.user)) }))
    })

    // Events the logged-in user posted.
    router.get('/me', requireAuth(userService), async (req, res) => {
        const events = await eventService.getByUserId(req.user.userId)
        res.json(jsend.success({ events }))
    })

    // Creates an event (and its linked community post). Image is optional.
    router.post('/me', requireAuth(userService), upload.single('image'), async (req, res) => {
        const payload = eventPostSchema.parse(req.body)
        const event = await eventService.postByUserId(req.user.userId, payload, req.file)
        res.json(jsend.success({ event }))
    })

    // Edits an event the logged-in user created (or any event, for an admin). Image is optional; if sent
    // it replaces the current cover image.
    router.patch('/me/:eventUuid', requireAuth(userService), upload.single('image'), async (req, res) => {
        const eventUuid = uuidSchema.parse(req.params.eventUuid)
        const payload = eventPatchSchema.parse(req.body)
        // Admins can edit any event, not only their own.
        const event = await eventService.patchByEventUuid(req.user.userId, eventUuid, payload, req.file, { isAdmin: Boolean(req.user.isAdmin) })
        res.json(jsend.success({ event }))
    })

    // Deletes an event (and its linked community post). The creator or an admin can do this.
    router.delete('/me/:eventUuid', requireAuth(userService), async (req, res) => {
        const eventUuid = uuidSchema.parse(req.params.eventUuid)
        await eventService.deleteByEventUuid(req.user.userId, eventUuid, { isAdmin: Boolean(req.user.isAdmin) })
        res.json(jsend.success(null))
    })

    // Single event detail.
    router.get('/:eventUuid', optionalAuth(userService), async (req, res) => {
        const eventUuid = uuidSchema.parse(req.params.eventUuid)
        const event = await eventService.getByEventUuid(eventUuid)
        res.json(jsend.success({ event: eventForViewer(event, req.user) }))
    })

    return router
}