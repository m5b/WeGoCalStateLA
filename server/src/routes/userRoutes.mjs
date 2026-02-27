import { Router } from 'express'
import {requireJWTAuth} from '../middlewares/requireCookie.mjs'
import {
    userIdSchema,
    userSchema,
    usernameSchema,
} from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'

export function createUserRouter(userService){

    const router = Router()

    router.get('/me', requireJWTAuth, async (req, res) => {
        const user = await userService.getByUserId(req.userId)
        const userDisplay = new UserDto(user, { scope: 'private' })
        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    router.patch('/me', requireJWTAuth, async (req, res) => {
        const user = userService.getByUserId(req.userId)
        const payload = userSchema.parse(req.body)
        const result = await userService.patchByUserId(user.userId, payload)
        const userDisplay = new UserDto(user, { scope: 'private' })
        res.status(200).send(jsend.success({ user: userDisplay }))
    })

    router.delete('/me', requireJWTAuth, async (req, res) => {
        const result = await userService.deleteByUserId(req.userId)
        res.status(200).send(jsend.success())
    })

    router.get('/profile/:username', async (req, res) => {
        const { username } = usernameSchema.parse({ username: req.params.username })
        const user = await userService.getByUsername(username)
        const userDisplay = new UserDto(user, { scope: 'public' })

        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    return router

}