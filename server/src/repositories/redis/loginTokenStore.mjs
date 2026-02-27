import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'

export function createLoginTokenStore(redis, loginTokenPrefix) {
    return {
        save,
        consume,
    }
    async function save(key, {}, opt = {}) {
        //defalut time to live as 5 minute
        const { ttl = 300 } = opt
        // append the prefix to make system consistent
        const prefixedKey = buildRedisKey(loginTokenPrefix, key)
        // set the key value pair in redis using hset for better effiency
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    createAt: Date.now(),
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

    async function consume(key) {
        const prefixedKey = buildRedisKey(loginTokenPrefix, key)
        let replies
        try {
            replies = await redis
                .multi()
                .hgetall(prefixedKey)
                .del(prefixedKey)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
        //destructure the reply
        const [[errGet, loginValue], [errDel, delCount]] = replies
        //Redis respond us with a error
        if (errGet || errDel) {
            throw new ServiceUnavailable(
                null,
                'Signup is temporarily unavailable. Please try again.'
            )
        }
        if (!loginValue || Object.keys(loginValue).length === 0) {
            throw new UnauthorizedError(
                { error: 'invalid_auth_response' },
                'Login session expired. Please try again'
            )
        }
        return loginValue
    }


}
