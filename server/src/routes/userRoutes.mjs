import { Router } from 'express'
import {
    getCurrentUser,
    patchCurrentUser,
    getUserResource,
    deleteCurrentUser,
} from '../services/userService.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import {
    userIdSchema,
    userSchema,
    usernameSchema,
} from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get('/me', requireJwtAuth, async (req, res) => {
    const { userId } = userIdSchema.parse({
        userId: req.user.userId,
    })
    const userDisplay = new UserDto(req.user, { scope: 'private' })
    res.status(200).json(jsend.success(userDisplay))
})

router.patch('/me', requireJwtAuth, async (req, res) => {
    const { userId } = userIdSchema.parse({
        userId: req.user.userId,
    })
    const payload = userSchema.parse(req.body)
    const result = await patchCurrentUser(userId, payload)
    const user = await getCurrentUser(userId)
    const userDisplay = new UserDto(user, { scope: 'private' })
    res.status(200).send(jsend.success(userDisplay))
})

router.delete('/me', requireJwtAuth, async (req, res) => {
    const { userId } = userIdSchema.parse({
        userId: req.user.userId,
    })
    const result = await deleteCurrentUser(userId)
    res.status(200).send(jsend.success())
})

router.get('/profile/:username', async (req, res) => {
    const { username } = usernameSchema.parse({ username: req.params.username })
    const user = await getUserResource(username)
    const userDisplay = new UserDto(user, { scope: 'public' })
    res.status(200).json(jsend.success(userDisplay))
})

export default router
