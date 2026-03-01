import buildPatchQuery from '../util/buildPatchQuery.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { NotFoundError } from '../errors/notFoundError.mjs'
import { v4 as uuidv4 } from 'uuid';
export function createUserService({userRepo, usernameService}) {
    return{
        getByUserId,
        patchByUserId,
        getByUsername,
        deleteByUserId,
        createUser,
        getByEmailHash,
        getUserCount,
        getByUuid

    }
    async function getUserCount(){
        const count = await userRepo.getCount()
        return count
    }
    async function createUser({emailHash, passwordHash}) {
        const user = dbMapper.fromDb(await userRepo.findByEmailHash(emailHash))
        if (user !== null) {
            await deleteByUserId(user.userId)
        }
        //perform password hash
        const username = await usernameService.generateUsername(userRepo)
        //perform database insertion for user creation
        const insertId = await userRepo.insertUser({
            emailHash: emailHash,
            passwordHash: passwordHash,
            username: username,
            userUuid: uuidv4()
        })
        return dbMapper.fromDb(await userRepo.findByUserId(insertId))
    }


    async function getByUserId(userId) {
        const user = dbMapper.fromDb(await userRepo.findByUserId(userId))
        if (!user) {
            throw new NotFoundError(
                null,
                'Can not found the user'
            )
        }
        return user
    }

    async function patchByUserId(userId, payload) {

        const { sqlQuery, dataList } = buildPatchQuery(
            'users',
            dbMapper.toDb(payload)
        )
        const {existed, changed} = await userRepo.updateByUserId(userId, sqlQuery, dataList)
        if(!existed){
            throw new NotFoundError(
                null,
                'Can not found current user'
            )
        }
        const user = await getByUserId(userId)
        return user
    }

    async function getByUsername(username) {
        const user = dbMapper.fromDb(await userRepo.findByUsername(username))
        if (!user) {
            throw new NotFoundError(null ,'Can not found the user')
        }
        return user
    }

    async function getByEmailHash(emailHash){
        const user = dbMapper.fromDb(await userRepo.findByEmailHash(emailHash))
        if(!user){
            throw new NotFoundError(
                null, 'Can not found the user',
            )
        }
        return user
    }

    async function getByUuid(userUuid){
        const user = dbMapper.fromDb(await userRepo.findByUuid(userUuid))
        if(!user){
            throw new NotFoundError(
                null, 'Can not found the user',
            )
        }
        return user
    }

    async function deleteByUserId(userId) {
        const removed = await userRepo.deleteByUserId(userId)
        //this mean not found user
        if(!removed){
            throw new NotFoundError(null ,"Can not found the user")
        }
    }
}