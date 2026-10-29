import { Router } from 'express'
import multer from 'multer'
import {
    threadPatchSchema, threadPostSchema,
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
import {uuidSchema} from "../validators/authValidators.mjs";
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { optionalAuth } from '../middlewares/optionalAuth.mjs'
import { BadRequestError } from '../errors/badRequestError.mjs'

// Photos are held in memory and saved by threadService. Only real picture types are
// accepted, since uploads are served back to browsers from /api/uploads.
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        if (!IMAGE_TYPES.has(file.mimetype)) {
            return callback(new BadRequestError(null, 'Use a JPEG, PNG, WebP, or GIF image.'))
        }
        callback(null, true)
    },
})

export function createThreadRouter({userService, threadService}){
    const router = Router()
    // Public: anyone can read the Community feed without being signed in.
    // optionalAuth only fills in which posts the signed-in person has liked; it never blocks.
    router.get('/', optionalAuth(userService), async (req, res) => {
        const threads = await threadService.getAll()
        await threadService.markLikedBy(threads, req.user?.userId)
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    router.get('/me', requireAuth(userService), async (req, res) => {
        const threads = await threadService.getByUserId(req.user.userId)
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    // Posting doesn't require an account: optionalAuth attaches req.user if
    // the person is signed in, but never blocks the request if not -- an
    // unauthenticated post is attributed to "Anonymous" (see threadsRepository).
    router.post('/me', optionalAuth(userService), upload.single('image'), async (req, res) => {
        const payload = threadPostSchema.parse(req.body)
        const userId = req.user ? req.user.userId : null
        const thread = await threadService.postByUserId(userId, payload, req.file)
        const threadDto = new ThreadDto(thread)
        res.json(jsend.success({thread: threadDto}))
    })

    //tested
    router.patch('/me/:threadUuid', requireAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const payload = threadPatchSchema.parse(req.body)
        const user = req.user
        const thread = await threadService.patchByThreadUuid({
            userId: user.userId,
            threadUuid,
            payload,
        })
        res.send(jsend.success({ thread: new ThreadDto(thread) }))
    })

    //tested
    router.delete('/me/:threadUuid', requireAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const user = req.user
        await threadService.deleteByThreadUuid({
            threadUuid,
            userId: user.userId,
        })
        res.send(jsend.success(null))
    })


    // Public: anyone can edit any thread, signed in or not. Temporary, to
    // keep things simple -- the author-only PATCH /me/:threadUuid above is
    // still available.
    router.patch('/:threadUuid', async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const payload = threadPatchSchema.parse(req.body)
        const thread = await threadService.patchAnyByThreadUuid({ threadUuid, payload })
        res.send(jsend.success({ thread: new ThreadDto(thread) }))
    })

    // Like or un-like a post. Needs an account so one person can't like it many times.
    router.post('/:threadUuid/like', requireAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const result = await threadService.toggleLike({ threadUuid, userId: req.user.userId })
        res.json(jsend.success(result))
    })

    //tested
    // Public: anyone can view a single thread without being signed in.
    router.get('/:threadUuid', optionalAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const thread = await threadService.getByThreadUuid(threadUuid)
        await threadService.markLikedBy(thread, req.user?.userId)
        res.json(jsend.success({thread: new ThreadDto(thread)}))
    })

    return router
}