import { signJWTToken } from '../util/generateJWTToken.mjs'
import * as client from 'openid-client'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import crypto from 'crypto'
import { consumeOIDC, saveOIDC } from '../repositories/redis/oidcStore.mjs'
import { openIdClient } from '../lib/openIdClient.mjs'
import { openIdConfig } from '../config/openIdConfig.mjs'
import { BadRequestError } from '../errors/badRequestError.mjs'

export function generateOIDCToken(key) {
    return signJWTToken({ sub: key }, '5m')
}

export async function startOIDCSignup(provider) {
    //perform pkrf generation
    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)
    //perform state generate
    const state = client.randomState()
    //perform nonce generation
    const nonce = client.randomNonce()
    //generate a key for tracking odic required data
    const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
    //save the codeVerifier in memory for callback use
    await saveOIDC(key, {
        provider: provider,
        codeVerifier: codeVerifier,
        nonce: nonce,
        createdAt: Date.now(),
        state: state,
    })
    //generate signed token contains key
    const token = generateOIDCToken(key)
    //generate redirect uri
    const redirectURL = client.buildAuthorizationUrl(openIdClient.googleClient, {
        redirect_uri: openIdConfig[provider].redirectUri,
        scope: 'openid email',
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    })
    return {token , redirectURL}
}

export async function completeOIDCSign(key, currentURL){
    const {codeVerifier, state, nonce }= await consumeOIDC(key)
    let token;
    try{
        token = await client.authorizationCodeGrant(
            openIdClient.googleClient,
            currentURL,
            {
                pkceCodeVerifier: codeVerifier,
                expectedState: state,
                expectedNonce: nonce,
            }
        )}
    catch (err){
            throw new BadRequestError(null, "Sign up session expired. Please try again.")
    }

    return token.claims().email

}

