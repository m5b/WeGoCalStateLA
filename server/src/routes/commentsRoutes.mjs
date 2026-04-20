import {Router} from 'express'
import {requireJWTAuth} from '../middlewares/requireCookie.mjs'
import CommentDto from "../dtos/commentDto.mjs";
import {jsend} from "../util/jSend.mjs";
import {commentSchema} from "../validators/commentsValidators.mjs";
import {uuidSchema} from "../validators/authValidators.mjs";
import buildCommentTree from "../util/commentTreeBuilder.mjs";
import { reqAuth } from '../middlewares/reqAuth.mjs'


export function createCommentRouter({userService, commentService}) {

    const router = Router()
    //tested

    router.get('/me', reqAuth(userService), async (req, res) => {
        const comments = await commentService.getByUserUuid(req.userUuid)
        const commentDTOs = comments.map((comment) => new CommentDto(comment))
        res.json(jsend.success({comments: commentDTOs}))

    })

    //tested
    router.post(
        '/me/thread/:threadUuid',
        reqAuth(userService),
        async (req, res) => {
            const userUuid = req.userUuid
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userUuid,
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
        reqAuth(userService),
        async (req, res) => {
            const userUuid = req.userUuid
            const threadUuid = uuidSchema.parse(req.params.threadUuid)
            const parentCommentUuid = uuidSchema.parse(
                req.params.parentCommentUuid
            )
            const payload = commentSchema.parse(req.body)
            const comment = await commentService.postComment({
                userUuid,
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

    router.patch('/me/:commentUuid', reqAuth(userService), async (req, res) => {
        const userUuid = req.userUuid
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const payload = commentSchema.parse(req.body)
        const comment = await commentService.patchByCommentUuid({
            commentUuid,
            userUuid,
            payload,
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
        reqAuth(userService),
        async (req, res) => {
            const userUuid = req.userUuid
            const commentUuid = uuidSchema.parse(req.params.commentUuid)
            await commentService.deleteByCommentUuid({ commentUuid, userUuid })
            res.send(jsend.success(null))
        }
    )

    router.get('/:commentUuid', async (req, res) => {
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const comment = await commentService.getByCommentUuid(commentUuid)
        res.json(
            jsend.success({
                comment: new CommentDto(comment)
            })
        )
    })


    router.get('/thread/:threadUuid',reqAuth(userService),  async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const {thread, comments} = await commentService.getByThreadUuid(threadUuid)
        const {commentDtoTreeList, commentTreeMap} = buildCommentTree(comments)
        //store redis in future
        res.json(jsend.success({thread, comments: commentDtoTreeList}))
    })

    router.get('/thread/:threadUuid/comment/:commentUuid', reqAuth(userService), async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const commentUuid = uuidSchema.parse(req.params.commentUuid)
        const {thread, comments} = await commentService.getByThreadUuid(threadUuid)
        const {commentDtoTreeList, commentTreeMap} = buildCommentTree(comments)
        //store redis in future
        res.json(jsend.success({ comment: commentTreeMap.get(commentUuid)}))
    })


    return router
}
