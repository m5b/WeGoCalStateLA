import { Router } from 'express'
import {
    threadIdSchema,
    threadPatchSchema, threadPostSchema,
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
import {requireJWTAuth} from '../middlewares/requireCookie.mjs'
import CommentDto from "../dtos/commentDto.mjs";
import buildCommentsTree from "../util/commentTreeBuilder.mjs";

export function createThreadRouter({threadService, commentService}){

    const router = Router()

    router.get("/", async (req, res) => {
        const threads = await threadService.getAll()
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    router.get('/me', requireJWTAuth, async (req, res) => {
        const threads = await threadService.getByUserId(req.userId)
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    router.post('/me', requireJWTAuth, async (req, res) => {
        const payload = threadPostSchema.parse(req.body)
        const thread = await threadService.postByUserId(req.userId, payload)
        res.json(jsend.success(null))
    })

    //tested
    router.patch('/me/:threadId', requireJWTAuth, async (req, res) => {
        const {threadId} = threadIdSchema.parse({
            threadId: req.params.threadId,
        })

        const payload = threadPatchSchema.parse(req.body)
        const thread = await threadService.patchByThreadId(req.userId, threadId, payload)
        console.log(thread)
        res.send(jsend.success({ thread:  new ThreadDto(thread)}))
    })

    //tested
    router.delete('/me/:threadId', requireJWTAuth, async (req, res) => {
        const {threadId} = threadIdSchema.parse({
            threadId: req.params.threadId,
        })
        await threadService.deleteByThreadId(threadId, req.user.userId)
        res.send(jsend.success(null))
    })


    //tested
    router.get('/:threadId', async (req, res) => {
        const {threadId} = threadIdSchema.parse({threadId: req.params.threadId})
        const thread = await threadService.getByThreadId(threadId)
        res.json(jsend.success({thread: new ThreadDto(thread)}))
    })

    //tested
    router.get('/:threadId/comments', async (req, res) => {
        const {threadId} = threadIdSchema.parse({threadId: req.params.threadId})
        const thread = await threadService.getByThreadId(threadId)
        const comments = await commentService.getByThreadId(threadId)
        const commentDtos = comments.map(
            (comment) => new CommentDto(comment, { scope: 'public' })
        )
        const commentTrees = buildCommentsTree(commentDtos)
        res.send(jsend.success({ thread: new ThreadDto(thread), comments: commentTrees }))
    })
    return router
}
