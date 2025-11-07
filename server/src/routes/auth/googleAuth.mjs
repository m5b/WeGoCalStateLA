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
        failureRedirect: '/api/auth',
        session: false,
    }),
    (req, res) => {
        const token = issueJwTForUser(req.user.userId)
        //store the jwt token in the cookie
        res.cookie('auth-token', token, {
            httpOnly: true,
            maxAge: 60000 * 60,
        })
        //temp holder as for now
        res.redirect('/api/auth')
    }
)

export default router
