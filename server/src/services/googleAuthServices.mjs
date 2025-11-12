import jwt from 'jsonwebtoken'
import {
    findByEmail,
    findByGoogleId,
    findByUserID,
    insertGoogleUser,
    updateUserGoogleId,
} from '../repositories/userRepository.mjs'
import generateUserName from './usernameGenerator.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { ConflictError } from '../errors/conflictError.mjs'
//generate jwt using provided payload
function issueJwTForUser(userId) {
    return jwt.sign(
        {
            userId: userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        }
    )
}

// helper function for linking a existing user to a google oauth
async function linkToExistingUser(userId, googleId) {
    await updateUserGoogleId({ userId: userId, googleId: googleId })
}

//main entry point for handleling the sign in using google
async function handleGoogleLogin({ googleId, email }) {
    //check if user already sigun up by google
    //case where user have a googId sign up using the email
    let user = dbMapper.fromDb(await findByGoogleId(googleId))

    if (!user) {
        //check if user already sign up using email and password but never sign up with google before
        const existUserByEmail = dbMapper.fromDb(await findByEmail(email))
        //case where user have a account but never link to the google, thereforo link them
        if (existUserByEmail && !existUserByEmail.googleId) {
            //link the google with the existing user
            await linkToExistingUser(existUserByEmail.userId, googleId)
            user = dbMapper.fromDb(await findByUserID(existUserByEmail.userId))
        }
        //first time user sign up by google using this email, therefore create account
        else if (!existUserByEmail) {
            const username = await generateUserName()
            const newUserId = await insertGoogleUser({
                username: username,
                email: email,
                googleId: googleId,
            })
            user = dbMapper.fromDb(await findByUserID(newUserId))
        }
        //case where we can not found the user under this googleId, but where we can find user with a email using this googleId  but a diffent googleId, most likely being server errror
        else {
            throw new ConflictError(
                'Email already linked to a different Google account.',
                null
            )
        }
    }

    return user
}
export { handleGoogleLogin, issueJwTForUser }
