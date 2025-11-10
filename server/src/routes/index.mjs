import { Router } from 'express'
import googleAuthRouter from './auth/googleAuth.mjs'
import localAuthRouter from './auth/login.mjs'
import signupRouter from './auth/signup.mjs'
import userRouter from './userRoutes.mjs'
import threadsRouter from './threadsRoutes.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'

const router = Router()

router.use('/auth', googleAuthRouter)
router.use('/auth', localAuthRouter)
router.use('/auth', signupRouter)
router.use('/user', userRouter)
router.use('/threads', threadsRouter)

//route for testing jwt
router.get('/test', requireJwtAuth, (req, res) => {
    res.send('HI')
})

export default router
