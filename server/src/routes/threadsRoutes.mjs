import { Router } from 'express'
import { getThread, getThreadIDs } from '../services/threadsService.mjs'
import { getCommentsResource } from '../services/commentsService.mjs'
import { threadIdSchema } from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import CommentDto from '../dtos/commentDto.mjs'
import { jsend } from '../util/jSend.mjs'
import buildCommentsTree from '../util/commentTreeBuilder.mjs'
const router = Router()

router.get('/all', async (req, res) => {
    const ids = await getThreadIDs()
    res.json(jsend.success({ threadIds: ids }))
})

router.get('/:threadId', async (req, res) => {
    const threadId = threadIdSchema.parse(req.params.threadId)
    const thread = await getThread(threadId)
    res.json(jsend.success(thread))
})

router.get('/:threadId/comments', async (req, res) => {
    const threadId = threadIdSchema.parse(req.params.threadId)
    const thread = await getThread(threadId)
    const comments = await getCommentsResource(threadId)
    const commentDtos = comments.map(
        (comment) => new CommentDto(comment, { scope: 'public' })
    )

    const commentTrees = buildCommentsTree(commentDtos)
    res.send(jsend.success({ thread, comments: commentTrees }))
})

export default router
