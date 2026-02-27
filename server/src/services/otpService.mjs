import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'

export async function createOTPService(otpStore, round = 10){
    return{
        saveOTP,
        verifyOTP,
    }
    function generateOTP() {
        return crypto.randomInt(100000, 999999).toString()
    }

    async function saveOTP(email) {
        // generate the code
        const otpCode = generateOTP()
        //hash and salt the otp
        const otpCodeHash = await bcrypt.hash(otpCode, round)
        // generate a challenge id / unique identifier to avoid expose on email
        const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
        await otpStore.save(key, {
            email,
            otpCodeHash,
            attempts: 0,
            createAt: Date.now(),
        })
        //send the code to reciver email
        return { key, otpCode }
    }

    async function verifyOTP(key, otpCode) {
        //retreive th target value from redis
        const { email, otpCodeHash, attempts, createAt } = await otpStore.consume(key)
        //verify if user submit too many attemps
        await otpStore.verifyOTPAttempts(key, attempts)

        if (!(await bcrypt.compare(otpCode, otpCodeHash))) {
            throw new UnauthorizedError(
                null,
                'The code does not match our record'
            )
        }
        //delete the key object pair if otp is correct
        await otpStore.deleteOTP(key)
    }
}