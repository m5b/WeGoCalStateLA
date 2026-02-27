import { signJWTToken } from '../util/generateJWTToken.mjs'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import crypto from 'crypto'
export function createSignupTokenService(signupTokenStore){
    return {
        saveSignupToken,
        verifySignupToken,
    }
    function generateSignupToken(key) {
        return signJWTToken({ sub: key }, '5m')
    }

    async function saveSignupToken(email, verifiedMethod) {
        const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
        await signupTokenStore.save(key, { email, verifiedMethod })
        //generate token for client side
        const token = generateSignupToken(key);
        return token
    }

    async function verifySignupToken(key) {
        const { email, attempts, verifiedMethod } = await signupTokenStore.consume(key)
        return email
    }
}