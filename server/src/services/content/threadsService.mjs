import dbMapper from '../../util/dbMapper.mjs'
import { NotFoundError } from '../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import {GoneError} from "../../errors/goneError.mjs";
import buildPatchQuery from "../../util/buildPatchQuery.mjs";

export function createThreadService(threadRepo) {
    return {
        getAll,
        getByThreadId,
        postByUserId,
        patchByThreadId,
        getByUserId,
        deleteByThreadId,

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

    async function getByUserId(userId) {
        const threads = dbMapper.fromDb(await threadRepo.findByUserId(userId))
        return threads
    }

    async function postByUserId(userId, payload) {
        const { title, content } = payload
        const result = await threadRepo.insertThread({
            userId: userId,
            title: title,
            content: content,
        })
        const thread = await getByThreadId(result.insertId)
        return thread
    }

    async function patchByThreadId(
        user,
        threadId,
        payload
    ) {
        let thread = await getByThreadId(threadId)
        if (user.userId !== thread.userId) {
            throw new UnauthorizedError({
                auth: "You don't have ownership for this thread",
            })
        }
        //thread has been deleted, therefore unable to patch
        if (thread.deletedAt !== null) {
            throw new GoneError({
                thread: 'Thread has been removed due to user delete the resource',
            })
        }

        const { sqlQuery, dataList } = buildPatchQuery(
            'threads',
            dbMapper.toDb(payload)
        )
        await threadRepo.updateByThreadId(threadId, sqlQuery, dataList)
        thread = await getByThreadId(threadId)
        return thread
    }

    async function deleteByThreadId(threadId, userId) {
        //check if it is deleted
        let thread = await getByThreadId(threadId)
        if (userId !== thread.userId) {
            throw new UnauthorizedError({
                auth: "You don't have ownership for this thread",
            })
        }

        if (thread.deletedAt === null) {
            await threadRepo.deleteByThreadId(threadId)
        }
        return
    }
}