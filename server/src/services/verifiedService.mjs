import { signJWTToken } from '../util/generateJWTToken.mjs'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import crypto from 'crypto'
import { consumeVerifiedId, saveVerifiedId } from '../repositories/redis/verifiedTokenStore.mjs'

export function generateVerifiedIdToken(key) {
    return signJWTToken({ sub: key }, '5m')
}

export async function handleVerified(email, verifiedMethod) {
    const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
    await saveVerifiedId(key, {email, verifiedMethod})
    //generate token for client side
    const token = generateVerifiedIdToken(key)
    return token;
}

export async function completeVerified(key) {
    const { email, verifiedMethod } = await consumeVerifiedId(key)
    return email;
}
