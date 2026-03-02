import crypto from 'crypto'
import {generateKey} from "../otp/keyGenerator.mjs";
export function createSignupTokenService({signupTokenStore, jwtTokenService}){
    return {
        saveSignupToken,
        verifySignupToken,
    }


    async function saveSignupToken(email, verifiedMethod) {
        const key = generateKey(32)
        await signupTokenStore.save(key, { email, verifiedMethod })
        //generate token for client side
        const token = jwtTokenService.issueSignupToken(key)
        return {key, token}
    }

    async function verifySignupToken(key) {
        const {email} = await signupTokenStore.consume(key)
        return email
    }
}