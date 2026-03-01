import cors from 'cors'
import { corsConfig } from '../config/corsConfig.mjs'
import express from 'express'
import cookieParser from 'cookie-parser'
import { createAPIRouter } from '../routes/index.mjs'
import errorHandler from '../middlewares/errorHandler.mjs'
import { createLoginTokenStore } from '../repositories/redis/loginTokenStore.mjs'
import { redis } from '../lib/redis.mjs'
import { redisKeysConfig } from '../config/redisKeysConfig.mjs'
import { createOIDCStore } from '../repositories/redis/oidcStore.mjs'
import { createSignupTokenStore } from '../repositories/redis/signupTokenStore.mjs'
import { createAuthRepo } from '../repositories/authRepository.mjs'
import connectionPool from '../lib/pool.mjs'
import { createCommentRepo } from '../repositories/commentsRepository.mjs'
import { createThreadRepo } from '../repositories/threadsRepository.mjs'
import { createUserRepo } from '../repositories/userRepository.mjs'
import { createUserService } from '../services/userService.mjs'
import { createLoginTokenService } from '../services/loginTokenService.mjs'
import { createSignupTokenService } from '../services/signupTokenService.mjs'
import { createOIDCService } from '../services/oidcService.mjs'
import { createGoogleAuthService } from '../services/googleAuthServices.mjs'
import { openIdClient } from '../lib/openIdClient.mjs'
import { openIdConfig } from '../config/openIdConfig.mjs'
import { createPasswordService } from '../services/passwordService.mjs'
import { createVOPRFService } from '../services/voprfService.mjs'
import { evaluator, voprfClient } from '../lib/voprf.mjs'
import { createOTPService } from '../services/otpService.mjs'
import { createOTPStore } from '../repositories/redis/otpStore.mjs'
import { createEmailService } from '../services/emailService.mjs'
import { createThreadService } from '../services/threadsService.mjs'
import { createCommentService } from '../services/commentsService.mjs'
import { createEmailOTPRouter } from '../routes/auth/emailOTP.mjs'
import { createGoogleAuthRouter } from '../routes/auth/googleAuth.mjs'
import { createLoginRouter } from '../routes/auth/login.mjs'
import { createSignupRouter } from '../routes/auth/signup.mjs'
import { createUserRouter } from '../routes/userRoutes.mjs'
import { createThreadRouter } from '../routes/threadsRoutes.mjs'
import { createCommentRouter } from '../routes/commentsRoutes.mjs'
import { createUsernameService } from '../services/usernameGenerator.mjs'

export function createApp(){
    const app = express()
    app.use(cors(corsConfig))
    app.use(express.json())
    app.use(cookieParser())
    //launch up the store / repo
    const loginTokenStore = createLoginTokenStore(redis, redisKeysConfig.loginToken)
    const oidcStore = createOIDCStore(redis, redisKeysConfig.oidc)
    const signupTokenStore = createSignupTokenStore(redis, redisKeysConfig.signupToken)
    const otpStore = createOTPStore(redis, redisKeysConfig.otp)

    const authRepo = createAuthRepo(connectionPool)
    const commentRepo = createCommentRepo(connectionPool)
    const threadRepo = createThreadRepo(connectionPool)
    const userRepo = createUserRepo(connectionPool)


    //launch up the service
    const emailService = createEmailService()
    const voprfService = createVOPRFService({voprfClient: voprfClient, evaluator: evaluator})
    const otpService = createOTPService(otpStore,10)
    const loginTokenService = createLoginTokenService(loginTokenStore)
    const signupTokenService = createSignupTokenService(signupTokenStore)
    const usernameService = createUsernameService(userRepo)
    const passwordService = createPasswordService(12)

    const googleAuthService = createGoogleAuthService(createOIDCService(
        {oidcStore: oidcStore, openIdClient : openIdClient.googleClient, openIdConfig: openIdConfig, provider: "google"}
    ))
    const loginService = createLoginTokenService(loginTokenService)

    const userService = createUserService({userRepo: userRepo, usernameService:usernameService})
    const threadService = createThreadService(threadRepo)
    const commentService = createCommentService({commentRepo: commentRepo, threadService: threadService})

    //launch up the router
    const emailOTPRouter = createEmailOTPRouter({emailService: emailService, otpService:otpService,signupTokenService:signupTokenService})
    const googleAuthRouter = createGoogleAuthRouter({googleAuthService:googleAuthService, signupTokenService: signupTokenService})
    const loginRouter = createLoginRouter({voprfService: voprfService, loginService:loginService })
    const signupRouter = createSignupRouter({signupTokenService: signupTokenService, voprfService: voprfService, userService: userService, passwordService : passwordService})
    const userRouter = createUserRouter(userService)
    const threadRouter = createThreadRouter({threadService: threadService, commentService: commentService})
    const commentRouter = createCommentRouter(commentService)
    const router = createAPIRouter({
        emailOTPRouter: emailOTPRouter,
        googleAuthRouter: googleAuthRouter,
        loginRouter: loginRouter ,
        signupRouter: signupRouter,
        userRouter: userRouter,
        threadRouter: threadRouter,
        commentRouter: commentRouter,
    })
    app.use('/api', router)
    app.use(errorHandler)
    return app
}
