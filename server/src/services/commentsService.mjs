import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
import {UnauthorizedError} from "../errors/unauthorizedError.mjs";
import {GoneError} from "../errors/goneError.mjs";
import buildPatchQuery from "../util/buildPatchQuery.mjs";

export function createCommentService({commentRepo, threadService}) {
    return{
        getByCommentId,
        getByThreadId,
        getByUserId,
        patchByCommendId,
        postComment,
        deleteByCommentId,
    }
    async function getByCommentId(commentId) {
        const comment = dbMapper.fromDb(await commentRepo.findByCommentId(commentId))
        if (!comment) {
            throw new NotFoundError({
                comment:
                    'Can not found the parent comment resource given the identifier',
            })
        }
        return comment
    }

    async function getByUserId(userId) {
        const comments = dbMapper.fromDb(await commentRepo.findByUserId(userId))
        return comments
    }

    async function getByThreadId(threadId) {
        const comments = dbMapper.fromDb(await commentRepo.findByCommentId(threadId))
        return comments
    }

    async function patchByCommendId(
        userId,
        commentId,
        payload
    ) {
        let comment = await getByCommentId(commentId)
        if (userId !== comment.userId) {
            throw new UnauthorizedError({
                auth: "You don't have ownership for this comment",
            })
        }
        //thread has been deleted, therefore unable to patch
        if (comment.deletedAt !== null) {
            throw new GoneError({
                thread: 'Comment has been removed due to user delete the resource',
            })
        }

        const { sqlQuery, dataList } = buildPatchQuery(
            'comments',
            dbMapper.toDb(payload)
        )
        await commentRepo.updateByCommentId(commentId, sqlQuery, dataList)
        comment = await getByCommentId(commentId)
        return comment
    }

    async function postComment(userId, threadId, payload, parentId) {
        const thread = await threadService.getByThreadId(threadId)
        if (!thread) {
            throw new NotFoundError({
                thread: 'Can not found the thread resource given the identifier',
            })
        }
        if (parentId != null) {
            const comment = await getByCommentId(parentId)
            if (!comment) {
                throw new NotFoundError({
                    comment:
                        'Can not found the parent comment resource given the identifier',
                })
            }
            if (comment.threadId !== threadId) {
                throw new NotFoundError({
                    comment: 'The comment does not belong to this thread',
                })
            }
        }
        const { content } = payload
        const commentId = await commentRepo.insertComment({
            userId: userId,
            threadId: threadId,
            content: content,
            parentId: parentId,
        })
        const comment = await getByCommentId(commentId)
        return comment
    }

    async function deleteByCommentId(commentId, userId) {
        //check if it is deleted
        let comment = await getByCommentId(commentId)
        if (userId !== comment.userId) {
            throw new UnauthorizedError({
                auth: "You don't have ownership for this comment",
            })
        }
        if (comment.deletedAt === null) {
            await commentRepo.deleteByCommentId(commentId)
        }
        return
    }
}