import bcrypt from 'bcrypt'

export async function hashPassword(password, round = 12){
    const passwordHash = await bcrypt.hash(password, round)
    return passwordHash
}

export async function comparePassword(password, passwordHash){
    const matched = await bcrypt.compare(password, user.passwordHash)
    return matched
}