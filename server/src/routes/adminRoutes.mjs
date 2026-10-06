import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { requireAdmin } from '../middlewares/requireAdmin.mjs'
import { adminUserPatchSchema } from '../validators/userValidators.mjs'
import { uuidSchema } from '../validators/authValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'

export function createAdminRouter(userService){
    const router = Router()

    router.use(requireAuth(userService), requireAdmin)

    router.get('/users', async (req, res) => {
        const users = await userService.listUsers({})
        const userDisplays = users.map((u) => new UserDto(u, { scope: 'public' }))
        res.json(jsend.success({ users: userDisplays }))
    })

    router.get('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        const user = await userService.getByUserUuid(userUuid)
        res.json(jsend.success({ user: new UserDto(user, { scope: 'public' }) }))
    })

    router.patch('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        const payload = adminUserPatchSchema.parse(req.body)
        const user = await userService.patchByUserUuid(userUuid, payload)
        res.json(jsend.success({ user: new UserDto(user, { scope: 'public' }) }))
    })

    router.delete('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        await userService.deleteByUserUuid(userUuid)
        res.json(jsend.success(null))
    })

    return router
}