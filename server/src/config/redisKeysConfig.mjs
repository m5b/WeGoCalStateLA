const REDIS_SYSTEM_PREFIX = "wego:"

export const redisKeysConfig = {
    oidc : REDIS_SYSTEM_PREFIX + "auth:oidc:",
<<<<<<< HEAD
    otp: REDIS_SYSTEM_PREFIX + "auth:otp:",
    signupToken: REDIS_SYSTEM_PREFIX + "auth:signupToken:",
    loginToken: REDIS_SYSTEM_PREFIX + "auth:loginToken:"
=======
    otp: REDIS_SYSTEM_PREFIX + "auth:otp",
    verifiedId: REDIS_SYSTEM_PREFIX + "auth:verified"
>>>>>>> abcb6e26 (message)

}