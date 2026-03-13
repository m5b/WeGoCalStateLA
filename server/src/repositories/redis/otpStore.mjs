import { redisKeysConfig } from '../../config/redisKeysConfig.mjs'
import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { redis } from '../../lib/redis.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'

const { otp } = redisKeysConfig

export async function saveOTP(key, {email, otpCodeHash, attempts, createAt}, opt = {}) {
    //defalut time to live as 5 minute
    const { ttl = 300 } = opt
    // append the prefix to make system consistent
    const prefixedKey = buildRedisKey(otp, key)
    // set the key value pair in redis using hset for better effiency
    try {
        await redis
            .multi()
            .hset(prefixedKey, {
                email: email,
                otpCodeHash: otpCodeHash,
                attempts: attempts,
                createAt: createAt,
            })
            .expire(prefixedKey, ttl)
            .exec()
    } catch (err) {
        throw new ServiceUnavailable(
            null,
            'Service is temporarily unavailable. Please try again later.'
        )
    }
}

export async function consumeOTP(key) {
    let replies
    try {
        replies = await redis.multi().hgetall(key).del(key).exec()
    } catch (err) {
        throw new ServiceUnavailable(
            null,
            'Service is temporarily unavailable. Please try again later.'
        )
    }
    //destructure the reply
    const [[errGet, otpVal], [errDel, delCount]] = replies
    //Redis respond us with a error
    if (errGet || errDel) {
        throw new ServiceUnavailable(
            null,
            'Signup is temporarily unavailable. Please try again.'
        )
    }
    if (!otpVal || Object.keys(otpVal).length === 0) {
        throw new UnauthorizedError(
            { error: 'invalid_auth_response' },
            'Sign up session expired. Please try again'
        )
    }
    return otpVal
}

//increment the otp attempt by one
export async function verifyOTPAttempts(key, attempts){
    if (attempts > 5) {
        await deleteOTP(key)
        throw new UnauthorizedError(
            null,
            'Please request a new code, you have exceed the limit of this code'
        )
    }
    try{
        redis.hincrby(key, "attempts", 1)
    }
    catch (err){
        throw new ServiceUnavailable(
            null,
            'Signup is temporarily unavailable. Please try again.'
        )
    }
}

export async function deleteOTP(key){
    try {
        await redis.del(key)
    } catch (err) {
        throw new ServiceUnavailable(
            null,
            'Service is temporarily unavailable. please try again later.'
        )
    }
}
