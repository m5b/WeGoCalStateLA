import { NotFoundError } from '../errors/notFoundError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import dbMapper from '../util/dbMapper.mjs'
import { findByEmail } from '../repositories/userRepository.mjs'
import bcrypt from 'bcrypt'
export async function handleUserLogin({ email, password }) {
    const user = dbMapper.fromDb(await findByEmail(email))
    if (!user) {
        throw new NotFoundError({
            email: 'Can not found the user of the given email',
        })
    }
    const matched = await bcrypt.compare(password, user.passwordHash)
    if (!matched) {
        throw new UnauthorizedError({
            auth: 'Unmatch password',
        })
    }
    return user
}
