import {
    findByUserID,
    findByUsername,
    updateByUserId,
} from '../repositories/userRepository.mjs'
import {deleteUserByUserId} from "../repositories/authRepository.mjs";
import buildPatchQuery from '../util/buildPatchQuery.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
export async function getCurrentUser(userId) {
    const user = dbMapper.fromDb(await findByUserID(userId))
    if (!user) {
        throw new NotFoundError(
            null,
            'Can not found current user given the token'
        )
    }
    return user
}

export async function patchCurrentUser(userId, payload) {
    const user = dbMapper.fromDb(await findByUserID(userId))
    if (!user) {
        throw new NotFoundError(
            null,
            'Can not found current user given the token'
        )
    }

    const { sqlQuery, dataList } = buildPatchQuery(
        'users',
        dbMapper.toDb(payload)
    )
    const result = updateByUserId(userId, sqlQuery, dataList)
    return result
}

export async function getUserResource(username) {
    const user = dbMapper.fromDb(await findByUsername(username))
    if (!user) {
        throw new NotFoundError({
            username: 'Can not found the user of give username',
        })
    }
    return user
}

export async function deleteCurrentUser(userId) {
    await deleteUserByUserId(userId)
}
