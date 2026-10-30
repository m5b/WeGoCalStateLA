import {Router} from 'express'
import CommentDto from "../dtos/commentDto.mjs";
import {jsend} from "../util/jSend.mjs";
import {commentSchema} from "../validators/commentsValidators.mjs";
import {uuidSchema} from "../validators/authValidators.mjs";
import buildCommentTree from "../util/commentTreeBuilder.mjs";
import { requireAuth } from '../middlewares/requireAuth.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { optionalAuth } from '../middlewares/optionalAuth.mjs'
import { assertCanView } from '../util/visibility.mjs'


export function createCommentRouter({userService, commentService}) {

    const router = Router()
    //tested

    router.get('/me', requireAuth(userService), async (req, res) => {
        const comments = await commentService.getByUserId(req.user.userId)
        const commentDTOs = comments.map((comment) => new CommentDto(comment))
        res.json(jsend.success({comments: commentDTOs}))

    })

    //tested
    router.post(
        '/me/thread/:threadUuid',
        optionalAuth(userService),
        async (req, res) => {
            const userId = req.user ? req.user.userId : null
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userId,
                threadUuid,
                payload,
                parentCommentUuid: null,
            })
            res.json(
                jsend.success({
                    comment: new CommentDto(comment),
                })
            )
        }
    )
    //tested
    router.post(
        '/me/thread/:threadUuid/comment/:parentCommentUuid',
        optionalAuth(userService),
        async (req, res) => {
            const userId = req.user ? req.user.userId : null
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const parentCommentUuid = uuidSchema.parse(
                req.params.parentCommentUuid
            )
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userId,
                threadUuid,
                payload,
                parentCommentUuid,
            })
            res.json(
                jsend.success({
                    comment: new CommentDto(comment),
                })
            )
        }
    )
    //tested
    router.patch('/me/:commentUuid', requireAuth(userService), async (req, res) => {
        const userId = req.user.userId
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const payload = commentSchema.parse(req.body)
        const comment = await commentService.patchByCommentUuid({
            commentUuid,
            userId,
            payload,
            // Admins can edit any reply, not only their own.
            isAdmin: Boolean(req.user.isAdmin),
        })
        res.send(
            jsend.success({
                comment: new CommentDto(comment),
            })
        )
    })

    //tested
    router.delete(
        '/me/:commentUuid',
        requireAuth(userService),
        async (req, res) => {
            const commentUuid = uuidSchema.parse(req.params.commentUuid)
            const userId = req.user.userId
            // Admins can delete any reply, not only their own.
            await commentService.deleteByCommentUuid({ commentUuid, userId, isAdmin: Boolean(req.user.isAdmin) })
            res.send(jsend.success(null))
        }
    )
    //tested
    router.get('/:commentUuid', async (req, res) => {
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const comment = await commentService.getByCommentUuid(commentUuid)
        res.json(
            jsend.success({
                comment: new CommentDto(comment)
            })
        )
    })

    //tested
    // Public: anyone can read a public thread's replies without being signed
    // in. Private threads' replies need an account.
    router.get('/thread/:threadUuid', optionalAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const {thread, comments} = await commentService.getByThreadUuid(threadUuid)
        assertCanView(thread, req.user)
        const threadDto = new ThreadDto(thread)
        const commentDtos = comments.map((comment) => new CommentDto(comment))

        const { commentDtoTreeList, commentTreeMap } =
            buildCommentTree(commentDtos)
        //store redis in future
        res.json(jsend.success({threadDto, comments: commentDtoTreeList}))
    })

    router.get('/thread/:threadUuid/comment/:commentUuid', optionalAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const { thread, comments } =
            await commentService.getByThreadUuid(threadUuid)
        assertCanView(thread, req.user)
        const commentDtos = comments.map((comment) => new CommentDto(comment))

        const { commentDtoTreeList, commentTreeMap } =
            buildCommentTree(commentDtos)
        const subComment = commentTreeMap.get(commentUuid)
        //store redis in future
        res.json(jsend.success({ comments: subComment}))
    })


    return router
}