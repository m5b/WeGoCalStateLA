import bcrypt from 'bcrypt'
import {
    deleteUserByEmailHash,
    insertUser,
} from '../repositories/authRepository.mjs'
import generateUserName from './usernameGenerator.mjs'
import { findByEmailHash } from '../repositories/userRepository.mjs'



export async function signupUser(emailHash, password) {
    const user = await findByEmailHash(emailHash)
    if(user !== null){
        await overwriteAccountForLoginId(emailHash)
    }
    //perform password hash
    const passwordHash = bcrypt.hash(password, 12)
    const username = await generateUserName()
    //perform database insertion for user creation
    await insertUser({
        email: emailHash,
        passwordHash: passwordHash,
        username: username,
    })
}

async function overwriteAccountForLoginId(emailHash){
    await deleteUserByEmailHash(emailHash)
}