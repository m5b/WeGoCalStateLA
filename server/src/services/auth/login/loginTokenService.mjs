import { uint8ArrayToBase64UrlString } from '../../../util/encoding.mjs'
import crypto from 'crypto'

export function createLoginTokenService({loginTokenStore, jwtTokenService}) {
    return {
        saveLoginToken,
        verifyLoginToken,
    }


    async function saveLoginToken() {
        const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
        await loginTokenStore.save(key, {})
        //generate token for client side
        const token = jwtTokenService.issueLoginToken(key)
        return token
    }

    async function verifyLoginToken(key) {
        const loginValue =
            await loginTokenStore.consume(key)
        return loginValue
    }
}
