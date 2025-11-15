import {
    insertThread,
    findByUserId,
    findByThreadId,
    updateByThreadId,
    deleteByThreadId,
} from '../repositories/threadsRepository.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import {GoneError} from "../errors/goneError.mjs";
import buildPatchQuery from "../util/buildPatchQuery.mjs";


export async function getThreadResourceByThreadId(threadId) {
    const thread = dbMapper.fromDb(await findByThreadId(threadId))
    if (!thread) {
        throw new NotFoundError({thread: "Cannot find thread with the given identifier"})
    }
    return thread
}

export async function getUserThreadResource(userId) {
    const threads = dbMapper.fromDb(await findByUserId(userId))
    console.log(threads)
    return threads
}

export async function postThreadResource(userId ,payload) {
    const {title, content} = payload
    const threadId = await insertThread({userId:userId, title:title, content:content})
    const thread = await getThreadResourceByThreadId(threadId);
    return thread
}

export async function patchThreadResourceByThreadId(user, threadId, payload) {
    let thread = await getThreadResourceByThreadId(threadId)
    if (user.userId !== thread.userId) {
        throw new UnauthorizedError({
            auth: "You don't have ownership for this thread",
        })
    }
    //thread has been deleted, therefore unable to patch
    if(thread.deletedAt !== null){
        throw new GoneError({
            thread: "Thread has been removed due to user delete the resource"
        })
    }


    const { sqlQuery, dataList } = buildPatchQuery(
        'threads',
        dbMapper.toDb(payload)
    )
    await updateByThreadId(threadId, sqlQuery, dataList)
    thread = await getThreadResourceByThreadId(threadId)
    return thread
}

export async function deleteThreadByThreadId(threadId, userId) {
    //check if it is deleted
    let thread = await getThreadResourceByThreadId(threadId)
    if (userId !== thread.userId) {
        throw new UnauthorizedError({
            auth: "You don't have ownership for this thread",
        })
    }

    if (thread.deletedAt === null) {

        await deleteByThreadId(threadId)
    }
    return;
}

