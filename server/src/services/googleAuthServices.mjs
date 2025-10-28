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
    await updateUserGoogleId(userId, googleId)
}

//main entry point for handleling the sign in using google
async function handleGoogleLogin({ googleId, email }) {
    //check if user already sigun up by google
    let user = await findByGoogleId(googleId)

    if (!user) {
        //check if user already sign up using email and password but never sign up with google before
        const existUserByEmail = dbMapper.fromDb(await findByEmail(email))
        if (existUserByEmail && !existUserByEmail.google_id) {
            //link the google with the existing user
            await linkToExistingUser(existUserByEmail.userId, googleId)
            user = await findByUserID(existUserByEmail.userId)
        }
        //first time user sign up by google using this email, therefore create account
        else if (!existUserByEmail) {
            const username = await generateUserName()
            const newUserId = await insertGoogleUser({
                username: username,
                email: email,
                googleId: googleId,
            })
            user = await findByUserID(newUserId)
        }
        //case where there is a user record where email is same but with a different google_id
        else {
            return new Error('something There is conflict with account')
        }
    }
    user = dbMapper.fromDb(user)

    return user
}
export { handleGoogleLogin, issueJwTForUser }
