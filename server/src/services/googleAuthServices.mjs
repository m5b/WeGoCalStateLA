import jwt from 'jsonwebtoken'
import {
    findByEmail,
    findByGoogleId,
    findByUserID,
    insertGoogleUser,
    updateUserGoogleId,
} from '../repositories/userRepository.mjs'
import generateUserName from './usernameGenerator.mjs'
//generate jwt using provided payload
function issueJwTForUser({ userId, email }) {
    return jwt.sign(
        {
            userId: userId,
            email: email,
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
        const existUserByEmail = await findByEmail(email)
        if (existUserByEmail && !existUserByEmail.google_id) {
            //link the google with the existing user
            await linkToExistingUser(existUserByEmail.user_id, googleId)
            user = await findByUserID(existUserByEmail.user_id)
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
    //creation of the jwt token
    const token = issueJwTForUser({
        userId: user.user_id,
        email: user.email,
    })
    return { user, token }
}
export default handleGoogleLogin
