import { redisConfig } from '../config/redisConfig.mjs'
import Redis from 'ioredis'

const {
    redisURL,
<<<<<<< HEAD
    option
} = redisConfig

const redis = new Redis(redisURL, option)
=======
    redisCommandTimeoutMs,
    redisConnectTimeoutMs,
    redisMaxRetriesPerRequest,
} = redisConfig

const redis = new Redis(redisURL, {
    connectTimeout: Number(redisConnectTimeoutMs),
    enableOfflineQueue: false,
    maxRetriesPerRequest: Number(redisMaxRetriesPerRequest),
    commandTimeout: Number(redisCommandTimeoutMs),
    retryStrategy(times) {
        const delay = Math.min(50 * 2 ** times, 2000)
        return delay
    },
    showFriendlyErrorStack: true,
})
>>>>>>> abcb6e26 (message)

redis.on('connect', () => {
    console.log('redis connect')
})

redis.on('ready', () => {
    console.log('[redis] ready')
})

redis.on('reconnecting', (time) => {
    console.warn(`[redis] reconnecting in ${time}ms`)
})

redis.on('error', (err) => {
    // ioredis emits errors for connection issues too; don't crash the process here.
    console.error('[redis] error:', err?.message || err)
})

redis.on('end', () => {
    console.warn('[redis] connection closed')
})

export {redis}