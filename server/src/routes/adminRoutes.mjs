import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.mjs'
import { requireAdmin } from '../middlewares/requireAdmin.mjs'
import { adminUserPatchSchema, adminUserListSchema } from '../validators/userValidators.mjs'
import { uuidSchema } from '../validators/authValidators.mjs'
import UserDto from '../dtos/userDto.mjs'
import { jsend } from '../util/jSend.mjs'
import { assertNotDeletingSelf, assertNotDemotingSelf } from '../util/adminGuards.mjs'

export function createAdminRouter(userService){
    const router = Router()

    router.use(requireAuth(userService), requireAdmin)

    router.get('/users', async (req, res) => {
        const { limit, offset, search, role } = adminUserListSchema.parse(req.query)
        const [users, total] = await Promise.all([
            userService.listUsers({ limit, offset, search, role }),
            userService.countUsers({ search, role }),
        ])
        const userDisplays = users.map((u) => new UserDto(u, { scope: 'public' }))
        res.json(jsend.success({ users: userDisplays, total }))
    })

    // Totals for the top of the admin page (counts only).
    router.get('/stats', async (req, res) => {
        res.json(jsend.success({ stats: await userService.getAdminStats() }))
    })

    router.get('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        const user = await userService.getByUserUuid(userUuid)
        res.json(jsend.success({ user: new UserDto(user, { scope: 'public' }) }))
    })

    router.patch('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        const payload = adminUserPatchSchema.parse(req.body)
        assertNotDemotingSelf(req.user, userUuid, payload)
        const user = await userService.patchByUserUuid(userUuid, payload)
        res.json(jsend.success({ user: new UserDto(user, { scope: 'public' }) }))
    })

    router.delete('/users/:userUuid', async (req, res) => {
        const userUuid = uuidSchema.parse(req.params.userUuid)
        assertNotDeletingSelf(req.user, userUuid)
        await userService.deleteByUserUuid(userUuid)
        res.json(jsend.success(null))
    })

    return router
}