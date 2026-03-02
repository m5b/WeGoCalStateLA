import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'

export function createOTPStore({redis, otpPrefix, opt = {}}){
    return{
        save,
        consume,
        verifyOTPAttempts,
        deleteOTP
    }
    async function save(
        key,
        { email, otpCodeHash},
    ) {
        //defalut time to live as 5 minute
        const { ttl = 300 } = opt
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(otpPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    email: email,
                    otpCodeHash: otpCodeHash,
                    attempts: 0,
                    createdAt: Date.now()
                })
                .expire(prefixedKey, ttl)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup service is temporarily unavailable. Please try again later.'
            )
        }
    }

    async function consume(key) {
        const prefixedKey = buildRedisKey(otpPrefix, key)
        let otpValue
        try {
            otpValue = await redis
                .hgetall(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                {error: "Service down"},
                'Signup service is temporarily unavailable. Please try again later.'
            )
        }
        if (!otpValue|| Object.keys(otpValue).length === 0) {
            throw new UnauthorizedError(
                { otp : "Record don't exist" },
                'OTP expired. Please try again'
            )
        }
        return otpValue
    }

    //increment the otp attempt by one
    async function verifyOTPAttempts(key , attempts) {
        const prefixedKey = buildRedisKey(otpPrefix, key)
        if (attempts >= 5) {
            await deleteOTP(key)
            throw new UnauthorizedError(
                {otp: "Record don't exist"},
                'Please request a new code, you have exceed the limit of this code'
            )
        }
        try {
           await redis.hincrby(prefixedKey, 'attempts', 1)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Signup is temporarily unavailable. Please try again.'
            )
        }
    }

    async function deleteOTP(key) {
        const prefixedKey = buildRedisKey(otpPrefix, key)
        try {
            await redis.del(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'OTP session is expired. please try again later.'
            )
        }
    }
}