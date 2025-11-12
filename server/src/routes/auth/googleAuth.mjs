import { Router } from 'express'
import passport from 'passport'
import { issueJwTForUser } from '../../services/googleAuthServices.mjs'
import { cookieConfig } from '../../config/cookieConfig.mjs'
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
        res.cookie('auth-token', token, cookieConfig)
        //temp holder as for now
        res.redirect(process.env.CLIENT_URL_DEV || process.env.SERVER_URL_DEV)
    }
)

export default router
