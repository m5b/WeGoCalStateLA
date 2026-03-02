import { hkdf} from '../../../util/hash.mjs'
import { ServiceUnavailable } from '../../../errors/serviceUnavailable.mjs'
import { uint8ArrayToBase64UrlString } from '../../../util/encoding.mjs'

export function createVOPRFService({voprfClient, evaluator}){
    return{
        handleServerVOPRF,
        evaluateVOPRF,
        bindVOPRF,
        unbindVOPRF
    }
    async function handleServerVOPRF(email) {
        const { finData, evalReq } = await bindVOPRF(email)
        const evaluation = await evaluateVOPRF(finData, evalReq)
        const [output] = await unbindVOPRF(evaluation)
        const emailHash = uint8ArrayToBase64UrlString(hkdf(output))
        return emailHash
    }
    //used for signup and login
    async function evaluateVOPRF(evalReq) {
        try {
            const evaluation = await evaluator.blindEvaluate(evalReq)
            return evaluation
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
    }
    //used only on sign up
    async function bindVOPRF(email) {
        try {
            const input = new TextEncoder().encode(email)
            const [finData, evalReq] = await voprfClient.blind([input])
            return { finData, evalReq }
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
    }
    //used only on sign up
    async function unbindVOPRF(finData, evaluation) {
        try {
            const [output] = await voprfClient.finalize(finData, evaluation)
            const emailHash = hkdf(output)
            return emailHash
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
    }
}