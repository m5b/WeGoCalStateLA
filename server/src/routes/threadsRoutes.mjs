import { Router } from 'express'
import { getThread, getThreadIDs } from '../services/threadsService.mjs'
import { threadIDSchema } from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get(
    '/all',
    async (req, res) => {
        const ids = await getThreadIDs()
        res.json(jsend.success({'threadIds': ids}))
    }
)

router.get(
    '/:threadId',
    async (req, res) => {
        const threadId = threadIDSchema.parse(req.params.threadId)
        const thread = await getThread(threadId)
        res.json(jsend.success(thread))
    }
)

export default router