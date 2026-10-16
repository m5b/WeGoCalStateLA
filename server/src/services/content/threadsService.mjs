import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import {GoneError} from "../../errors/goneError.mjs";
import buildPatchQuery from "../../util/buildPatchQuery.mjs";

import { v4 as uuidv4 } from 'uuid';

export function createThreadService(threadRepo) {
    return {
        getAll,
        getByThreadId,
        getByThreadUuid,
        postByUserId,
        patchByThreadId,
        patchByThreadUuid,
        patchAnyByThreadUuid,
        getByUserId,
        getByUserUuid,
        deleteByThreadId,
        deleteByThreadUuid
    }
    async function getAll() {
        const threads = dbMapper.fromDb(await threadRepo.findAll())
        return threads
    }

    async function getByThreadId(threadId) {
        const thread = dbMapper.fromDb(await threadRepo.findByThreadId(threadId))

        if (!thread) {
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return thread
    }
    async function getByThreadUuid(threadUuid) {
        const thread = dbMapper.fromDb(await threadRepo.findByThreadUuid(threadUuid))

        if (!thread) {
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return thread
    }

    async function getByUserId(userId) {
        const threads = dbMapper.fromDb(await threadRepo.findByUserId(userId))
        return threads
    }

    async function getByUserUuid(userUuid) {
        const threads = dbMapper.fromDb(await threadRepo.findByUserUuid(userUuid))
        return threads
    }

    async function postByUserId(userId, payload) {
        const { title, content, category } = payload
        const insertId = await threadRepo.insertThread({
            userId: userId,
            threadUuid: uuidv4(),
            title: title,
            content: content,
            category: category,
        })
        const thread = await getByThreadId(insertId)
        return thread
    }

    async function patchByThreadId({userId, threadId, payload}) {
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const {existed,changed} = await threadRepo.updateByThreadId({threadId, userId,  sqlQuery, dataList})
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const thread = await getByThreadId(threadId)
        return thread
    }

    async function patchByThreadUuid({userId, threadUuid, payload}) {
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const {existed,changed} = await threadRepo.updateByThreadUuid({threadUuid, userId,  sqlQuery, dataList})
        if(!existed){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
        const thread = await getByThreadUuid(threadUuid)
        return thread
    }

    // Edits a thread regardless of who wrote it.
    async function patchAnyByThreadUuid({threadUuid, payload}) {
        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )

        const existed = await threadRepo.updateAnyByThreadUuid({threadUuid, sqlQuery, dataList})
        if(!existed){
            throw new NotFoundError({
                thread: 'Cannot find thread with the given identifier',
            })
        }
        return await getByThreadUuid(threadUuid)
    }

    async function deleteByThreadId({threadId, userId}) {
        const deleted = await threadRepo.deleteByThreadId(
            {threadId, userId}
        )
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
    async function deleteByThreadUuid({threadUuid, userId}) {
        const deleted = await threadRepo.deleteByThreadUuid(
            {threadUuid, userId}
        )
        if(!deleted){
            throw new UnauthorizedError(null, "You do not have permission to change this thread")
        }
    }
}