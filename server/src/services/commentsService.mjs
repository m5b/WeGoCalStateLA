import {
    deleteByCommentId, findByCommentId, findByThreadId, findByUserId,
    insertComment, updateByCommentId,
} from '../repositories/commentsRepository.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
import {UnauthorizedError} from "../errors/unauthorizedError.mjs";
import {GoneError} from "../errors/goneError.mjs";
import buildPatchQuery from "../util/buildPatchQuery.mjs";
import {getThreadResourceByThreadId} from "./threadsService.mjs";



export async function getCommentResourceByCommentId(commentId) {
    const comment = dbMapper.fromDb(await findByCommentId(commentId))
    if (!comment) {
        throw new NotFoundError(
            {comment:"Can not found the parent comment resource given the identifier"},
        )
    }
    return comment
}

export async function getCommentResourceByUserId(userId) {
    const comments = dbMapper.fromDb(await findByUserId(userId))
    return comments
}

export async function getCommentsResourceTreeByThreadId(threadId) {
    const comments = dbMapper.fromDb(await findByThreadId(threadId))
    return comments
}

export async function patchCommentResourceByCommentId(user, commentId, payload) {
    let comment = await getCommentResourceByCommentId(commentId)
    if (user.userId !== comment.userId) {
        throw new UnauthorizedError({
            auth: "You don't have ownership for this comment",
        })
    }
    //thread has been deleted, therefore unable to patch
    if(comment.deletedAt !== null){
        throw new GoneError({
            thread: "Comment has been removed due to user delete the resource"
        })
    }


    const { sqlQuery, dataList } = buildPatchQuery(
        'comments',
        dbMapper.toDb(payload)
    )
    await updateByCommentId(commentId, sqlQuery, dataList)
    comment = await getCommentResourceByCommentId(commentId)
    return comment
}

export async function createComment(userId, threadId, payload, parentId) {
    const thread = await getThreadResourceByThreadId(threadId)
    if(!thread){
        throw new NotFoundError({thread: "Can not found the thread resource given the identifier"})
    }
    if(parentId != null){
        const comment=  await getCommentResourceByCommentId(parentId)
        if(!comment){
            throw new NotFoundError({comment:"Can not found the parent comment resource given the identifier"})
        }
        if(comment.threadId !== threadId){
            throw new NotFoundError({comment:"The comment does not belong to this thread"})
        }
    }
    const {content} = payload
    const commentId = await insertComment({userId:userId, threadId: threadId, content: content, parentId: parentId})
    const comment = await getCommentResourceByCommentId(commentId)
    return comment
}

export async function deleteCommentByCommentId(commentId, userId) {
    //check if it is deleted
    let comment = await getCommentResourceByCommentId(commentId)
    if (userId !== comment.userId) {
        throw new UnauthorizedError({
            auth: "You don't have ownership for this comment",
        })
    }
    if (comment.deletedAt === null) {

        await deleteByCommentId(commentId)
    }
    return
}
