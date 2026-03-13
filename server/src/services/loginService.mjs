import { NotFoundError } from '../errors/notFoundError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { findAuthUserByEmail } from '../repositories/authRepository.mjs'
import bcrypt from 'bcrypt'
import { encoding, uint8ArrayToBase64UrlString } from '../util/encoding.mjs'
import { evaluator } from '../lib/voprf.mjs'

export async function handleClientEval(evalReqB64) {
    const evalReq = encoding(evalReqB64)
    const evaluation = await evaluator.blindEvaluate(evalReq)
    return uint8ArrayToBase64UrlString(evaluation)

}

export async function loginUser(emailHash, password) {
    const user = dbMapper.fromDb(await findAuthUserByEmail(emailHash))
    if (!user) {
        throw new NotFoundError({
            email: 'Can not found the user of the given email',
        })
    }
    const matched = await bcrypt.compare(password, user.passwordHash)
    if (!matched) {
        throw new UnauthorizedError({
            password: 'Unmatch password',
        })
    }
    return user
}
