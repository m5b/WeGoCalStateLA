import { Router } from 'express'
import passport from 'passport'
import { issueJwTForUser } from '../../services/googleAuthServices.mjs'

const router = Router()

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.CLIENT_URL_DEV + '/authentication/login',
        session: false,
    }),
    (req, res) => {
        const token = issueJwTForUser(req.user.userId)
        //store the jwt token in the cookie
        res.cookie('auth-token', token, {
            httpOnly: true,
            maxAge: 60000 * 60,
            sameSite: 'lax',
        })
        //temp holder as for now
        res.redirect(process.env.CLIENT_URL_DEV)
    }
)

export default router
