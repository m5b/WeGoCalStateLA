import { Router } from 'express'
import {
    usernameSchema,
    profileSchema,
} from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
import { requireAuth } from '../middlewares/requireAuth.mjs'

export function createUserRouter(userService){

    const router = Router()

    router.get('/me', requireAuth(userService),  async (req, res) => {
        res.status(200).json(jsend.success({ user: new UserDto(req.user, {scope: "public"})}))
    })

    router.patch('/me', requireAuth(userService), async (req, res) => {
        const payload = profileSchema.parse(req.body)
        const user = await userService.patchByUserId(req.user.userId, payload)
        const userDisplay = new UserDto(user, { scope: 'public' })
        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    router.delete('/me', requireAuth(userService), async (req, res) => {
        const result = await userService.deleteByUserUuid(req.userUuid)
        res.status(200).send(jsend.success(null))
    })

    router.get('/profile/:username', requireAuth(userService),  async (req, res) => {
        const { username } = usernameSchema.parse({ username: req.params.username })
        const user = await userService.getByUsername(username)
        const userDisplay = new UserDto(user, { scope: 'public' })
        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    return router

}