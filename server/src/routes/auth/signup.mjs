import { Router } from 'express'
import { randomUUID } from 'crypto'
import {
    identifierPasswordSchema,
} from '../../validators/authValidators.mjs'
import { jsend } from '../../util/jSend.mjs'
import { cookieConfig } from '../../config/cookieConfig.mjs'
import { ConflictError } from '../../errors/conflictError.mjs'

export function createSignupRouter({voprfService, userService, passwordService, usernameService, authRepo, jwtTokenService}){
    const router = Router()
    router.post('/signup', async (req, res) => {
        const { identifier, password } = identifierPasswordSchema.parse(req.body)
        const isEmail = /^\S+@\S+\.\S+$/.test(identifier)

        let emailHash = null
        let username

        if (isEmail) {
            emailHash = await voprfService.handleServerVOPRF(identifier)
            const existing = await authRepo.findByEmailHash(emailHash)
            if (existing) {
                throw new ConflictError(
                    { identifier: 'An account with this email already exists' },
                    'An account with this email already exists.'
                )
            }
            username = await usernameService.generateUsername()
        } else {
            const existing = await authRepo.findByUsername(identifier)
            if (existing) {
                throw new ConflictError(
                    { identifier: 'That username is already taken' },
                    'That username is already taken.'
                )
            }
            username = identifier
        }

        const passwordHash = await passwordService.hashPassword(password)
        const userUuid = randomUUID()

        const user = await userService.createUser({
            username,
            userUuid,
            createdAt: new Date(),
            emailHash,
            passwordHash,
        })

        const token = jwtTokenService.issueAccessToken(user.userUuid)
        res.cookie('auth_tx', token, cookieConfig)
        res.json(jsend.success({ username: user.username }))
    })
    return router
}