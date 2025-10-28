import { Router } from 'express'
import passport from 'passport'
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
        console.log(req.user.user)
        const token = req.user.token
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
