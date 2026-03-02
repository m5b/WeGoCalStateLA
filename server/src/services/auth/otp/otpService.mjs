import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import {generateOTP} from "./otpGenerator.mjs";
import {generateKey} from "./keyGenerator.mjs";

export function createOTPService({otpStore, jwtTokenService, round = 10}){
    return{
        saveOTP,
        verifyOTP,
    }

    async function saveOTP(email) {
        // generate the code
        const otpCode = generateOTP()
        //hash and salt the otp
        const otpCodeHash = await bcrypt.hash(otpCode, round)
        // generate a challenge id / unique identifier to avoid expose on email
        const key = generateKey(32)
        await otpStore.save(key, {
            email,
            otpCodeHash,
        })
        const token = jwtTokenService.issueOTPToken(key)
        //send the code to reciver email
        return {key, token , otpCode}
    }

    async function verifyOTP(key, otpCode) {
        //retreive th target value from redis
        const { email, otpCodeHash, attempts, createAt } = await otpStore.consume(key)
        //verify if user submit too many attemps
        await otpStore.verifyOTPAttempts(key, attempts)

        if (!(await bcrypt.compare(otpCode, otpCodeHash))) {
            throw new UnauthorizedError(
                {otp: "Not matched"},
                'The code does not match our record'
            )
        }
        //delete the key object pair if otp is correct
        await otpStore.deleteOTP(key)
    }
}