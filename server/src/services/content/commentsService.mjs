import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import {UnauthorizedError} from "../../errors/unauthorizedError.mjs";
import { v4 as uuidv4 } from 'uuid';
import buildPatchQuery from "../../util/buildPatchQuery.mjs";
import { assertCanView } from '../../util/visibility.mjs'
import { BadRequestError } from '../../errors/badRequestError.mjs'
import { IMAGE_EXTENSIONS } from '../../lib/imageTypes.mjs'

// uploadBuffer saves an attached picture and returns its URL (see lib/localStorage.mjs).
export function createCommentService({commentRepo, threadService, uploadBuffer}) {
    return{
        getByCommentId,
        getByCommentUuid,
        getByThreadId,
        getByThreadUuid,
        getByUserId,
        getByUserUuid,
        patchByCommentId,
        patchByCommentUuid,
        postComment,
        deleteByCommentId,
        deleteByCommentUuid,
    }

    async function getByCommentId(commentId) {
        const comment = dbMapper.fromDb(await commentRepo.findByCommentId(commentId))
        if (!comment) {
            throw new NotFoundError({
                comment:
                    'Can not found the comment resource given the identifier',
            })
        }
        return comment
    }

    async function getByCommentUuid(commentUuid) {
        const comment = dbMapper.fromDb(await commentRepo.findByCommentUuid(commentUuid))
        if (!comment) {
            throw new NotFoundError({
                comment:
                    'Can not found the comment resource given the identifier',
            })
        }
        return comment
    }


    async function getByThreadId(threadId) {
        const thread = await threadService.getByThreadId(threadId)
        const comments = dbMapper.fromDb(await commentRepo.findByThreadId(threadId))
        return{thread, comments}
    }

    async function getByThreadUuid(threadUuid) {
        const thread = await threadService.getByThreadUuid(threadUuid)
        const comments = dbMapper.fromDb(await commentRepo.findByThreadUuid(threadUuid))
        return{thread, comments}
    }


    async function getByUserId(userId) {
        const comments = dbMapper.fromDb(await commentRepo.findByUserId(userId))
        return comments
    }

    async function getByUserUuid(userUuid) {
        const comments = dbMapper.fromDb(await commentRepo.findByUserUuid(userUuid))
        return comments
    }

        // imageFile is multer's req.file (undefined when no picture was attached).
    async function postComment({userId, threadUuid, payload, parentCommentUuid, imageFile}) {
        const thread = await threadService.getByThreadUuid(threadUuid)
        // Replying anonymously is only allowed on public threads.
        if (userId == null) assertCanView(thread, null)
        const { content } = payload
        // A reply needs some text or a picture (or both).
        if (!content.trim() && !imageFile) {
            throw new BadRequestError({ content: 'Write a reply or attach a picture.' }, 'Write a reply or attach a picture.')
        }
        let photoUrl = null
        if (imageFile) {
            // Name the file from its type, never from the uploaded file name.
            const ext = IMAGE_EXTENSIONS[imageFile.mimetype] ?? 'jpg'
            photoUrl = await uploadBuffer({ buffer: imageFile.buffer, key: `comments/${uuidv4()}.${ext}` })
        }
        let inserted, insertId
        if(parentCommentUuid == null){
            const result = await commentRepo.insertComment({
                userId: userId,
                threadId: thread.threadId,
                content: content,
                commentUuid: uuidv4(),
                photoUrl,
            })
            insertId = result.insertId
            inserted = result.inserted
        }
        else{
            const result = await commentRepo.insertCommentWithParent({
                userId: userId,
                threadId: thread.threadId,
                content: content,
                commentUuid: uuidv4(),
                parentCommentUuid,
                photoUrl,
            })
            insertId = result.insertId
            inserted = result.inserted
        }
        if(!inserted){
            throw new NotFoundError(null, "Resource Not Found")
        }
        const comment = await getByCommentId(insertId)
        return comment
    }

    async function patchByCommentId({commentId, userId, payload}) {
        const { sqlQuery, dataList } = buildPatchQuery(
            'comments',
            dbMapper.toDb(payload)
        )
        const{existed, changed} = await commentRepo.updateByCommentId({
            commentId, userId, sqlQuery, dataList
        })
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const comment = await getByCommentId(commentId)
        return comment
    }

    // isAdmin lets an admin edit any reply, not only their own.
    async function patchByCommentUuid({commentUuid, userId, payload, isAdmin = false}){
        const { sqlQuery, dataList } = buildPatchQuery(
            'comments',
            dbMapper.toDb(payload)
        )
        const{existed, changed} = isAdmin
            ? await commentRepo.updateAnyByCommentUuid({ commentUuid, sqlQuery, dataList })
            : await commentRepo.updateByCommentUuid({ commentUuid, userId, sqlQuery, dataList })
        if(!existed){
            if (isAdmin) throw new NotFoundError({ comment: 'Cannot find reply with the given identifier' })
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const comment = await getByCommentUuid(commentUuid)
        return comment
    }



    async function deleteByCommentId({commentId, userId}) {
        const deleted = await commentRepo.deleteByCommentId({
            commentId, userId
        })
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }

    // isAdmin lets an admin delete any reply, not only their own.
    async function deleteByCommentUuid({commentUuid, userId, isAdmin = false}) {
        const deleted = isAdmin
            ? await commentRepo.deleteAnyByCommentUuid({ commentUuid })
            : await commentRepo.deleteByCommentUuid({ commentUuid, userId })
        if(!deleted){
            if (isAdmin) throw new NotFoundError({ comment: 'Cannot find reply with the given identifier' })
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
}