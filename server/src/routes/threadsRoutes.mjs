import { Router } from 'express'
import {
    threadPatchSchema, threadPostSchema,
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
import {uuidSchema} from "../validators/authValidators.mjs";
import { reqAuth } from '../middlewares/reqAuth.mjs'

export function createThreadRouter({userService, threadService}){
    const router = Router()

    router.get("/", async (req, res) => {
        const threads = await threadService.getAll()
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    router.get('/me', requireJWTAuth, async (req, res) => {
        const threads = await threadService.getByUserUuid(req.userUuid)
        const threadDtos = threads.map((thread) => new ThreadDto(thread))
        res.send(jsend.success({ threads: threadDtos }))
    })

    //tested
    router.post('/me', requireJWTAuth, async (req, res) => {
        const payload = threadPostSchema.parse(req.body)
        const user = await userService.getByUuid(req.userUuid)
        const thread = await threadService.postByUserId(user.userId, payload)
        const threadDto = new ThreadDto(thread)
        res.json(jsend.success({thread: threadDto}))
    })

    //tested
    router.patch('/me/:threadUuid', requireJWTAuth, async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const payload = threadPatchSchema.parse(req.body)
        const user = await userService.getByUuid(req.userUuid)
        const thread = await threadService.patchByThreadUuid({userId:user.userId, threadUuid, payload})
        console.log(thread)
        res.send(jsend.success({ thread:  new ThreadDto(thread)}))
    })

    //tested
    router.delete('/me/:threadUuid', requireJWTAuth, async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const user = await userService.getByUuid(req.userUuid)
        await threadService.deleteByThreadUuid({threadUuid, userId:user.userId})
        res.send(jsend.success(null))
    })


    //tested
    router.get('/:threadUuid', async (req, res) => {
        const threadUuid = uuidSchema.parse(req.params.threadUuid)
        const thread = await threadService.getByThreadUuid(threadUuid)
        res.json(jsend.success({thread: new ThreadDto(thread)}))
    })

    return router
}
