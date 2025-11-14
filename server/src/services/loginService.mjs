import { NotFoundError } from '../errors/notFoundError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { findAuthUserByEmail } from '../repositories/authRepository.mjs'
import bcrypt from 'bcrypt'
export async function handleUserLogin({ email, password }) {
    const user = dbMapper.fromDb(await findAuthUserByEmail(email))
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
