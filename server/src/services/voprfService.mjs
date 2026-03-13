import { evaluator, voprfClient, VOPRFPepper } from '../lib/voprf.mjs'
import { hkdf} from '../util/hash.mjs'
import { ServiceUnavailable } from '../errors/serviceUnavailable.mjs'
import { uint8ArrayToBase64UrlString } from '../util/encoding.mjs'

export async function handleServerVOPRF(email){
    const {finData, evalReq} = await bindVOPRF(email)
    const evaluation = await evaluateVOPRF(finData, evalReq)
    const [output] = await unbindVOPRF(finData, evaluation)
    const emailHash =  uint8ArrayToBase64UrlString(hkdf(output))
    return emailHash
}
//used for signup and login
export async function evaluateVOPRF(finData, evalReq){
    try{
        const evaluation = await evaluator.blindEvaluate(evalReq)
        return evaluation
    }
    catch(err){
        throw new ServiceUnavailable(
            null,
            'Service is temporarily unavailable. Please try again later.'
        )
    }
}
//used only on sign up
export async function bindVOPRF(email){
    try{

        const input = new TextEncoder().encode(email)
        const [finData, evalReq] = await voprfClient.blind([input])
        return {finData, evalReq}
    }
    catch(err){
        throw new ServiceUnavailable(null, 'Service is temporarily unavailable. Please try again later.')
    }
}
//used only on sign up
export async function unbindVOPRF(finData, evaluation) {
    try {
        const [output] = await voprfClient.finalize(finData, evaluation)
        const emailHash = hmacSha256Hex(VOPRFPepper, evaluation)
        return emailHash
    } catch (err) {
        throw new ServiceUnavailable(
            null,
            'Service is temporarily unavailable. Please try again later.'
        )
    }
}

