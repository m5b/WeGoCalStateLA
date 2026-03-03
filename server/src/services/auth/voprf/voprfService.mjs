import { hkdf} from '../../../util/hash.mjs'
import { ServiceUnavailable } from '../../../errors/serviceUnavailable.mjs'
import {base64UrlStringToUint8Array, uint8ArrayToBase64UrlString} from '../../../util/encoding.mjs'
import {Evaluation, EvaluationRequest} from "@cloudflare/voprf-ts";

export function createVOPRFService({voprfClient, evaluator}){
    return{
        handleServerVOPRF,
        evaluateVOPRF,
        bindVOPRF,
        unbindVOPRF
    }
    async function handleServerVOPRF(email) {
        const input = new TextEncoder().encode(email)
        const [finData, evalReq] = await voprfClient.blind([input])
        const evaluation = await evaluator.blindEvaluate(evalReq)
        const [output] = await voprfClient.finalize(finData, evaluation)
        const emailHash = uint8ArrayToBase64UrlString(hkdf(output))
        return emailHash
    }
    //used for signup and login
    async function evaluateVOPRF(evalReqB64U) {
        try {
            const evalReqUint8 = base64UrlStringToUint8Array(evalReqB64U)
            const evalReq =  EvaluationRequest.deserialize(evaluator.suite, evalReqUint8)
            const evaluation = await evaluator.blindEvaluate(evalReq)

            return uint8ArrayToBase64UrlString(evaluation.serialize())
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
            const evalReqBytes = evalReq.serialize()
            const evalReqB64U= uint8ArrayToBase64UrlString(evalReqBytes)
            return {finData, evalReqB64U}
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
    }
    //used only on sign up
    async function unbindVOPRF(finData, evaluationB64U) {
        try {
            const evaluation = Evaluation.deserialize(evaluator.suite, base64UrlStringToUint8Array(evaluationB64U))
            const [output] = await voprfClient.finalize(finData, evaluation)
            const emailHash = uint8ArrayToBase64UrlString(hkdf(output))
            return emailHash
        } catch (err) {
            throw new ServiceUnavailable(
                null,
                'Service is temporarily unavailable. Please try again later.'
            )
        }
    }
}