import {
    findByUserID,
    updateByUserId,
} from '../repositories/userRepository.mjs'
import buildPatchQuery from '../util/buildPatchQuery.mjs'
import dbMapper from '../util/dbMapper.mjs'
export async function getCurrentUser(userId) {
    const user = dbMapper.fromDb(await findByUserID(userId))
    if (!user) {
        return new Error('User not find')
    }
    return user
}

export async function patchCurrentUser(userId, payload) {
    const user = dbMapper.fromDb(await findByUserID(userId))
    if (!user) {
        return new Error('User not find')
    }

    const { sqlQuery, dataList } = buildPatchQuery(
        'users',
        dbMapper.toDb(payload)
    )
    const result = updateByUserId(userId, sqlQuery, dataList)
    return result
}
