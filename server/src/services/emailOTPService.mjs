import {SendTemplatedEmailCommand} from "@aws-sdk/client-ses"
import {sesClient} from "../lib/ses.mjs";
import bcrypt from 'bcrypt'
import { redis } from '../lib/redis.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import { sha256Hex } from '../util/hash.mjs'
import {
    consumeOTP, deleteOTP,
    saveOTP,
    verifyOTPAttempts,
} from '../repositories/redis/otpStore.mjs'
import crypto from 'crypto'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'

export async function sendOTPEmail(receiver, optCode) {
    const emailSendCommand = new SendTemplatedEmailCommand({
        Destination: { ToAddresses: [receiver] },
        TemplateData: JSON.stringify({ otpCode: optCode }),
        Source: 'baohang193@gmail.com',
        Template: 'EmailOTPTemplate',
    })
    await sesClient.send(emailSendCommand)
}

export function generateOTP() {
    return crypto.randomInt(100000, 999999).toString()
}

export async function handleOTP(email) {
    // generate the code
    const otpCode = generateOTP()
    //hash and salt the otp
    const otpCodeHash = await bcrypt.hash(otpCode, 10)
    // generate a challenge id / unique identifier to avoid expose on email
    const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
    await saveOTP(key, {email, otpCodeHash, attempts: 0, createAt: Date.now() })
    //send the code to reciver email
    return {key, otpCode}
}

export async function verifyOTP(key, otpCode) {
    //retreive th target value from redis
    const {email, otpCodeHash, attempts, createAt} = await consumeOTP(key)
    //verify if user submit too many attemps
    await verifyOTPAttempts(key, attempts)

    if (!(await bcrypt.compare(otpCode, otpCodeHash, 10))) {
        throw new UnauthorizedError(null, 'The code does not match our record')
    }
    //delete the key object pair if otp is correct
    await deleteOTP(key)


}
