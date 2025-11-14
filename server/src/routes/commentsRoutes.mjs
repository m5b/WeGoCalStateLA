import { Router } from 'express'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import {
    getCommentIDsByThreadID,
    getCommentIDsByParentID,
    getComment,
    createComment,
} from '../services/commentsService.mjs'
import { threadIdSchema } from '../validators/threadsValidators.mjs'
import { commentIdSchema } from '../validators/commentsValidators.mjs'
import { createCommentSchema } from '../validators/commentsValidators.mjs'
import { userIdSchema } from '../validators/userValidators.mjs'
import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get('/thread/:threadId', async (req, res) => {
    const threadId = threadIdSchema.parse(req.params.threadId)
    const ids = await getCommentIDsByThreadID(threadId)
    res.json(jsend.success({ threadIds: ids }))
})

router.get('/parent/:parentID', async (req, res) => {
    const parentId = commentIdSchema.parse(req.params.threadId)
    const ids = await getCommentIDsByParentID(parentId)
    res.json(jsend.success({ threadIds: ids }))
})

router.get('/:commentId', async (req, res) => {
    const commentId = commentIdSchema.parse(req.params.commentId)
    const comment = await getComment(commentId)
    res.json(jsend.success(comment))
})

router.post('/thread/:threadId/comment/:parentId', requireJwtAuth, async (req, res) => {

    const userId = userIdSchema.parse({userId: req.user.userId})

    const parentId = commentIdSchema.parse(req.params.parentId)
    
    const threadId = threadIdSchema.parse(req.params.threadId)
    
    const data = createCommentSchema.parse(req.body)
    
    const newComment = await createComment(data)
    res.json(jsend.success(null))

})

export default router
