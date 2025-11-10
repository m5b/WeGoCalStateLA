import { Router } from 'express'
import authRouter from './auth/googleAuth.mjs'
import userRouter from './userRoutes.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import { signup } from './auth/signup.mjs'
import { login } from './auth/login.mjs'
import generateUserName from '../services/usernameGenerator.mjs'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)


//route for testing jwt
router.get('/test', requireJwtAuth, (req, res) => {
    res.send('HI')
})

router.get('/hi', (req,res) => {res.send(generateUserName())})

//router for signup
router.post("/signup",signup)

//router for login
router.post("/login",login)



export default router
