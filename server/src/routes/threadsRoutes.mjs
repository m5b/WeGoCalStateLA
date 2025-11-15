import { Router } from 'express'
import {
    deleteThreadByThreadId, getThreadResourceByThreadId,
    getUserThreadResource,
    patchThreadResourceByThreadId, postThreadResource,
} from '../services/threadsService.mjs'
import {
    threadIdSchema,
    threadPatchSchema, threadPostSchema,
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import {getCommentsResourceTreeByThreadId} from "../services/commentsService.mjs";
import CommentDto from "../dtos/commentDto.mjs";
import buildCommentsTree from "../util/commentTreeBuilder.mjs";
const router = Router()

//tested
router.get('/me', requireJwtAuth, async (req, res) => {
    const threads = await getUserThreadResource(req.user.userId)
    const threadDtos = threads.map((thread) => new ThreadDto(thread))
    res.send(jsend.success({ threads: threadDtos }))
})

//tested
router.post('/me', requireJwtAuth, async (req, res) => {
    const payload = threadPostSchema.parse(req.body)
    const thread = await postThreadResource(req.user.userId, payload)
    res.json(jsend.success({thread: new ThreadDto(thread)}))
})

//tested
router.patch('/me/:threadId', requireJwtAuth, async (req, res) => {
    const {threadId} = threadIdSchema.parse({
        threadId: req.params.threadId,
    })

    const payload = threadPatchSchema.parse(req.body)
    const thread = await patchThreadResourceByThreadId(req.user, threadId, payload)
    console.log(thread)
    res.send(jsend.success({ thread:  new ThreadDto(thread)}))
})
//tested
router.delete('/me/:threadId', requireJwtAuth, async (req, res) => {
    const {threadId} = threadIdSchema.parse({
        threadId: req.params.threadId,
    })
    await deleteThreadByThreadId(threadId, req.user.userId)
    res.send(jsend.success(null))
})


//tested
router.get('/:threadId', async (req, res) => {
    const {threadId} = threadIdSchema.parse({threadId: req.params.threadId})
    const thread = await getThreadResourceByThreadId(threadId)
    res.json(jsend.success({thread: new ThreadDto(thread)}))
})

//tested
router.get('/:threadId/comments', async (req, res) => {
    const {threadId} = threadIdSchema.parse({threadId: req.params.threadId})
    const thread = await getThreadResourceByThreadId(threadId)
    const comments = await getCommentsResourceTreeByThreadId(threadId)
    const commentDtos = comments.map(
        (comment) => new CommentDto(comment, { scope: 'public' })
    )
    const commentTrees = buildCommentsTree(commentDtos)
    res.send(jsend.success({ thread: new ThreadDto(thread), comments: commentTrees }))
})
//tested

export default router
