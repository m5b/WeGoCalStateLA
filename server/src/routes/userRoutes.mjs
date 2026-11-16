import { Router } from 'express'
import {
    usernameSchema,
    profileSchema,
} from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { uuidSchema } from '../validators/authValidators.mjs'

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

    // Someone's public profile, for the card that opens when you click a name (needs an account).
    router.get('/public/:userUuid', requireAuth(userService), async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        const profile = await userService.getPublicProfile({ userUuid, viewerUserUuid: req.user.userUuid })
        res.status(200).json(jsend.success({ profile }))
    })

    router.get('/profile/:username', requireAuth(userService),  async (req, res) => {
        const { username } = usernameSchema.parse({ username: req.params.username })
        const user = await userService.getByUsername(username)
        const userDisplay = new UserDto(user, { scope: 'public' })
        res.status(200).json(jsend.success({ user: userDisplay }))
    })

    return router

}