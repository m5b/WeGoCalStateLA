import { emailSchema, verifyOTPSchema } from '../../validators/authValidators.mjs'
<<<<<<< HEAD
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
        const { token, otpCode } = await otpService.saveOTP(email)
        await emailService.sendOTPEmail(email, otpCode)
        res.cookie('otp_tx', token, otpTokenCookieConfig)

        res.json(jsend.success(null))
    })

    router.post('/otp/verify', requireOTPToken, async (req, res) => {
        const { otp } = verifyOTPSchema.parse(req.body)
        const email = await otpService.verifyOTP(req.otpToken, otp)
        const {key, token}= await signupTokenService.saveSignupToken(
            email,
            'otp'
        )
        res.cookie('signup_tx', token, signupTokenCookieConfig)
        res.json(jsend.success(null))
    })
    return router
}
=======
import {
    handleOTP,
    verifyOTP,
} from '../../services/emailOTPService.mjs'
import { jsend } from '../../util/jSend.mjs'
import router from './signup.mjs'
import {
    otpCookieConfig,
    verifiedCookieConfig,
} from '../../config/cookieConfig.mjs'
import { requireOTPId } from '../../middlewares/requireCookie.mjs'
import { handleVerified } from '../../services/verifiedService.mjs'

router.post('/otp/send', async (req, res) => {
    const { email } = emailSchema.parse(req.body)
    const {key, otpCode} = await handleOTP(email)
    res.cookie('opt_tx', key, otpCookieConfig)

    res.json(jsend.success(null))
})

router.post('/otp/verify', requireOTPId, async (req, res) => {
    const {otp} = verifyOTPSchema.parse(req.body)
    const email = await verifyOTP(req.otpId, otp)
    const verifiedToken = await handleVerified(email, "otp")
    res.cookie("verified_tx", verifiedToken, verifiedCookieConfig)
    res.json(jsend.success({ verifiedToken: verifiedToken }))
})
>>>>>>> abcb6e26 (message)
