import {
    findByThreadID
} from '../repositories/threadsRepository.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
export async function getThread(threadID) {
    const thread = dbMapper.fromDb(await findByThreadID(threadID))
    if (!thread) {
        throw new NotFoundError(
            null,
            'Cannot find thread with the given token'
        )
    }
    return thread
}
