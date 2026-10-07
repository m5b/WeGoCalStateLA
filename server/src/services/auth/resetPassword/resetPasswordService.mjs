import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import { generateOTP } from '../../../util/otpGenerator.mjs'
import { generateKey } from '../../../util/keyGenerator.mjs'

export function createResetPasswordService({resetTokenStore, jwtTokenService, round = 10}){
    return {
        saveResetOtp,
        verifyResetOtp,
    }

    async function saveResetOtp(userUuid) {
        const otpCode = generateOTP()
        const otpCodeHash = await bcrypt.hash(otpCode, round)
        const key = generateKey(32)
        await resetTokenStore.save(key, { userUuid, otpCodeHash })
        const token = jwtTokenService.issueResetOtpToken(key)
        return { key, token, otpCode }
    }

    async function verifyResetOtp(key, otpCode) {
        const resetValue = await resetTokenStore.consume(key)
        if (!resetValue || Object.keys(resetValue).length === 0) {
            throw new UnauthorizedError(
                { otp: 'Record not found' },
                'Code expired. Please request a new one.'
            )
        }
        await resetTokenStore.incrementAttempts(key)
        const { userUuid, otpCodeHash, attempts } = resetValue

        if (attempts >= 5) {
            await resetTokenStore.deleteReset(key)
            throw new UnauthorizedError(
                { otp: 'Too many failed attempts' },
                'Too many failed attempts. Please request a new code.'
            )
        }
        if (!(await bcrypt.compare(otpCode, otpCodeHash))) {
            throw new UnauthorizedError(
                { otp: 'Incorrect OTP' },
                'Incorrect code. Please try again.'
            )
        }
        await resetTokenStore.deleteReset(key)
        return userUuid
    }
}