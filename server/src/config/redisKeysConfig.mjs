const REDIS_SYSTEM_PREFIX = "wego:"

export const redisKeysConfig = {
    oidc : REDIS_SYSTEM_PREFIX + "auth:oidc:",
    otp: REDIS_SYSTEM_PREFIX + "auth:otp",
    verifiedId: REDIS_SYSTEM_PREFIX + "auth:verified"

}