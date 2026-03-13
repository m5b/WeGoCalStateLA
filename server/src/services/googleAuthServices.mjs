import { completeOIDCSign, startOIDCSignup } from './oidcService.mjs'

export async function handleGoogleLogin(){
    const {token, redirectURL} = await startOIDCSignup('google')
    return {token, redirectURL}
}

export async function completeGoogleLogin(oidcValue, currentURL){
    const email = await completeOIDCSign(oidcValue, currentURL)
    return email

}

