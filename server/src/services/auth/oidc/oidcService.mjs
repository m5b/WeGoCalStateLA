import * as client from 'openid-client'
import { uint8ArrayToBase64UrlString } from '../../../util/encoding.mjs'
import crypto from 'crypto'
import { BadRequestError } from '../../../errors/badRequestError.mjs'

export function createOIDCService({oidcStore, jwtTokenService, openIdClient, openIdConfig, provider}){
    return{
        startOIDCSignup,
        completeOIDCSignup,
    }

    async function startOIDCSignup() {
        //perform pkrf generation
        const codeVerifier = client.randomPKCECodeVerifier()
        const codeChallenge =
            await client.calculatePKCECodeChallenge(codeVerifier)
        //perform state generate
        const state = client.randomState()
        //perform nonce generation
        const nonce = client.randomNonce()
        //generate a key for tracking odic required data
        const key = uint8ArrayToBase64UrlString(crypto.randomBytes(32))
        //save the codeVerifier in memory for callback use
        await oidcStore.save(key, {
            provider: provider,
            codeVerifier: codeVerifier,
            nonce: nonce,
            createdAt: Date.now(),
            state: state,
        })
        //generate signed token contains key
        const token = jwtTokenService.issueOIDCToken(key)
        //generate redirect uri
        const redirectURL = client.buildAuthorizationUrl(
            openIdClient,
            {
                redirect_uri: openIdConfig[provider].redirectUri,
                scope: 'openid email',
                state,
                nonce,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            }
        )
        return { token, redirectURL }
    }

    async function completeOIDCSignup(key, currentURL) {
        const { codeVerifier, state, nonce } = await oidcStore.consume(key)
        let token
        try {
            token = await client.authorizationCodeGrant(
                openIdClient,
                currentURL,
                {
                    pkceCodeVerifier: codeVerifier,
                    expectedState: state,
                    expectedNonce: nonce,
                }
            )
        } catch (err) {
            throw new BadRequestError(
                null,
                'Sign up session expired. Please try again.'
            )
        }

        return token.claims().email
    }
}