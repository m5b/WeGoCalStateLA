import { emailSchema, verifyOTPSchema } from '../../validators/authValidators.mjs'
import { jsend } from '../../util/jSend.mjs'
import {
    otpTokenCookieConfig,
    signupTokenCookieConfig,
} from '../../config/cookieConfig.mjs'
import { requireOTPToken } from '../../middlewares/requireCookie.mjs'
import { Router } from 'express'

export function createEmailOTPRouter({emailService, otpService, signupTokenService}){
    const router = new Router()

    router.post('/otp/send', async (req, res) => {
        const { email } = emailSchema.parse(req.body)
        const { key, otpCode } = await otpService.saveOTP(email)
        await emailService.sendOTPEmail(email, otpCode)
        res.cookie('opt_tx', key, otpTokenCookieConfig)

        res.json(jsend.success(null))
    })

    router.post('/otp/verify', requireOTPToken, async (req, res) => {
        const { otp } = verifyOTPSchema.parse(req.body)
        const email = await otpService.verifyOTP(req.otpToken, otp)
        const signupToken = await signupTokenService.saveSignupToken(
            email,
            'otp'
        )
        res.cookie('signup_tx', signupToken, signupTokenCookieConfig)
        res.json(jsend.success({ signupToken: signupToken }))
    })
    return router
}