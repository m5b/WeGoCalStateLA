import { redis } from '../../lib/redis.mjs'
import { redisKeysConfig } from '../../config/redisKeysConfig.mjs'
import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'

const {verifiedId} = redisKeysConfig

export async function saveVerifiedId(
    key,
    {email, verifiedMethod},
    opt = {}
) {
    //defalut time to live as 5 minute
    const { ttl = 300 } = opt
    // append the prefix to make system consistent
    const prefixedKey = buildRedisKey(verifiedId, key)
    // set the key value pair in redis using hset for better effiency
    try {
        await redis
            .multi()
            .hset(prefixedKey, {
                email: email,
                verifiedMethod: verifiedMethod
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

export async function consumeVerifiedId(key) {
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
    const [[errGet, verifiedValue], [errDel, delCount]] = replies
    //Redis respond us with a error
    if (errGet || errDel) {
        throw new ServiceUnavailable(
            null,
            'Signup is temporarily unavailable. Please try again.'
        )
    }
    if (!verifiedValue || Object.keys(verifiedValue).length === 0) {
        throw new UnauthorizedError(
            { error: 'invalid_auth_response' },
            'Sign up session expired. Please try again'
        )
    }
    return verifiedValue
}
