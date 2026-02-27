import { Router } from 'express'
import {requireJWTAuth} from '../middlewares/requireCookie.mjs'

import {threadIdSchema} from "../validators/threadsValidators.mjs";
import CommentDto from "../dtos/commentDto.mjs";

import {jsend} from "../util/jSend.mjs";
import {commentIdSchema, commentSchema} from "../validators/commentsValidators.mjs";


export function createCommentRouter(commentService){
    const router = Router()
    //tested
    router.get('/me', requireJWTAuth, async (req, res) => {
        const comments = await commentService.getByUserId(req.userId)
        const commentDtos = comments.map(
            (comment) => new CommentDto(comment, { scope: 'public' })
        )
        res.json(jsend.success({ comments: commentDtos }))
    })

    router.patch('/me/:commentId', requireJWTAuth, async (req, res) => {
        const { commentId } = commentIdSchema.parse({
            commentId: req.params.commentId,
        })
        const payload = commentSchema.parse(req.body)
        const comment = await commentService.patchByCommendId(
            req.userId,
            commentId,
            payload
        )
        res.send(
            jsend.success({
                comment: new CommentDto(comment, { scope: 'public' }),
            })
        )
    })

    //tested
    router.delete('/me/:commentId', requireJWTAuth, async (req, res) => {
        const { commentId } = commentIdSchema.parse({
            commentId: req.params.commentId,
        })
        await commentService.getByCommentId(commentId, req.userId)
        res.send(jsend.success(null))
    })

    // router.get('/:commentId/comments', async (req, res) => {
    //     const parentId = commentIdSchema.parse(req.params.threadId)
    //     const ids = await getCommentIDsByParentID(parentId)
    //     res.json(jsend.success({ threadIds: ids }))
    // })

    //tested
    router.get('/:commentId', async (req, res) => {
        const { commentId } = commentIdSchema.parse({
            commentId: req.params.commentId,
        })
        const comment = await commentService.getByCommentId(commentId)
        res.json(
            jsend.success({
                comment: new CommentDto(comment, { scope: 'public' }),
            })
        )
    })

    //tested
    router.post('/me/thread/:threadId/', requireJWTAuth, async (req, res) => {
        const { threadId } = threadIdSchema.parse({
            threadId: req.params.threadId,
        })
        const payload = commentSchema.parse(req.body)
        const comment = await commentService.postComment(
            req.user.userId,
            threadId,
            payload,
            null
        )
        res.json(
            jsend.success({
                comment: new CommentDto(comment, { scope: 'public' }),
            })
        )
    })
    //tested
    router.post(
        '/me/thread/:threadId/comment/:parentId',
        requireJWTAuth,
        async (req, res) => {
            const { commentId } = commentIdSchema.parse({
                commentId: req.params.parentId,
            })
            const parentId = commentId
            const { threadId } = threadIdSchema.parse({
                threadId: req.params.threadId,
            })
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment(
                req.user.userId,
                threadId,
                payload,
                parentId
            )
            res.json(
                jsend.success({
                    comment: new CommentDto(comment, { scope: 'public' }),
                })
            )
        }
    )

    return router
}
