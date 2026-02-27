import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import crypto from 'crypto'
import { signJWTToken } from '../util/generateJWTToken.mjs'

export function createLoginTokenService(loginTokenStore) {
    return {
        saveLoginToken,
        verifyLoginToken,
    }
    function generateLoginToken(key) {
        return signJWTToken({ sub: key }, '5m')
    }

    async function saveLoginToken() {
        const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
        await loginTokenStore.save(key, {})
        //generate token for client side
        const token = generateLoginToken(key)
        return token
    }

    async function verifyLoginToken(key) {
        const loginValue =
            await loginTokenStore.consume(key)
        return loginValue
    }
}
