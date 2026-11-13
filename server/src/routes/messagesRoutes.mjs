import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { requireAdmin } from '../middlewares/requireAdmin.mjs'
import { uuidSchema } from '../validators/authValidators.mjs'
import { messageSendSchema, messageReportSchema, peopleSearchSchema } from '../validators/messagesValidators.mjs'
import { createImageUpload } from '../lib/imageUpload.mjs'
import { jsend } from '../util/jSend.mjs'

// Direct messages. Everything here needs an account; the report review routes need an admin.
export function createMessagesRouter({ userService, messagesService }) {
    const router = Router()
    const auth = requireAuth(userService)
    const upload = createImageUpload()

    // How many messages are waiting for you (shown as a badge next to the account menu).
    router.get('/unread-count', auth, async (req, res) => {
        res.json(jsend.success({ unread: await messagesService.unreadCount(req.user.userId) }))
    })

    // Find someone to message by name.
    router.get('/people', auth, async (req, res) => {
        const { q } = peopleSearchSchema.parse(req.query)
        const people = await messagesService.searchPeople({ userId: req.user.userId, query: q })
        res.json(jsend.success({ people }))
    })

    router.get('/conversations', auth, async (req, res) => {
        res.json(jsend.success({ conversations: await messagesService.listConversations(req.user.userId) }))
    })

    // Close a conversation: it leaves your list but nothing is deleted. It comes back when you open it
    // again (the second route) or when a new message is sent in it.
    router.post('/conversations/:userUuid/close', auth, async (req, res) => {
        const personUuid = uuidSchema.parse(req.params.userUuid)
        await messagesService.closeConversation({ userId: req.user.userId, personUuid })
        res.json(jsend.success(null))
    })

    router.post('/conversations/:userUuid/open', auth, async (req, res) => {
        const personUuid = uuidSchema.parse(req.params.userUuid)
        await messagesService.openConversation({ userId: req.user.userId, personUuid })
        res.json(jsend.success(null))
    })

    // Open a conversation (marks their messages to you as read).
    router.get('/with/:userUuid', auth, async (req, res) => {
        const otherUuid = uuidSchema.parse(req.params.userUuid)
        const conversation = await messagesService.getConversation({ userId: req.user.userId, otherUuid })
        res.json(jsend.success(conversation))
    })

    // Send a message: text, a picture (multipart field "image"), or both.
    router.post('/with/:userUuid', auth, upload.single('image'), async (req, res) => {
        const recipientUuid = uuidSchema.parse(req.params.userUuid)
        const { content } = messageSendSchema.parse(req.body)
        const message = await messagesService.send({
            senderId: req.user.userId, recipientUuid, content, imageFile: req.file,
        })
        res.json(jsend.success({ message }))
    })

    // The people you have blocked.
    router.get('/blocks', auth, async (req, res) => {
        res.json(jsend.success({ blocked: await messagesService.listBlocked(req.user.userId) }))
    })

    router.put('/blocks/:userUuid', auth, async (req, res) => {
        const personUuid = uuidSchema.parse(req.params.userUuid)
        await messagesService.block({ userId: req.user.userId, personUuid })
        res.json(jsend.success(null))
    })

    router.delete('/blocks/:userUuid', auth, async (req, res) => {
        const personUuid = uuidSchema.parse(req.params.userUuid)
        await messagesService.unblock({ userId: req.user.userId, personUuid })
        res.json(jsend.success(null))
    })

    // A message's picture, only for the two people in the conversation.
    router.get('/photo/:messageUuid', auth, async (req, res) => {
        const messageUuid = uuidSchema.parse(req.params.messageUuid)
        const file = await messagesService.getPhotoFile({ userId: req.user.userId, messageUuid })
        res.set('Cache-Control', 'private, max-age=3600')
        res.set('X-Content-Type-Options', 'nosniff')
        res.sendFile(file)
    })

    // ---- admin: review reports ----
    router.get('/reports', auth, requireAdmin, async (req, res) => {
        const includeResolved = req.query.all === '1'
        res.json(jsend.success({ reports: await messagesService.listReports({ includeResolved }) }))
    })

    router.patch('/reports/:reportUuid/resolve', auth, requireAdmin, async (req, res) => {
        const reportUuid = uuidSchema.parse(req.params.reportUuid)
        await messagesService.resolveReport({ adminId: req.user.userId, reportUuid })
        res.json(jsend.success(null))
    })

    router.get('/reports/:reportUuid/photo', auth, requireAdmin, async (req, res) => {
        const reportUuid = uuidSchema.parse(req.params.reportUuid)
        const file = await messagesService.getReportPhotoFile(reportUuid)
        res.set('Cache-Control', 'private, max-age=3600')
        res.set('X-Content-Type-Options', 'nosniff')
        res.sendFile(file)
    })

    // Report a message you received, and delete one you sent. (Last, so the fixed paths above win.)
    router.post('/:messageUuid/report', auth, async (req, res) => {
        const messageUuid = uuidSchema.parse(req.params.messageUuid)
        const { reason } = messageReportSchema.parse(req.body)
        await messagesService.report({ userId: req.user.userId, messageUuid, reason })
        res.json(jsend.success(null))
    })

    router.delete('/:messageUuid', auth, async (req, res) => {
        const messageUuid = uuidSchema.parse(req.params.messageUuid)
        await messagesService.deleteMessage({ userId: req.user.userId, messageUuid })
        res.json(jsend.success(null))
    })

    return router
}