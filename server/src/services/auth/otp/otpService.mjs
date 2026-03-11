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
        const otpValue = await otpStore.consume(key)
        //check if exist
        if (!otpValue|| Object.keys(otpValue).length === 0) {
            throw new UnauthorizedError(
                { otp : "Record don't exist" },
                'OTP expired. Please try again'
            )
        }
        //increment the key because it exist
        await otpStore.incrementAttempts(key)
        const {email, otpCodeHash, attempts} = otpValue

        if(attempts >= 5) {
            await otpStore.deleteOTP(key)
            throw new UnauthorizedError(
                {otp: "Record don't exist"},
                'Please request a new code, you have exceed the limit of this code'
            )
        }
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