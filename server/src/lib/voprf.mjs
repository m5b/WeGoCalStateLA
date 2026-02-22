import {
    Oprf,
    VOPRFClient,
    VOPRFServer,
    generatePublicKey,
    randomPrivateKey,
} from '@cloudflare/voprf-ts'
import * as crypto from "node:crypto"

const suite = Oprf.Suite.P384_SHA384
let VOPRFPrivateKey, VOPRFPublicKey, VOPRFPepper
if(process.env.NODE_ENV === "development"){
    VOPRFPrivateKey = await randomPrivateKey(suite)
    VOPRFPublicKey = generatePublicKey(suite, VOPRFPrivateKey)
    VOPRFPepper = crypto.randomBytes(32).toString('hex')
}
else{
    VOPRFPrivateKey = process.env.VOPRF_PRIVATE_KEY
    VOPRFPublicKey = process.env.VOPRF_PUBLIC_KEY
    VOPRFPepper = process.env.VOPRF_PEPPER
}
const evaluator = new VOPRFServer(suite, VOPRFPrivateKey)
const voprfClient = new VOPRFClient(suite, VOPRFPublicKey)
export {evaluator,voprfClient, VOPRFPublicKey, VOPRFPepper}