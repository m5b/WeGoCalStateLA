import { Router } from 'express'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import {
    createComment,
    deleteCommentByCommentId,
    getCommentResourceByCommentId,
    patchCommentResourceByCommentId
} from "../services/commentsService.mjs";

import {threadIdSchema} from "../validators/threadsValidators.mjs";
import CommentDto from "../dtos/commentDto.mjs";

import {jsend} from "../util/jSend.mjs";
import {commentIdSchema, commentSchema} from "../validators/commentsValidators.mjs";
const router = Router()


//tested
router.get('/:commentId', async (req, res) => {
    const {commentId} = commentIdSchema.parse({commentId: req.params.commentId})
    const comment = await getCommentByCommentId(commentId)
    res.json(jsend.success({comment: new CommentDto(comment, {scope: "public"})}))
})
//tested
router.patch("/:commentId", requireJwtAuth, async (req, res) => {
    const {commentId} = commentIdSchema.parse({
        commentId: req.params.commentId,
    })
    const payload = commentSchema.parse(req.body)
    const comment = await patchCommentResourceByCommentId(req.user, commentId, payload)
    res.send(jsend.success({ comment:  new CommentDto(comment, {scope: "public"})}))
})

//tested
router.delete('/:commentId', requireJwtAuth, async (req, res) => {
    const {commentId} = commentIdSchema.parse({
        commentId: req.params.commentId,
    })
    await deleteCommentByCommentId(commentId, req.user.userId)
    res.send(jsend.success(null))
})

// router.get('/:commentId/comments', async (req, res) => {
//     const parentId = commentIdSchema.parse(req.params.threadId)
//     const ids = await getCommentIDsByParentID(parentId)
//     res.json(jsend.success({ threadIds: ids }))
// })


//tested
router.post('/thread/:threadId/comment/:parentId', requireJwtAuth, async (req, res) => {
    const {commentId} = commentIdSchema.parse({commentId: req.params.parentId})
    const parentId = commentId
    const {threadId} = threadIdSchema.parse({threadId: req.params.threadId})
    const payload = commentSchema.parse(req.body)
    const comment = await createComment(req.user.userId, threadId, payload, parentId)
    res.json(jsend.success({comment: new CommentDto(comment, {scope: "public"})}))
})


export default router
