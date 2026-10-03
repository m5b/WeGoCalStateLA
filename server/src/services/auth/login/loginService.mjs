import { NotFoundError } from '../../../errors/notFoundError.mjs'
import { UnauthorizedError } from '../../../errors/unauthorizedError.mjs'
import dbMapper from '../../../util/dbMapper.mjs'


export function createLoginService({authRepo, passwordService, jwtTokenService, voprfService}) {

    return{
        loginUser,
        authenticateUser,
    }

    async function authenticateUser(identifier, password) {
        const isEmail = /^\S@\S\.\S$/.test(identifier)
        const user = dbMapper.fromDb(
            isEmail
                ? await authRepo.findByEmailHash(await voprfService.handleServerVOPRF(identifier))
                : await authRepo.findByUsername(identifier)
        )
        if (!user) {
            throw new NotFoundError({
                identifier: 'Not Found',
            }, 'No account found with that username or email.')
        }
        if (!user.passwordHash) {
            throw new UnauthorizedError({
                identifier: 'No password set',
            }, 'This account has no password set. Try signing in with Google.')
        }
        const matched = await passwordService.comparePassword(password, user.passwordHash)
        if (!matched) {
            throw new UnauthorizedError({
                password: 'Incorrect password',
            }, 'Incorrect password. Please try again.')
        }
        return jwtTokenService.issueAccessToken(user.userUuid)
    }

    async function loginUser(emailHash, password) {
        const user = dbMapper.fromDb(await authRepo.findByEmailHash(emailHash))
        if (!user) {
            throw new NotFoundError({
                emailHash: 'Not Found',
            },"Given EmailHash can not be found in our database.")
        }
        const matched = await passwordService.comparePassword(password, user.passwordHash)
        if (!matched) {
            throw new UnauthorizedError({
                password: 'Incorrect password',
            }, "Incorrect password. Please try again.")
        }
        const token = jwtTokenService.issueAccessToken(user.userUuid)
        return token
    }
}