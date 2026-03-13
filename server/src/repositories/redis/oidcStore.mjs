import { redis } from '../../lib/redis.mjs'
import { redisKeysConfig } from '../../config/redisKeysConfig.mjs'
import { buildRedisKey } from '../../util/redisKeyBuilder.mjs'
import { UnauthorizedError } from '../../errors/unauthorizedError.mjs'
import { ServiceUnavailable } from '../../errors/serviceUnavailable.mjs'


const {oidc} = redisKeysConfig

export async function saveOIDC(key, {provider, codeVerifier, nonce, createAt, state}, opt = {}){
    //defalut time to live as 5 minute
    const {ttl = 300} = opt
    // append the prefix to make system consistent
    const prefixedKey = buildRedisKey(oidc, key)
    // set the key value pair in redis using hset for better effiency
    try{
        await redis.multi().hset(prefixedKey, {
            provider,
            codeVerifier,
            nonce,
            createAt,
            state
        }).expire(prefixedKey, ttl).exec()
    }
    catch(err){
        throw new ServiceUnavailable(null, 'Service is temporarily unavailable. Please try again later.')
    }
}

export async function consumeOIDC(key) {
    const prefixedKey = buildRedisKey(oidc, key)
    let replies
    try{
        replies = await redis.multi().hgetall(prefixedKey).del(prefixedKey).exec()
    }
    catch(err){
       throw new ServiceUnavailable(
           null,
           'Service is temporarily unavailable. Please try again later.',
       )
    }
    //destructure the reply
    const [[errGet, oidcValue], [errDel, delCount]] = replies
    //Redis respond us with a error
    if (errGet || errDel) {
        throw new ServiceUnavailable(
            null,
            'Signup is temporarily unavailable. Please try again.'
        )
    }
    if (!oidcValue || Object.keys(oidcValue).length === 0) {
        throw new UnauthorizedError(
            { error: 'invalid_auth_response' },
            'Sign up session expired. Please try again'
        )
    }
    return oidcValue
}


