import {
    getCommentIDsByThread,
    getCommentIDsByParent,
    findByCommentID,
    getCommentsByThreadId,
} from '../repositories/commentsRepository.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'

export async function getCommentIDsByThreadID(threadID) {
    const ids = dbMapper.fromDb(await getCommentIDsByThread(threadID))
    if (!ids) {
        throw new NotFoundError(null, 'Cannot find IDs with the given token')
    }
    return ids
}

export async function getCommentIDsByParentID(parentID) {
    const ids = dbMapper.fromDb(await getCommentIDsByParent(parentID))
    if (!ids) {
        throw new NotFoundError(null, 'Cannot find IDs with the given token')
    }
    return ids
}

export async function getComment(commentId) {
    const comment = dbMapper.fromDb(await findByCommentID(commentId))
    if (!comment) {
        throw new NotFoundError(
            null,
            'Cannot find comment with the given token'
        )
    }
    return comment
}

export async function getCommentsResource(threadId) {
    const comments = dbMapper.fromDb(await getCommentsByThreadId(threadId))
    return comments
}
