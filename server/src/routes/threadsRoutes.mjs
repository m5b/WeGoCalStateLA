import { Router } from 'express'
import { getThread } from '../services/threadsService.mjs'

import { jsend } from '../util/jSend.mjs'
const router = Router()

router.get(
    '/getThreads',
    (req, res) => {
        res.send(200)
    }
)

export default router