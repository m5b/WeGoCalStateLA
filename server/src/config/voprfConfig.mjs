import { generatePublicKey, Oprf, randomPrivateKey } from '@cloudflare/voprf-ts'

const suite = Oprf.Suite.P384_SHA384
const privateKey =
    process.env.VOPRF_PRIVATE_KEY || (await randomPrivateKey(suite))
const publicKey =
    process.env.VOPRF_PUBLIC_KEY || (await generatePublicKey(suite, privateKey))

export const voprfConfig = {
    suite,
    privateKey,
    publicKey,
}