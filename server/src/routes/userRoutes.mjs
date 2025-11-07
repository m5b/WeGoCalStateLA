import { Router } from 'express'
import { getCurrentUser, patchCurrentUser } from '../services/userService.mjs'
import requireJwtAuth from '../middlewares/requireJwtAuth.mjs'
import { userIDSchema, userSchema } from '../validators/userValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get('/me', requireJwtAuth, async (req, res) => {
    try {
        const userId = userIDSchema.parse(req.user.userId)
        const user = await getCurrentUser(userId)
        const userDisplay = new UserDto(user, { scope: 'private' })
        res.status(200).json(jsend.success(userDisplay))
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})

router.patch('/me', requireJwtAuth, async (req, res) => {
    try {
        const userId = userIDSchema.parse(req.user.userId)
        const payload = userSchema.parse(req.body)
        const result = await patchCurrentUser(userId, payload)
        const user = await getCurrentUser(userId)
        const userDisplay = new UserDto(user, { scope: 'private' })
        res.status(200).send(jsend.success(user))
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})

export default router
