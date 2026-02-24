import { Router } from 'express'
import googleAuthRouter from './auth/googleAuth.mjs'
import localAuthRouter from './auth/login.mjs'
import signupRouter from './auth/signup.mjs'
import userRouter from './userRoutes.mjs'
import threadsRouter from './threadsRoutes.mjs'
import commentsRouter from './commentsRoutes.mjs'
import { jsend } from '../util/jSend.mjs'
import { VOPRFPublicKey } from '../lib/voprf.mjs'

const router = Router()

router.use('/auth', googleAuthRouter)
router.use('/auth', localAuthRouter)
router.use('/auth', signupRouter)
router.use('/user', userRouter)
router.use('/threads', threadsRouter)
router.use('/comments', commentsRouter)

//route for testing jwt
router.get('/public-key', (req, res) => {
    res.json(jsend.success({
        publicKey: VOPRFPublicKey
    }))
})

router.get('/health', (req, res )=>{
    res.json(jsend.success(null))
})

export default router
