import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'

export function createResetTokenStore({redis, resetTokenPrefix, opt = {}}){
    return{
        save,
        consume,
        deleteReset,
        incrementAttempts,
    }

    async function save(key, { userUuid, otpCodeHash }) {
        const { ttl = 300 } = opt
        const prefixedKey = buildRedisKey(resetTokenPrefix, key)
        try {
            await redis
                .multi()
                .hset(prefixedKey, {
                    userUuid: userUuid,
                    otpCodeHash: otpCodeHash,
                    attempts: 0,
                    createdAt: Date.now(),
                })
                .expire(prefixedKey, ttl)
                .exec()
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Password reset service is temporarily unavailable. Please try again later.'
            )
        }
    }

    async function consume(key) {
        const prefixedKey = buildRedisKey(resetTokenPrefix, key)
        let resetValue
        try {
            resetValue = await redis.hgetall(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Password reset service is temporarily unavailable. Please try again later.'
            )
        }
        return resetValue
    }

    async function deleteReset(key) {
        const prefixedKey = buildRedisKey(resetTokenPrefix, key)
        try {
            await redis.del(prefixedKey)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Password reset session expired. Please try again later.'
            )
        }
    }

    async function incrementAttempts(key) {
        const prefixedKey = buildRedisKey(resetTokenPrefix, key)
        try {
            await redis.hincrby(prefixedKey, 'attempts', 1)
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Password reset is temporarily unavailable. Please try again.'
            )
        }
    }
}