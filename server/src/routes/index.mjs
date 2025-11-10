import { Router } from 'express'
import authRouter from './auth/googleAuth.mjs'
import userRouter from './userRoutes.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'

const router = Router()
router.use('/auth', authRouter)
router.use('/user', userRouter)

//route for testing jwt
router.get('/test', requireJwtAuth, (req, res) => {
    res.send('HI')
})
export default router
