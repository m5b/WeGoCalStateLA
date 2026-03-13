import { emailSchema, verifyOTPSchema } from '../../validators/authValidators.mjs'
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
