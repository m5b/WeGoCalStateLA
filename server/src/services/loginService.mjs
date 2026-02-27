import { NotFoundError } from '../errors/notFoundError.mjs'
import { UnauthorizedError } from '../errors/unauthorizedError.mjs'
import dbMapper from '../util/dbMapper.mjs'


export function createLoginService(authRepo, passwordService) {

    return{
        loginUser
    }
    async function loginUser(emailHash, password) {
        const user = dbMapper.fromDb(await authRepo.findByEmailHash(emailHash))
        if (!user) {
            throw new NotFoundError({
                email: 'Can not found the user of the given email',
            })
        }
        const matched = passwordService.comparePassword(password, user.passwordHash)
        if (!matched) {
            throw new UnauthorizedError({
                password: 'Unmatch password',
            })
        }
        return user
    }
}