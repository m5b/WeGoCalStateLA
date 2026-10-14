import { Router } from 'express'
import {
    threadPatchSchema, threadPostSchema,
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
import {uuidSchema} from "../validators/authValidators.mjs";
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { optionalAuth } from '../middlewares/optionalAuth.mjs'

export function createThreadRouter({userService, threadService}){
    const router = Router()
    // Public: anyone can read the Community feed without being signed in.
    router.get('/', async (req, res) => {
        const threads = await threadService.getAll()
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
    router.post('/me', optionalAuth(userService), async (req, res) => {
        const payload = threadPostSchema.parse(req.body)
        const userId = req.user ? req.user.userId : null
        const thread = await threadService.postByUserId(userId, payload)
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


    //tested
    // Public: anyone can view a single thread without being signed in.
    router.get('/:threadUuid', async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const thread = await threadService.getByThreadUuid(threadUuid)
        res.json(jsend.success({thread: new ThreadDto(thread)}))
    })

    return router
}