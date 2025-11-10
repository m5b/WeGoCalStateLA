import { Router } from 'express'
import { getThread } from '../services/threadsService.mjs'
import {
    threadIDSchema
} from '../validators/threadsValidators.mjs'
import ThreadDto from '../dtos/threadDto.mjs'
import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get(
    '/:threadId',
    async (req, res) => {
        const threadId = threadIDSchema.parse(req.params.threadId)
        const thread = await getThread(threadId)
        const threadResponse = new ThreadDto(threadId)
        res.json(jsend.success(thread))
    }
)

export default router