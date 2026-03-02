import { Router } from 'express'
import {
    emailHashSchema,
    emailPasswordSchema,
} from '../../validators/authValidators.mjs'
import { cookieConfig } from '../../config/cookieConfig.mjs'
import { jsend } from '../../util/jSend.mjs'
import { requireLoginToken } from '../../middlewares/requireCookie.mjs'

export function createLoginRouter({voprfService, loginService}){
    const router = Router()

    router.post('/login/voprf', async (req, res) => {
        const { emailHash } = emailHashSchema.parse(req.body)
        const evaluation = await voprfService.evaluateVOPRF(emailHash)
        const token = loginService.saveLoginToken()
        res.cookie("login_tx",  token)
        res.json(jsend.success({ evaluation : evaluation}))
    })

    router.post('/login/complete', requireLoginToken, async (req, res) => {
        const loginValue = await loginService.verifyLoginToken(req.loginToken)
        const { emailHash, password } = emailPasswordSchema.parse(req.body)
        const {user, token}= await loginService.loginUser(emailHash, password)
        // Generate JWT
        // Store token in HTTP-only cookie
        res.cookie('auth-token', token, cookieConfig)
        return res.json(jsend.success({ auth: 'authentication acquired' }))
    })
    return router
}