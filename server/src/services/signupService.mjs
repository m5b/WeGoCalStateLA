import { ConflictError } from '../errors/conflictError.mjs'
import { insertUser } from '../repositories/authRepository.mjs'
import generateUserName from '../services/usernameGenerator.mjs'
import { findByEmail } from '../repositories/userRepository.mjs'
import bcrypt from 'bcrypt'
export async function handleUserSignup({ email, password }) {
    const existing = await findByEmail(email)
    if (existing) {
        throw new ConflictError({ email: 'Email already taken' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const username = await generateUserName()
    const result = await insertUser({
        email: email,
        passwordHash: hashed,
        username: username,
    })
}
