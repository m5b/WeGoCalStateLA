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
        const token = req.user.token
        res.cookie('auth-token', token, {
            httpOnly: true,
            maxAge: 60000 * 60,
        })
        res.redirect('/api/auth')
    }
)

export default router
