export const redisConfig = {
    redisURL : process.env.REDIS_URL,
    redisConnectTimeoutMs: process.env.REDIS_CONNECT_TIMEOUT_MS || 5000,
    redisCommandTimeoutMs: process.env.REDIS_COMMAND_TIMEOUT_MS || 2000,
    redisMaxRetriesPerRequest: process.env.REDIS_MAX_RETRIES_PER_REQUEST || 3,
}