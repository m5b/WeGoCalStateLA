import { Router } from 'express'
import dbMapper from '../../util/dbMapper.mjs'
import {
    emailSchema,
    verifyOTPSchema,
    passwordOnlySchema,
} from '../../validators/authValidators.mjs'
import { jsend } from '../../util/jSend.mjs'
import {
    resetOtpTokenCookieConfig,
    resetTokenCookieConfig,
} from '../../config/cookieConfig.mjs'
import {
    requireResetOtpToken,
    requireResetToken,
} from '../../middlewares/requireCookie.mjs'

export function createResetPasswordRouter({voprfService, authRepo, emailService, resetPasswordService, passwordService, userService, jwtTokenService}){
    const router = Router()

    router.post('/password-reset/request', async (req, res) => {
        const { email } = emailSchema.parse(req.body)
        const emailHash = await voprfService.handleServerVOPRF(email)
        const userRow = await authRepo.findByEmailHash(emailHash)
        const user = userRow ? dbMapper.fromDb(userRow) : null

        if (user) {
            const { token, otpCode } = await resetPasswordService.saveResetOtp(user.userUuid)
            await emailService.sendOTPEmail(email, otpCode)
            res.cookie('reset_otp_tx', token, resetOtpTokenCookieConfig)
        }
        res.json(jsend.success(null))
    })

    router.post('/password-reset/verify', requireResetOtpToken, async (req, res) => {
        const { otp } = verifyOTPSchema.parse(req.body)
        const userUuid = await resetPasswordService.verifyResetOtp(req.resetOtpToken, otp)
        const token = jwtTokenService.issueResetToken(userUuid)
        res.cookie('reset_tx', token, resetTokenCookieConfig)
        res.json(jsend.success(null))
    })

    router.post('/password-reset/complete', requireResetToken, async (req, res) => {
        const { password } = passwordOnlySchema.parse(req.body)
        const passwordHash = await passwordService.hashPassword(password)
        await userService.patchByUserUuid(req.resetUserUuid, { passwordHash })
        res.json(jsend.success(null))
    })

    return router
}