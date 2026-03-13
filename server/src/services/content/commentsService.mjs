import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import {UnauthorizedError} from "../../errors/unauthorizedError.mjs";
import { v4 as uuidv4 } from 'uuid';
import buildPatchQuery from "../../util/buildPatchQuery.mjs";

export function createCommentService({commentRepo, threadService,userService}) {
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

    async function postComment({userUuid, threadUuid, payload, parentCommentUuid}) {
        const user = await userService.getByUuid(userUuid)
        const thread = await threadService.getByThreadUuid(threadUuid)
        const { content } = payload
        let inserted, insertId
        if(parentCommentUuid == null){
            const result = await commentRepo.insertComment({
                userId: user.userId,
                threadId: thread.threadId,
                content: content,
                commentUuid: uuidv4(),
            })
            insertId = result.insertId
            inserted = result.inserted
        }
        else{
            const result = await commentRepo.insertCommentWithParent({
                userId: user.userId,
                threadId: thread.threadId,
                content: content,
                commentUuid: uuidv4(),
                parentCommentUuid,
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


    async function patchByCommentId({commentId, userUuid, payload}) {
        const user = await userService.getByUuid(userUuid)
        const { sqlQuery, dataList } = buildPatchQuery(
            'comments',
            dbMapper.toDb(payload)
        )
        const{existed, changed} = await commentRepo.updateByCommentId({
            commentId, userId: user.userId, sqlQuery, dataList
        })
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const comment = await getByCommentId(commentId)
        return comment
    }

    async function patchByCommentUuid({commentUuid, userUuid, payload}){
        const user = await userService.getByUuid(userUuid)
        const { sqlQuery, dataList } = buildPatchQuery(
            'comments',
            dbMapper.toDb(payload)
        )
        const{existed, changed} = await commentRepo.updateByCommentUuid({
            commentUuid, userId: user.userId, sqlQuery, dataList
        })
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const comment = await getByCommentUuid(commentUuid)
        return comment
    }



    async function deleteByCommentId({commentId, userUuid}) {
        const user = await userService.getByUuid(userUuid)
        const deleted = await commentRepo.deleteByCommentId({
            commentId, userId:user.userId
        })
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }

    async function deleteByCommentUuid({commentUuid, userUuid}) {
        const user = await userService.getByUuid(userUuid)
        const deleted = await commentRepo.deleteByCommentUuid({
            commentUuid, userId:user.userId
        })
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
}